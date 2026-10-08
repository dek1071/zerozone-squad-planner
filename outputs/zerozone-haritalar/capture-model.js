// Independent sequential prediction from published lane/cluster data.
// Assumption: lanes have equal priors, and each cluster candidate is equally likely.
export const samePoint=(a,b)=>!!a&&!!b&&Math.abs(a.x-b.x)<.0001&&Math.abs(a.y-b.y)<.0001;
const candidates=group=>group.candidates?.length?group.candidates:[group];

function routesFor(layer,team){
  const groups=new Map(layer.points.map(p=>[p.id,p]));
  return layer.lanes.map(lane=>{
    const route=lane.ids.map(id=>groups.get(id)).filter(Boolean);
    return {name:lane.name,groups:team===2?route.reverse():route,weight:1/layer.lanes.length};
  });
}
function advance(routes,point,depth){
  const next=routes.flatMap(route=>{
    const group=route.groups[depth];if(!group)return [];
    const choices=candidates(group),matches=choices.filter(c=>samePoint(c,point)).length;
    return matches?[{...route,weight:route.weight*matches/choices.length}]:[];
  });
  const total=next.reduce((sum,r)=>sum+r.weight,0);
  return next.map(r=>({...r,weight:r.weight/total}));
}
export function capturePrediction(layer,state={}){
  const team=state.team===2?2:1;
  let routes=routesFor(layer,team);const selected=[];
  for(const point of Array.isArray(state.selected)?state.selected.slice(0,50):[]){
    const next=advance(routes,point,selected.length);if(!next.length)break;
    const canonical=routes.flatMap(r=>r.groups[selected.length]?candidates(r.groups[selected.length]):[]).find(p=>samePoint(p,point));
    selected.push({x:canonical.x,y:canonical.y,name:canonical.name});routes=next;
  }
  const points=[];
  const merge=(point,depth,status,probability=0,laneName='')=>{
    // Retain separate occurrences of a physical flag at different depths.
    let existing=points.find(p=>p.depth===depth&&samePoint(p,point));
    if(!existing){existing={...point,id:`capture-${depth}-${point.x.toFixed(5)}-${point.y.toFixed(5)}`,depth,order:depth+1,captureStatus:status,probability:0,laneNames:[]};points.push(existing);}
    existing.probability+=probability;if(laneName&&!existing.laneNames.includes(laneName))existing.laneNames.push(laneName);
  };
  selected.forEach((p,i)=>{
    const source=routes.flatMap(r=>r.groups[i]?candidates(r.groups[i]):[]).find(c=>samePoint(c,p))||p;
    merge(source,i,'selected');
  });
  for(const route of routes)for(let i=selected.length;i<route.groups.length;i++){
    const choices=candidates(route.groups[i]);
    for(const point of choices)merge(point,i,i===selected.length?'next':'future',i===selected.length?route.weight/choices.length:0,route.name);
  }
  const start=layer.mains.find(m=>Number(m.team)===team);
  const links=[];let prior=start;
  for(const point of points.filter(p=>p.captureStatus==='selected')){if(prior)links.push({from:prior.id,to:point.id,captured:true});prior=point;}
  return {team,selected,points,links,next:points.filter(p=>p.captureStatus==='next'),lanes:layer.lanes.map(l=>({name:l.name,probability:routes.find(r=>r.name===l.name)?.weight||0})),complete:routes.length>0&&routes.every(r=>r.groups.length===selected.length)};
}
export function chooseCapture(layer,state,point){
  const current=capturePrediction(layer,state);
  const selected=current.points.find(p=>p.captureStatus==='selected'&&samePoint(p,point)&&(point.depth===undefined||point.depth===p.depth));
  if(selected)return {team:current.team,selected:current.selected.slice(0,selected.depth)};
  const next=current.next.find(p=>samePoint(p,point));
  return {team:current.team,selected:next?[...current.selected,{x:next.x,y:next.y,name:next.name}]:current.selected};
}
