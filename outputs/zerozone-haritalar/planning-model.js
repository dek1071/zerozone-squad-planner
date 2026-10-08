import {WEAPONS} from './fire-support.js';
export const DRAW_TOOLS = ['pin','hab','arrow','measure','mortar','line','circle','rectangle','brush'];
export const SYMBOLS = {pin:'İşaret',fob:'FOB',rally:'Rally',infantry:'Piyade',vehicle:'Araç',support:'Destek',mine:'Mayın',repair:'Onarım',mortar:'Havan',hmg:'Ağır makineli'};
export const COLOURS = ['#b5e8fa','#f19aa4','#f4c27b','#addeb2','#f4f3ef'];
export function cleanMortarSettings(value={}) {
  const bounded=(n,fallback)=>Number.isFinite(n)?Math.max(0,Math.min(100,n)):fallback;
  return {weapon:Object.hasOwn(WEAPONS,value?.weapon)?value.weapon:'mortar',arc:value?.arc==='low'?'low':'high',weaponOffset:bounded(value?.weaponOffset,1),targetOffset:bounded(value?.targetOffset,0)};
}
export function cleanStyle(style={}) {
  return {color:COLOURS.includes(style.color)?style.color:COLOURS[0],weight:Math.max(1,Math.min(8,Number(style.weight)||3)),symbol:Object.hasOwn(SYMBOLS,style.symbol)?style.symbol:'pin',dashed:style.dashed===true};
}
export function normalizeAnnotations(items) {
  if(!Array.isArray(items)||items.length>500)throw Error('Bir planda en fazla 500 işaret olabilir.');
  return items.map((a,i)=>{
    const count=['pin','hab'].includes(a?.tool)?1:2;
    if(!DRAW_TOOLS.includes(a?.tool)||!Array.isArray(a.points)||(a.tool==='brush'?a.points.length<2||a.points.length>2000:a.points.length!==count)||a.points.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<0||p.x>1||p.y<0||p.y>1))throw Error(`${i+1}. plan işareti geçersiz.`);
    return {id:typeof a.id==='string'?a.id.slice(0,100):`import-${i}`,tool:a.tool,points:a.points.map(p=>({x:p.x,y:p.y})),label:typeof a.label==='string'?a.label.slice(0,120):'',createdAt:typeof a.createdAt==='string'?a.createdAt.slice(0,40):'',style:cleanStyle(a.style),...(a.tool==='mortar'?{mortar:cleanMortarSettings(a.mortar)}:{})};
  });
}
export function availableVehicles(unit,layer) {
  return unit.vehicles.filter(v=>(layer.boats||!['BOAT','RHIB'].includes(v.type)&&!/RHIB|RIB|boat/i.test(v.name))&&(layer.helicopters||v.type!=='UH')&&(layer.tanks||v.type!=='MBT'));
}
export function buildBudget(unit,layer,construction,plan={}) {
  const vehicles=availableVehicles(unit,layer).filter(v=>['LOGI','UH'].includes(v.type)&&v.resources>0);
  const counts=plan.vehicles||{},items=plan.items||{};
  const bounded=(n,max)=>Math.max(0,Math.min(max,Math.floor(Number(n)||0)));
  const capacity=vehicles.reduce((sum,v)=>sum+v.resources*bounded(counts[v.name],v.count),0);
  const builds=unit.deployables.filter(d=>construction[d.id]&&Number.isFinite(construction[d.id].cost)).map(d=>({...d,...construction[d.id],count:bounded(items[d.id],d.availability<0?999:d.availability)}));
  const cost=builds.reduce((sum,b)=>sum+b.count*b.cost,0);
  return {vehicles,builds,capacity,cost,remaining:capacity-cost};
}
// Match observed physical flags against every lane, even when several clusters share a flag.
export function matchingLanes(layer,observed=[]) {
  return layer.lanes.filter(l=>observed.every(q=>layer.points.some(p=>l.ids.includes(p.id)&&(p.candidates?.length?p.candidates:[p]).some(c=>Math.abs(c.x-q.x)<.0001&&Math.abs(c.y-q.y)<.0001))));
}
