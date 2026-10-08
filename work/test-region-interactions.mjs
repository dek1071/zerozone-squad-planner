import assert from 'node:assert/strict';
import {createRegionEditor} from '../outputs/zerozone-haritalar/region-editor.js';

// Run the real editor against small DOM/Leaflet substitutes; no user storage is touched.
const events=new Map(),saved=new Map(),nodes=new Map(),groups=[];
const node=()=>({dataset:{},hidden:false,innerHTML:'',checked:true,handlers:{},append(){},setAttribute(k,v){this[k]=v;},addEventListener(k,f){this.handlers[k]=f;},focus(){this.focused=true;}});
for(const selector of ['#map-stage','#side-content','[data-overlay="redZones"]'])nodes.set(selector,node());
globalThis.document={createElement:node,body:node(),querySelector:s=>nodes.get(s)||null,addEventListener(k,f){const a=events.get(k)||[];a.push(f);events.set(k,a);}};
const L={layerGroup(){const g={items:[],addTo(){groups.push(this);return this;},clearLayers(){this.items=[];}};return g;},divIcon:x=>x,DomEvent:{stopPropagation(e){e.stopPropagation?.();}},marker(position,options){const el=node();return {position,options,handlers:{},addTo(g){g.items.push(this);return this;},getElement:()=>el,on(k,f){this.handlers[k]=f;return this;},getLatLng(){return this.position;}};}};
const map={L,overlays:{},width:1000,height:1000,tool:'pan',config:{},map:{doubleClickZoom:{enable(){},disable(){}}},element:{querySelector(selector){const label=selector.match(/aria-label="(.+)"/)?.[1];return groups[0].items.find(m=>m.getElement()['aria-label']===label)?.getElement();}},setTool(t){this.tool=t;},_latLng:p=>p,_point:p=>p,_icon:html=>({html}),_renderRedZones(){}};
const editor=createRegionEditor({map,readStore:(k,d)=>saved.get(k)??d,store:(k,v)=>saved.set(k,structuredClone(v)),toast(){},escape:String,getTab:()=> 'regions'});
const square={id:'a',team:1,points:[{x:.1,y:.1},{x:.4,y:.1},{x:.4,y:.4},{x:.1,y:.4}]};
editor.load('layer-a',{regions:[square]});editor.enter();
editor.setVisible(false);assert.equal(map.overlays.redZones,false);
editor.undo();assert.equal(map.overlays.redZones,true,'public undo restores region visibility');
editor.redo();assert.equal(map.overlays.redZones,false);editor.undo();
const select={dataset:{regionSelect:'a'},hasAttribute:k=>k==='data-region-select'};
for(const fn of events.get('click'))fn({target:{closest:()=>select}});
assert.equal(groups[0].items.length,8,'selected polygon has four vertices and four midpoints');
let vertex=groups[0].items[0];assert.deepEqual(vertex.options.icon.iconSize,[20,20]);
vertex.getElement().handlers.keydown({key:'ArrowRight',preventDefault(){},stopPropagation(){}});
assert.equal(editor.data().regions[0].points[0].x,.101);
assert.equal(groups[0].items[0].getElement().focused,true,'keyboard focus survives rerender');
editor.load('layer-b',{regions:[]});
assert.equal(groups[0].items.length,0,'layer switch clears previous vertex handles');
assert.equal(editor.data().regions.length,0);
editor.load('layer-a',{regions:[square]});
assert.equal(editor.data().regions[0].points[0].x,.101,'edits survive switching away and back');
console.log('PASS: editor undo/redo API, vertex keyboard movement/focus, usable hitbox, stale handle cleanup and per-layer persistence.');
