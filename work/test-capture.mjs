import fs from 'node:fs';
import assert from 'node:assert/strict';
import {capturePrediction,chooseCapture,samePoint} from '../outputs/zerozone-haritalar/capture-model.js';
const read=name=>JSON.parse(fs.readFileSync(new URL('../outputs/zerozone-haritalar/data/'+name,import.meta.url),'utf8'));
const layer=read('Gorodok.json').find(l=>l.id==='Gorodok_RAAS_v1');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
let state={team:1,selected:[]};
const choose=name=>{const point=capturePrediction(layer,state).next.find(p=>p.name===name);assert.ok(point,name);state=chooseCapture(layer,state,point);};
let p=capturePrediction(layer,state);close(p.next.find(p=>p.name==='Desna').probability,.5);close(p.next.find(p=>p.name==='Russian Outpost').probability,1/3);close(p.next.find(p=>p.name==='Western Spy Farm').probability,1/6);
choose('Desna');p=capturePrediction(layer,state);assert.equal(p.lanes[0].probability,0);close(p.lanes[1].probability,1/3);close(p.lanes[2].probability,2/3);assert.equal(p.next.length,3);p.next.forEach(p=>close(p.probability,1/3));
// Future targets cannot skip a step.
assert.deepEqual(chooseCapture(layer,state,p.points.find(p=>p.name==='Gas Station')),state);
choose('Soloninki Lower');choose('Soloninki Upper');p=capturePrediction(layer,state);assert.equal(p.lanes[2].probability,1);assert.equal(p.next.length,3);assert.equal(p.links.length,3);assert.ok(!p.points.some(p=>p.name==='Soloninki Ruins'));
state=chooseCapture(layer,state,p.points.find(p=>p.name==='Soloninki Lower'));assert.equal(state.selected.length,1);assert.equal(capturePrediction(layer,state).next.length,3);
state={team:2,selected:[]};choose('Akim Central');p=capturePrediction(layer,state);close(p.next.find(p=>p.name==="Butcher's House").probability,.5);close(p.next.find(p=>p.name==='Sluda Hamlet').probability,.25);close(p.lanes[1].probability,.5);
assert.equal(capturePrediction(layer,{team:1,selected:[{x:NaN,y:0}]}).selected.length,0);
const repeat={lanes:[{name:'A',ids:['a','b']}],mains:[],points:[{id:'a',x:.1,y:.1,name:'Shared'},{id:'b',x:.1,y:.1,name:'Shared'}]};
let r={team:1,selected:[{x:.1,y:.1}]};r=chooseCapture(repeat,r,capturePrediction(repeat,r).next[0]);assert.equal(r.selected.length,2);
let checked=0,zones=0;
for(const map of read('catalog.json'))for(const l of read(map.id+'.json')){
 for(const group of l.points)for(const point of group.candidates?.length?group.candidates:[group])for(const z of point.zones||[]){zones++;if(z.type==='circle')assert.ok(z.radius>0&&Number.isFinite(z.x)&&Number.isFinite(z.y));else assert.ok(z.points.length>=3&&z.points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));}
 if(!l.lanes.length)continue;
 for(const team of [1,2]){let s={team,selected:[]};for(let depth=0;depth<50;depth++){const pr=capturePrediction(l,s);close(pr.lanes.reduce((a,l)=>a+l.probability,0),1);if(pr.complete)break;assert.ok(pr.next.length,l.id+' missing next');close(pr.next.reduce((a,p)=>a+p.probability,0),1);s=chooseCapture(l,s,pr.next[0]);assert.equal(s.selected.length,depth+1,l.id+' did not advance');}assert.ok(capturePrediction(l,s).complete,l.id+' did not finish');checked++;}
}
console.log(`PASS: reference probabilities, forward/reverse selection, truncation, future rejection, shared locations, ${checked} full route traversals, ${zones} region geometries.`);
