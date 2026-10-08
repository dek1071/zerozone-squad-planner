# Kırmızı sınır bölgeleri

Kullanıcının gönderdiği 32 görseldeki geniş kırmızı alanlar, ilgili 32 RAAS katmanına aktarıldı: 23 harita, 64 ayrı poligon. Küçük üs çemberleri bu veri setine dahil değildir. Sınırlar referans görseller üzerinden vektör olarak çizildi; resmi oyun kuralı veya otomatik yasak alan verisi olarak yorumlanmaz.

Harita görünümü → **Kırmızı sınır bölgeleri** seçeneği varsayılan olarak açıktır. Hedefler, ele geçirme bölgeleri, çizimler ve koridor hesapları bu katmandan bağımsızdır. Kırmızı poligonlar tıklama yakalamaz; altlarındaki harita sürüklenebilir, üzerlerindeki bayraklar seçilebilir. Standart, arazi ve topografik görünümlerde aynı koordinatlarda kalırlar.

Her sınır kendi katman kimliğine bağlıdır. Örneğin Gorodok RAAS V1 ile V2 ayrı sınırlara sahiptir. Referansı gönderilmeyen düzenlere başka katmanın sınırları uygulanmaz. Al Basrah V1/V2 görsellerindeki sınır dışı kırmızı tarama, aynı veri snapshot'ındaki oynanabilir alan sınırından çizilir.

## Veri ve tekrar üretme

- Uygulama verisi: `data/red-zones.json`.
- Düzenlenebilir kaynak: `../../work/red-zone-traces.json`; her görselin kimliği, harita/katman eşleşmesi, görüntü çerçevesi ve piksel köşeleri bulunur.
- Tekrar üretme: `node work/prepare-red-zones.cjs` (çalışma kökünden). Ana üslerin doğru poligonların içinde olduğu doğrulanır.
- Kontrol: `node work/test-red-zones.mjs`. 32 düzen/64 alan, koordinat sınırları, poligon alanları, katmanlar arası izolasyon, görünürlük ve tıklama geçişi test edilir.
- Tarayıcıda Gorodok V1/V2 geçişi, referanssız AAS'a geçince temizlenmesi, açma/kapatma, zoom, kırmızı alandaki bayrak seçimi ve Al Basrah taraması doğrulandı. Mevcut capture/plan/veri testleri de geçti.

Bu çalışma yalnızca yerel özel önizlemededir.

## Bölge düzenleyicisi

7 Ekim ekleri: **Sınır setleri ve layerdan kopyalama** bölümünden mevcut alanlar adlandırılmış bir kopya olarak saklanabilir (layer başına en fazla 20 set). Setler sonraki çizim değişikliklerinden etkilenmez. Aynı haritanın diğer layerlarından alanlar karşılaştırmalı geometri önizlemesi ile alınabilir; ekle/değiştir seçilir ve Geri al desteklenir. Kaynak layer değiştirilmez. Setler `zerozone-maps-v1:region-sets:<layerId>` anahtarında tutulur.

**Planım → Tam yedek indir** artık bölgeleri ve sınır setlerini de içerir. Aşağıdaki eski Planım yedeği açıklaması yalnızca schema 1 eski dosyalar için geçerlidir. Bölgeler panelindeki ayrı yedek yalnızca aktif sınırları taşır; setleri taşımak için tam yedek kullanılmalıdır.

**Bölgeler** sekmesi tüm 222 katmanda kullanılabilir. Önce harita ve katmanı seçin.

1. **Yeni bölge çiz** ile haritaya köşe noktaları koyun; en az üç köşeden sonra **Çizimi bitir**, Enter veya ilk köşeye tıklama ile kapatın. Esc/Vazgeç taslağı iptal eder.
2. Listeden mevcut alanı seçin. Kare köşeleri sürükleyin; aradaki + işaretleri köşe ekler. Köşeye sağ tıklamak onu siler (en az üç köşe kalır). Seçili köşe ok tuşlarıyla 1 m, Shift ile 10 m taşınabilir.
3. **Yeniden çiz** aynı alanın sınırını baştan oluşturur. Adı değiştirilebilir ve alan silinebilir. **Geri al / Yinele** bu işlemleri geri döndürür.
4. Alan yanındaki kutu yalnızca o alanı, üstteki kutu bütün kırmızı alanları açar/kapatır. Al Basrah sınır dışı taraması ayrıca yönetilir.
5. **Başlangıç sınırlarına dön** ilgili katmanın referanslarını geri getirir; bu işlem de geri alınabilir.

Değişiklikler otomatik olarak `zerozone-maps-v1:regions:<layerId>` localStorage anahtarına kaydedilir. Başka katmanın alanlarını değiştirmez. Referans JSON dosyası değiştirilmez. Tarayıcı verileri temizlenirse cihazdaki düzenlemeler kaybolur. **Yedeği indir / Yedeği yükle** yalnızca açık katmanın bölge verisini taşır; farklı katmana ait dosyalar reddedilir. Planım yedeği bölge verisini içermez. Geri alma geçmişi oturum belleğindedir.

`region-model.js` geometri doğrulama ve 60 adımlı geçmişi; `region-editor.js` arayüz, çizim ve cihaz kaydını yönetir. `node work/test-region-editor.mjs` yeni alan, katman izolasyonu, görünürlük, yeniden çizme, silme/geri alma, geçersiz geometri ve 64 referansın düzenlenebilirliğini sınar.

Tarayıcıda yeni alan, köşe ekleme/silme/sürükleme, yeniden çizme, isim ve görünürlük kaydının sayfa yenilenince korunması, başlangıca dönme ve geri alma doğrulandı. Yedek indirme olayını gözlemleyen tarayıcı aracı zaman aşımına uğradı; dosya indirme/yükleme akışı uçtan uca doğrulanamadı.
