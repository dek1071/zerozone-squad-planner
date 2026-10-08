import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {solveMortar,analyzeLine,validateTerrain} from '../outputs/zerozone-haritalar/terrain-model.js';

// Independent forward time integration of the reference game's ideal projectile.
// This checks the inverse solver; it is not an in-game impact measurement.
function impact(angle,targetHeight){
 const vx=110*Math.cos(angle),g=9.78,dt=.01;let x=0,z=0,vz=110*Math.sin(angle),time=0;
 for(let i=0;i<10000;i++){
  const nx=x+vx*dt,nz=z+vz*dt-.5*g*dt*dt,nv=vz-g*dt;
  if(nv<0&&z>=targetHeight&&nz<=targetHeight){const fraction=(z-targetHeight)/(z-nz);return {distance:x+fraction*(nx-x),time:time+fraction*dt};}
  x=nx;z=nz;vz=nv;time+=dt;
 }
 throw Error('No forward impact');
}
let cases=0,maxError=0,maxTimeError=0,maxRoundedError=0;
for(let distance=51;distance<=1300;distance+=7)for(const height of [-150,-75,-10,0,10,75,150]){
 const s=solveMortar(distance,height);if(!s)continue;
 const p=impact(s.radians,height),rounded=impact(Math.round(s.mil)*Math.PI/3200,height);
 maxError=Math.max(maxError,Math.abs(p.distance-distance));maxTimeError=Math.max(maxTimeError,Math.abs(p.time-s.time));maxRoundedError=Math.max(maxRoundedError,Math.abs(rounded.distance-distance));cases++;
 assert.ok(Math.abs(p.distance-distance)<.002);assert.ok(Math.abs(p.time-s.time)<.0001);
}
assert.ok(cases>900);assert.equal(solveMortar(12100/9.78+.01,0),null);
assert.ok(solveMortar(12100/9.78,0));
for(const widthMeters of [Infinity,'100',NaN])assert.throws(()=>validateTerrain({cols:2,rows:2,values:[0,0,0,0],widthMeters,heightMeters:100}));
const flat={cols:2,rows:2,widthMeters:1000,heightMeters:1000,values:[0,0,0,0]};
for(const [p,bearing] of [[{x:.5,y:0},0],[{x:1,y:.5},90],[{x:.5,y:1},180],[{x:0,y:.5},270]])assert.equal(analyzeLine(flat,{x:.5,y:.5},p,1000,1000).bearing,bearing);
assert.equal(analyzeLine(flat,{x:1,y:1},{x:1,y:1},1000,1000).solution,null);
const report={date:'2026-10-07',method:'Independent time integration, dt=0.01s; not in-game calibration',cases,maxDistanceErrorMeters:maxError,maxTimeErrorSeconds:maxTimeError,maxRoundedMilDistanceErrorMeters:maxRoundedError};
await fs.writeFile('work/terrain-calibration-results.json',JSON.stringify(report,null,2));
console.log('PASS: '+JSON.stringify(report));
