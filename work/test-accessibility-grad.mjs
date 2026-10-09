import assert from 'node:assert/strict';import {mapImageFilter,annotationAppearance,PALETTES,displayMode,polarTarget,headingCorrection} from '../outputs/zerozone-haritalar/accessibility.js';import {cleanDisplay} from '../outputs/zerozone-haritalar/workspace-model.js';import {solveWeapon} from '../outputs/zerozone-haritalar/fire-support.js';
const l=hex=>{const c=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];};for(const [mode,p]of Object.entries(PALETTES)){if(mode==='none')continue;for(const key of ['team1','team2','flight','ground','selected','next'])assert.ok((l(p[key])+.05)/(l('#10191e')+.05)>4.5,mode+key);assert.equal(cleanDisplay({colorMode:mode}).colorMode,mode);}
assert.equal(displayMode({colorBlind:true}),'deutan');assert.equal(displayMode({colorBlind:'true'}),'none');assert.equal(displayMode({colorMode:'mono',colorBlind:false}),'mono');assert.equal(displayMode({colorMode:'none',colorBlind:true}),'none');
const origin={x:.5,y:.5};for(const [b,x,y]of [[0,.5,.4],[90,.6,.5],[180,.5,.6],[270,.4,.5]]){const p=polarTarget(origin,b,100,1000,1000);assert.ok(Math.abs(p.x-x)<1e-10&&Math.abs(p.y-y)<1e-10);}
for(const [from,to,result]of [[350,10,20],[10,350,-20],[120,90,-30],[0,0,0]])assert.equal(headingCorrection(from,to),result);assert.throws(()=>polarTarget(origin,0,1000,1000,1000));assert.throws(()=>polarTarget(null,90,100,1000,1000));
const s=solveWeapon(1223.2,1.8-3,'grad','low');assert.ok(Math.abs(s.degrees-18.31)<.01);assert.equal(s.time.toFixed(1),'6.4');console.log('PASS: palette contrast, legacy display migration, four polar bearings, bounds, shortest-turn wrap and live SquadCalc Grad 1223.2 m reference.');
const colors=['#b5e8fa','#f19aa4','#f4c27b','#addeb2','#f4f3ef'];
for(const mode of Object.keys(PALETTES)){
 const appearances=colors.map(c=>annotationAppearance(mode,c));
 if(mode==='none'){assert.deepEqual(appearances.map(a=>a.color),colors);assert.equal(mapImageFilter(mode,100),'none');}
 else {assert.equal(new Set(appearances.map(a=>a.code)).size,5);assert.equal(new Set(appearances.map(a=>a.dash)).size,5);assert.notEqual(mapImageFilter(mode,0),mapImageFilter(mode,100));}
}
assert.equal(cleanDisplay({colorIntensity:200}).colorIntensity,100);assert.equal(cleanDisplay({colorIntensity:-5}).colorIntensity,0);
assert.equal(cleanDisplay({}).colorIntensity,70);assert.equal(mapImageFilter('bad',100),'none');
console.log('PASS: every supported mode, five redundant annotation groups, terrain filter intensity and persisted bounds.');

assert.match(mapImageFilter('mono',0),/grayscale\(1\)/,'monochrome always removes terrain hue');
