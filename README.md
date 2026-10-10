# Zero Zone — Squad Harita Planlayıcısı

Zero Zone tasarımına uygun taktik harita ve ateş desteği prototipi. Bu depo, 10 Ekim 2026 tarihindeki yerel sürümü içerir. Canlı Zero Zone sitesinden bağımsız çalışır.

## Başlatma

1. Depoyu klonlayın veya **Code → Download ZIP** ile indirip arşivi tamamen çıkarın.
2. Bilgisayarınızda Node.js 22 veya daha yeni bir sürüm bulunmalıdır.
3. Proje klasöründe `npm start` çalıştırın. Windows'ta `BASLAT.cmd` dosyasını da açabilirsiniz.
4. Tarayıcıda <http://127.0.0.1:4173/haritalar> adresini açın.

Paket bağımlılığı veya `npm install` gerekmez. Haritalar, yükseklikler, 3B nesneler ve kütüphaneler depoda bulunur. Yerel sunucu yalnızca kendi bilgisayarınızdan erişilebilir; GitHub depo bağlantısı oynanabilir bir web sitesi değildir.

## Özellikler

- 26 harita / 222 layer; harita, oyun modu ve birlik filtreleri.
- RAAS hedef seçimi, olası sonraki noktalar ve capture alanları.
- Layer başına düzenlenebilir kırmızı bölgeler, taktik çizimler ve plan yedekleri.
- Sabit havan konumu, çoklu hedef, arazi kesiti ve atış animasyonu.
- Havan, Hell Cannon, BM-21 Grad ve M121 profilleri; Grad yön/mesafe cetveli.
- 25 haritada dokulu 3B arazi, bina ve bitki yerleşimleri, serbest kamera.
- Deuteranopi, protanopi, tritanopi ve yüksek kontrast modları; 2B/3B harita ve bütün UI için yoğunluk ayarı, A–E çizim grupları, şekil ve çizgi desteği.
- Ortak inşa maliyeti hesabı; kesin cons bedeli, 100’lük araç yükü ve kalan mühimmat kapasitesi. [Maliyet denetimi](outputs/zerozone-haritalar/CONSTRUCTION-AUDIT.md).
- 230 aracın tamamında araç resmi ve haritada Squad oyun ikonları. [Görsel kaynakları](outputs/zerozone-haritalar/SQUAD-VISUALS.md).
- Ayrı Görüş alanı sekmesi, 3B topografik/standart/arazi dokusu seçimi ve layer başına üç sabit araç sayacı. [Yeni araçların kullanımı](outputs/zerozone-haritalar/NEW-FEATURES.md).

3B görünümde **Serbest gezin**: W/A/S/D hareket, Space/Shift yükseklik, fareyle bakış, tekerlekle hız. Bina ve ağaç katmanları ayrı kapatılabilir. Ayrıntılı seçenekler ana ekranı doldurmamak için kapalı bölümlerdedir.

## Zırh analizi

Harita başlığındaki **Zırh analizi** bağlantısı veya `/zirh` adresi ayrı araç laboratuvarını açar. 233 araç adı / 470 varyantın zırh geometrisi, mühimmat ve mesafeye göre katman hesabı, mermi kamerası ve tekrar sürgüsü bulunur. Renk desteği ve hareket azaltma seçenekleri vardır. [Kaynaklar, oyun manifesti karşılaştırması ve sınırlar](outputs/zerozone-haritalar/ARMOR-ANALYSIS.md).

## Plan paylaşımı

Planlar tarayıcıda saklanır. Başka kişiye kendi çizimlerinizi göndermek için uygulamada **Planım → Tam yedek indir** kullanın; alıcı JSON dosyasını içe aktarabilir. Bu depo kişisel tarayıcı kayıtlarını içermez.

## Testler

`npm test` ile 25 JavaScript test dosyası çalışır. Sayısal atış hesabı, plan yedekleri, bölgeler, erişilebilirlik, inşa maliyetleri, görüş alanı ve nokta seçimi, sabit sayaçlar, 3B veri ve kaynak temizliği denetlenir. Tam sahne verisi testi bellek ve zaman gerektirebilir. Zırh analizi gerçek masaüstü ve dar ekran tarayıcısında kontrol edildi; 470 model üzerinde 2.820 ışın testi yapıldı. Daha önceki araç görselleri güncellemesinin ayrı gerçek tarayıcı testi yapılmamıştı. Güncel otomasyon, 26 harita/222 layer kaynak karşılaştırması ve kalan kaynak çelişkileri [veri denetim raporunda](outputs/zerozone-haritalar/DATA-AUDIT.md). [GitHub araştırması ve kalan sınırlar](outputs/zerozone-haritalar/GITHUB-REVIEW.md).

## Kapsam sınırları

Bu bir oyun planlama aracıdır. Canlı maç, ortak oturum ve hesap sistemi bağlı değildir. Atış profilleri oyun içi isabet testiyle kalibre edilmiş olarak sunulmaz. 3B bitkiler ve bazı yapılar basitleştirilmiştir; yapı/ağaç çarpışması hesaplanmaz. Kırmızı bölgeler kullanıcı referanslarından oluşturulan planlama alanlarıdır. Veri snapshot'ı güncel oyun sürümünden farklı olabilir.

## Dosyalar ve kaynaklar

Uygulama `outputs/zerozone-haritalar/`, otomatik testler `work/` klasöründedir. Kaynak ve lisans açıklamaları [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) içindedir. Bütün depo için yeni bir açık kaynak lisansı verilmemiştir; üçüncü taraf içeriklerin kendi koşulları geçerlidir.
