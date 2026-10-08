import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {validateTerrain,heightAt,solveMortar,analyzeLine,MORTAR} from '../outputs/zerozone-haritalar/terrain-model.js';
import {buildTerrainGeometry} from '../outputs/zerozone-haritalar/terrain-view.js';
const plane={cols:2,rows:2,widthMeters:1000,heightMeters:1000,values:[0,10,20,30]};
assert.equal(heightAt(plane,{x:.5,y:.5}),15);assert.equal(heightAt(plane,{x:1,y:1}),30);
assert.throws(()=>heightAt(plane,{x:1.1,y:0}));assert.throws(()=>validateTerrain({...plane,values:[NaN]}));
const s=solveMortar(500,0);assert.ok(s.mil>1380&&s.mil<1395);
for(const [d,h] of [[500,0],[800,100],[800,-100],[1200,-20]]){
 const a=solveMortar(d,h);assert.ok(a);const t=a.time;assert.ok(Math.abs(MORTAR.speed*Math.cos(a.radians)*t-d)<1e-7);assert.ok(Math.abs(MORTAR.speed*Math.sin(a.radians)*t-.5*MORTAR.gravity*t*t-h)<1e-7);
}
assert.equal(solveMortar(50,0),null);assert.equal(solveMortar(5000,0),null);assert.equal(solveMortar(NaN,0),null);
const flat={...plane,values:[0,0,0,0]},line=analyzeLine(flat,{x:.25,y:.5},{x:.75,y:.5},1000,1000);
assert.equal(line.distance,500);assert.equal(line.bearing,90);assert.equal(line.collision,undefined);assert.ok(Math.abs(line.samples.at(-1).flight-line.end)<1e-7);
const ridge={cols:3,rows:2,widthMeters:1000,heightMeters:1000,values:[0,1000,0,0,1000,0]};assert.ok(analyzeLine(ridge,{x:0,y:.5},{x:1,y:.5},1000,1000).collision);
const root='outputs/zerozone-haritalar/data/',manifest=JSON.parse(await fs.readFile(root+'terrain/manifest.json'));let maps=0,layers=0,unsupported=[];
for(const [id,m]of Object.entries(manifest)){if(!m.available){unsupported.push(id);continue;}const d=validateTerrain(JSON.parse(await fs.readFile(root+`terrain/${id}.json`)));maps++;for(const l of JSON.parse(await fs.readFile(root+id+'.json'))){if(Math.abs(d.widthMeters-l.widthMeters)>Math.max(3,d.widthMeters*.005)||Math.abs(d.heightMeters-l.heightMeters)>Math.max(3,d.heightMeters*.005)){unsupported.push(l.id);continue;}layers++;const a=analyzeLine(d,{x:.4,y:.5},{x:.5,y:.5},l.widthMeters,l.heightMeters);assert.ok(Number.isFinite(a.delta));}}

// Actual WebGL mesh: axes, UV orientation, winding and finite vertices.
const {geometry,base,span}=buildTerrainGeometry(plane,1000,1000,16);
assert.equal(base,0);assert.equal(span,1000);const pos=geometry.getAttribute('position'),uv=geometry.getAttribute('uv'),normal=geometry.getAttribute('normal');
assert.equal(pos.count,289);assert.equal(geometry.index.count,16*16*6);
assert.equal(pos.getX(0),-.5);assert.equal(pos.getZ(0),-.5);assert.equal(uv.getX(0),0);assert.equal(uv.getY(0),1);
assert.equal(uv.getX(pos.count-1),1);assert.equal(uv.getY(pos.count-1),0);assert.ok(Math.abs(pos.getY(pos.count-1)-.03)<1e-7);
assert.ok([...pos.array,...normal.array].every(Number.isFinite));assert.ok(normal.getY(0)>0);geometry.dispose();
console.log('PASS: ballistic endpoint physics, interpolation, '+maps+' terrain files / '+layers+' compatible layers; real Three geometry, UV orientation, normals. Browser covers GPU rendering.');
