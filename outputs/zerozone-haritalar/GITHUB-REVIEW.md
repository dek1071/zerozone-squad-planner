# GitHub kaynak incelemesi — 9 Ekim 2026

## SquadMaps

[Resmi mahtoid/SquadMaps deposu](https://github.com/mahtoid/SquadMaps) topluluk, çeviri, sorun ve sürüm notları için kullanılıyor. README, güncel web uygulamasının kaynak kodunun kapalı olduğunu belirtiyor. Depodaki lisans bütün canlı uygulamanın açık kaynak olduğu anlamına gelmiyor.

Canlı sitenin yapılandırılmış inşa verisindeki HAB_NATO bedeli 100 olarak geliyor. Bu değeri aynen aktarmak bizim iki panelimizde de yanlış sonuca yol açıyordu. Ortak maliyet çözümleyicimiz doğrulanan düzeltmeleri uygular; ham veri kaynak denetimi için korunur. Ayrıntılar: [CONSTRUCTION-AUDIT.md](CONSTRUCTION-AUDIT.md).

## SquadCalc

[sh4rkman/SquadCalc](https://github.com/sh4rkman/SquadCalc) gerçek uygulama kaynaklarını içeriyor. İncelenen sürüm: `24828d6d3081c7ce52b10ef39ec86036ebf010b5`.

[3B kaynak dosyası](https://github.com/sh4rkman/SquadCalc/blob/24828d6d3081c7ce52b10ef39ec86036ebf010b5/src/js/squad3DSimulation.js) doku yükleme/değiştirme, nesne kaynaklarını temizleme ve kamera/miniharita davranışı için incelendi. İncelenen `_setTexture` metodunda son istek denetimi bulunmuyor; bizim bağımsız uygulamamızda bu koruma tutuldu ve eski isteğin geç hatasının yeni dokuya hata mesajı yazması ayrıca düzeltildi. Mini haritanın navigasyon dokusunu sabit tutma yaklaşımı değerlendirildi. Bu tur SquadCalc uygulama kodu kopyalanmadı.

## Topluluk harita verisi

[aachtenberg/squadmaps-v2](https://github.com/aachtenberg/squadmaps-v2) deposunun `8d614dd5d368e5125271777d3698bdc8b68aee75` sürümü de incelendi. [Veri dosyası](https://github.com/aachtenberg/squadmaps-v2/blob/8d614dd5d368e5125271777d3698bdc8b68aee75/data/v10_data.json) 218 layer içeriyor; harita geometrisi ve takım/araç bilgileri var, bağımsız bir inşa maliyeti tablosu yok. Bu nedenle cons fiyatlarına kanıt olarak kullanılmadı ve mevcut 222 layer verisinin üzerine yazılmadı.

## Açık kalan sınırlar

- Her inşa gerecinin güncel SDK bedeli bağımsız olarak doğrulanmış değil. Yalnızca kaynakla desteklenen düzeltmeler uygulandı; diğerleri kaynak snapshot değerlerini kullanıyor.
- Bina ve ağaçlar görünür, fakat görüş/balistik engel hesabı zemine dayanıyor.
- Oyun içi isabet kalibrasyonu, canlı maç/ortak oturum ve gerçek hesap bağlantısı henüz yok.
- Renk desteği bütün arayüze yayıldı; farklı renk algılarına sahip oyuncularla kullanılabilirlik denemesi ayrıca yapılmalı.
