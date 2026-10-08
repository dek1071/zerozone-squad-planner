# ZeroZone /haritalar — özel önizleme

Mevcut ZeroZone görünümüne uygun, bağımsız ek sayfa prototipi. Üretim sitesi değiştirilmedi; hiçbir dosya dışarıya yayımlanmadı.

Kullanıcı tercihi (6 Ekim 2026): Squad Servers, diğer sunucu listeleri ve başka sunucu reklamları bu sayfada yer almayacak.

## Açma

`node server.cjs` komutunu bu klasörde çalıştırın. Ardından `http://127.0.0.1:4173/haritalar` adresini açın. Sunucu yalnızca 127.0.0.1 üzerinde dinler. Haritalar, fontlar, scriptler ve veriler yereldir; harita kullanımı dış servis bağlantısı gerektirmez. Üst menüdeki diğer sayfa bağlantıları canlı ZeroZone sitesini yeni sekmede açar.

## Çalışan özellikler

- Planım → Tam yedek indir: açık layerın planı, capture seçimi, kırmızı alanları, sınır setleri ve erişilebilirlik ayarları tek JSON dosyasında. Eski planlar da içe aktarılır; son dosya aktarımı geri alınabilir.
- Bölgeler → Sınır setleri ve layerdan kopyalama: adlandırılmış sınır kopyaları, aynı haritada başka layerdan karşılaştırmalı önizlemeyle ekleme/değiştirme.
- Harita görünümü: deuteranopi, protanopi, tritanopi ve renksiz yüksek kontrast seçenekleri; renk yanında takım şekli, durum etiketi ve çizgi deseni; ayarlanabilir hedef/etiket boyutu ve cihazda kalıcı tercihler.
- Bölgeler sekmesi: kırmızı alanları tek tek/topluca gösterme, her katmanda yeni poligon çizme, köşe düzenleme, yeniden çizme, adlandırma, geri alma/yineleme ve katmana özel otomatik cihaz kaydı.
- 26 harita, 222 katman; ad/katman, oyun modu ve ordu filtreleri, cihazda favoriler.
- Gerçek hedef koordinatları, AAS bağlantıları, TC altıgenleri ve 3.617 ele geçirme bölgesinin üstten görünümü.
- 40 RAAS katmanında doğrudan bayrak/bölge seçimi, sıradaki adayların yüzdeleri, koridor olasılıkları ve seçilen hedefleri bağlayan rota.
- Seçili bayrağa tekrar tıklayarak o adım ve sonrasını geri alma; ana üs veya takım düğmesiyle ters yönden takip. Seçimler taslak ve JSON planında saklanır.
- Ordu/birlik seçimi, araç adedi, gecikme/yenilenme süreleri, komutan desteği ve inşa maliyetleri.
- Yakınlaştırma, sürükleme, koordinat ızgarası, görünüm seçenekleri ve geniş harita görünümü.
- İşaretler, hareket okları, mesafe/yön ölçümü, referans HAB halkaları ve havan hattı.
- Otomatik cihaz taslağı, adlandırılmış planlar, JSON içe/dışa aktarma; klavyeyle koordinat girişi.
- Mobil düzen, klavye kısayolları ve erişilebilir kontrol etiketleri.

`example-plan.json` bir örnek plandır; Planım → İçe aktar üzerinden açılabilir.

## Sınırlar

Havan hattı mesafe/yön gösterir; Araçlar → Havan / 3B paneli desteklenen layerlarda standart oyun havanı için yükseklik, mil ve uçuş süresi tahmini ekler. RAAS yüzdeleri eşit koridor önseli ve grup içindeki adayların eşit seçilmesi varsayımıyla, kullanıcının seçtiği sıraya göre hesaplanır. Canlı maç verisi değildir; özel sunucu kuralları farklı olabilir. Canlı sunucu verisi veya ortak düzenleme bağlı değildir. Araç listeleri birim envanteridir; katman ve sunucu kısıtları gerçek oyundaki dağılımı değiştirebilir. HAB halkaları 150/400 m planlama referansıdır; her fraksiyon/oyun sürümü için doğrulanmış inşa kuralları değildir.

RAAS'ta yalnızca sıradaki hedef seçilebilir; ilerideki bir hedefe tıklamak bilgi gösterir. AAS gibi sabit katmanlarda hedef bilgisi ve ele geçirme bölgeleri gösterilir, rastgele koridor tahmini uygulanmaz. “Harita görünümü → Ele geçirme bölgeleri” ile sınırlar açılıp kapatılır. Çok yakın bölgelerde yan paneldeki aday düğmeleri de kullanılabilir.

Veri tekrar hazırlanırken `work/prepare-data.cjs` sonrasında `work/prepare-capture-zones.cjs` çalıştırılmalıdır. `capture-model.js` site uygulamasından bağımsız yazılmış sıralı tahmin modelidir; yayınlanmış oyun verisini kullanır.

## Mevcut siteye entegrasyon

Kaynak depo sağlandığında mevcut sitenin gerçek header/footer bileşenleri kullanılmalı, `/haritalar` rotası ve tek menü bağlantısı eklenmelidir. Bu prototipte kabuk, herkese açık sitedeki görsel kurallara göre yerelde yeniden oluşturuldu.

Önizleme CSS'i bu bağımsız sayfa için yazıldı. Üretime taşımadan önce seçiciler `.zz-maps-page` altında kapsamlanmalı; ortak sitenin `button`, `input`, `dialog` ve diğer sayfalarını etkilememeli. Kaynak/veri varlıkları örneğin `/assets/maps-planner/` altına alınmalı ve URL'ler o konuma göre güncellenmeli. Önizlemenin `server.cjs` dosyası üretime taşınmaz.

Yerel planları hesaplar arası veya ekiplerle paylaşmak istenirse mevcut sitenin kimlik doğrulaması ve veri saklama düzeni ayrıca bağlanmalıdır. Kullanıcının onayı olmadan bu adımlar uygulanmadı.

## Kaynaklar

- Haritalar ve yapılandırılmış oyun verisi: https://squadmaps.com/ (5 Ekim 2026'da alınan herkese açık veri snapshot'ı). Güncel oyunda değişmiş olabilir.
- Harita görselleri ve oyun markaları ilgili hak sahiplerinindir. Canlı yayına geçmeden önce kullanılacak veri/görsel dağıtım izinleri teyit edilmelidir.
- ZeroZone logo/renk/font referansı: https://zerozonecommunity.com/
- Leaflet 1.9.4: BSD-2-Clause. `assets/vendor/Leaflet-LICENSE.txt`.
- Montserrat: SIL Open Font License. `assets/brand/Montserrat-OFL.txt`.

## Kontroller

Kullanıcının 32 referans görselindeki kırmızı sınırlar 23 haritanın 32 RAAS katmanına eklendi (64 poligon). Harita görünümü menüsünden açılıp kapatılır. Katman eşlemesi ve yeniden üretme ayrıntıları `RED-ZONES.md` dosyasındadır. Bu sınırlar görsel referanstan aktarılır; resmi oyun yasak alanı verisi değildir.

Bölgeler sekmesinden referansı olmayan katmanlara da alan çizilebilir. Kayıtlar bu tarayıcı ve cihazdadır. Yeni birleşik JSON yedeği bölge ve sınır setlerini de içerir; eski plan JSON dosyaları bunları içermeyebilir. Kullanım ayrıntıları `RED-ZONES.md`, son geliştirme ve inceleme raporu `SQUADCALC-REVIEW.md` içindedir.

222 katmanda veri bağlantıları, 26 haritanın görselleri, koordinat sınırları, 500 m ölçüm örneği ve ana yönler kontrol edildi. Tarayıcıda filtreleme, harita/katman seçimi, takım değiştirme, koordinatla işaret ekleme, geri alma ve plan kaydı kontrol edildi. Yeni capture-point testleri 40 RAAS katmanında iki yönden 80 tam zinciri, yüzde toplamlarını, ortak konumları, geri almayı ve 3.617 bölge geometrisini doğrular. Gorodok Desna → Soloninki Lower → Soloninki Upper ve ters yönde Akim Central akışları SquadMaps UI'siyle karşılaştırıldı.


## 7 Ekim: Havan / 3B
Araçlar → Havan / 3B: standart oyun havanı için arazi yüksekliğiyle mil/yön/uçuş hesabı, arazi kesiti, döndürülebilen dokulu arazi. 25 harita / 203 uyumlu layer. Önceki yalnızca yatay mesafe notları bu panel için geçersizdir. Kapsam, kaynak ve test sınırları: [TERRAIN-QA.md](TERRAIN-QA.md). Gerçek tarayıcı ve dar ekran görsel kontrolü yapıldı; fiziksel dokunmatik testi yapılmadı.

Son kontrol: sade havan HUD; kesit/ayarlar isteğe bağlı. Yükseklikler artık her hatta ayrı, plan yedeğinde saklanır. 1.173 sayısal senaryo ve 13 test grubu geçti; oyun içi kalibrasyon henüz yok. Ayrıntı: TERRAIN-QA.md.

Sabit havan: ilk tık başlangıcı sabitler; sonraki tıklar hedef ekler. Yer değiştirmek için “Havan konumunu değiştir”. 3B gerçek dokulu WebGL görünümüne geçirildi; bu tur 14 JavaScript test grubu ve tarayıcı kontrolleri geçti.

## 8 Ekim: genişletilmiş ateş desteği
Dört silah / beş mühimmat profili; hat başına silah ve açı; oyun grid'iyle başlangıç/hedef; atış bilgisini kopyalama; isteğe bağlı menzil, saçılım, patlama sınırı; 3B oynatma/zaman çubuğu, atışa odaklanma, üstten bakış ve katman anahtarları eklendi. Konum değişiminde seçilmiş silah/atış ayarı korunur. Ayrıntılar ve henüz eklenmeyen SquadCalc özellikleri: SQUADCALC-REVIEW.md. Eski “standart havan” kapsamı bu beş profille genişletildi; oyun içi kalibrasyon hâlâ yapılmadı.

## 8 Ekim: ayrıntılı 3B, Grad ve erişilebilirlik

25 haritada SDK konumlu bina/yapı ve bitki yerleşimleri 3B görünümde yerel olarak yüklenir. Serbest kamera W/A/S/D, Space/Shift, fare bakışı, tekerlek hızı ve ekrandaki yön düğmeleriyle çalışır; kamera konumu küçük harita ve oyun karesiyle görünür. Bina ve ağaç katmanları kapatılabilir. Nesneler görsel temsildir; bina çarpışması ve nesneye göre balistik engel hesabı yoktur.

BM-21 Grad için sabit araç konumundan yön+mesafeyle hedef ekleme, namlu yönüne göre kısa sağ/sol dönüş ve isteğe bağlı 100 m cetvel eklendi. Ayrıntılar kapalı bölümlerde tutulduğu için ana HUD yön, yükseliş, mesafe ve süreyi göstermeye devam eder.
