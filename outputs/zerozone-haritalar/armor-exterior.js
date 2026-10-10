import * as THREE from './assets/vendor/three.module.js';
import {GLTFLoader} from './assets/vendor/GLTFLoader.js';
import {DRACOLoader} from './assets/vendor/DRACOLoader.js';

const draco=new DRACOLoader().setDecoderPath('assets/vendor/draco/').setDecoderConfig({type:'wasm'}).setWorkerLimit(2);
const loader=new GLTFLoader().setDRACOLoader(draco);
let knownMissing;
async function missingTextures(){
 if(!knownMissing)knownMissing=fetch('data/armor/exterior-manifest.json').then(r=>{if(!r.ok)throw Error('Manifest');return r.json();}).then(m=>new Set(m.textures.filter(t=>t.error).map(t=>t.path))).catch(()=>{knownMissing=null;return new Set();});
 return knownMissing;
}
export function disposeExterior(group){if(!group)return;const textures=new Set(),materials=new Set();group.traverse(o=>{o.geometry?.dispose();o.skeleton?.dispose();for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(m)materials.add(m);});for(const m of materials){for(const value of Object.values(m))if(value?.isTexture)textures.add(value);m.dispose();}for(const t of textures)t.dispose();group.removeFromParent();}
export async function loadExterior(id,signal){
 const response=await fetch(`data/armor/exterior/${encodeURIComponent(id)}.glb`,{signal});if(!response.ok)throw Error('Dış model yüklenemedi.');
 const bytes=await response.arrayBuffer();signal.throwIfAborted();const gltf=await loader.parseAsync(bytes,'');const root=gltf.scene;
 try{
  signal.throwIfAborted();const armor=root.getObjectByName('Armor');disposeExterior(armor);root.rotation.x=-Math.PI/2;
  const missing=await missingTextures();signal.throwIfAborted();
  const textureLoader=new THREE.TextureLoader(),materials=new Map(),pending=[];
  root.traverse(mesh=>{if(!mesh.isMesh)return;const original=mesh.material;const converted=(Array.isArray(original)?original:[original]).map(old=>{
   if(materials.has(old))return materials.get(old);
   const extra=old.userData||{},material=new THREE.MeshStandardMaterial({color:extra.baseColor?new THREE.Color().fromArray(extra.baseColor):0xffffff,roughness:.82,metalness:.08,side:THREE.DoubleSide,transparent:(extra.opacity??1)<1,opacity:extra.opacity??1});
   materials.set(old,material);
   const fallback=()=>{material.color.set(0x77786d);root.userData.missingTextures=(root.userData.missingTextures||0)+1;};
   if(missing.has(extra.albedo))fallback();
   else if(extra.albedo&& !extra.albedo.includes('..')&&!extra.albedo.startsWith('/'))pending.push(textureLoader.loadAsync('assets/armor-textures/'+extra.albedo).then(texture=>{texture.colorSpace=THREE.SRGBColorSpace;texture.flipY=false;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=4;material.map=texture;material.needsUpdate=true;}).catch(fallback));
   else if(!extra.baseColor)material.color.copy(old.color);
   old.dispose();return material;
  });mesh.material=Array.isArray(original)?converted:converted[0];mesh.castShadow=false;mesh.receiveShadow=false;});
  await Promise.all(pending);signal.throwIfAborted();root.updateMatrixWorld(true);return root;
 }catch(e){disposeExterior(root);throw e;}
}
export function disposeExteriorDecoder(){draco.dispose();}
