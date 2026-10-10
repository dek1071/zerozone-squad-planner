import assert from 'node:assert/strict';import {spawn}from'node:child_process';import net from'node:net';import http from'node:http';
const probe=net.createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r));
const child=spawn(process.execPath,['outputs/zerozone-haritalar/server.cjs'],{env:{...process.env,ZEROZONE_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']});let errors='';child.stderr.on('data',d=>errors+=d);
const request=(path,method='GET')=>new Promise((resolve,reject)=>{const req=http.request({hostname:'127.0.0.1',port,path,method},res=>{let bytes=0;res.on('data',b=>bytes+=b.length);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,bytes}));});req.on('error',reject);req.setTimeout(5000,()=>req.destroy(Error('timeout')));req.end();});
try{await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(Error('server start timeout')),5000);child.stdout.once('data',()=>{clearTimeout(t);resolve();});child.once('exit',()=>reject(Error('server exited '+errors)));});
for(const path of ['/','/haritalar','/zirh','/zirh/','/armor-app.js','/armor-exterior.js','/data/catalog.json','/data/armor/catalog.json','/assets/vendor/draco/draco_decoder.wasm','/data/armor/exterior/BP_M1A2.glb']){const r=await request(path,'HEAD');assert.equal(r.status,200,path);assert.equal(r.bytes,0);assert.equal(r.headers['x-content-type-options'],'nosniff');assert.match(r.headers['content-security-policy'],/worker-src 'self' blob:/);}
assert.equal((await request('/haritalar/?map=Harju')).headers.location,'/haritalar?map=Harju');
for(const path of ['/missing.js','/../package.json','/%2e%2e%5cpackage.json','/data/','/server.cjs'])assert.equal((await request(path)).status,404,path);
assert.equal((await request('/armor.html','POST')).status,405);assert.equal((await request('/%ZZ')).status,400);
assert.equal((await request('/%00.json')).status,400);assert.equal((await request('/armor.html','HEAD')).status,200,'server remains alive after malformed URL');
assert.equal((await request('/assets/vendor/draco/draco_decoder.wasm','HEAD')).headers['content-type'],'application/wasm');
console.log('PASS: isolated HTTP server routes, HEAD, MIME, security headers, redirect query, method rejection, traversal, malformed/NUL URL and continued availability.');
}finally{child.kill();}
