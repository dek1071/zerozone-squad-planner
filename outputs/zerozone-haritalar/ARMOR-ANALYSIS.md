# Zırh analizi — kaynaklar ve doğrulama

10 Ekim 2026. Harita başlığındaki **Zırh analizi** bağlantısı ayrı sekmede açılır. Doğrudan adres: `/zirh` veya `armor.html`.

## Kullanım

Hedef aracı ve varyantını, ateş eden aracı, mühimmatı ve mesafeyi seçin. Modeli sürükleyerek döndürün, tekerlekle yakınlaşın, atış noktasına tıklayın. Klavyede ok tuşları kamerayı çevirir; Enter/Space merkezden ateş eder. Ön, yan, arka, üst ve sığdır düğmeleri hazır kamera yönleridir.

Mermi kamerası, yavaşlatılmış iz üzerinde ilerler. Tekrar oynatma, duraklatma ve sürgü ile katmanları inceleyebilirsiniz. Görünüm ve erişilebilirlik bölümünde saydam zırh, dört renk desteği, animasyonu azaltma ve tekrar hızı bulunur. Sonuç tablosu renk olmadan da sıra, simge ve yazıyla okunur. Araç/mühimmat/mesafe değişince önceki atış temizlenir. Harita planları değiştirilmez.

## Veri kapsamı ve kaynaklar

- [Squad Armor](https://squad-armor.com/) v10.6.0: 233 araç adı, 470 varyant, 5.462 zırh geometrisi parçası ve 25 delme eğrisi. Kaynak, verilerini oyun dosyalarından çıkardığını belirtir. Bu bir üçüncü taraf çıkarımıdır.
- [Kaynak veri dosyası](https://squad-armor.com/assets/Game_vehicles-BCHYWPMk.json): mühimmat parametreleri ve eğriler. Katalog, kaynak SHA-256 değerini saklar.
- Modellerin `https://squad-armor.com/vehicles/<rawName>.glb` adreslerindeki **Armor** geometrileri, bileşen bilgileri ve zırh malzemeleri kullanılır. Her dosyanın kaynak ve dönüşüm hash'i `data/armor/catalog.json` içindedir. Dış kaplama dokuları yerine zırh çarpışma geometrisi gösterilir; fotoğraf gerçek araç görünümünü ayrıca tanıtır.
- [War Thunder koruma analizi](https://warthunder.com/en/news/5569-development-protection-analysis-en/1000): hedef/atıcı/mühimmat/mesafe seçimi ve iç bileşenleri izleme sunumuna esin verir. War Thunder kodu, modeli, sesi veya hasar parametreleri kullanılmaz.
- [Offworld 10.6 sürüm notları](https://www.joinsquad.com/updates/squad-10-6-release-notes): sürüm ve oyun/SDK ayrımı için birincil referans. Notlar tüm zırh kalınlıklarını veya delme formülünü yayımlamaz.

Üç kaynak model adresi geçerli GLB döndürmedi: `BP_MATV` (M-ATV M2), `BP_BFV` (M2A3), `BP_MI8` (Mi-8MTV-5). İlk ikisinin mevcut Woodland varyantları ayrı kimlikle seçilebilir; eksik modelin yerine sessizce başka geometri atanmaz. Liste `catalog.unavailable` içindedir.

## Kurulu özgün Squad dosyalarıyla karşılaştırma

Bilgisayardaki Steam Squad kurulumu bulundu; Steam build kimliği **25763409**. Oyunun kendi `Manifest_UFSFiles_Win64.txt` dosyasındaki asset adlarıyla **471/473 araç kimliği ve 25/25 eğri adı** eşleşti. `BP_Loach_CAS_Large` ve `BP_Loach_CAS_SingleLarge` bu manifestte bulunmadı; kaynak kataloğunda kaldılar ancak kurulu oyunla eşleşmiş sayılmazlar. Bu sonuç bir asset kimliği kontrolüdür; paketlerdeki sayısal değerleri veya geometrileri çözümleyerek doğrulama değildir.

Epic kurulum kayıtlarında Squad SDK bulunmadı. Mevcut `UE_5.8` klasörü yalnızca kurulum metadata klasörü içeriyor; kullanılabilir UnrealPak/SDK editörü saptanmadı. Oyun paketlerine, oyuna veya anti-cheat dosyalarına yazılmadı. Kişisel kurulum yolları yayımlanan rapora alınmadı.

`data/armor/installed-game-audit.json` manifest hash'i ve kimlik bazında sonuçları içerir. Aynı kontrol `node work/audit-installed-armor.cjs "Squad kurulum klasörü"` ile yeniden yapılabilir. SDK'dan çıkarılmış yeni sayısal veriler gelene kadar değer kaynağı Squad Armor olarak kalır.

## Hesap

1. Ekranda seçilen noktadan gerçek zırh üçgenlerine ışın gönderilir. Dünya dönüşümündeki yüzey normali, geliş açısını belirler.
2. Kaynak eğrileri 50 m aralıkla örneklenmiştir; ara mesafeler doğrusal enterpolasyonla hesaplanır. Sabit delmeli mühimmat kendi sabit değerini kullanır.
3. Delmeye katılan plakanın etkili kalınlığı, kalınlığın geliş açısı kosinüsüne bölümüdür. Maliyet katmanlar boyunca birikir.
4. Delme sonrası iz sınırı varsa, ilk temastan ilerledikçe kullanılabilir delme doğrusal azalır. İlk durdurucu yüzey veya ilerleme sınırı animasyonu durdurur. Tam eşitlik geçiş sayılmaz.
5. Kaynak görüntüleyicinin ilk gövde/bağlı kule ve aralıklı zırh kuralları uygulanır; yinelenen yüzeyler ve çıkış yüzleri tekrar hesaplanmaz. Motor ve mühimmat teması ayrıca belirtilir.

## Sınırlar

Bu bir oyun eğitim yaklaşımıdır; Squad motorunun yeniden uygulaması değildir. Kule, kaynak modeldeki sabit pozundadır. Sekme, saçılan parçalar, patlama hasarı, mürettebat yaralanması, bileşen HP'si, hasar çarpanları, yangın/cook-off, balistik düşüş ve gerçek uçuş süresi hesaplanmaz. Bileşene ulaşılması kesin imha anlamına gelmez. Yavaşlatılmış kamera gerçek zamanlı mermi fiziği değildir. Veri snapshot'ı daha yeni oyun sürümlerinden farklılaşabilir.

## Test kanıtı

- `work/test-armor.mjs`: 470 modelin hash, koordinat, indeks ve ölçü doğrulaması; 2.820 gerçek üçgen ışını / 2.777 temas; eğriler, kritik açılar, eşitlik, katman sırası, geçilemez yüzey ve iz sınırı testleri.
- `work/test-armor-app.mjs`: uygulama akışları; hızlı seçimde eski istek iptali, yükleme hatasından kurtulma, model/atış temizliği, geçersiz mesafe, sürgü, hareket azaltma, renk modu ve kaynakların serbest bırakılması. DOM/WebGL test ikameleri kullanır; gerçek tarayıcı testi yerine sayılmaz.
- Gerçek tarayıcıda M1A2 ve T-72B3 yükleme/atış, kamera yönleri, HEAT seçimi, tekrar/sürgü, renksiz mod ve boş mesafe kontrolü yapıldı. Ön/arka yön eşleşmesi ve saydam zırhın örttüğü mermi işaretleri düzeltildi. 390 px dar ekran kontrolünde sayfa yatay taşmadı; tablo kendi içinde kayar.
- Kaynak M1A2 arayüzünde AP 800 mm başlangıç / 50 m iz, HEAT 400 mm / 2 m iz değerleri yerel parametrelerle karşılaştırıldı.
- Tüm 25 test dosyası geçti. Otomasyon, tüm araçların her atış noktasını ve oyun içi isabetini garanti etmez.

Three.js/OrbitControls r180 MIT lisansı `assets/vendor/THREE-LICENSE.txt` içindedir. Squad varlıkları ve kaynak verileri üzerindeki haklar ilgili hak sahiplerinindir; kaynak belirtmek ek dağıtım/ticari kullanım izni değildir.
