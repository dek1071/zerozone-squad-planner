import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {SQUAD_SYMBOLS,VEHICLE_VISUALS} from '../outputs/zerozone-haritalar/squad-visual-data.js';
import {squadSymbol,vehicleVisual} from '../outputs/zerozone-haritalar/squad-visuals.js';
import {fobRadii} from '../outputs/zerozone-haritalar/planning-model.js';
const root='outputs/zerozone-haritalar/',manifest=JSON.parse(fs.readFileSync(root+'assets/squad/manifest.json'));
for(const f of manifest.files){const data=fs.readFileSync(root+f.file);assert.equal(crypto.createHash('sha256').update(data).digest('hex'),f.sha256,f.file);}
const units=JSON.parse(fs.readFileSync(root+'data/units.json')).units;
for(const u of Object.values(units))for(const v of u.vehicles){const visual=VEHICLE_VISUALS[v.name];assert.ok(visual,v.name);assert.ok(fs.existsSync(root+visual.icon));if(visual.image)assert.ok(fs.existsSync(root+visual.image));else assert.match(vehicleVisual(v.name),/Sınıf simgesi/);}
assert.equal(Object.keys(VEHICLE_VISUALS).length,230);assert.equal(manifest.missingPhotos.length,0);
const extra=JSON.parse(fs.readFileSync(root+'data/vehicle-photo-sources.json'));
assert.equal(extra.length,21);
for(const photo of extra){
 assert.equal(decodeURIComponent(new URL(photo.source).pathname),'/icons/Images/'+photo.rawName+'.webp');
 assert.equal(new URL(photo.sourcePage).pathname,'/vehicles/'+photo.rawName);
 assert.equal(VEHICLE_VISUALS[photo.vehicle].image,photo.file);
 assert.equal(manifest.files.find(f=>f.file===photo.file)?.sha256,photo.sha256);
 assert.match(photo.sourcePage,/^https:\/\/squadintelligence.com\/vehicles\/BP_/);
 assert.match(vehicleVisual(photo.vehicle),/vehicle-photo/);
 assert.doesNotMatch(vehicleVisual(photo.vehicle),/Sınıf simgesi/);
}
assert.match(vehicleVisual('Unknown vehicle'),/Sınıf simgesi/);
for(const symbol of ['fob','hab','rally','infantry','vehicle','support','mine','repair','mortar','hmg'])assert.ok(fs.existsSync(root+SQUAD_SYMBOLS[symbol]));
assert.equal(squadSymbol('unknown'),'');assert.doesNotMatch(vehicleVisual('<img onerror="alert(1)">'),/alt="<img/);
for(const map of ['Chora','FoolsRoad','Kokan','Logar','Sumari'])assert.deepEqual(fobRadii(map),{build:150,exclusion:300});
for(const map of ['Gorodok','Anvil','Manicouagan','Mestia','Unknown'])assert.deepEqual(fobRadii(map),{build:150,exclusion:400});
console.log(`PASS: 230 vehicle mappings, ${manifest.files.length} asset hashes, explicit missing-photo fallbacks, escaped labels and map-specific FOB radii.`);
