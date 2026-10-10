import assert from 'node:assert/strict';
import {terrainSight} from '../outputs/zerozone-haritalar/terrain-model.js';
const data={cols:101,rows:101,widthMeters:1000,heightMeters:1000,values:Array(10201).fill(0)};
const origin={x:.25,y:.5};
const flat=terrainSight(data,origin,{radius:700,size:61});
assert.equal(flat.visible,flat.total,'flat ground remains visible');
for(let y=0;y<101;y++)data.values[y*101+50]=80;
const ridge=terrainSight(data,origin,{radius:700,size:61});
const at=(r,x,y)=>r.cells[Math.floor((y-r.bounds.top)/(r.bounds.bottom-r.bounds.top)*r.size)*r.size+Math.floor((x-r.bounds.left)/(r.bounds.right-r.bounds.left)*r.size)];
assert.equal(at(ridge,.4,.5),1,'ground before ridge visible');
assert.equal(at(ridge,.75,.5),2,'ground behind ridge blocked');
assert.ok(ridge.visible<flat.visible);
assert.ok(terrainSight(data,origin,{radius:700,eye:100,size:61}).visible>ridge.visible,'raising eye reveals more ground');
const corner=terrainSight(data,{x:0,y:0},{radius:50,size:31});
assert.equal(corner.bounds.left,0);assert.equal(corner.bounds.top,0);assert.ok(corner.total>0);
assert.throws(()=>terrainSight(data,origin,{radius:Infinity}));
assert.throws(()=>terrainSight(data,origin,{eye:-1}));
assert.throws(()=>terrainSight(data,{x:2,y:0}));
// An inclined plane has no intervening terrain: every ground sample must be visible.
const plane={...data,values:Array.from({length:10201},(_,i)=>Math.floor(i/101)*1.3+(i%101)*-.7)};
for(const p of [{x:.01,y:.99},{x:.5,y:.5},{x:.99,y:.01}]){const r=terrainSight(plane,p,{radius:700,eye:.1,size:41});assert.equal(r.visible,r.total,'unobstructed tilted plane');}
// Analytic tall vertical ridge: a ground target beyond it is occluded at low eye height.
const fence={...data,values:Array.from({length:10201},(_,i)=>i%101===50?100:0)};
for(const p of [{x:.25,y:.3},{x:.75,y:.7}]){const r=terrainSight(fence,p,{radius:700,eye:1.7,size:51});assert.equal(at(r,1-p.x,p.y),2);assert.equal(at(r,p.x,p.y),1);}
console.log('Sight: flat plane, ridge occlusion, eye height, bounds and invalid inputs PASS');
