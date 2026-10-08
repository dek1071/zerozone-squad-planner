import assert from 'node:assert/strict';
import {TacticalMap} from '../outputs/zerozone-haritalar/map-engine.js';
import {cleanMortarSettings} from '../outputs/zerozone-haritalar/planning-model.js';
const map=Object.create(TacticalMap.prototype),noop=()=>{};
Object.assign(map,{tool:'pan',width:1000,height:1000,config:{},annotations:[],_history:[],_future:[],_counter:0,style:{},mortarOrigin:null,mortarOriginReset:false,mortarSettings:cleanMortarSettings(),_renderAnnotations:noop,onChange:noop,onStatus:noop,getGrid:()=>'',previewLayer:{clearLayers:noop},editLayer:{clearLayers:noop},element:{style:{},classList:{toggle:noop}},map:{dragging:{enable:noop,disable:noop},doubleClickZoom:{enable:noop,disable:noop}},L:{latLng:(y,x)=>({x,y}),circleMarker:()=>({addTo:noop})}});
const a={x:.1,y:.2},b={x:.3,y:.4},c={x:.5,y:.4};
map.setTool('mortar');map._acceptPoint(a);assert.equal(map.annotations.length,0);assert.deepEqual(map.mortarOrigin,a);
map.mortarSettings.weaponOffset=12;map._acceptPoint(b);map._acceptPoint(c);assert.equal(map.annotations.length,2);
for(const item of map.annotations){assert.deepEqual(item.points[0],a);assert.equal(item.mortar.weaponOffset,12);assert.equal(item.mortar.targetOffset,0);}
map._acceptPoint(a);assert.equal(map.annotations.length,2,'same-point target rejected');
map.setTool('pan');map.setTool('mortar');assert.deepEqual(map.mortarOrigin,a);map._acceptPoint({x:.7,y:.7});assert.equal(map.annotations.length,3);
map.undo();assert.equal(map.annotations.length,2);assert.deepEqual(map.mortarOrigin,a);map.redo();assert.equal(map.annotations.length,3);
map.resetMortarOrigin();map.setTool('mortar');assert.equal(map.mortarOrigin,null,'draw button must not restore old source after explicit reset');
map.setTool('pan');map.setTool('mortar');assert.equal(map.mortarOrigin,null);
const a2={x:.8,y:.1};map._acceptPoint(a2);assert.equal(map.annotations.length,3);map._acceptPoint(b);assert.deepEqual(map.annotations.at(-1).points[0],a2);assert.deepEqual(map.annotations[0].points[0],a,'old lines preserved');
assert.equal(map.annotations.at(-1).mortar.weaponOffset,12,'reposition preserves the configured launch height');
map.useMortarOrigin(map.annotations[0]);assert.deepEqual(map.mortarOrigin,a);assert.equal(map.mortarSettings.weaponOffset,12);
map.mortarOrigin=null;map.setTool('pan');map.setTool('mortar');assert.deepEqual(map.mortarOrigin,a2,'restores last saved line on entering mortar');
console.log('PASS: persistent source, consecutive targets, tool switches, undo/redo, same-point guard, explicit reposition, old-line preservation and resume saved line.');

map.mortarSettings={weapon:'grad',arc:'low',weaponOffset:3,targetOffset:12};map.resetMortarOrigin();assert.deepEqual(map.mortarSettings,{weapon:'grad',arc:'low',weaponOffset:3,targetOffset:0});
console.log('PASS: reposition keeps chosen weapon, arc and launch height, resets only target height.');

