// Game-only parameter snapshot, 2026-10-07. Factual values checked against
// SquadCalc src/data/weapons.js (Squad 10.6); independently implemented solver.
export const WEAPONS={
 mortar:{name:'81 mm Havan',speed:110,gravity:9.78,minRange:51,minAngle:45,maxAngle:88.875,unit:'mil',height:1,moa:50,blast:40,arc:'high'},
 hell:{name:'Hell Cannon',speed:95,gravity:9.78,minRange:0,minAngle:10,maxAngle:89.99,unit:'deg',height:1.5,moa:100,blast:50,arc:'high'},
 grad:{name:'BM-21 Grad',speed:200,gravity:19.56,minRange:0,minAngle:-45,maxAngle:89.99,unit:'deg',height:3,moa:200,blast:35,arc:'low'},
 m121:{name:'M1064 M121 · Darbeli',speed:142,gravity:9.78,minRange:340,minAngle:-45,maxAngle:85.3,unit:'deg',height:3,moa:40,blast:40,arc:'high'},
 m121_air:{name:'M1064 M121 · Yakın yüzey',speed:142,gravity:9.78,minRange:340,minAngle:-45,maxAngle:85.3,unit:'deg',height:3,moa:50,blast:60,arc:'high'}
};
export const weaponFor=id=>Object.hasOwn(WEAPONS,id)?WEAPONS[id]:WEAPONS.mortar;
export function solveWeapon(distance,delta,id='mortar',arc='high'){
 const w=weaponFor(id),v=w.speed,g=w.gravity;
 if(!Number.isFinite(distance)||!Number.isFinite(delta)||distance<=.01||distance<w.minRange)return null;
 const disc=v**4-g*(g*distance**2+2*delta*v*v);if(disc < -Number.EPSILON*v**4*8)return null;
 const radians=Math.atan((v*v+(arc==='low'?-1:1)*Math.sqrt(Math.max(0,disc)))/(g*distance)),degrees=radians*180/Math.PI,time=distance/(v*Math.cos(radians));
 if(degrees<w.minAngle||degrees>w.maxAngle||!Number.isFinite(time)||time<=0)return null;
 return {radians,degrees,mil:radians*3200/Math.PI,time,arc};
}
export function elevationText(solution,weapon){return !solution?'—':weapon.unit==='mil'?`${solution.mil.toFixed(0)} milyem`:`${solution.degrees.toFixed(1)}°`;}
export function gridPoint(text,width,height){
 const match=String(text).trim().toUpperCase().replace(/\s+/g,'').match(/^([A-Z]{1,3})([1-9]\d*)(?:-([1-9]))?(?:-([1-9]))?$/);
 if(!match||![width,height].every(v=>Number.isFinite(v)&&v>0))throw Error('Koordinatı A1-7-3 biçiminde yaz.');
 let col=0;for(const c of match[1])col=col*26+c.charCodeAt(0)-64;
 let x=(col-1)*300,y=(Number(match[2])-1)*300,size=300;
 for(const k of match.slice(3)){if(!k)break;size/=3;const n=Number(k)-1;x+=(n%3)*size;y+=(2-Math.floor(n/3))*size;}
 if(x>=width||y>=height)throw Error('Bu koordinat harita sınırının dışında.');
 return {x:(x+Math.min(size,width-x)/2)/width,y:(y+Math.min(size,height-y)/2)/height};
}
// Approximate spread on the target-height plane, not a probability or guaranteed hit area.
export function spreadEstimate(analysis){
 if(!analysis.solution)return null;const {weapon:w,solution:s,delta,samples}=analysis,half=w.moa*Math.PI/10800/2;
 const reach=angle=>{const vy=w.speed*Math.sin(angle),d=vy*vy-2*w.gravity*delta;if(d<0)return null;return w.speed*Math.cos(angle)*(vy+Math.sqrt(d))/w.gravity;};
 const ends=[reach(s.radians-half),reach(s.radians+half)];if(ends.some(v=>v===null||!Number.isFinite(v)))return null;
 const path=samples.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p.d-samples[i].d,p.flight-samples[i].flight),0);
 return {along:Math.abs(ends[1]-ends[0])/2,across:path*half};
}
export function spreadPolygon(a,width,height){const spread=spreadEstimate(a);if(!spread)return [];const b=a.bearing*Math.PI/180;
 return Array.from({length:64},(_,i)=>{const t=i*Math.PI/32,along=spread.along*Math.cos(t),across=spread.across*Math.sin(t);return{x:a.b.x+(Math.sin(b)*along+Math.cos(b)*across)/width,y:a.b.y+(-Math.cos(b)*along+Math.sin(b)*across)/height};});
}
