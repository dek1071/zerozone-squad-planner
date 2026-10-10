import * as THREE from './assets/vendor/three.module.js';
export function createArmorGroup(metadata,buffer){
 const group=new THREE.Group();group.name=metadata.id;
 try{for(const [index,part] of metadata.meshes.entries()){
  const {vertexOffset,vertexCount,indexOffset,indexCount}=part;
  if(![vertexOffset,vertexCount,indexOffset,indexCount].every(Number.isSafeInteger)||vertexOffset<0||indexOffset<0||vertexOffset%4||indexOffset%4||vertexCount<3||indexCount<3||indexCount%3||vertexOffset+vertexCount*12>buffer.byteLength||indexOffset+indexCount*4>buffer.byteLength)throw Error('Zırh geometrisi geçersiz.');
  const positions=new Float32Array(buffer,vertexOffset,vertexCount*3),indices=new Uint32Array(buffer,indexOffset,indexCount);
  if(positions.some(v=>!Number.isFinite(v))||indices.some(i=>i>=vertexCount))throw Error('Zırh geometrisinde geçersiz koordinat.');
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setIndex(new THREE.BufferAttribute(indices,1));geometry.computeVertexNormals();geometry.computeBoundingSphere();
  const material=new THREE.MeshStandardMaterial({color:new THREE.Color().fromArray(part.color),metalness:.1,roughness:.75,side:THREE.DoubleSide});
  const mesh=new THREE.Mesh(geometry,material);mesh.userData={...part,key:metadata.id+':'+index};group.add(mesh);
 }group.updateMatrixWorld(true);return group;}catch(error){disposeArmorGroup(group);throw error;}
}
export function armorIntersections(group,origin,direction){
 const ray=new THREE.Raycaster(origin,direction.clone().normalize(),0,5000),normalMatrix=new THREE.Matrix3();
 group.updateMatrixWorld(true);
 return ray.intersectObjects(group.children,false).map(hit=>{
  const normal=hit.face.normal.clone().applyMatrix3(normalMatrix.getNormalMatrix(hit.object.matrixWorld)).normalize();
  return{...hit.object.userData,distance:hit.distance,point:hit.point.toArray(),cosine:-normal.dot(ray.ray.direction),object:hit.object};
 });
}
export function disposeArmorGroup(group){if(!group)return;group.traverse(mesh=>{mesh.geometry?.dispose();if(Array.isArray(mesh.material))mesh.material.forEach(m=>m.dispose());else mesh.material?.dispose();});group.removeFromParent();}
