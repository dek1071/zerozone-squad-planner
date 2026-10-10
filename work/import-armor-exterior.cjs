const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root='outputs/zerozone-haritalar',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(){
 const vendor=root+'/assets/vendor';
 for(const [remote,local] of [['loaders/GLTFLoader.js','GLTFLoader.js'],['loaders/DRACOLoader.js','DRACOLoader.js'],['utils/BufferGeometryUtils.js','BufferGeometryUtils.js']]){
  const r=await fetch('https://raw.githubusercontent.com/mrdoob/three.js/r180/examples/jsm/'+remote);if(!r.ok)throw Error(remote);
  fs.writeFileSync(vendor+'/'+local,(await r.text()).replaceAll("from 'three'","from './three.module.js'").replaceAll("'../utils/BufferGeometryUtils.js'","'./BufferGeometryUtils.js'"));
 }
 fs.mkdirSync(vendor+'/draco',{recursive:true});
 for(const name of ['draco_wasm_wrapper.js','draco_decoder.wasm']){const r=await fetch('https://raw.githubusercontent.com/mrdoob/three.js/r180/examples/jsm/libs/draco/gltf/'+name);if(!r.ok)throw Error(name);fs.writeFileSync(vendor+'/draco/'+name,Buffer.from(await r.arrayBuffer()));}
 const catalog=JSON.parse(fs.readFileSync(root+'/data/armor/catalog.json')),textures=new Set(),models=[];
 fs.mkdirSync(root+'/data/armor/exterior',{recursive:true});fs.mkdirSync(root+'/assets/armor-textures',{recursive:true});
 for(const v of catalog.vehicles){const bytes=fs.readFileSync('work/armor-research/models/'+v.id+'.glb'),g=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));
  for(const m of g.materials||[])if(m.extras?.role==='exterior'&&m.extras.albedo)textures.add(m.extras.albedo);
  fs.writeFileSync(root+'/data/armor/exterior/'+v.id+'.glb',bytes);models.push({id:v.id,sha256:hash(bytes),bytes:bytes.length});
 }
 const list=[...textures],results=[];let cursor=0;
 await Promise.all(Array.from({length:5},async()=>{while(cursor<list.length){const name=list[cursor++],local=root+'/assets/armor-textures/'+name;let success=false;
  for(let attempt=0;attempt<3&&!success;attempt++)try{let bytes;if(fs.existsSync(local))bytes=fs.readFileSync(local);else{const r=await fetch('https://squad-armor.com/textures/'+name,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('HTTP '+r.status);bytes=Buffer.from(await r.arrayBuffer());}
   if(bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP')throw Error('Not WebP');fs.mkdirSync(path.dirname(local),{recursive:true});fs.writeFileSync(local,bytes);results.push({path:name,sha256:hash(bytes),bytes:bytes.length});success=true;
  }catch(e){if(attempt===2)results.push({path:name,error:e.message});}
  if(results.length%100===0)console.log('Textures',results.length,'/',list.length);
 }}));
 fs.writeFileSync(root+'/data/armor/exterior-manifest.json',JSON.stringify({source:'https://squad-armor.com/',models,textures:results.sort((a,b)=>a.path.localeCompare(b.path))}));console.log('Done',models.length,'models',results.length,'textures; failures',results.filter(x=>x.error));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
