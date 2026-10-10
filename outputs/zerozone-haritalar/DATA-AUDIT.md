# Veri ve hata denetimi — 9–10 Ekim 2026

## Yapılan düzeltmeler

- Havan açısındaki belirsiz “mil” yazısı **milyem** oldu; mesafe metre, uçuş saniye olarak ayrı etiketlendi. Araçların derece birimi ve sayısal atış hesabı korundu.

- Görüş alanı **Araçlar → Görüş alanı** sekmesine taşındı. Gözlemci, göz yüksekliği veya yarıçap değişince önceki kaplama kaldırılır. Temizle düğmesi bekleyen nokta seçimini de iptal eder. Geç yükleme sonuçları başka layera taşınmaz.
- Görüş açıklaması zemine yapılan hesapla kişi/araç görünürlüğünü ayırır. 81×81 sonuç örneklemesi ve kaynak yükseklik aralığı gösterilir. Bina, ağaç, duman ve oyun çizim mesafesi dahil değildir; oyun içi görünürlük doğrulaması yapılmadı.
- Chora, Fools Road, Kokan, Logar ve Sumari'de FOB telsiz dışlama halkası 400 yerine **300 m**. İnşa halkası 150 m. Etiket halkanın HAB değil telsiz merkezli olduğunu açıklar. [SquadCalc harita tanımları](https://github.com/sh4rkman/SquadCalc/blob/master/src/data/maps.js).
- Harju RAAS v3 CL: SquadMaps'ın Alpha hattında referans verilen fakat `objectives` içinde bulunmayan **Lumber Yard** noktası ve capture kutusu SquadCalc'tan tamamlandı. [Kaynak layer](https://squadcalc.app/api/get/layer?name=Harju_RAAS_v3_CL). Sınırlı ekleme [source-overrides.json](data/source-overrides.json) dosyasındadır; kaynakta sonradan gelen aynı anahtar ezilmez.
- Mestia RAAS v1: `USA Main` / `MIL Main` adları nedeniyle hedef sanılan iki ana üs doğru takımlara ve ana üs listesine taşındı. Her iki taraftan hedef zinciri yeniden test edildi.
- Kutulu capture alanlarında ihmal edilen `scaling_x/y/z` değerleri dönüşten önce uygulanır. 20 layerdaki 65 noktanın alan listesi değişti; buna yeni Lumber Yard da dahildir. Döndürülmüş kutunun beklenen kenar uzunlukları ayrıca denetlendi. [SquadCalc capture geometrisi](https://github.com/sh4rkman/SquadCalc/blob/master/src/js/squadCapZone.js).

## Karşılaştırma kapsamı

| Veri | Sonuç |
|---|---|
| SquadMaps canlı veri paketi | 7 ham veri bloğu mevcut snapshot ile eşleşti; 26 harita, 222 layer, 274 birlik ve araç/inşa tabloları kapsandı. |
| Üretilen uygulama verisi | Güncel kaynak, belgelenen düzeltmelerle tekrar dönüştürüldü; 28 JSON çıktısı yerel sürümle eşleşti. |
| SquadCalc layer API | 222 layer sorgulandı; 195 yanıt, 27 HTTP 404. 404 veriler silinmedi. |
| İki sitede ortak 195 layer | Düzeltmeden sonra hedef adı/konumu, harita sınırları, varsayılan birlikler ve biletler eşleşti. Konumlarda SDK santimetre biriminde 1 cm kayan nokta toleransı kullanıldı. |
| Yükseklik verisi | 25 güncel kaynak PNG'den 6.579.225 yerel örnek yeniden hesaplandı; değişen örnek 0. |
| Harita görselleri | 26 × 4 = 104 dosyanın SHA-256 değeri güncel SquadMaps dosyalarıyla eşleşti. |
| 3B veri | 25 × 4 = 100 props/trees JSON ve binary dosyası güncel SquadCalc dosyalarıyla SHA-256 düzeyinde eşleşti. Yerel sahne geometri testleri de geçti. |
| Balistik/harita tanımları | SquadCalc `maps.js` ve `weapons.js` güncel dosyaları önceki doğrulama snapshot'ıyla aynı. Desteklenen beş profilin sayısal testleri geçti. |

Bu eşleşmeler kaynak uyumluluğudur; kaynak sitelerin tamamının güncel oyun sürümüne karşı hatasız olduğunun kanıtı değildir. 3B yerleşim verisinin eşleşmesi de tüm ağaçların/binaların görünümünün oyunla aynı olduğu anlamına gelmez.

## Çelişen veya doğrulanamayan bilgiler

- Manicouagan RAAS v2: SquadCalc'ın **Echo** yolu D1–D7 üzerinden Delta'yı tekrar eder; SquadMaps E1–E7 yolunu kullanır. Mevcut E yolu korundu. Bu bir kaynak çelişkisidir, SDK/oyunla bağımsız çözülmedi.
- 32 layerda bot kullanılabilirliği, 62 layerda komutanın açık/kapalı olması, 59 layerda seçilebilir birlik listeleri farklı. Bunlar birbiriyle örtüşen sayılardır. Bu alanlarda sürüm/çıkarım farkı olabileceği için SquadMaps değerleri korunmuştur; rastgele kaynak tercihiyle “düzeltildi” denmez.
- 27 eksik API yanıtının çoğu Belaya, Insurgency ve Jensen varyantlarıdır. SquadCalc'ta bulunmaması yerel layerın yanlış olduğunu göstermez.
- İnşa bedellerinin tamamı oyun/SDK ile bağımsız doğrulanmış değildir; [maliyet denetiminin sınırları](CONSTRUCTION-AUDIT.md) geçerlidir. Kullanıcının çizdiği kırmızı bölgeler resmî oyun sınırları olarak doğrulanmaz.

## Test sonucu ve sınırı

23 JavaScript test dosyası: hedef zincirleri, 80 ileri/geri rota, 3.616 capture geometrisi, balistik, 25 sahne, yedek/geri alma, renk desteği, lojistik, görüş hesabı ve yaşam döngüsü, yeni görsel eşlemeleri. Düz ve eğimli arazinin açık görünmesi, sırtın arkasının kapanması, göz yüksekliği ve harita kenarı ayrıca sınandı.

Bu oturumda tarayıcı otomasyon bağlantısı boş döndü. Yeni sekmenin ve resimli listelerin bağlantıları DOM testleriyle, resimler dosya çözümleme ve HTTP ile doğrulandı; **yeni masaüstü/mobil ekran kontrolü tamamlandı denemez**. Önceki sürümün tarayıcı kontrolleri bu değişikliklerin yerine sayılmaz. Oyun içi isabet/görünürlük kalibrasyonu yapılmadı.

Ham kaynaklar: [SquadMaps](https://squadmaps.com/), [SquadCalc](https://squadcalc.app/), [SquadCalc GitHub](https://github.com/sh4rkman/SquadCalc). Küçük makine raporları `data/audit/` içindedir; kullanıcı planları bu raporlara dahil değildir.
