# 10 Ekim 2026 — isteğe bağlı harita araçları

## Görüş alanı

**Araçlar → Görüş alanı** bölümünü açın. **Haritadan gözlemci seç** ile noktaya tıklayın veya koordinatı elle girin. Göz yüksekliğini ve inceleme mesafesini girip **Görüşü hesapla** düğmesine basın. Koordinatı boş bırakırsanız sabit havan konumu kullanılır.

Açık kaplama görülebilen zemini, koyu tarama arazi arkasında kalan zemini gösterir. Siyah/beyaz nokta gözlemcidir. Yüzde yalnızca seçilen mesafe içindeki örneklenen zemin noktalarını ifade eder. Katmanı gizleyebilir veya temizleyebilirsiniz; layer değişiminde sonuç ve gözlemci girişi temizlenir. Haritadan seçim tam konumu, elle yazılan grid ise o hücrenin merkezini kullanır. Görüş sonucu geçici bir analizdir, plan yedeğine kaydedilmez.

Hesap yükseklik verisinde ışın örneklemesi yapar. Bina, ağaç, duman ve oyun içi görüş mesafesi hesaba katılmaz. 81×81 örnekleme küçük engelleri kaçırabilir; kesin görünürlük garantisi değildir. Mesafe 50–3.000 m, göz yüksekliği 0,1–100 m aralığındadır.

## Ölçü birimleri

Havan nişan açısı Türkçe **milyem**, Grad ve araçların yükselişi **derece (°)** olarak yazılır. **Mesafe: … m** ve **Uçuş: … sn** ayrı etiketlerdir. Oyundaki `mil` açısının sayısal değeri değişmez: 1600 milyem = 90°. Açıklama Atış ayarları içinde bulunur; kopyalanan atış bilgisinde de aynı birimler kullanılır.

## 3B topografik görünüm

**3B araziyi aç → Görünüm ayarları ve yardım → 3B harita görünümü** alanında Standart, Topografik veya Arazi seçin. Kamera, atış yolu ve nesne katmanları aynı kalır. Yeni doku yüklenemezse önceki görüntü korunur. Hızlı seçimlerde son istek esas alınır; geç biten eski yükleme hata mesajı veya yanlış doku oluşturmaz. Bu seçim yalnızca açık 3B penceresine aittir.

## Sabit araç sayaçları

**Araçlar → Sayaçlar → Haritaya sabitle** ile mevcut layer için en fazla üç sayaç ekleyin. Sol alttaki küçük kartlardan başlatın, sıfırlayın veya × ile sabitlemeyi kaldırın. Kartta takım, birlik ve araç adı gösterilir. Birliği sonradan değiştirirseniz eski kartta **Önceki birlik** etiketi görünür. Sabitlemeler ve çalışan sayaçların bitiş zamanları bu tarayıcıda saklanır; diğer layerlara geçerken karışmaz. Sabitlemeyi kaldırmak çalışan sayacı sıfırlamaz.

**Tam yedek indir** sabitlenecek sayaç tercihlerini taşır; aktif geri sayımın bitiş zamanı paylaşılmaz. Eski yedeklerde sayaç alanı yoksa mevcut sabitlemeler korunur.

Sayaçlar elle başlatılır; canlı sunucudan araç kaybı okunmaz. İlk çıkış gecikmesini Sayaçlar panelinden, yenilenme sayacını panelden veya sabit karttan başlatabilirsiniz.

## Renk desteği

**Harita görünümü → Görsel ayarları** içindeki dört destek modu, 2B harita zeminini, 3B sahneyi, harita kartlarını, panelleri ve pencereleri kapsar. Yoğunluk ayarı zemin renkliliğini ve kontrastı değiştirir; Renksiz modu zemini her yoğunlukta gri tutar. İşaretler ve takımlar belirgin palet, şekil ve çizgi farklarıyla ayrılır. Çizim renkleri A–E grupları ve farklı çizgi desenleriyle de tanınır. Ayarlar cihazda ve tam yedekte saklanır.

Bu modlar okunabilirliği artırmayı amaçlar; renk algısını birebir düzelttiği iddia edilmez. Tercihinize göre yoğunluk, yazı ve işaret boyutunu ayarlayın.

## İnşa ve lojistik

Takımlar listesindeki birim cons bedeli ve Araçlar → Lojistik hesabı aynı maliyet tablosunu kullanır. Her satırda adet × birim maliyet = toplam gösterilir. Örneğin 500 cons HAB + 25 cons kum torbası **525 cons** inşadır; 100’lük yükleme için **600 cons** önerilir, **75 cons** artar. 3.000 kapasiteli araçta mühimmat için **2.400** yer kalır. Kaynak denetimi: [CONSTRUCTION-AUDIT.md](CONSTRUCTION-AUDIT.md).

## Araç resimleri ve oyun ikonları

Envanter, karşılaştırma, lojistik ve sayaç listeleri araç görselleri içerir. Harita işaretleri Squad ikonlarını kullanır. 209 tam ad eşleşmesi ve 21 sınıf simgesiyle yedek gösterim vardır. [Görsel kaynakları ve kapsam](SQUAD-VISUALS.md).

## Doğrulama

23 JavaScript test dosyası: balistik ve arazi, capture zincirleri, bölge düzenleme, yedek/geri alma, renk modları, inşa maliyeti tutarlılığı, görüş hesabı, haritadan tam konum seçimi, layer temizliği, sabit sayaçlar ve yarışan 3B yüklemeleri. Önceki sürümde gerçek masaüstü tarayıcıda 3B nesneler, üç doku, serbest kamera, haritadan gözlemci seçimi, layer değişimi, beş görünüm seçeneği ve 525/600 cons örneği kontrol edildi. 10 Ekim değişikliklerinde tarayıcı bağlantısı bulunmadığından yeni sekme ve resimli UI için ekran testi tamamlanmadı. [Güncel veri denetimi ve test sınırları](DATA-AUDIT.md).

390×844 dar ekranda ayar paneli ve yatay taşma kontrol edildi; Renksiz modu %20 yoğunlukta da gri kaldı. Geçici ekran boyutu testi sonunda geri alındı. Son tarayıcı konsolunda hata/uyarı yoktu.

Fiziksel dokunmatik cihaz, farklı renk algılarına sahip oyuncularla kullanılabilirlik araştırması ve oyun içi atış kalibrasyonu bu doğrulamaya dahil değildir. GitHub kaynak incelemesi: [GITHUB-REVIEW.md](GITHUB-REVIEW.md).
