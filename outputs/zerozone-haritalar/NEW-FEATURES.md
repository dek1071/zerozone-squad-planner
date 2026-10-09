# 9 Ekim 2026 — isteğe bağlı harita araçları

## Görüş alanı

**Araçlar → Havan / 3B → Görüş alanı** bölümünü açın. Gözlemci koordinatını, göz yüksekliğini ve inceleme mesafesini girip **Görüşü hesapla** düğmesine basın. Koordinatı boş bırakırsanız sabit havan konumu kullanılır.

Açık kaplama görülebilen zemini, koyu tarama arazi arkasında kalan zemini gösterir. Siyah/beyaz nokta gözlemcidir. Yüzde yalnızca seçilen mesafe içindeki örneklenen zemin noktalarını ifade eder. Katmanı gizleyebilir veya temizleyebilirsiniz; layer değişiminde temizlenir. Görüş sonucu geçici bir analizdir, plan yedeğine kaydedilmez.

Hesap yükseklik verisinde ışın örneklemesi yapar. Bina, ağaç, duman ve oyun içi görüş mesafesi hesaba katılmaz. 81×81 örnekleme küçük engelleri kaçırabilir; kesin görünürlük garantisi değildir. Mesafe 50–3.000 m, göz yüksekliği 0,1–100 m aralığındadır.

## 3B topografik görünüm

**3B araziyi aç → Görünüm ayarları ve yardım → 3B harita görünümü** alanında Standart, Topografik veya Arazi seçin. Kamera, atış yolu ve nesne katmanları aynı kalır. Yeni doku yüklenemezse önceki görüntü korunur. Bu seçim yalnızca açık 3B penceresine aittir.

## Sabit araç sayaçları

**Araçlar → Sayaçlar → Haritaya sabitle** ile mevcut layer için en fazla üç sayaç ekleyin. Sol alttaki küçük kartlardan başlatın, sıfırlayın veya × ile sabitlemeyi kaldırın. Kartta takım ve araç adı gösterilir. Sabitlemeler ve çalışan sayaçların bitiş zamanları bu tarayıcıda saklanır; diğer layerlara geçerken karışmaz. Sabitlemeyi kaldırmak çalışan sayacı sıfırlamaz.

Sayaçlar elle başlatılır; canlı sunucudan araç kaybı okunmaz. İlk çıkış gecikmesini Sayaçlar panelinden, yenilenme sayacını panelden veya sabit karttan başlatabilirsiniz.

## Doğrulama

Önceki 16 test dosyasına ek olarak dört yeni test geçti: görüş modeli (düz zemin/tepe/yükseklik/harita sınırı), görüş paneli (gizle/göster/layer temizliği/geç yükleme), sabit sayaçlar (üçlü sınır/kayıt/layer ayrımı/başlat/sıfırla), 3B doku (yarışan yüklemeler/hata/kapama/kaynak temizliği). Toplam 20 JavaScript test dosyası.

Bu değişikliklerin yeni gerçek tarayıcı ve mobil görsel kontrolü tamamlanmadı: test sırasında tarayıcı bağlantısı kullanılamadı. DOM/GPU yerine test nesneleri kullanan kontroller görsel doğrulama sayılmaz.
