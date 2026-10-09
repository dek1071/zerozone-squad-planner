// Palette choices plus redundant symbols/line styles; color is never the sole signal.
export const PALETTES={
 none:{name:'Standart',team1:'#8fcafb',team2:'#f19aa4',selected:'#addeb2',next:'#b5e8fa',danger:'#f42538',flight:'#f4c27b',ground:'#b5e8fa'},
 deutan:{name:'Deuteranopi · mavi / sarı',team1:'#56b4e9',team2:'#ffcf40',selected:'#56b4e9',next:'#ffcf40',danger:'#ffffff',flight:'#ffcf40',ground:'#56b4e9'},
 protan:{name:'Protanopi · açık mavi / sarı',team1:'#8bd5ff',team2:'#ffe17a',selected:'#8bd5ff',next:'#ffe17a',danger:'#ffffff',flight:'#ffe17a',ground:'#8bd5ff'},
 tritan:{name:'Tritanopi · turkuaz / pembe',team1:'#54e1cf',team2:'#ff9ab4',selected:'#54e1cf',next:'#ff9ab4',danger:'#ffffff',flight:'#ff9ab4',ground:'#54e1cf'},
 mono:{name:'Renksiz · yüksek kontrast',team1:'#ffffff',team2:'#c7c7c7',selected:'#ffffff',next:'#c7c7c7',danger:'#ffffff',flight:'#ffffff',ground:'#969696'}
};
export const paletteFor=id=>PALETTES[id]||PALETTES.none;
export function displayMode(value={}){return Object.hasOwn(PALETTES,value.colorMode)?value.colorMode:value.colorBlind===true?'deutan':'none';}
export function polarTarget(origin,bearing,distance,width,height){if(!origin||![bearing,distance,width,height].every(Number.isFinite)||distance<=0||width<=0||height<=0)throw Error('Geçerli yön ve mesafe gir.');const r=bearing*Math.PI/180,p={x:origin.x+Math.sin(r)*distance/width,y:origin.y-Math.cos(r)*distance/height};if(p.x<0||p.y<0||p.x>1||p.y>1)throw Error('Hedef harita sınırının dışında.');return p;}
export function headingCorrection(current,target){if(![current,target].every(Number.isFinite))return null;return ((target-current+540)%360+360)%360-180;}
export function mapImageFilter(mode='none',intensity=70){
 const amount=Math.max(0,Math.min(100,Number.isFinite(Number(intensity))?Number(intensity):70))/100;
 if(mode==='none'||!Object.hasOwn(PALETTES,mode))return 'none';
 return `grayscale(${mode==='mono'?1:amount*.8}) contrast(${1+amount*.18})`;
}
export function annotationAppearance(mode,color){
 const index=Math.max(0,['#b5e8fa','#f19aa4','#f4c27b','#addeb2','#f4f3ef'].indexOf(color));
 const p=paletteFor(mode),active=mode!=='none'&&Object.hasOwn(PALETTES,mode);
 return {color:active?(mode==='mono'?['#ffffff','#dddddd','#bbbbbb','#999999','#eeeeee']:[p.team1,p.team2,'#ffffff','#bdbdbd','#e1c8ff'])[index]:color,code:active?'ABCDE'[index]:'',dash:active?[null,'10 5','2 5','10 4 2 4','3 3 9 3'][index]:null};
}
