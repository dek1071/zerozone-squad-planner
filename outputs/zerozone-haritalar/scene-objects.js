import * as THREE from './assets/vendor/three.module.js';
// Independent reader for public Squad SDK geometry snapshots. No remote requests at runtime.
export function floatSlice(buffer,layout,allowInvalid=false){if(!layout||layout.byteOffset<0||layout.byteLength%4||layout.byteOffset+layout.byteLength>buffer.byteLength)throw Error('3B veri aralığı geçersiz.');const view=new DataView(buffer,layout.byteOffset,layout.byteLength),a=new Float32Array(layout.byteLength/4);for(let i=0;i<a.length;i++){a[i]=view.getFloat32(i*4,true);if(!allowInvalid&&!Number.isFinite(a[i]))throw Error('3B koordinatı geçersiz.');}return a;}
const material=()=>new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide,flatShading:true});
export function createProps(manifest,buffer,meta,width,height,base){
 let parts=manifest.parts;if(!Array.isArray(parts)||parts.length>50000)throw Error('Bina verisi geçersiz.');
 let skipped=0;parts=parts.filter(part=>{const l=part.layout?.indices,bytes=l?.bytesPerIndex||4;if(!l||![2,4].includes(bytes)||l.byteOffset<0||l.byteLength!==part.indexCount*bytes||l.byteOffset+l.byteLength>buffer.byteLength)throw Error('Bina veri aralığı geçersiz.');const dv=new DataView(buffer,l.byteOffset,l.byteLength);for(let i=0;i<part.indexCount;i++)if((bytes===2?dv.getUint16(i*bytes,true):dv.getUint32(i*bytes,true))>=part.vertexCount){skipped++;return false;}return true;});
 const verts=parts.reduce((n,p)=>n+p.vertexCount,0),count=parts.reduce((n,p)=>n+p.indexCount,0);if(verts>8000000||count>24000000)throw Error('Bina verisi çok büyük.');
 const pos=new Float32Array(verts*3),colors=new Uint8Array(verts*3),indices=new Uint32Array(count),span=Math.max(width,height);let v=0,k=0;
 for(const part of parts){const p=floatSlice(buffer,part.layout.positions);if(p.length!==part.vertexCount*3)throw Error('Bina köşe sayısı geçersiz.');const c=new THREE.Color(part.color),layout=part.layout.indices,bytes=layout.bytesPerIndex||4;if(![2,4].includes(bytes)||layout.byteLength!==part.indexCount*bytes||layout.byteOffset+layout.byteLength>buffer.byteLength)throw Error('Bina indeksleri geçersiz.');const dv=new DataView(buffer,layout.byteOffset,layout.byteLength);
  for(let i=0;i<p.length;i+=3){pos[v*3+i]=(p[i]-meta.corner[0]-width/2)/span;pos[v*3+i+1]=(p[i+1]-meta.zOffset-base)/span;pos[v*3+i+2]=(p[i+2]-meta.corner[1]-height/2)/span;colors.set([Math.round(c.r*255),Math.round(c.g*255),Math.round(c.b*255)],v*3+i);}
  for(let i=0;i<part.indexCount;i++){const index=bytes===2?dv.getUint16(i*bytes,true):dv.getUint32(i*bytes,true);if(index>=part.vertexCount)throw Error('Bina üçgeni geçersiz.');indices[k++]=index+v;}v+=part.vertexCount;
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(colors,3,true));g.setIndex(new THREE.BufferAttribute(indices,1));g.computeVertexNormals();const mesh=new THREE.Mesh(g,material());mesh.userData.skipped=skipped;return mesh;
}
function template(kind,label){
 if(kind==='tree'){const pine=/pine|spruce|fir|conifer/i.test(label),g=pine?new THREE.ConeGeometry(.24,.85,7,1):new THREE.IcosahedronGeometry(.36,0);if(!pine)g.scale(1,1.15,1);g.translate(0,pine?.58:.66,0);return g;}
 if(kind==='bush'){const g=new THREE.IcosahedronGeometry(.5,0);g.scale(1,.7,1);g.translate(0,.35,0);return g;}
 if(/house|gable|apartment/i.test(kind)){const shape=new THREE.Shape();shape.moveTo(0,0);shape.lineTo(1,0);shape.lineTo(1,.75);shape.lineTo(.5,1);shape.lineTo(0,.75);shape.closePath();return new THREE.ExtrudeGeometry(shape,{depth:1,bevelEnabled:false,steps:1,curveSegments:1});}
 if(/cylinder|chimney|log/.test(kind)){const g=new THREE.CylinderGeometry(.5,.5,1,8);g.translate(.5,.5,.5);return g;}
 const g=new THREE.BoxGeometry(1,1,1);g.translate(.5,.5,.5);return g;
}
export function createInstances(manifest,buffer,meta,width,height,base){
 const vegetation=new THREE.Group(),buildings=new THREE.Group(),span=Math.max(width,height),m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),scale=new THREE.Vector3(),local=new THREE.Matrix4(),normalizer=new THREE.Matrix4().makeScale(1/span,1/span,1/span),stats={trees:0,structures:0,skipped:0};
 normalizer.setPosition((-meta.corner[0]-width/2)/span,(-meta.zOffset-base)/span,(-meta.corner[1]-height/2)/span);
 for(const s of manifest.species||[]){const veg=['tree','bush'].includes(s.kind);if(veg&&!s.label.endsWith('_0'))continue;if(!veg&&(!s.bboxMin||!s.bboxMax))continue;const a=floatSlice(buffer,s.layout.matrices,true);if(a.length!==s.instanceCount*10||s.instanceCount>500000)throw Error('Nesne yerleşim sayısı geçersiz.');
  let natural=s.heightOverride;if(veg&&!natural){const positions=floatSlice(buffer,s.layout.positions);let lo=Infinity,hi=-Infinity;for(let i=1;i<positions.length;i+=3){lo=Math.min(lo,positions[i]);hi=Math.max(hi,positions[i]);}natural=Math.max(.5,hi-lo);}
  const geom=template(s.kind,s.label),mat=new THREE.MeshLambertMaterial({color:veg?(s.kind==='bush'?'#647443':/fall|autumn/i.test(s.label)?'#8d7543':'#47734e'):'#acafa7',flatShading:true,side:THREE.DoubleSide}),mesh=new THREE.InstancedMesh(geom,mat,s.instanceCount);
  let trunk=null;if(s.kind==='tree'){const g=new THREE.CylinderGeometry(.022,.034,.55,5);g.translate(0,.275,0);trunk=new THREE.InstancedMesh(g,new THREE.MeshLambertMaterial({color:'#675141'}),s.instanceCount);}
  if(veg)local.makeScale(natural,natural,natural);else{if(!s.bboxMin||!s.bboxMax)continue;const [x,y,z]=s.bboxMin,[a,b,c]=s.bboxMax;local.makeScale(Math.max(.01,a-x),Math.max(.01,b-y),Math.max(.01,c-z));local.setPosition(x,y,z);}
  let n=0;for(let i=0;i<s.instanceCount;i++){const off=i*10;if(!a.subarray(off,off+10).every(Number.isFinite)){stats.skipped++;continue;}const x=a[off],z=a[off+2];if(x<meta.corner[0]||z<meta.corner[1]||x>meta.corner[0]+width||z>meta.corner[1]+height)continue;p.set(x,a[off+1],z);q.set(...a.slice(off+3,off+7)).normalize();scale.set(...a.slice(off+7,off+10));m.compose(p,q,scale).multiply(local).premultiply(normalizer);mesh.setMatrixAt(n,m);trunk?.setMatrixAt(n,m);n++;}
  mesh.count=n;mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();if(trunk){trunk.count=n;trunk.instanceMatrix.needsUpdate=true;trunk.computeBoundingSphere();vegetation.add(trunk);} (veg?vegetation:buildings).add(mesh);stats[veg?'trees':'structures']+=n;
 }
 return {vegetation,buildings,stats};
}
export async function loadScene(id,{width,height,base,signal}){
 if(!/^[A-Za-z0-9_]+$/.test(id||''))throw Error('Bu haritada 3B nesne verisi yok.');
 const get=async path=>{const r=await fetch('data/scene/'+path,{signal});if(!r.ok)throw Error('Bu haritada 3B nesne verisi yok.');return r;};
 const manifest=await(await get('manifest.json')).json(),meta=manifest[id];if(!meta)throw Error('Bu haritada 3B nesne verisi yok.');
 const buildings=new THREE.Group(),trees=new THREE.Group();let stats={trees:0,structures:0};
 try{if(meta.props){const [m,b]=await Promise.all([get(id+'/props.json').then(r=>r.json()),get(id+'/props.bin').then(r=>r.arrayBuffer())]);const mesh=createProps(m,b,meta,width,height,base);buildings.add(mesh);stats.skippedProps=mesh.userData.skipped;stats.parts=m.parts.length-stats.skippedProps;}
 if(meta.trees){const [m,b]=await Promise.all([get(id+'/trees.json').then(r=>r.json()),get(id+'/trees.bin').then(r=>r.arrayBuffer())]);const objects=createInstances(m,b,meta,width,height,base);trees.add(objects.vegetation);buildings.add(objects.buildings);stats={...stats,...objects.stats};}
 return {buildings,trees,stats};}catch(error){for(const g of [buildings,trees])g.traverse(o=>{o.geometry?.dispose();if(o.isInstancedMesh)o.dispose();o.material?.dispose();});throw error;}
}
