import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import * as Three from '../outputs/zerozone-haritalar/assets/vendor/three.module.js';
import * as model from '../outputs/zerozone-haritalar/terrain-model.js';
import * as accessibility from '../outputs/zerozone-haritalar/accessibility.js';
const requests=[],frames=new Map();let id=0,material;
class Loader{load(url,ok,_progress,fail){const texture=new Three.Texture();texture.disposed=false;texture.addEventListener('dispose',()=>texture.disposed=true);requests.push({url,ok,fail,texture});return texture;}}
class Renderer{constructor(){this.capabilities={getMaxAnisotropy:()=>1};}setPixelRatio(){}setClearColor(){}setSize(){}render(s){material=s.children[0].children[0].material;}dispose(){}forceContextLoss(){}}
globalThis.requestAnimationFrame=fn=>{frames.set(++id,fn);return id;};globalThis.cancelAnimationFrame=i=>frames.delete(i);globalThis.ResizeObserver=class{observe(){}disconnect(){}};
const flush=()=>{const f=[...frames.values()];frames.clear();f.forEach(fn=>fn());};
const synthetic=o=>new vm.SyntheticModule(Object.keys(o),function(){for(const [k,v]of Object.entries(o))this.setExport(k,v);});
const module=new vm.SourceTextModule(fs.readFileSync('outputs/zerozone-haritalar/terrain-view.js','utf8'));
await module.link(n=>synthetic(n.includes('three.module')?{...Three,TextureLoader:Loader,WebGLRenderer:Renderer}:n.includes('accessibility')?accessibility:model));await module.evaluate();
const canvas={clientWidth:600,clientHeight:400,addEventListener(){},removeEventListener(){}};
const view=module.namespace.createTerrainView(canvas,{cols:2,rows:2,widthMeters:1000,heightMeters:1000,values:[0,0,0,0]},{width:1000,height:1000,image:'base'});
requests[0].ok(requests[0].texture);flush();assert.equal(material.map,requests[0].texture);
const first=view.setTexture('topo'),second=view.setTexture('terrain');requests[2].ok(requests[2].texture);requests[1].ok(requests[1].texture);
assert.equal(await second,true);assert.equal(await first,null);assert.equal(material.map,requests[2].texture);assert.ok(requests[0].texture.disposed);assert.ok(requests[1].texture.disposed);
const failure=view.setTexture('missing');requests[3].fail();assert.equal(await failure,false);assert.equal(material.map,requests[2].texture,'failed texture preserves previous image');
const staleFail=view.setTexture('stale-fail'),winner=view.setTexture('winner');requests[5].ok(requests[5].texture);requests[4].fail();assert.equal(await staleFail,null);assert.equal(await winner,true);
const late=view.setTexture('late');view.destroy();requests[6].ok(requests[6].texture);assert.equal(await late,null);assert.ok(requests[5].texture.disposed);assert.ok(requests[6].texture.disposed);assert.equal(frames.size,0);
console.log('3D textures: latest request wins, failure preserves map, close disposes pending texture PASS');
