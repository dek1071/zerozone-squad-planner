import {weaponFor,solveWeapon} from './fire-support.js';
// Independent Squad game planning model. Coordinates: normalized east/south.
export const MORTAR={speed:110,gravity:9.78,minRange:51,minAngle:45,maxAngle:88.875};
export function validateTerrain(data){
 if(!data||!Number.isInteger(data.cols)||!Number.isInteger(data.rows)||data.cols<2||data.rows<2||data.cols>2049||data.rows>2049||!Array.isArray(data.values)||data.values.length!==data.cols*data.rows||!data.values.every(Number.isFinite)||!Number.isFinite(data.widthMeters)||!Number.isFinite(data.heightMeters)||!(data.widthMeters>0)||!(data.heightMeters>0))throw Error('Yükseklik verisi geçersiz.');
 return data;
}
export function heightAt(data,p){
 if(!p||![p.x,p.y].every(Number.isFinite)||p.x<0||p.x>1||p.y<0||p.y>1)throw Error('Nokta harita dışında.');
 const x=p.x*(data.cols-1),y=p.y*(data.rows-1),x0=Math.floor(x),y0=Math.floor(y),x1=Math.min(x0+1,data.cols-1),y1=Math.min(y0+1,data.rows-1),dx=x-x0,dy=y-y0;
 const v=(a,b)=>data.values[b*data.cols+a];return (v(x0,y0)*(1-dx)+v(x1,y0)*dx)*(1-dy)+(v(x0,y1)*(1-dx)+v(x1,y1)*dx)*dy;
}
export const solveMortar=(distance,delta)=>solveWeapon(distance,delta,'mortar','high');
// Each cell is independently ray-tested at half the source heightmap spacing.
// 0: outside radius, 1: visible, 2: terrain-obstructed; buildings are not sampled.
export function terrainSight(data,origin,{radius=1000,eye=1.7,size=81}={}){
 if(!Number.isFinite(radius)||radius<50||radius>3000||!Number.isFinite(eye)||eye<.1||eye>100||!Number.isInteger(size)||size<3||size>121)throw Error('Görüş ayarları geçersiz.');
 const start=heightAt(data,origin)+eye,w=data.widthMeters,h=data.heightMeters;
 const bounds={left:Math.max(0,origin.x-radius/w),right:Math.min(1,origin.x+radius/w),top:Math.max(0,origin.y-radius/h),bottom:Math.min(1,origin.y+radius/h)};
 const cells=new Uint8Array(size*size),step=Math.min(w/(data.cols-1),h/(data.rows-1))/2;let visible=0,total=0;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const p={x:bounds.left+(x+.5)/size*(bounds.right-bounds.left),y:bounds.top+(y+.5)/size*(bounds.bottom-bounds.top)},dx=(p.x-origin.x)*w,dy=(p.y-origin.y)*h,d=Math.hypot(dx,dy);if(d>radius)continue;
  const end=heightAt(data,p),n=Math.max(1,Math.ceil(d/step));let clear=true;
  for(let i=1;i<n;i++){const t=i/n;if(heightAt(data,{x:origin.x+(p.x-origin.x)*t,y:origin.y+(p.y-origin.y)*t})>start+(end-start)*t+.02){clear=false;break;}}
  cells[y*size+x]=clear?1:2;total++;if(clear)visible++;
 }
 return {cells,size,bounds,visible,total,origin,radius,eye};
}
export function analyzeLine(data,a,b,width,height,weaponOffset=1,targetOffset=0,settings={}){
 if(![width,height,weaponOffset,targetOffset].every(Number.isFinite)||width<=0||height<=0||weaponOffset<0||targetOffset<0)throw Error('Ölçüler geçersiz.');
 const dx=(b.x-a.x)*width,dy=(b.y-a.y)*height,distance=Math.hypot(dx,dy),start=heightAt(data,a)+weaponOffset,end=heightAt(data,b)+targetOffset;
 const weapon=weaponFor(settings.weapon),solution=solveWeapon(distance,end-start,settings.weapon,settings.arc),count=Math.min(2048,Math.max(128,Math.ceil(distance/Math.min(width/(data.cols-1),height/(data.rows-1))*2)));
 const samples=Array.from({length:count+1},(_,i)=>{const t=i/count,p={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t},ground=heightAt(data,p),d=distance*t;return {...p,t,d,ground,flight:solution?start+d*Math.tan(solution.radians)-weapon.gravity*d*d/(2*weapon.speed**2*Math.cos(solution.radians)**2):null};});
 const collision=solution?samples.slice(1,-1).find(p=>p.flight<p.ground-.01):null;
 return {a,b,weapon,distance,bearing:(Math.atan2(dx,-dy)*180/Math.PI+360)%360,start,end,delta:end-start,solution,samples,collision};
}
