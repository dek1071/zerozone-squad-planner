import {SYMBOLS,COLOURS,buildBudget,availableVehicles} from './planning-model.js';
import {createTerrainTools} from './terrain-tools.js';

export function createPlanningTools({map,getState,escape:esc,icon,setTool,saveDraft,info,toast,readStore,store}) {
  let mode='strategy',buildFilter='',selected=null;
  const terrain=createTerrainTools({map,getState,setTool,escape:esc,toast,readStore,store});
  const timers=new Map((readStore('timers',[])||[]).filter(p=>Array.isArray(p)&&typeof p[0]==='string'&&Number.isFinite(p[1])&&p[1]>Date.now()));
  const saveTimers=()=>store('timers',[...timers].filter(([,end])=>end>Date.now()));
  const tools={pin:['pin','İşaret'],arrow:['arrow','Ok'],line:['line','Çizgi'],circle:['circle','Daire'],rectangle:['rectangle','Alan'],brush:['brush','Serbest çiz'],measure:['ruler','Mesafe'],hab:['home','HAB']};
  const el=()=>document.querySelector('#side-content');
  const toolGrid=()=>`<div class="drawing-grid">${Object.entries(tools).map(([id,[symbol,label]])=>`<button class="drawing-button ${map.tool===id?'active':''}" data-tool="${id}" aria-pressed="${map.tool===id}">${icon(symbol)}${label}</button>`).join('')}</div>`;
  function render(){
    if(getState().tab!=='tools')return;
    if(mode!=='terrain')map.setFirePreview?.(null);
    el().innerHTML=`<div class="mode-pills tools-modes">${[['strategy','Strateji'],['terrain','Havan / 3B'],['build','İnşa'],['timers','Sayaçlar']].map(([id,name])=>`<button class="mode-pill ${mode===id?'active':''}" data-tools-mode="${id}">${name}</button>`).join('')}</div><div id="tools-content"></div>`;
    const panel=document.querySelector('#tools-content');
    if(mode==='strategy')panel.innerHTML=`<div class="section-caption">ÇİZİM ARAÇLARI</div>${toolGrid()}<label class="form-label" for="marker-symbol">TAKTİK SEMBOL</label><select id="marker-symbol" class="side-select">${Object.entries(SYMBOLS).map(([id,name])=>`<option value="${id}" ${map.style.symbol===id?'selected':''}>${name}</option>`).join('')}</select><div class="form-label">RENK</div><div class="colour-swatches">${COLOURS.map((c,i)=>`<button style="--swatch:${c}" aria-label="${['Buz mavisi','Kırmızı','Sarı','Yeşil','Beyaz'][i]}" aria-pressed="${map.style.color===c}" data-draw-colour="${c}"></button>`).join('')}</div><label class="range-label" for="line-weight">Çizgi kalınlığı <output id="weight-value">${map.style.weight} px</output></label><input id="line-weight" type="range" min="1" max="8" step="1" value="${map.style.weight}"><label class="check-label"><input id="draw-dashed" type="checkbox" ${map.style.dashed?'checked':''}> Kesikli çizgi</label><div class="plan-tools"><button class="button secondary" data-action="undo">${icon('undo')} Geri al</button><button class="button secondary" data-action="redo">${icon('redo')} Yinele</button></div><p class="side-note">Çizgi ve alan için iki nokta seç. Serbest çizimde basılı tutarak çiz. Taşı aracındayken bir çizime tıklayıp uç noktalarını sürükleyebilirsin.</p><div id="annotation-editor"></div>`;
    else if(mode==='terrain')terrain.render(panel);
    else if(mode==='build')renderBuild(panel);
    else renderTimers(panel);
    if(mode==='strategy')renderEditor();
  }
  function renderEditor(){
    const panel=document.querySelector('#annotation-editor');if(!panel)return;
    const a=map.exportPlan().find(a=>a.id===selected);
    panel.innerHTML=a?`<div class="section-caption">SEÇİLİ İŞARET</div><label class="form-label" for="selected-label">İSİM</label><input class="form-input" id="selected-label" value="${esc(a.label)}" maxlength="80"><div class="plan-tools"><button class="button secondary" data-edit-style>Rengi uygula</button><button class="button secondary" data-edit-delete>Sil</button></div><p class="side-note">Beyaz tutamaçları sürükleyerek konumu değiştir. Silme ve düzenleme işlemleri geri alınabilir.</p>`:'';
  }
  function selectAnnotation(item){selected=item.id;mode=item.tool==='mortar'?'terrain':'strategy';if(item.tool==='mortar')terrain.select(item.id);render();}
  function buildPlan(){const s=getState(),k=`${s.teamIndex}:${s.chosenUnits[s.teamIndex-1]}`;return s.logistics[k]||(s.logistics[k]={vehicles:{},items:{}});}
  function renderBuild(panel){
    const s=getState(),unit=s.activeUnit(s.teamIndex-1),plan=buildPlan(),budget=buildBudget(unit,s.layer,s.unitData.construction,plan);
    panel.innerHTML=`<div class="team-tabs"><button class="button ${s.teamIndex===1?'primary':'secondary'} compact" data-tools-team="1">Takım 1</button><button class="button ${s.teamIndex===2?'primary':'secondary'} compact" data-tools-team="2">Takım 2</button></div><p class="side-note">${esc(unit.name)} · Tek FOB için yük planı</p><div class="budget-grid"><div><small>Kapasite</small><b>${budget.capacity}</b></div><div><small>İnşa</small><b>${budget.cost}</b></div><div class="${budget.remaining<0?'over-budget':''}"><small>${budget.remaining<0?'Eksik ikmal':'Mühimmat'}</small><b>${Math.abs(budget.remaining)}</b></div></div><p class="side-note ${budget.remaining<0?'over-budget':''}">${budget.remaining<0?'Yük kapasitesi aşıldı. Araç ekle veya yapı sayısını azalt.':'İnşa için ayrılan puanlardan kalan kapasite mühimmat olarak gösterilir.'}</p><div class="section-caption">LOJİSTİK ARAÇLARI</div>${budget.vehicles.map(v=>counter(v.name,plan.vehicles[v.name]||0,v.count,'vehicle',v.name,`${v.resources} kapasite · en fazla ${v.count}`)).join('')||'<p class="side-note">Bu katmanda kullanılabilir lojistik aracı bulunamadı.</p>'}<label class="form-label" for="build-search">YAPI ARA</label><input id="build-search" class="form-input" type="search" placeholder="HAB, mortar, sandbag…" value="${esc(buildFilter)}"><div id="build-results">${buildRows(budget)}</div><p class="side-note">Adet sınırları tek FOB içindir. İnşa listesi plan dosyana dahil edilir; haritaya otomatik yapı yerleştirmez.</p>`;
  }
  function counter(name,value,max,kind,id,detail){return `<div class="build-row"><div><strong>${esc(name)}</strong><small>${esc(detail)}</small></div><div class="stepper"><button data-build-kind="${kind}" data-build-id="${esc(id)}" data-build-delta="-1" aria-label="${esc(name)} azalt" ${value<=0?'disabled':''}>−</button><output>${value}</output><button data-build-kind="${kind}" data-build-id="${esc(id)}" data-build-delta="1" aria-label="${esc(name)} ekle" ${value>=max?'disabled':''}>+</button></div></div>`;}
  function buildRows(budget){const q=buildFilter.toLocaleLowerCase('tr');return budget.builds.filter(b=>b.name.toLocaleLowerCase('tr').includes(q)).map(b=>counter(b.name,b.count,b.availability<0?999:b.availability,'item',b.id,`${b.cost} inşa · ${b.availability<0?'sınırsız':b.availability+' / FOB'}`)).join('')||'<p class="side-note">Yapı bulunamadı.</p>';}
  function timerAssets(){const s=getState(),u=s.activeUnit(s.teamIndex-1);return [...availableVehicles(u,s.layer).flatMap(v=>Array.from({length:v.count},(_,i)=>({id:`${s.layer.id}:${s.teamIndex}:${u.id}:${v.name}:${i}`,name:`${v.name}${v.count>1?' #'+(i+1):''}`,seconds:(v.respawn||0)*60,delay:(v.delay||0)*60}))),...(s.layer.commander?u.commander.map((c,i)=>({id:`${s.layer.id}:${s.teamIndex}:${u.id}:cmd:${i}`,name:c.name,seconds:c.cooldown,delay:0})):[])];}
  function renderTimers(panel){const s=getState();panel.innerHTML=`<div class="team-tabs"><button class="button ${s.teamIndex===1?'primary':'secondary'} compact" data-tools-team="1">Takım 1</button><button class="button ${s.teamIndex===2?'primary':'secondary'} compact" data-tools-team="2">Takım 2</button></div><p class="side-note">Araç kaybında “Yenilenme”ye bas. Sayaçlar elle başlatılır; canlı sunucuya bağlı değildir.</p>${timerAssets().map(a=>`<div class="timer-row"><strong>${esc(a.name)}</strong><div><output data-timer-output="${esc(a.id)}">Hazır</output><button class="text-button" data-timer-stop="${esc(a.id)}">Sıfırla</button></div><div class="plan-tools"><button class="button secondary compact" data-timer="${esc(a.id)}" data-seconds="${a.seconds}" ${a.seconds?'':'disabled'}>Yenilenme · ${Math.round(a.seconds/60)} dk</button>${a.delay?`<button class="button secondary compact" data-timer="${esc(a.id)}" data-seconds="${a.delay}">İlk çıkış · ${Math.round(a.delay/60)} dk</button>`:''}</div></div>`).join('')}`;tick();}
  function tick(){document.querySelectorAll('[data-timer-output]').forEach(el=>{const end=timers.get(el.dataset.timerOutput);const left=end?Math.max(0,Math.ceil((end-Date.now())/1000)):0;el.textContent=left?`${Math.floor(left/60).toString().padStart(2,'0')}:${(left%60).toString().padStart(2,'0')}`:end?'Hazır · süre doldu':'Hazır';el.classList.toggle('counting',left>0);});}
  setInterval(tick,1000);
  function compare(){const s=getState();info('TAKIM KARŞILAŞTIRMASI',`<div class="compare-teams">${[0,1].map(i=>{const u=s.activeUnit(i);return `<section><span class="eyebrow">TAKIM ${i+1}</span><h3>${esc(u.faction)}</h3><p>${esc(u.name)}<br>${s.layer.teams[i].tickets??'—'} başlangıç bileti</p>${availableVehicles(u,s.layer).map(v=>`<div class="vehicle"><div class="vehicle-line"><strong>${esc(v.name)}</strong><b>×${v.count}</b></div><small>Yenilenme ${v.respawn??'—'} dk · İlk çıkış ${v.delay||0} dk</small></div>`).join('')}</section>`;}).join('')}</div>`);}
  document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.toolsMode){mode=b.dataset.toolsMode;render();}
    if(b.dataset.drawColour){map.setStyle({color:b.dataset.drawColour});render();}
    if(b.dataset.toolsTeam){getState().setTeam(+b.dataset.toolsTeam);render();}
    if(b.dataset.buildKind){const s=getState(),plan=buildPlan(),budget=buildBudget(s.activeUnit(s.teamIndex-1),s.layer,s.unitData.construction,plan),id=b.dataset.buildId,type=b.dataset.buildKind;
      const found=type==='vehicle'?budget.vehicles.find(v=>v.name===id):budget.builds.find(v=>v.id===id);if(!found)return;
      const target=type==='vehicle'?plan.vehicles:plan.items,max=type==='vehicle'?found.count:found.availability<0?999:found.availability;
      target[id]=Math.max(0,Math.min(max,(target[id]||0)+Number(b.dataset.buildDelta)));saveDraft();render();
    }
    if(b.hasAttribute('data-edit-delete')){map.importPlan(map.exportPlan().filter(a=>a.id!==selected));selected=null;renderEditor();}
    if(b.hasAttribute('data-edit-style')){const items=map.exportPlan(),a=items.find(a=>a.id===selected);if(a){a.style={...map.style};map.importPlan(items);toast('Seçili işaretin görünümü güncellendi.');}}
    if(b.dataset.timer){timers.set(b.dataset.timer,Date.now()+Number(b.dataset.seconds)*1000);saveTimers();tick();}
    if(b.dataset.timerStop){timers.delete(b.dataset.timerStop);saveTimers();tick();}
  });
  document.addEventListener('focusout',e=>{if(e.target.id==='selected-label')delete e.target.dataset.editStarted;});
  document.addEventListener('input',e=>{if(e.target.id==='selected-label'){map.updateLabel(selected,e.target.value,!e.target.dataset.editStarted);e.target.dataset.editStarted='1';}if(e.target.id==='line-weight'){map.setStyle({weight:Number(e.target.value)});document.querySelector('#weight-value').textContent=e.target.value+' px';}if(e.target.id==='build-search'){buildFilter=e.target.value;const s=getState();document.querySelector('#build-results').innerHTML=buildRows(buildBudget(s.activeUnit(s.teamIndex-1),s.layer,s.unitData.construction,buildPlan()));}});
  document.addEventListener('change',e=>{if(e.target.id==='marker-symbol'){map.setStyle({symbol:e.target.value});setTool('pin');}if(e.target.id==='draw-dashed')map.setStyle({dashed:e.target.checked});});
  return {render,selectAnnotation,compare,refreshTerrain:terrain.refresh,showTerrain(){mode='terrain';render();}};
}
