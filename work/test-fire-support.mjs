import assert from 'node:assert/strict';
import {WEAPONS,elevationText,solveWeapon,gridPoint,spreadEstimate,spreadPolygon} from '../outputs/zerozone-haritalar/fire-support.js';
import {analyzeLine} from '../outputs/zerozone-haritalar/terrain-model.js';
import {cleanMortarSettings,normalizeAnnotations} from '../outputs/zerozone-haritalar/planning-model.js';
import {TacticalMap} from '../outputs/zerozone-haritalar/map-engine.js';
const map=Object.create(TacticalMap.prototype);Object.assign(map,{config:{},width:10000,height:10000});
for(const s of ['A1-7-3','N14-5-1','AA2-9-8','C7-1-9'])assert.equal(map.getGrid(gridPoint(s,10000,10000)),s);
assert.deepEqual(gridPoint('a1',1000,1000),{x:.15,y:.15});
for(const s of ['A0','A1-0','A1-10','ZZ100','bad','A1-2-3-4'])assert.throws(()=>gridPoint(s,1000,1000));
assert.equal(map.getGrid(gridPoint('AA2',10000,10000)).split('-')[0],'AA2');
let cases=0,maxError=0;
for(const [id,w]of Object.entries(WEAPONS))for(const arc of ['high','low'])for(const delta of [-70,0,60])for(const d of [100,400,650,900,1200,1700,2000]){
 const s=solveWeapon(d,delta,id,arc);if(!s)continue;let x=0,y=0,vy=w.speed*Math.sin(s.radians),vx=w.speed*Math.cos(s.radians),t=0;
 while(t<s.time){const dt=Math.min(.01,s.time-t);x+=vx*dt;y+=vy*dt-.5*w.gravity*dt*dt;vy-=w.gravity*dt;t+=dt;}
 const err=Math.max(Math.abs(x-d),Math.abs(y-delta));maxError=Math.max(maxError,err);assert.ok(err<1e-6);cases++;
}
assert.equal(solveWeapon(50,0,'mortar'),null);assert.equal(solveWeapon(339,0,'m121'),null);assert.equal(solveWeapon(600,0,'mortar','low'),null);assert.equal(solveWeapon(Infinity,0),null);
const ref=solveWeapon(1050.1,3.2-1);assert.ok(Math.abs(ref.mil-1082.8)<.1);assert.ok(Math.abs(ref.time-19.6)<.1);
const old=cleanMortarSettings();assert.equal(old.weapon,'mortar');assert.equal(old.arc,'high');
for(const id of Object.keys(WEAPONS)){const item={id:'x',tool:'mortar',points:[{x:.2,y:.6},{x:.4,y:.3}],mortar:{weapon:id,arc:'low',weaponOffset:3,targetOffset:4}};assert.deepEqual(normalizeAnnotations(JSON.parse(JSON.stringify([item])))[0].mortar,item.mortar);}
const data={cols:2,rows:2,widthMeters:2000,heightMeters:2000,values:[0,0,0,0]};
const a=analyzeLine(data,{x:.2,y:.6},{x:.4,y:.3},2000,2000);const spread=spreadEstimate(a);assert.ok(spread.along>0&&spread.across>0);assert.equal(spreadPolygon(a,2000,2000).length,64);assert.ok(spreadPolygon(a,2000,2000).every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
assert.equal(spreadEstimate({...a,solution:null}),null);
console.log('PASS:',cases,'weapon/arc/height trajectories, error',maxError,'m; live reference result, grid roundtrips/bounds, settings persistence, spread geometry. Numerical validation, not in-game calibration.');
assert.equal(elevationText({mil:1600,degrees:90},WEAPONS.mortar),'1600 milyem');
assert.equal(elevationText({mil:800,degrees:45},WEAPONS.grad),'45.0°');
assert.equal(elevationText(null,WEAPONS.mortar),'—');

