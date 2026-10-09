import assert from 'node:assert/strict';
import fs from 'node:fs';
import {constructionFor,buildBudget} from '../outputs/zerozone-haritalar/planning-model.js';
const data=JSON.parse(fs.readFileSync('outputs/zerozone-haritalar/data/units.json','utf8'));
const layer={boats:true,helicopters:true,tanks:true};
let habs=0,sandbags=0;
for(const unit of Object.values(data.units)){
 const plan={items:Object.fromEntries(unit.deployables.map(d=>[d.id,1]))};
 const budget=buildBudget(unit,layer,data.construction,plan);
 for(const d of unit.deployables){
  const c=constructionFor(unit,d,data.construction);if(!c)continue;
  assert.ok(Number.isFinite(c.cost)&&c.cost>=0,unit.id+' '+d.id);
  assert.equal(budget.builds.find(b=>b.id===d.id).cost,c.cost,'inventory and budget share resolved cost');
  if(d.id.startsWith('HAB_')){assert.equal(c.cost,['MEI','IMF'].includes(unit.faction)?100:500);habs++;}
  if(['Wall_Sandbag','Wall_Sandbag_MurderHole'].includes(d.id)){assert.equal(c.cost,['MEI','IMF'].includes(unit.faction)?10:25);sandbags++;}
 }
 assert.equal(budget.cost,budget.builds.reduce((sum,b)=>sum+b.cost*b.count,0));
}
const u=data.units.BAF_LO_CombinedArms;
const b=buildBudget(u,layer,data.construction,{vehicles:{'HX60 Logistics':1},items:{HAB_NATO:1,Wall_Sandbag:1}});
assert.equal(b.cost,525);assert.equal(b.recommendedLoad,600);assert.equal(b.buildReserve,75);assert.equal(b.ammoCapacity,2400);
const invalid=buildBudget(u,layer,data.construction,{vehicles:{'HX60 Logistics':'bad'},items:{HAB_NATO:Infinity,Wall_Sandbag:-2}});
assert.equal(invalid.cost,0);assert.equal(invalid.capacity,0);
assert.equal(data.construction.HAB_NATO.cost,100,'imported source remains auditable; corrections are explicit');
console.log(`Construction audit: ${habs} faction HABs, ${sandbags} sandbag entries, inventory/budget parity, load rounding and invalid counts PASS`);
