import {SQUAD_SYMBOLS,VEHICLE_VISUALS} from './squad-visual-data.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function squadSymbol(symbol,color='#b5e8fa'){
 const src=SQUAD_SYMBOLS[symbol];if(!src)return '';
 return `<span class="zz-squad-symbol" style="--symbol-color:${esc(color)}"><img src="${src}" alt="" draggable="false"></span>`;
}
export function vehicleVisual(name){
 const v=VEHICLE_VISUALS[name],src=v?.image||v?.icon||SQUAD_SYMBOLS.vehicle,photo=!!v?.image;
 return `<div class="vehicle-visual ${photo?'vehicle-photo':'vehicle-class-icon'}"><img src="${esc(src)}" alt="${esc(name)}${photo?'':' — araç sınıfı simgesi'}" loading="lazy" decoding="async" width="240" height="110">${photo?'':'<small>Sınıf simgesi</small>'}</div>`;
}
