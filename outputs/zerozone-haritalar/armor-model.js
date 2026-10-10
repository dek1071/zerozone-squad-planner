// Game-only approximation of the published Squad Armor layer/trace model.
export const EPS=1e-6;
export function penetrationAt(weapon,meters,curves){
 if(!weapon||!Number.isFinite(meters)||meters<0||meters>4000)throw Error('Mesafe 0–4000 m olmalı.');
 const values=weapon.curve?curves[weapon.curve]:null;
 if(weapon.curve&&!Array.isArray(values))throw Error('Mühimmatın delme eğrisi eksik.');
 if(values?.length){const x=Math.min(meters/50,values.length-1),i=Math.floor(x),v=values[i]+((values[i+1]??values[i])-values[i])*(x-i);if(!Number.isFinite(v)||v<0)throw Error('Geçersiz delme eğrisi.');return v;}
 if(!Number.isFinite(weapon.pen)||weapon.pen<0)throw Error('Delme değeri eksik.');return weapon.pen;
}
export function componentLabel(hit){const c=hit.componentClass||'',n=hit.material.materialName||'';
 if(hit.material.allowPen===false)return 'Geçilemez yüzey';
 if(/Ammo|ammo/.test(c+n))return 'Mühimmat';if(/Engine|engine/.test(c+n))return 'Motor';
 if(/Track|tracks/.test(c+n))return 'Palet';if(/Wheel/.test(c))return 'Tekerlek';
 if((hit.surfaceOpacity??hit.material.opacity)<1)return 'Aralıklı zırh';return 'Zırh';
}
// Geometry is already in world metres. Ignore exit faces and repeated surfaces;
// follow the source viewer's first-hull/first-attached-turret rule.
export function filterLayers(hits){
 const seen=new Set(),attachments=new Set(),out=[];let hull=false;
 for(const h of [...hits].sort((a,b)=>a.distance-b.distance)){
  if(!Number.isFinite(h.cosine)||h.cosine<=EPS||!Number.isFinite(h.distance)||h.distance<0)continue;
  const m=h.material;if(m.materialName==='MI_Transparent_White'||seen.has(h.key))continue;seen.add(h.key);
  const opaque=(h.surfaceOpacity??m.opacity??1)===1,internal=/engine|ammo/i.test(m.materialName),attached=h.attachedTo||'Hull';
  if(opaque&&attached!=='Hull'){if(attachments.has(attached))continue;attachments.add(attached);}
  if(m.allowPen===false){out.push(h);break;}
  const hullSurface=attached==='Hull'||(h.passDamage&&h.passPointDamage);
  if(!hull&&opaque&&hullSurface&&!/engine/i.test(m.materialName)&&h.componentType!=='damageableComp')hull=true;
  else if(hull&&opaque&&hullSurface&&!internal)continue;
  out.push(h);
 }
 return out;
}
export function simulateLayers(hits,{pen,trace=0,exitDistance}={}){
 if(!Number.isFinite(pen)||pen<0||!Number.isFinite(trace)||trace<0)throw Error('Geçersiz mühimmat parametresi.');
 const input=filterLayers(hits);if(!input.length)return{status:'miss',layers:[],endDistance:null,penetrated:0};
 const first=input[0].distance,layers=[];let cost=0,endDistance=first,status='exited',penetrated=0;
 for(const hit of input){
  const d=Math.max(0,hit.distance-first),available=trace>0?Math.max(0,pen*(1-d/trace)):pen;
  const limit=trace>0?first+trace*Math.max(0,1-cost/Math.max(pen,EPS)):Infinity;
  if(hit.distance>limit+EPS){status='trace-ended';endDistance=limit;break;}
  const t=hit.material.thickness;
  if(!Number.isFinite(t)||t<0||typeof hit.material.allowPen!=='boolean'||typeof hit.material.considerForPen!=='boolean'){
   status='unknown';endDistance=hit.distance;layers.push({...hit,label:componentLabel(hit),status:'unknown',effective:null,available,cumulative:cost});break;
  }
  const effective=hit.material.considerForPen?t/Math.max(Math.abs(hit.cosine),EPS):0;
  cost+=effective;
  const passes=hit.material.allowPen&&available>Math.round(cost*100)/100;
  layers.push({...hit,label:componentLabel(hit),effective,available,cumulative:cost,angle:Math.acos(Math.min(1,Math.abs(hit.cosine)))*180/Math.PI,status:passes?'penetrated':'blocked'});
  endDistance=hit.distance;if(!passes){status='blocked';break;}penetrated++;
 }
 if(status==='exited'){
  const exit=Math.max(endDistance,Number.isFinite(exitDistance)?exitDistance:endDistance);
  const limit=trace>0?first+trace*Math.max(0,1-cost/Math.max(pen,EPS)):Infinity;
  endDistance=Math.min(exit,limit);if(limit<exit-EPS)status='trace-ended';
 }
 return{status,layers,endDistance,firstDistance:first,penetrated,pen,trace,cumulative:cost};
}
export function positionOnShot(origin,direction,distance){return origin.map((v,i)=>v+direction[i]*distance);}
export function shotProgress(now,start,duration){return Math.max(0,Math.min(1,(now-start)/Math.max(1,duration)));}
