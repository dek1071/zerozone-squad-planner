// Read-only cross-check against the game's own shipped asset manifest.
// Usage: node work/audit-installed-armor.cjs "path/to/Squad"
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const game=process.argv[2];if(!game)throw Error('Supply the installed Squad directory.');
const bytes=fs.readFileSync(path.join(game,'Manifest_UFSFiles_Win64.txt'));
const assets=bytes.toString('utf8').split(/\r?\n/).map(l=>l.split('\t')[0]).filter(p=>p.endsWith('.uasset'));
const names=new Set(assets.map(p=>path.posix.basename(p,'.uasset')));
const catalog=JSON.parse(fs.readFileSync('outputs/zerozone-haritalar/data/armor/catalog.json'));
const vehicles=[...catalog.vehicles,...catalog.unavailable].map(v=>({id:v.id,present:names.has(v.id)}));
const curves=Object.keys(catalog.curves).map(id=>({id,present:names.has(id)}));
const report={checkedAt:new Date().toISOString(),scope:'Asset identity only; numeric values and geometry are not decoded from installed game containers.',manifestSha256:crypto.createHash('sha256').update(bytes).digest('hex'),vehicles,curves};
fs.writeFileSync('outputs/zerozone-haritalar/data/armor/installed-game-audit.json',JSON.stringify(report,null,2));
console.log({vehicles:vehicles.filter(v=>v.present).length,totalVehicles:vehicles.length,curves:curves.filter(v=>v.present).length,totalCurves:curves.length,missingVehicles:vehicles.filter(v=>!v.present),missingCurves:curves.filter(v=>!v.present)});
