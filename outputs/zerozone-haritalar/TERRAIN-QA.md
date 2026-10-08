# Havan, arazi kesiti ve 3B görünüm

## 7 Ekim 2026 — sabit havan ve gerçek 3B doğrulaması

Havanın ilk konumu aynı layer içinde sabittir; sonraki tıklamalar yalnızca hedef ekler. Araç değiştirip dönmek konumu korur. Tamamlanmış hatlar planla saklanır; sayfa yeniden açıldığında havan aracına giriş son hattın konumunu kullanır. Henüz hedefi olmayan başlangıç oturumluk kalır. “Havan konumunu değiştir” eski hatlara dokunmadan yeni başlangıç ister. Seçilen eski hatla o havandan devam edilir. Yeni hedef havan yüksekliğini devralır, hedef yüksekliği sıfırdan başlar. Layer değişimi başlangıcı sıfırlar.

3B artık yerel Three.js r180 (MIT; assets/vendor/THREE-LICENSE.txt) ile WebGL kullanır. Tam harita dokusu, 513×513 yükseklik ağı, doğru UV/kuzey yönü ve derinlik testi vardır. Eski 56×56 renk üçgenleri kaldırıldı. Sınır çizgileri araziye oturur; atış yolu arazi tarafından örtülebilir. Başlangıç yüksekliği ×1; kamera sığdırması atış eğrisini ve yükseklik vurgusunu hesaba katar. Canvas boyutu dar ekrana göre güncellenir. Pencere kapanınca GPU kaynakları, ResizeObserver ve dinleyiciler temizlenir.

Gerçek tarayıcı bu tur kullanılabildi: Goose Bay ve Anvil dokuları gözle kontrol edildi. Ayrı localhost test kökeninde ilk konum + iki ardışık hedef, açık konum değişimi + yeni hedef, sayfa yenilemesinden son havanı sürdürme, fareyle döndürme, klavye, zoom, reset, ×1/×5 yükseklik ve üç aç/kapa döngüsü geçti. 390×844 görünümde kontroller ve harita görüldü; viewport geri alındı. Konsol hata/uyarı listesi boştu. Kullanıcının 127.0.0.1 taslaklarına test işaretleri eklenmedi.

14 JavaScript test grubu bu değişikliklerle geçti; test-mortar-origin yeni. Eski Canvas çizici testleri gerçek Three geometri/UV/normal testlerine ve GPU yerine test nesnesi kullanan yaşam döngüsü testine taşındı; GPU çizimi ayrıca tarayıcıda doğrulandı. Yaşam döngüsü testi 10 aç/kapa, bozuk WebGL, import sırasında kapama, odak dönüşü ve kaynak temizliği kapsar. Sayısal 1.173 senaryo yeniden geçti. Önceki Python veri dönüşümü testi bu tur tekrarlanmadı, veri dosyaları değişmedi.

Kanıt: work/terrain-desktop-after.jpg ve work/terrain-mobile-after.jpg. Önceki “tarayıcı kullanılamadı” notları geçmiş test turlarına aittir. Fiziksel dokunmatik cihaz ve oyun içi isabet kalibrasyonu yapılmadı. Bina/ağaçlar daha sonra görsel 3B sahneye eklendi; balistik çarpışma modeli hâlâ yalnızca araziyi kullanır. Özel yerel önizleme korunur.

## Önceki tur: ek etkileşim testleri

Kullanıcının testleri yürütme talebi üzerine tarayıcı yeniden denendi: envanter boş; `createBrowserTab` “Browser is not available: iab” döndü. Kullanıcıdan izin beklenmiyor; bağlantı teknik olarak kullanılamıyor.

Yeni `work/test-terrain-lifecycle.mjs` gerçek arazi/panel/harita geçmişi kodunu DOM/Canvas test nesneleriyle çalıştırır. İkinci parmağın kalkmasının asıl sürüklemeyi kesmesi hatası önce testte yeniden üretildi, ardından yalnızca sürüklemeyi başlatan işaretçinin bitiş olayı kabul edilerek düzeltildi.

Başarılı ek kontroller: birincil parmak sahipliği, işaretçi yakalamanın kaybı, gerçek undo/redo geçmişi, bozuk içe aktarmada veri korunması, 3B modülü yüklenirken kapatma, art arda 10 modal aç/kapa, tekrar açmada tek pencere, yakınlaştırma/sıfırlama, kapanışta odak dönüşü, Canvas yokluğunda hata gösterme ve temiz kapanış, olay dinleyicisi ve çizim isteği temizliği. Etkilenen üç arazi test grubu da yeniden geçti. Toplam test dosyası sayısı 14 oldu; bu tur ilgisiz gruplar gereksiz yere tekrarlanmadı.

Güncel 3B modülünün sözdizimi, yerel sayfa ve modülün HTTP 200 yanıtı doğrulandı. Bu ek kontroller gerçek cihaz dokunma/görsel testi veya oyun içi isabet ölçümü değildir.

## Son kontrol: sade HUD ve sayısal kalibrasyon

Ana panel artık iki büyük değer (yön / mil), tek mesafe-süre satırı ve bir durum mesajı gösterir. Arazi kesiti, yükseklik ayarı ve hesap bilgileri kapalı açılır bölümlerdedir. Tek hat varken seçim kutusu görünmez. 3B'nin görünüm ayarları ayrıntı bölümüne alındı; dokunmatik kullanım için +/− düğmeleri eklendi. Harita görünümündeki renk/boyut/parlaklık ayarları ve hedef takibi açıklaması da kapalı ayrıntılara taşındı. Özellikler kaldırılmadı.

Düzeltilen hatalar:

- Tam teorik menzilde sıfır olması gereken diskriminant, kayan nokta yuvarlamasıyla negatif olabiliyor ve geçerli atış reddediliyordu. Yalnızca makine hassasiyeti kadar tolerans eklendi; menzil dışı atışlar hâlâ reddedilir.
- Havan/hedef yüksekliği ortak tarayıcı ayarıydı. Artık `annotation.mortar` içinde her hatta ayrı saklanır, JSON yedeğine dahil olur ve mevcut geri al geçmişini kullanır. Eski ortak ayar uygulanmaz; eski hatlar standart 1 m / 0 m ile açılır. Kullanıcının plan ve çizimleri silinmedi.
- Bozuk/sonsuz harita boyutları veri doğrulamasında reddedilir. Aynı noktada yön değeri yerine çizgi gösterilir. Santimetrenin altındaki sayısal farklar yanlış arazi kesişimi oluşturmaz.
- 3B'de işaretçi yakalama kaybı sürüklemeyi sonlandırır; ikinci işaretçi sürüklemeyi devralamaz. Kapanışta önceki düğmeye odak döner.

**13 test grubu başarılı.** Ek HTML kontrolünde etiketler, benzersiz ID'ler ve görünüm kontrollerinin korunması doğrulandı. Bütün JS dosyaları sözdizimi denetiminden geçti; güncel sayfa/CSS/JS yerel HTTP 200 döndü.

- Bağımsız ileri hareket entegrasyonu (0.01 sn adım): 1.173 mesafe/yükseklik senaryosu. Ters açı hesabı ile mesafe farkı en fazla 0.000114 m, süre farkı 0.00000162 sn. Bunlar aynı ideal fizik modelinin sayısal tutarlılığıdır; oyun isabet hassasiyeti değildir.
- Ekrandaki tam mil yuvarlaması aynı ideal modelde en fazla yaklaşık 1.28 m yatay sapma üretti. Oyun saçılımı, arazi örneklemesi ve sürüm farkları buna dahil değildir.
- Harju'nun 263.169 yükseklik örneği, indirilen özgün renk kodlu PNG ve ölçekle karşılaştırıldı; kayıttaki üç ondalık basamak nedeniyle en fazla 0.000500 m fark var. Kaynak arazinin güncel oyunla aynı olduğu oyun içinde doğrulanmadı.
- Hatta özel yükseklik, hat değiştirme, sınırlandırma, açık ayrıntıyı koruma, tam yedek ve geri dönüş testleri geçti; mevcut sekiz regresyon grubu yeniden geçti.

Gerçek tarayıcı envanteri hâlâ boş. Bu yüzden görsel/mobil/dokunmatik deneyimi doğrulanmış sayılmaz. Oyun içi atış kalibrasyonu yapılmadı. Otomatik testler DOM/Canvas/Leaflet yerine test nesneleri kullanıyor.

## Kullanım

Araçlar → **Havan / 3B** panelini aç. “Haritada havan hattı çiz” ile önce havanı sonra hedefi seç. Var olan havan çizimine tıklamak da bu paneli açar. Hatlar mevcut plan ve yedek sistemiyle saklanır; yeni çizilen hat hesap için otomatik seçilir. Hattın uçlarını Taşı aracında sürüklemek hesabı yeniler.

Standart Squad havanı için mesafe, yön, yükseklik farkı, yükseliş (mil), açı ve uçuş süresi gösterilir. Havan/hedef için zeminden yükseklik girilebilir. Yüksek açı çözümü açı ve menzil sınırlarını karşılamıyorsa sonuç verilmez. Örneklenen arazinin mermi eğrisiyle kesişmesi ayrıca belirtilir. Çözüm bulunmaması arazi kesitini kapatmaz.

3B arazi hat olmadan da açılabilir. Sürükleyerek/ok tuşlarıyla döndür, tekerlek veya +/− ile yakınlaş. Kamera sıfırlama, yükseklik vurgusu (1–5×), mevcut görünür kırmızı sınırlar ve varsa havan/hedef/eğri çizimi bulunur. Pencere Kapat veya Escape ile kapanır. Kapanışta çizim döngüsü ve olay dinleyicileri temizlenir.

## Veri ve kapsam

- 25 harita, 203 uyumlu layer. Belaya için kaynakta güncel yükseklik tanımı yok. Diğer 11 küçük/kırpılmış layerın ölçüleri ana haritadan farklı olduğu için hesap ve 3B kapalıdır. Böylece ana harita yüksekliği küçük layera yanlış yerleştirilmez.
- SquadCalc API / Squad SDK renk kodlu yükseklik PNG'leri, kaynakta tanımlı düşey ölçekle metreye çevrildi; 513×513 örnek saklandı. Manifest her haritanın kaynağını, özgün boyutunu, kapsamını ve yüksekliğini kaydeder. Yükseklik dosyaları sadece seçilen haritada istenir ve oturumda önbelleklenir. Uygulama dış API'ye veri göndermez.
- Veri yaklaşık 2.5–13.5 metre yatay örnek aralığına sahip. Aralarda bilinear enterpolasyon kullanılır. İnce arazi engelleri kaçabilir; balistik hesap bina, ağaç ve köprüleri kullanmaz. Kesitte düşey ölçek farklıdır. Yükseklik değerleri kaynak referansına göredir; deniz seviyesi iddiası yoktur.
- 3B, mevcut harita dokusunu 513×513 arazi yüzeyine işler. Görsel bina ve bitki sahnesi ayrıca yüklenir; serbest kamera vardır. Çizgiler okunabilirlik için yüzeyin önüne çizilir; bu çizimden görüş hattı veya bina çarpışması çıkarılmamalıdır.
- Bağımsız geliştirilen standart oyun havanı modeli: 110 m/s, 9.78 m/s² oyun yerçekimi, 45–88.875° yükseliş ve en az 51 m yatay menzil. Yalnızca yüksek açı; diğer silahlar/araç havanları dahil değildir. Oyun içi kalibrasyon yapılmadı.

## Kontroller

11 test grubu geçti: önceki 8 regresyon grubu; yeni model/veri/3B çizim testi; panelin eksik veri/uyumsuz layer/gecikmiş yanıt testi; gerçek uygulama + araçlar + arazi modüllerinin bağlantı testi.

Fizik testleri hesaplanan açının mermiyi hedef mesafe ve yüksekliğine ulaştırmasını, menzil dışını, arazi sırtında çarpışmayı ve sınır enterpolasyonunu kontrol eder. Tüm 25 yükseklik dosyası sayısal doğrulamadan geçer. 3B testleri projeksiyonun sonlu koordinat üretmesini ve dinleyici temizliğini kontrol eder. Uygulama testleri DOM/Canvas/Leaflet test nesneleri kullanır; gerçek tarayıcı testi değildir.

Harju sayfası, üç yeni JS modülü ve Harju/AlBasrah yükseklik dosyaları yerel sunucudan HTTP 200 döndü. Tarayıcı envanteri boş olduğu için görsel, mobil/dokunmatik ve gerçek GPU/cihaz performans kontrolü tamamlanamadı. Güncel ekran görüntüsü oluşturulmadı. Canlı siteye yayın yapılmadı.

## Kaynaklar

[SquadCalc](https://github.com/sh4rkman/SquadCalc), [yükseklik okuyucusu](https://github.com/sh4rkman/SquadCalc/blob/master/src/js/squadHeightmaps.js), [harita ölçekleri](https://github.com/sh4rkman/SquadCalc/blob/master/src/data/maps.js), [silah parametreleri](https://github.com/sh4rkman/SquadCalc/blob/master/src/data/weapons.js).

SquadCalc: Copyright (c) 2026 Maxime “sharkman” Boussard. Kaynak projenin lisans bildirimi `data/terrain/SQUADCALC-LICENSE.txt` içinde korunur. Oyun varlıkları Offworld Industries ve ilgili hak sahiplerine aittir. Bu teslim yerel, ticari olmayan önizleme içindir; gelecekte yayına alınması ayrıca değerlendirilmelidir. SquadCalc uygulama kodu kopyalanmadı; yükseklik varlıkları ve sayısal oyun verisi kaynak gösterilerek kullanıldı.

## 8 Ekim 2026 — genişletilmiş ateş desteği QA

Yeni fire-support.js bağımsız sabit hızlı oyun çözücüsü: 4 silah / 5 mühimmat profili, açı ve menzil denetimi, grid parser, yaklaşık saçılım. Her hattın silah ve açı ayarları normalize edilerek plan/yedek içinde korunur. Değişen yükseklik verisi yok.

15 JavaScript test dosyası geçti. Yeni test-fire-support.mjs: 145 silah/açı/yükseklik kombinasyonu, bağımsız 0,01 sn integrasyonunda en büyük uç nokta farkı 1,14e-10 m; grid alt kareleri, AA sütunu, sınır/hatalı giriş, eski plan varsayılanı, profil saklama ve saçılım geometri kontrolleri. Mevcut 1.173 havan senaryosu da geçti. Bu sayısal tutarlılıktır, oyun içi kalibrasyon değildir.

3B yaşam döngüsü testine oynat/duraklat, zaman seçimi, çarpışma sınırında durma, yeniden başlama, capture geometrisi, katman anahtarları, kamera odak/üstten/reset ve frame temizliği eklendi. Test nesneleri GPU yerine kullanılır; gerçek GPU ayrıca tarayıcıda görüldü.

Gerçek Harju tarayıcı akışı: D8-5 başlangıcı + G6-5/H6-5 ardışık hedefler, Grad alçak/yüksek, Hell Cannon menzil dışı, M121 yakın yüzey, önceki hatta dönünce 81 mm ayarının korunması, yenileme sonrası saklama, pano metni, 3B oynatma ve zaman çubuğu, odak/üstten/capture anahtarı. 390×844 ölçüm: açık modal genişliği 374,4 px; içerik scrollWidth 357 px. Konsol hata/uyarı listesi boş. Fiziksel dokunmatik/oyun içi ölçüm yapılmadı.

Düzeltilenler: async panel yüklenirken silah seçiminin yanlış hatta yazılabilmesi önlendi; eski harita alanı önizlemeleri temizlenir; konum değişimi silah/açıyı sıfırlamaz; capture poligonları 10 metrelik ara örneklerle araziyi takip eder; 3B başlık/kontroller küçük ekranda erişilebilir. Kanıt: work/terrain-playback-after.jpg ve work/terrain-playback-mobile.jpg. Ayrıntılı kapsam: SQUADCALC-REVIEW.md.

## 8 Ekim 2026 — bina, bitki, serbest kamera ve Grad doğrulaması

3B görünüm 25 haritada `data/scene` altındaki yerel SDK sahne dosyalarını seçilen haritada yükler. Bina geometrileri korunur; ağaç/çalı ve bazı yerleştirilmiş yapılar düşük poligon temsilleriyle aynı SDK dönüşümlerine yerleştirilir. Harju tarayıcı testinde 5.482 bina parçası, 906 temsili yapı ve 120.812 bitki yüklendi; Manicouagan sahne yüklemesi de gözlendi. Katmanlar ayrı açılıp kapandı. Serbest kamera harita sınırında ve arazi tabanında durdu; bulanıklaşınca basılı tuşlar temizlendi; mini harita konumu ve oyun karesi hareketle yenilendi.

Tüm 25 sahne paketi çevrimdışı okundu: 101 dosya / 482 MiB, toplam 1.422.030 bitki yerleşimi. İndeks, koordinat, matris ve dosya sınırları denetlendi. Anvil'deki 24 geçersiz matris ve Sanxian'daki bir geçersiz yapı parçası tüm sahneyi durdurmadan atlanır. Black Coast için yükseklik PNG'si ile SDK 3B referansı arasındaki 30,032 m sabit fark düzeltildi; ağaç yerleşimlerinin medyan zemin farkı 25 haritada yaklaşık sıfırlandı.

Grad'ın 1.223,2 m ve −1,2 m yükseklik farkı örneği SquadCalc'ta 18,31° / 6,4 sn, yerel bağımsız çözücüde 18,305° / 6,4 sn verdi. Yön+mesafe hedefi dört ana yönde, harita sınırı reddi ve 0/360° kısa dönüş hesabı test edildi. 1.000 m / 90° hedef ve 120° mevcut namlu yönünden “30,0° sola” çıktısı gerçek tarayıcıda doğrulandı.

Toplam 16 JavaScript test dosyası geçti. Renk modlarında işaret renklerinin koyu arka plana kontrastı en az 4,5:1; takım kare/elmasları, seçili/sıradaki etiketleri ve kesik çizgiler gerçek DOM stilleriyle kontrol edildi. Tarayıcı konsolunda hata/uyarı yoktu. Bina içi kamera çarpışması, ağaç/yapı üzerinden mermi çarpışması, fiziksel dokunmatik cihaz ve oyun içi isabet testi kapsam dışıdır.
