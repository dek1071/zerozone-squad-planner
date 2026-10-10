// Visual grouping only. These categories do not add collision or damage data.
export function componentKind(part){
 // Armor material names may mention an ammo compartment without being an ammo component.
 const s=[part.name,part.componentClass].join(' ').toLowerCase();
 if(/ammo/.test(s))return'ammo';if(/engine/.test(s))return'engine';if(/track/.test(s))return'track';if(/wheel/.test(s))return'wheel';if(/rotor/.test(s))return'rotor';
 if(/gun|barrel|weapon/.test(s))return'gun';if(/turret|crows/.test(s))return'turret';return'hull';
}
export const COMPONENTS={ammo:{label:'Mühimmat deposu',color:'#ff303b'},engine:{label:'Motor',color:'#e8bb63'},turret:{label:'Kule / silah istasyonu',color:'#a891ed'},gun:{label:'Top / silah',color:'#7be3c5'},track:{label:'Palet',color:'#81aefb'},wheel:{label:'Tekerlek',color:'#81aefb'},rotor:{label:'Rotor',color:'#e8bfeb'}};
