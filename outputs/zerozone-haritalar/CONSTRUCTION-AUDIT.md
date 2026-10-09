# İnşa maliyeti denetimi — 9 Ekim 2026

Takımlar altındaki liste ve İnşa yük planı, `planning-model.js` içindeki `constructionFor` fonksiyonunu kullanır. Ham `data/units.json` kaynak anlık görüntüsü korunur; düzeltmeler açıkça uygulanır.

## Düzeltilenler

- `HAB_NATO`: kaynakta 100; standart HAB değeri 500 cons. MEI / IMF HAB'ları 100 cons kalır. Birlik başına HAB adedi mevcut deployable availability verisinden alınır; destek birliğinde fazla HAB hakkı maliyeti düşürmez.
- MEI / IMF `Wall_Sandbag`, `Wall_Sandbag_MurderHole`: paylaşılan kaynak nesnesi 25; düzensiz kuvvet karşılığı 10 cons. Diğer birlikler 25.
- Satırda birim maliyet, adet ve toplam ayrı gösterilir. Kesin yapı maliyeti ile 100'e yuvarlanmış önerilen araç inşa yükü farklıdır. Aradaki fark inşa yedeği; kalan araç kapasitesi mühimmat için ayrılabilecek yerdir. Canlı yük okunmaz.
- HAB içindeki 10.6 mühimmat kutusu ek ücretli bir plan satırı değildir. Kullanıcının eklediği ayrı Ammo Crate 100 cons olarak hesaplanır.

## Kaynaklar ve sınırlar

- [Offworld 4.5 maliyet değişiklikleri](https://www.joinsquad.com/archive/squad-update-v4-5-release-notes): standart HMG 150, HMG bunker 200, HESCO 50/150; düzensiz kuvvet kum torbası duvarları 10. Eski wiki tablolarındaki HMG 200/350 değerleriyle geri alınmadı.
- [Squad Wiki deployables](https://squad.wiki.gg/wiki/Deployables): standart HAB 500, IMF/INS 100. Tablodaki bazı diğer değerler eski olduğu için topluca içeri aktarılmadı.
- [Offworld 10.6](https://www.joinsquad.com/updates/squad-10-6-release-notes), [10.6.1](https://www.joinsquad.com/updates/squad-10-6-1-release-notes): HAB içine dahil mühimmat kutusu.
- SquadMaps kaynağı 9 Ekim'de tekrar incelendi; HAB_NATO 100 değeri kaynağın kendisinde de mevcut. Bu yüzden yeniden veri hazırlamak düzeltmeyi silmez.

Diğer girdiler kaynak değerlerini korur. Bu denetim her deployable'ın güncel SDK değeriyle doğrulandığı anlamına gelmez. Sunucu modları farklı maliyet kullanabilir.
