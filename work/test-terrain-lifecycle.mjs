import * as accessibility from '../outputs/zerozone-haritalar/accessibility.js';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import * as Three from '../outputs/zerozone-haritalar/assets/vendor/three.module.js';
import * as terrainModel from '../outputs/zerozone-haritalar/terrain-model.js';
import * as planningModel from '../outputs/zerozone-haritalar/planning-model.js';
import * as fireSupport from '../outputs/zerozone-haritalar/fire-support.js';
let renderCount=0,disposedRenderers=0,disconnected=0;
// Exercise real scene/camera/geometry with GPU and image loading substituted; GPU is tested in browser.
class Renderer {constructor({canvas}){if(!canvas.getContext())throw Error('no GPU');this.capabilities={getMaxAnisotropy:()=>8};}setPixelRatio(){}setClearColor(){}setSize(){}render(scene,camera){renderCount++;assert.ok(camera.isOrthographicCamera||camera.isPerspectiveCamera);assert.ok(scene.children[0].children[0].geometry.isBufferGeometry);}dispose(){disposedRenderers++;}forceContextLoss(){}}
class TextureLoader{load(_url,ready){const t=new Three.Texture();queueMicrotask(()=>ready(t));return t;}}
globalThis.ResizeObserver=class{observe(){}disconnect(){disconnected++;}};
const synthetic=obj=>new vm.SyntheticModule(Object.keys(obj),function(){for(const [k,v] of Object.entries(obj))this.setExport(k,v);});
const viewModule=new vm.SourceTextModule(fs.readFileSync('outputs/zerozone-haritalar/terrain-view.js','utf8'));
await viewModule.link(name=>synthetic(name.includes('accessibility')?accessibility:name.includes('three.module')?{...Three,WebGLRenderer:Renderer,TextureLoader}:terrainModel));await viewModule.evaluate();
const {createTerrainView}=viewModule.namespace;
const toolsModule=new vm.SourceTextModule(fs.readFileSync('outputs/zerozone-haritalar/terrain-tools.js','utf8'),{importModuleDynamically:async()=>viewModule});
await toolsModule.link(name=>synthetic(name.includes('accessibility')?accessibility:name.includes('terrain-model')?terrainModel:name.includes('fire-support')?fireSupport:planningModel));await toolsModule.evaluate();
const {createTerrainTools}=toolsModule.namespace;
import {TacticalMap} from '../outputs/zerozone-haritalar/map-engine.js';
import {normalizeAnnotations} from '../outputs/zerozone-haritalar/planning-model.js';
const data={cols:2,rows:2,widthMeters:1000,heightMeters:1000,values:[0,0,0,0]};
let scheduled=0,cancelled=0,frameId=0,frames=new Map();
globalThis.Image=class{};
globalThis.requestAnimationFrame=fn=>{scheduled++;frames.set(++frameId,fn);return frameId;};
globalThis.cancelAnimationFrame=id=>{cancelled++;frames.delete(id);};
const flush=()=>{const batch=[...frames.values()];frames.clear();batch.forEach(fn=>fn());};
function canvas(){
 const events=new Map(),ctx={fillRect(){},beginPath(){},closePath(){},fill(){},stroke(){},fillText(){},arc(){},moveTo(){},lineTo(){}};
 return {width:1100,height:680,events,getContext:()=>ctx,setPointerCapture(){},focus(){},addEventListener:(n,fn)=>events.set(n,fn),removeEventListener:n=>events.delete(n)};
}
const surface=canvas(),view=createTerrainView(surface,data,{width:1000,height:1000,image:'local.webp'});flush();
const trigger=(name,e)=>surface.events.get(name)(e);
trigger('pointerdown',{button:0,pointerId:1,clientX:0,clientY:0});
trigger('pointerdown',{button:0,pointerId:2,clientX:100,clientY:100});
trigger('pointerup',{pointerId:2});
const before=scheduled;trigger('pointermove',{pointerId:1,clientX:20,clientY:20});
assert.ok(scheduled>before,'lifting a second finger must not stop primary drag');flush();
trigger('lostpointercapture',{pointerId:1});const after=scheduled;trigger('pointermove',{pointerId:1,clientX:50,clientY:50});assert.equal(scheduled,after);
view.destroy();assert.equal(surface.events.size,0);assert.equal(frames.size,0);

// Use actual map history methods with rendering callbacks replaced by no-ops.
const map=Object.create(TacticalMap.prototype);
Object.assign(map,{annotations:normalizeAnnotations([{id:'a',tool:'mortar',points:[{x:.1,y:.1},{x:.6,y:.1}]}]),_history:[],_future:[],_renderAnnotations(){},_changed(){},cancelPending(){},config:{image:'local.webp'},overlays:{redZones:false}});
const copy=map.exportPlan();copy[0].mortar.weaponOffset=12;map.importPlan(copy);map.undo();assert.equal(map.exportPlan()[0].mortar.weaponOffset,1);map.redo();assert.equal(map.exportPlan()[0].mortar.weaponOffset,12);
const beforeBad=JSON.stringify(map.exportPlan());assert.throws(()=>map.importPlan([{tool:'mortar',points:[]}]),/geçersiz/);assert.equal(JSON.stringify(map.exportPlan()),beforeBad);

// Run real modal/dynamic-import wiring against explicit DOM/Canvas test doubles.
let dialogs=[],focusRestores=0,errors=[],failCanvas=false;
const opener={focus(){focusRestores++;}},button={},result={isConnected:true,innerHTML:'',querySelector:()=>button};
const panel={innerHTML:'',querySelector:()=>result};result.parentElement=panel;
globalThis.document={activeElement:opener,addEventListener(){},querySelector:()=>null,body:{appendChild(d){dialogs.push(d);}},createElement(type){
 assert.equal(type,'dialog');const events=new Map(),c=canvas();if(failCanvas)c.getContext=()=>null;
 const nodes=new Map([['canvas',c]]);return {events,nodes,setAttribute(){},innerHTML:'',showModal(){this.open=true;},addEventListener(n,fn){events.set(n,fn);},querySelector(q){if(!nodes.has(q))nodes.set(q,{setAttribute(){},getAttribute(){return "false";}});return nodes.get(q);},close(){this.open=false;events.get('close')?.();},remove(){this.removed=true;}};
}};
globalThis.fetch=async()=>({ok:true,json:async()=>data});
const tools=createTerrainTools({map,getState:()=>({mapId:'Test',layer:{id:'Test_RAAS_v1',name:'Test',widthMeters:1000,heightMeters:1000}}),setTool(){},escape:String,toast:t=>errors.push(t),readStore:(_k,v)=>v,store(){}});
await tools.render(panel);
const pending=button.onclick();const early=dialogs.at(-1);early.close();await pending;assert.equal(early.nodes.get('canvas').events.size,0,'close before dynamic import does not start renderer');
for(let i=0;i<10;i++){
 await button.onclick();const d=dialogs.at(-1);assert.ok(d.open);assert.equal(d.nodes.get('canvas').events.size,9);flush();
 d.nodes.get('[data-terrain-zoom=in]').onclick();flush();d.nodes.get('[data-terrain-reset]').onclick();flush();
 await button.onclick();assert.equal(dialogs.at(-1),d,'repeated open has one modal');
 d.nodes.get('[data-terrain-close]').onclick();assert.ok(d.removed);assert.equal(d.nodes.get('canvas').events.size,0);assert.equal(frames.size,0);
}
failCanvas=true;await button.onclick();assert.match(errors.at(-1),/WebGL/);assert.ok(dialogs.at(-1).removed);assert.equal(focusRestores,12);
assert.ok(cancelled>=11);assert.equal(disposedRenderers,11);assert.equal(disconnected,11);assert.ok(renderCount>20);
console.log('PASS: multi-pointer drag ownership, real history undo/redo, invalid import isolation, close during import, 10 modal cycles, zoom/reset, focus restore, WebGL failure and renderer/observer/listener/frame cleanup (DOM/GPU substitutes; real Three scene geometry).');
// New playback methods: deterministic seeking, collision stop, toggles and shutdown.
const shot=terrainModel.analyzeLine(data,{x:.1,y:.1},{x:.6,y:.1},1000,1000);
let playback=[];const shotCanvas=canvas(),shotView=createTerrainView(shotCanvas,data,{width:1000,height:1000,image:'local.webp',line:{...shot,collision:{t:.4}},objectives:[{zones:[{type:'circle',x:.3,y:.3,radius:50},{type:'polygon',points:[{x:.1,y:.1},{x:.8,y:.1},{x:.8,y:.8}]}]}],onProgress:(p,playing)=>playback.push([p,playing])});
shotView.seek(.8);assert.deepEqual(playback.at(-1),[.4,false]);shotView.play();assert.deepEqual(playback.at(-1),[0,true]);flush();assert.ok(playback.at(-1)[0]>=0);shotView.play();assert.equal(playback.at(-1)[1],false);
shotView.top();shotView.focusShot();shotView.toggle('objectives',true);shotView.toggle('trajectory',false);flush();shotView.reset();shotView.seek(.2);assert.deepEqual(playback.at(-1),[.2,false]);shotView.destroy();assert.equal(frames.size,0);assert.equal(shotCanvas.events.size,0);
console.log('PASS: playback seek/pause/restart, sampled collision stop, objective geometry, group toggles, shot focus/top/reset, frame cleanup.');
// Free-flight: forward movement, bounded map, ground floor, return and listener cleanup.
let cameras=[];const flyCanvas=canvas(),flyView=createTerrainView(flyCanvas,data,{width:1000,height:1000,image:'local.webp',onCamera:s=>cameras.push(s)});flyView.fly(true);flush();const start=cameras.at(-1);flyView.step('w');flush();assert.ok(cameras.at(-1).y<start.y);for(let i=0;i<100;i++)flyView.step('q');flush();assert.ok(cameras.at(-1).height>=2);for(let i=0;i<100;i++)flyView.step('w');flush();assert.equal(cameras.at(-1).y,0);flyCanvas.events.get('keydown')({key:'w',preventDefault(){}});flyCanvas.events.get('blur')();flush();assert.equal(frames.size,0);flyView.top();flush();assert.equal(cameras.at(-1).free,false);flyView.destroy();assert.equal(flyCanvas.events.size,0);assert.equal(frames.size,0);console.log('PASS: free camera moves, stops at ground and map edge, releases keys on blur, switches to orbit and cleans up.');
