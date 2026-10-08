# Son kontrol ve SquadMaps karşılaştırması

7 Ekim 2026. Yalnızca özel yerel önizleme; canlı siteye yayın yapılmadı.

## Sonuç

Altı otomatik test grubu başarılı. Harita/katman verisi ve temel planlama akışları test kapsamında doğrulanmıştır; bu rapor sıfır hata garantisi veya üretim yayını onayı değildir. Son düzeltmelerden sonra gerçek tarayıcıdaki görsel/mobil kontrol tamamlanamadı: uygulama tarayıcısı bağlantısında kullanılabilir tarayıcı dönmedi.

## Düzeltilen hatalar

- Bölgeler düzenlemesi aktifken harita araç çubuğunun Geri al/Yinele işlemleri taktik işaret geçmişini kullanıyordu. Şimdi bölge geçmişine yönleniyor.
- Layer değiştiğinde önceki bölgenin köşe tutamaçları kalabiliyordu. Layer yüklenirken temizleniyor.
- Klavye ile köşe taşındığında yeniden çizilen tutamaç odağı kaybediyordu. Yeni tutamaç yeniden odaklanıyor. Tutamaçlar artık sıfır boyutlu değil; 20 × 20 piksel etkileşim alanı var.
- Bölgeler sekmesine girişte araç çubuğundaki seçili araç rengi ile gerçek taşıma aracı farklı kalabiliyordu. Görsel aktif durum da eşitleniyor.

## Doğrulamalar

| Test | Kapsam | Sonuç |
|---|---|---|
| validate-preview | 26 harita, 222 layer, görseller, birlik referansları, koordinat ve mesafe hesabı | Geçti |
| test-capture | İki yönden 80 tam RAAS rota geçişi, hedef seçimi/geri alma, olasılıklar, 3.617 capture geometrisi | Geçti |
| test-planning | İnşa kapasitesi/maliyeti/sınırları, çizim geçmişi, veri şeması, 78 harita görünümü | Geçti |
| test-red-zones | 32 referans düzeni, 64 poligon, layer izolasyonu, görünürlük | Geçti |
| test-region-editor | Yeni alan/yeniden çizim, kalıcılık, silme ve geri alma, geçersiz poligonlar | Geçti |
| test-region-interactions | Gerçek düzenleyici kodu + DOM/Leaflet test nesneleri: undo/redo, klavye hareketi/odak, tutamaç temizliği, layer geçişinde kayıt | Geçti |
| HTTP | 31 rota/kod/veri dosyası; eksik dosya ve dizin dışı erişim reddi; noindex | Geçti |

app.js ve region-editor.js sözdizimi kontrolü geçti. Önizleme sunucusu yeniden başlatıldı, yalnızca 127.0.0.1:4173 üzerinde dinliyor.

Önceki oturumda tarayıcıda yeni alan çizimi, köşe ekleme/silme/sürükleme, adlandırma, yeniden çizme, görünürlük, sayfa yenilenince kayıtların korunması ve başlangıca dönme doğrulandı. Bu turdaki son dört düzeltmenin gerçek tarayıcı kontrolü, dar ekran/dokunmatik kontrolü ve JSON yedek indirme/yükleme uçtan uca kontrolü açık maddelerdir. Önceki ekran görüntüleri son düzeltmelerin görsel kanıtı sayılmaz.

## SquadMaps karşılaştırması

Kaynak: [SquadMaps Gorodok AAS V1](https://squadmaps.com/?map=Gorodok&layer=AASv1). Bu çalışma sırasında OVERLAYS, STRATEGY, MORTAR, TEAM ve CONSTRUCTION panelleri gerçekten açılarak incelendi. Aşağıdaki gelişmiş özellikler panelde görülen seçeneklerdir; balistik doğruluğu veya bütün davranışları ayrıca ölçülmedi.

| Alan | SquadMaps'te gözlenen | ZeroZone önizlemesi |
|---|---|---|
| Tasarım | Harita odaklı bağımsız araç arayüzü | ZeroZone renkleri, başlık ve gezinme düzenine uyumlu ek sayfa |
| Capture / RAAS | Capture zones, çoklu hedef derinliği ve koridor renkleri seçenekleri | 40 RAAS layerında sıralı seçim, aday yüzdeleri, geri alma; 3.617 capture bölgesi |
| Taktik çizim | Fırça, çizgi, daire, preset simgeleri, renk ve kalınlık | Temel çizimler, işaretler, ölçüm, kayıt ve geri alma |
| Kırmızı alan düzenleme | İncelenen panellerde layera özel sınır düzenleme akışının eşdeğeri görülmedi | Kullanıcıya özel köşe düzenleme, yeniden çizme, ayrı layer kayıtları ve görünürlük |
| Havan | Dört slot, silah seçimi, menzil/saçılım/süre, mil gösterimi ve ısı haritası kontrolleri | Yalnızca yatay mesafe ve yön; balistik eşdeğerliği yok |
| Görünüm | Standard/terrain/topographic, LOS beta, marker boyutu, zoom hassasiyeti, renk körlüğü | Üç harita görünümü, ızgara, parlaklık/opaklık/gri ton; LOS ve özel renk körlüğü modu yok |
| Takım / inşa | Faction/unit, araç süreleri, karşılaştırma, lojistik ve yapı hesabı | Ordu/birlik bilgisi, manuel sayaçlar, karşılaştırma, kapasite ve maliyet hesabı |
| Sunucular | Servers bölümü mevcut | Kullanıcının tercihiyle bulunmuyor |

Oyun verisi 5 Ekim 2026 snapshot'ıdır. Sonraki oyun yamaları ve sunucu kısıtları otomatik takip edilmez. Kırmızı sınırlar kullanıcı görsellerinden aktarılan planlama referanslarıdır.

## Öneriler — uygulanmış özellik değildir

1. Tek yedek: taktik plan, capture seçimi ve kırmızı bölgeleri aynı dosyada toplamak; mevcut ayrı yedeklerin kullanım karışıklığını azaltır.
2. Aynı haritanın layerları arasında sınır kopyalama; üzerine yazmadan önce karşılaştırmalı önizleme. Normal maç/etkinlik sınır setleri.
3. Renk körlüğü paleti ve ayarlanabilir hedef/etiket boyutu; yoğun haritalarda okunabilirliği iyileştirir.
4. Veri sürümü ve değişiklik listesi; oyun güncellemelerinde eski araç/katman bilgisini fark etmeyi kolaylaştırır.
5. Canlı entegrasyonda hesapla kayıt ve yöneticiye özel sınır düzenleme. Şimdiki kayıtlar cihaz/tarayıcıyla sınırlıdır.
6. Gelişmiş havan ve görüş hattını ayrı proje aşaması olarak ele almak; yükseklik verisi, silah tabloları ve oyun içi ölçümler olmadan eklememek.

Mevcut işlev kapsamı özel denemeye uygundur. Yayın kararı öncesinde açık tarayıcı kontrolleri ve mevcut sitenin gerçek kaynaklarıyla entegrasyon tamamlanmalıdır.
