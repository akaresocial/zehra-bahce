# Zehra'nın Sihirli Bahçesi 🌷🐰

6 yaşında çocuklar için matematik öğreten PWA oyunu — toplama ve çıkarma alıştırmaları, bahçe büyütme mekaniği, Pıtırcık öğretmen ile öğretici akış.

## Özellikler

- **30 bölüm** (5 bölge × 6 bölüm), kademeli zorluk
- 4 farklı oyun tipi: klasik, sürükle-bırak, balon patlatma, eşleştirme
- Pıtırcık öğretmen modu (toplama, çıkarma, karışık konsept tanıtımı)
- Yanlış cevapta pedagojik animasyonlu anlatım
- Etkileşimli kawaii bahçe (tohum → filiz → çiçek)
- Dolap (kıyafet giydirme), Hayvanlar (sevme + isim verme) koleksiyon ekranları
- Anne–baba paneli (gizli, logoya 1.5sn basılı tut)
- Haftalık ilerleme grafiği
- PWA: offline çalışır, ana ekrana eklenir

## Çalıştırma

Tarayıcıda `index.html`'i bir HTTP sunucudan aç:

```bash
python3 -m http.server 4173
# veya
npx serve .
```

## Teknoloji

- HTML5 + CSS3 + Vanilla JavaScript (framework yok)
- Service Worker (cache-first, offline)
- Web Audio API (sesler ve müzik)
- localStorage (`zehra_bahce_v1` anahtarıyla durum)
