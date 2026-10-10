import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import * as THREE from '../outputs/zerozone-haritalar/assets/vendor/three.module.js';
import {penetrationAt,simulateLayers,filterLayers,shotProgress} from '../outputs/zerozone-haritalar/armor-model.js';
import {createArmorGroup,armorIntersections,disposeArmorGroup} from '../outputs/zerozone-haritalar/armor-geometry.js';
const hit=(key,distance,thickness,cosine=1,more={})=>({key,distance,cosine,attachedTo:'Hull',componentType:'damageableComp',componentClass:'',material:{thickness,allowPen:true,considerForPen:true,opacity:1,materialName:'Test'},...more});
const simulate=(h,pen=100,trace=50,exitDistance=4)=>simulateLayers(h,{pen,trace,exitDistance});
assert.equal(penetrationAt({pen:500},1000,{}),500);
assert.equal(penetrationAt({curve:'test'},25,{test:[100,80,60]}),90);
assert.equal(penetrationAt({curve:'test'},4000,{test:[100,80,60]}),60);
for(const distance of [-1,NaN,Infinity,4001])assert.throws(()=>penetrationAt({pen:1},distance,{}));
assert.throws(()=>penetrationAt({curve:'missing'},0,{}));
assert.equal(simulate([hit('a',1,100)],100).status,'blocked','equal threshold does not penetrate');
assert.equal(simulate([hit('a',1,40,.5)],81).layers[0].effective,80);
assert.equal(simulate([hit('a',1,40,.5)],79).status,'blocked');
assert.equal(simulate([hit('a',1,20),hit('b',2,100),hit('c',3,1)],100).layers.length,2,'no hits beyond stopped layer');
assert.equal(simulate([hit('a',1,20),hit('b',3,5)],100,1).status,'trace-ended');
assert.equal(simulate([hit('a',1,20)],100,1,5).endDistance,1.8,'continuous trace exhaustion between surfaces');
assert.equal(simulate([hit('a',1,20)],100,0,5).status,'exited');
assert.equal(simulate([hit('a',1,0,1,{material:{thickness:0,allowPen:false,considerForPen:true}})]).status,'blocked');
assert.equal(simulate([hit('a',1,NaN)]).status,'unknown');
assert.equal(simulate([]).status,'miss');
assert.equal(filterLayers([hit('a',1,10),hit('a',1,10),hit('b',2,10,-1)]).length,1,'deduplication and backface rejection');
const outer=hit('a',1,20,1,{componentType:'mesh'}),exit=hit('b',4,20,1,{componentType:'mesh'});
assert.equal(filterLayers([outer,exit]).length,1,'source first hull convention');
assert.equal(shotProgress(0,0,4500),0);assert.equal(shotProgress(2250,0,4500),.5);assert.equal(shotProgress(9000,0,4500),1);
const root='outputs/zerozone-haritalar/data/armor/',catalog=JSON.parse(fs.readFileSync(root+'catalog.json'));
assert.equal(catalog.vehicles.length,470);assert.equal(catalog.unavailable.length,3);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');let rays=0,contacts=0,meshes=0;
for(const vehicle of catalog.vehicles){
 const json=fs.readFileSync(root+'models/'+vehicle.id+'.json'),bytes=fs.readFileSync(root+'models/'+vehicle.id+'.bin');
 assert.equal(sha(json),vehicle.metadataSha256);assert.equal(sha(bytes),vehicle.geometrySha256);
 const meta=JSON.parse(json),group=createArmorGroup(meta,bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));meshes+=group.children.length;
 const box=new THREE.Box3().setFromObject(group),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3()),radius=size.length();
 assert.ok(radius>.1&&radius<100,vehicle.id+' plausible scale in metres');
 for(const d of [[1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[0,1,0],[1,.3,1]]){
  const offset=new THREE.Vector3(...d).normalize().multiplyScalar(radius*2),origin=center.clone().add(offset),direction=offset.clone().negate().normalize();
  const hits=armorIntersections(group,origin,direction);rays++;
  if(hits.length)contacts++;
  for(const h of hits)assert.ok(Number.isFinite(h.cosine)&&h.cosine>=-1.00001&&h.cosine<=1.00001);
  const result=simulate(hits,800,50,Math.max(0,...hits.map(h=>h.distance)));
  if(result.status!=='miss'){assert.ok(Number.isFinite(result.endDistance));assert.ok(result.endDistance>=result.firstDistance-1e-5);assert.ok(result.layers.every(l=>l.status==='unknown'||Number.isFinite(l.effective)));}
 }
 for(const w of vehicle.weapons)for(const d of [0,25,100,500,2000,4000])assert.ok(Number.isFinite(penetrationAt(w,d,catalog.curves)),vehicle.id+' '+w.id);
 disposeArmorGroup(group);
}
assert.ok(contacts>2000);
console.log(`PASS: 470 real vehicle geometries / ${meshes} meshes / ${rays} rays (${contacts} contacts), source hashes, ammunition curves, obliquity, layer ordering, hard stops and trace exhaustion.`);
