# SquadCalc incelemesi ve uygulanan geliştirmeler

8 Ekim 2026 · Özel yerel ZeroZone önizlemesi. Bu kayıt önceki öneri raporunun güncel durumudur.

## İnceleme

[SquadCalc Harju / Invasion v1](https://squadcalc.app/?map=Harju&layer=Invasionv1) gerçek tarayıcıda incelendi. Harita, havan ve katman ayarları; kısayollar; sağ tık menüsü; silah seçimi; havan ve hedef yerleştirme; hedef ayrıntıları ve 3B görünüm kullanıldı. 3B'de arazi dokusu, bina/ağaç anahtarları ve topografik görünüm kontrol edildi. Ortak oturum veya sunucu bağlantısı açılmadı. Bu bir işlev karşılaştırmasıdır; oyun içi isabet kalibrasyonu değildir.

## Bu tur eklenenler

| İşlev | ZeroZone uygulaması |
|---|---|
| Silah / mühimmat | 81 mm havan, Hell Cannon, BM-21 Grad, M1064 M121 darbeli ve yakın yüzey: dört silah, beş profil. Her hat seçimini ve ayarını ayrı saklar. |
| Yüksek / alçak atış | Silahın menzil ve açı sınırları denetlenir. Uygun çözüm yoksa sahte ayar verilmez. |
| Oyun koordinatı | A1, A1-7, A1-7-3 biçimleriyle havan ve ardışık hedef girişi. Kare merkezi kullanılır; sınır dışı giriş reddedilir. |
| Sabit başlangıç | Art arda hedeflerde başlangıç korunur. Konum değiştirirken silah, açı ve ayarlanmış namlu yüksekliği korunur; hedef yüksekliği sıfırlanır. |
| Atış bilgisini kopyalama | Layer, silah, başlangıç/hedef koordinatı, yön, ayar, mesafe, uçuş süresi ve arazi engeli uyarısı tek metin. |
| Alanlar | İsteğe bağlı düz zemin menzili, yaklaşık saçılım elipsi, patlama dış sınırı. Başlangıçta kapalı; hasar garantisi gösterilmez. |
| 3B oynatma | Oynat/duraklat, zaman çubuğu, örneklenmiş arazi çarpışmasında durma, tekrar oynatma. |
| 3B kamera | Yörünge görünümü yanında serbest gezinme eklendi. W/A/S/D, Space/Shift, fare bakışı, hız tekerleği ve dokunmatik yön düğmeleri çalışır. Kamera arazinin altına inmez; konumu mini harita ve oyun karesiyle gösterilir. |
| 3B sahne | 25 haritada SDK konumlu binalar, yapılar ve bitki yerleşimleri yerel dosyalardan yüklenir. Bina ve ağaç/çalı katmanları ayrı açılır. Dağlar 513×513 yükseklik ağıyla gösterilir. Bitki ve bazı yapı şekilleri okunabilir düşük poligon temsilleridir. |
| 3B katmanlar | Binalar, ağaçlar, kırmızı sınırlar, ele geçirme bölgeleri, arazi izi ve atış yolu ayrı açılır/kapanır. Çizgiler arazi yüksekliğini takip eder. |
| Grad ölçümü | Sabit BM-21 konumundan yön + mesafeyle hedef ekleme, mevcut namlu yönüne göre sağ/sol düzeltme ve isteğe bağlı 100 m çizgili / 500 m etiketli cetvel. |
| Renk ve şekil desteği | Deuteranopi, protanopi, tritanopi ve renksiz yüksek kontrast seçenekleri. Takım 1 kare, Takım 2 elmas; seçili/sıradaki hedefler etiket ve çizgi deseniyle de ayrılır. |
| Sade düzen | Ana sonuç yön/ayar ve mesafe/süredir. Koordinat, kesit, alanlar ve teknik ayarlar kapalı ayrıntılarda. 3B başlığı küçük ekranda erişilebilir kalır. |

## Zaten bulunan ve korunanlar

26 harita / 222 layer, RAAS seçim zinciri ve olasılıkları, gerçek capture geometrileri, takım/birlik ve araç listeleri, manuel araç sayaçları, mesafe/yön, taktik çizim ve HAB planlama, düzenlenebilir kırmızı bölgeler, layerlar arası sınır kopyalama, adlandırılmış plan ve sınır setleri, birleşik JSON yedeği, geri al/ileri al, renk/boyut/parlaklık ayarları. Arazi verisi 25 harita ve 203 uyumlu layerda kullanılabilir. Kaynaklarla kapsam farkları vardır; tam SquadCalc eşdeğerliği iddia edilmez.

## Açık kalan özellikler ve nedeni

- UB-32 / Tech UB-32: yavaşlama ve mermi ömrü için ayrı model ve doğrulama gerekli. Sabit hızlı silah hesabı bu silahlara uygulanmadı.
- Tech Mortar, Mk19 ve AGS: nişangâh/açı ofseti, mühimmat ve kullanım sınırları ayrıca doğrulanmalı; menüye çalışmayan seçenek konmadı.
- 3B görünüm bağlantısı paylaşımı henüz yoktur. Standart, Topografik ve Arazi dokuları 9 Ekim güncellemesinde eklenmiştir; plan JSON ile paylaşılabilir.
- 3B bina ve ağaçlar görsel/konum farkındalığı içindir. Kamera bina çarpışması, bina içi dolaşma ve yapı/ağaç üzerinden balistik çarpışma hesabı yapmaz.
- Gerçek araziye göre menzil sınırı mevcut düz zemin halkasından farklıdır; halka bunu açıkça belirtir.
- Resmî üs koruma/inşa yasağı ve araç doğma noktaları güncel SDK eşlemesi gerektirir. Kullanıcının kırmızı çizimleri resmî oyun sınırı olarak sunulmaz.
- Ortak oturum, hesapla kayıt ve yönetici yetkileri sunucu ve gerçek kimlik sistemi gerektirir. ZeroZone kaynakları kullanıcıda olmadığı için yerel kayıt ve dosya yedeği sürer.
- Araziye göre görüş alanı 9 Ekim güncellemesinde eklendi. Ana üs varlıkları, yeniden doğma kamerası ve topluluk ısı haritası verisi henüz yoktur. Reklam ve Squad Servers kullanıcı tercihiyle kapsam dışıdır.
- Bayrak hover otomatik rota önerisi, kullanıcının önceki “ilk öneri hariç” tercihi nedeniyle genişletilmedi.

Öncelikli sonraki iyileştirmem, silah model sayısını artırmadan önce oyun içi ölçümlerle mevcut profilleri doğrulamak. İkinci olarak isteğe bağlı en fazla üç araç sayacını küçük bir alana sabitlemek yararlı olur. HUD'a sürekli yeni panel eklememek temel tercih.

## Doğrulama

16 JavaScript test dosyası geçti. Mevcut 1.173 sayısal havan senaryosuna ek olarak 145 farklı silah/açı/yükseklik senaryosu bağımsız zaman integrasyonu ile karşılaştırıldı. Grid alt kareleri, harita sınırları, eski plan uyumluluğu, mühimmat ayarlarının saklanması, saçılım geometrisi, renk paleti kontrastı, Grad yön hesabı, serbest kamera sınırları ve 3B kaynak temizliği kontrol edildi.

SquadCalc'ta gözlenen 1050,1 m / arazi farkı 3,2 m örneği, 1 m namlu yüksekliği dahil edildiğinde 1082,8 mil ve 19,6 saniye ile eşleşti. Bu tek referans, tüm silahların oyun içi doğrulandığı anlamına gelmez.

Gerçek yerel tarayıcı: Harju'da koordinatla D8-5 başlangıcı, G6-5 ve H6-5 hedefleri; Grad yüksek/alçak açı; yön+mesafeyle 1.000 m / 90° hedef; 120° namlu yönünden 30° sola düzeltme; 100 m cetveli; Hell Cannon menzil dışı; M121 yakın yüzey; yenileme sonrası ayarlar; 3B serbest kamera, mini harita, bina/ağaç anahtarları ve capture bölgeleri test edildi. Harju sahnesi 5.482 yapı parçası, 906 temsili yapı ve 120.812 ağaç/çalı yükledi. Manicouagan'da da dağ, viyadük, bina ve bitki yerleşimi gözle kontrol edildi. Konsol hata/uyarı listesi boş. Kullanıcının 127.0.0.1 planlarına test çizimi eklenmedi; testler ayrı localhost kökeninde yapıldı.

Sahne doğrulaması 25 haritanın 101 yerel dosyasını ve 482 MiB veriyi okudu; 1.422.030 bitki yerleşimi sonlu dönüşüm ve arazi hizası denetiminden geçti. Anvil'deki 24 bozuk bitki kaydı ile Sanxian'daki bir bozuk yapı parçası güvenli biçimde atlandı. Black Coast'taki 30,032 m sistematik yükseklik başlangıcı farkı SDK'nın 3B referansına göre düzeltildi. Kanıt: `work/scene-harju-flight.jpg`. Fiziksel dokunmatik ve oyun içi atış testi yapılmadı.

## Kaynak ve uygulama yöntemi

- [Resmî özellikler ve proje](https://github.com/sh4rkman/SquadCalc)
- [Silah parametreleri](https://github.com/sh4rkman/SquadCalc/blob/master/src/data/weapons.js) — 7 Ekim 2026 snapshot; oyun sürümüyle değişebilir.
- [Atış açısı açıklaması](https://github.com/sh4rkman/SquadCalc/wiki/Deducing-Elevation)
- [Saçılım açıklaması](https://github.com/sh4rkman/SquadCalc/wiki/Deducing-Spread)
- [Lisans](https://github.com/sh4rkman/SquadCalc/blob/master/LICENSE)

Yeni çözücü, koordinat parser'ı, panel ve 3B oynatma kodu bağımsız yazıldı. Mevcut yükseklik/oyun verisi kaynakları TERRAIN-QA.md içinde kayıtlıdır. Bu çalışma yalnızca özel yerel önizlemede; canlı ZeroZone sitesine yayın yapılmadı.

## 9 Ekim: görüş alanı, topografik 3B ve sabit sayaçlar

Araçlar → Havan / 3B içindeki Görüş alanı, gözlemci koordinatı ve yüksekliğiyle yaklaşık arazi görünürlüğünü hesaplar. 3B görünüm ayarlarında üç harita dokusu seçilebilir. Araçlar → Sayaçlar üzerinden layer başına en fazla üç sayaç haritaya sabitlenir. Ayrıntılı kullanım, hesap sınırları ve 20 test dosyasının kapsamı: [NEW-FEATURES.md](NEW-FEATURES.md). Yeni gerçek tarayıcı görsel kontrolü bağlantı olmadığı için tamamlanmadı.
