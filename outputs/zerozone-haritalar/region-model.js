const copy=value=>JSON.parse(JSON.stringify(value));
const cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
export function validPolygon(points){
  if(!Array.isArray(points)||points.length<3||points.length>500)return false;
  if(points.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<0||p.x>1||p.y<0||p.y>1))return false;
  const area=points.reduce((s,p,i)=>{const q=points[(i+1)%points.length];return s+p.x*q.y-q.x*p.y;},0)/2;
  if(Math.abs(area)<1e-7)return false;
  for(let i=0;i<points.length;i++){
    const a=points[i],b=points[(i+1)%points.length];
    if(Math.hypot(a.x-b.x,a.y-b.y)<1e-8)return false;
    for(let j=i+2;j<points.length;j++){
      if(i===0&&j===points.length-1)continue;
      const c=points[j],d=points[(j+1)%points.length];
      if(cross(a,b,c)*cross(a,b,d)<-1e-14&&cross(c,d,a)*cross(c,d,b)<-1e-14)return false;
    }
  }
  return true;
}
export function cleanRegions(value){
  if(!value||!Array.isArray(value.regions)||value.regions.length>100)throw Error('Bölge dosyası geçersiz (en fazla 100 alan).');
  const ids=new Set();
  return {visible:value.visible!==false,hatch:value.hatch!==false,regions:value.regions.map((r,i)=>{
    if(!validPolygon(r.points))throw Error(`${i+1}. alanın sınırı geçersiz. En az üç köşe seç; çizgiler birbirini kesmesin.`);
    const id=String(r.id||`region-${i}`).slice(0,100);if(ids.has(id))throw Error('Bölge kimlikleri tekrarlanıyor.');ids.add(id);
    return {id,team:r.team===2?2:1,name:String(r.name||`Kırmızı alan ${i+1}`).slice(0,80),visible:r.visible!==false,points:r.points.map(p=>({x:p.x,y:p.y}))};
  })};
}
export class RegionHistory{
  constructor(value){this.value=cleanRegions(value);this.past=[];this.future=[];}
  commit(value){const clean=cleanRegions(value);if(JSON.stringify(clean)===JSON.stringify(this.value))return false;this.past.push(copy(this.value));if(this.past.length>60)this.past.shift();this.future=[];this.value=clean;return true;}
  undo(){if(!this.past.length)return false;this.future.push(copy(this.value));this.value=this.past.pop();return true;}
  redo(){if(!this.future.length)return false;this.past.push(copy(this.value));this.value=this.future.pop();return true;}
}
