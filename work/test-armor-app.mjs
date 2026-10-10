import fs from 'node:fs/promises';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import * as THREE from '../outputs/zerozone-haritalar/assets/vendor/three.module.js';
class Element{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.listeners={};this.dataset={};this.style={setProperty(){}};this.classList={toggle(){}};this.disabled=false;this.hidden=false;this.checked=false;this._value='';this.textContent='';this.clientWidth=1000;this.clientHeight=600;}
 setAttribute(k,v){this[k]=v;} get value(){return this._value;}set value(v){this._value=String(v);}
 append(...items){this.children.push(...items);}replaceChildren(...items){this.children=items;if(this.tagName==='SELECT')this.value=items.find(i=>i.selected)?.value??items[0]?.value??'';}
 get firstChild(){return this.children[0];}get lastChild(){return this.children.at(-1);}
 addEventListener(event,fn){(this.listeners[event]??=[]).push(fn);}dispatch(event,extra={}){for(const fn of this.listeners[event]||[])fn({target:this,...extra});}
 setCustomValidity(v){this.validationMessage=v;}getBoundingClientRect(){return{left:0,top:0,width:1000,height:600};}
}
const nodes=new Map(),docEvents={},windowEvents={},storage=new Map(),animations=new Map();let serial=0,rejectModel=false,hold=false,release=[];
const selects=new Set(['#target','#variant','#shooter','#ammo','#view-mode','#color-mode','#replay-speed']);
const document={body:new Element(),hidden:false,querySelector(s){if(!nodes.has(s))nodes.set(s,new Element(selects.has(s)?'select':'div'));return nodes.get(s);},querySelectorAll(){return[];},createElement:tag=>new Element(tag),addEventListener(n,fn){docEvents[n]=fn;}};
for(const [key,value]of Object.entries({'#distance':'100','#distance-range':'100','#view-mode':'normal','#color-mode':'none','#replay-speed':'1'}))document.querySelector(key).value=value;
document.querySelector('#follow-camera').checked=true;
class Renderer{constructor(){this.domElement=new Element('canvas');}setPixelRatio(){}setSize(){}render(scene,camera){scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);}dispose(){this.disposed=true;}}
class Controls{constructor(camera){this.camera=camera;this.target=new THREE.Vector3();this.listeners={};}addEventListener(k,fn){this.listeners[k]=fn;}update(){this.camera.lookAt(this.target);this.camera.updateMatrixWorld(true);this.listeners.change?.();}dispose(){}}
class ResizeObserver{constructor(fn){this.fn=fn;}observe(){this.fn();}disconnect(){}}
const root=path.resolve('outputs/zerozone-haritalar');
const context=vm.createContext({console,document,window:{addEventListener:(n,fn)=>windowEvents[n]=fn},location:{href:'http://localhost:4173/armor.html'},history:{replaceState(){}},URL,Option:class extends Element{constructor(label,value,_default,selected){super('option');this.textContent=label;this.value=value;this.selected=selected;}},matchMedia:()=>({matches:false}),localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},AbortController,ResizeObserver,devicePixelRatio:1,performance:{now:()=>0},requestAnimationFrame:fn=>{animations.set(++serial,fn);return serial;},cancelAnimationFrame:id=>animations.delete(id),fetch:async(url,{signal}={})=>{
 if(hold&&url.includes('/models/'))await new Promise(resolve=>release.push(resolve));
 if(signal?.aborted)throw Object.assign(Error('Aborted'),{name:'AbortError'});
 if(rejectModel&&url.includes('/models/'))return{ok:false};
 const b=await fs.readFile(path.join(root,url));return{ok:true,json:async()=>JSON.parse(b),arrayBuffer:async()=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)};
}});
const modules=new Map();async function load(file){if(modules.has(file))return modules.get(file);let module;if(file.endsWith('three.module.js')){const exports={...THREE,WebGLRenderer:Renderer};module=new vm.SyntheticModule(Object.keys(exports),function(){for(const[k,v]of Object.entries(exports))this.setExport(k,v);},{context});}else if(file.endsWith('armor-exterior.js'))module=new vm.SyntheticModule(['loadExterior','disposeExterior','disposeExteriorDecoder'],function(){this.setExport('loadExterior',async()=>new THREE.Group());this.setExport('disposeExterior',g=>g?.removeFromParent());this.setExport('disposeExteriorDecoder',()=>{});},{context});else if(file.endsWith('OrbitControls.js'))module=new vm.SyntheticModule(['OrbitControls'],function(){this.setExport('OrbitControls',Controls);},{context});else{let source=await fs.readFile(file,'utf8');if(file.endsWith('armor-app.js'))source=source.replace(/main\(\);\s*$/,'const ready=main();')+'\nexport {ready,fire,loadTarget,clearShot,refreshAmmo,seek,play,pause,dispose,setView};export const state=()=>({group,exteriorGroup,selectedComponent,shot,camera,controls,playing,disposed,marker});';module=new vm.SourceTextModule(source,{context,identifier:file});}modules.set(file,module);return module;}
const mod=await load(path.join(root,'armor-app.js'));await mod.link((s,m)=>load(path.resolve(path.dirname(m.identifier),s)));await mod.evaluate();const api=mod.namespace;await api.ready;
async function settled(){for(let i=0;i<25;i++)await new Promise(r=>setTimeout(r,5));}
await settled();assert.ok(api.state().group);assert.equal(document.querySelector('#loading').hidden,true);assert.equal(document.querySelector('#fire').disabled,false);
api.setView('front');assert.ok(api.state().camera.position.x>api.state().controls.target.x);api.setView('rear');assert.ok(api.state().camera.position.x<api.state().controls.target.x);api.setView('reset');assert.equal(api.state().marker.material.transparent,true);assert.equal(api.state().marker.material.depthWrite,false);assert.equal(document.querySelector('#ammo').children.length,5);
assert.equal(api.state().exteriorGroup.visible,true);assert.equal(api.state().group.visible,false);
const view=document.querySelector('#view-mode');view.value='xray';view.dispatch('change');
assert.equal(api.state().exteriorGroup.visible,false);assert.equal(api.state().group.visible,true);
const ammoButton=document.querySelector('#component-list').children.find(b=>b.dataset.component==='ammo');assert.ok(ammoButton);ammoButton.dispatch('click');assert.equal(ammoButton['aria-pressed'],'true');
const ammoParts=api.state().group.children.filter(m=>/ammo/i.test([m.userData.name,m.userData.componentClass].join(' ')));assert.ok(ammoParts.length);for(const m of ammoParts){assert.equal(m.material.color.getHexString(),'ff303b');assert.equal(m.material.opacity,1);}
view.value='normal';view.dispatch('change');assert.equal(api.state().selectedComponent,'all');assert.equal(api.state().exteriorGroup.visible,true);
api.fire(new THREE.Vector2());assert.ok(api.state().shot);assert.equal(api.state().exteriorGroup.visible,false);assert.equal(api.state().group.visible,true);
api.clearShot();assert.equal(api.state().exteriorGroup.visible,true);api.fire(new THREE.Vector2());assert.ok(api.state().shot);assert.ok(document.querySelector('#layer-list').children.length);assert.equal(api.state().playing,true);
api.pause();assert.equal(api.state().playing,false);api.seek(.5);assert.equal(document.querySelector('#timeline').value,'500');
document.querySelector('#distance').value='';api.refreshAmmo();assert.equal(api.state().shot,null);assert.equal(document.querySelector('#fire').disabled,true);
document.querySelector('#distance').value='4001';api.refreshAmmo();assert.equal(document.querySelector('#fire').disabled,true);
document.querySelector('#distance').value='100';api.refreshAmmo();assert.equal(document.querySelector('#fire').disabled,false);
document.querySelector('#reduce-motion').checked=true;api.fire(new THREE.Vector2());assert.ok(api.state().shot);assert.equal(api.state().playing,false);assert.equal(document.querySelector('#timeline').value,'1000');
document.querySelector('#color-mode').value='mono';document.querySelector('#color-mode').dispatch('change');assert.equal(storage.get('zz-armor-color'),'mono');
// All in-flight requests for the old vehicle are aborted; latest choice wins.
hold=true;document.querySelector('#variant').value='BP_T72B3';const first=api.loadTarget();document.querySelector('#variant').value='BP_M1A2';const second=api.loadTarget();hold=false;for(const resume of release)resume();await Promise.all([first,second]);assert.equal(api.state().group.name,'BP_M1A2');assert.equal(api.state().shot,null);
rejectModel=true;await api.loadTarget();assert.equal(api.state().group,null);assert.equal(document.querySelector('#fire').disabled,true);assert.match(document.querySelector('#loading').textContent,/yüklenemedi/);rejectModel=false;await api.loadTarget();assert.ok(api.state().group);
api.dispose();assert.equal(api.state().disposed,true);assert.equal(animations.size,0);
console.log('PASS: real armor page modules (DOM/WebGL substitutes): initialization, shot table, timeline, pause, invalid distance, reduced motion, monochrome, stale request cancellation, missing model recovery and disposal.');
