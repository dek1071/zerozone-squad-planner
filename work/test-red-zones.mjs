import fs from 'node:fs';
import assert from 'node:assert/strict';
import {TacticalMap} from '../outputs/zerozone-haritalar/map-engine.js';
const root=new URL('../outputs/zerozone-haritalar/',import.meta.url);
const read=file=>JSON.parse(fs.readFileSync(new URL(file,root)));
const {layers}=read('data/red-zones.json');
assert.equal(Object.keys(layers).length,32);
let count=0;
for(const [id,data] of Object.entries(layers)){
  assert.ok(read(`data/${data.map}.json`).some(l=>l.id===id),id);
  assert.equal(data.regions.length,2);
  assert.deepEqual(data.regions.map(r=>r.team).sort(),[1,2]);
  for(const region of data.regions){
    count++;
    assert.ok(region.points.length>=3);
    for(const p of region.points)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1,id);
    const area=region.points.reduce((sum,p,i)=>{const q=region.points[(i+1)%region.points.length];return sum+p.x*q.y-q.x*p.y;},0)/2;
    assert.ok(Math.abs(area)>.001&&Math.abs(area)<.5,`${id} polygon area`);
  }
  if(data.playableBoundary){assert.ok(data.playableBoundary.length>3);for(const p of data.playableBoundary)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));}
}
assert.equal(count,64);
assert.notDeepEqual(layers.Gorodok_RAAS_v1.regions,layers.Gorodok_RAAS_v2.regions);
assert.equal(layers.Gorodok_AAS_v1,undefined,'Do not invent outlines for unsupported layouts');
// Verify that hiding objectives does not hide the red regions, and switching to
// a layer without reference data removes the previous layer's regions.
let drawn=[];
const map=Object.create(TacticalMap.prototype);
Object.assign(map,{config:{redZones:layers.Gorodok_RAAS_v1},overlays:{redZones:true,objectives:false},redZoneLayer:{clearLayers(){drawn=[];}},_latLng:p=>[-p.y*4064,p.x*4064],L:{polygon(points,opts){return {addTo(){drawn.push({points,opts});return this;},getElement(){return null;}};}}});
map._renderRedZones();assert.equal(drawn.length,2);assert.equal(drawn[0].opts.interactive,false);assert.equal(drawn[0].opts.pane,'zz-red-zones');
map.setOverlay('redZones',false);assert.equal(drawn.length,0);
map.setOverlay('redZones',true);assert.equal(drawn.length,2);
map.config={};map._renderRedZones();assert.equal(drawn.length,0);
console.log('PASS: 32 reference layouts, 64 bounded regions, per-layer isolation, independent visibility and pointer pass-through.');
