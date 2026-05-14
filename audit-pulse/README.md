# 🚀 AuditPulse

**AuditPulse**, projenizin hem Frontend (SEO, Erişilebilirlik) hem de Backend (Güvenlik, Kod Kalitesi) sağlığını saniyeler içinde analiz eden profesyonel bir CLI aracıdır.

## ✨ Özellikler

-   **Frontend Audit:** Meta etiketleri, başlık hiyerarşisi ve eksik `alt` öznitelikleri denetimi.
-   **SEO Audit:** Arama motoru optimizasyonu için kritik etiketlerin kontrolü.
-   **Security Audit:** Kod içindeki gizli şifrelerin (Hardcoded Secrets), API anahtarlarının ve güvensiz fonksiyonların (örn: `gets()`) tespiti.
-   **Backend Audit:** `.gitignore` dosyası denetimi, bare except kullanımı ve proje yapısı kontrolleri.
-   **Beautiful Output:** `rich` kütüphanesi ile renkli ve profesyonel terminal raporları.

## 📦 Kurulum

Proje dizininde aşağıdaki komutu çalıştırarak aracı sisteminize kurabilirsiniz:

```bash
pip install .
```

## 🛠 Kullanım

Kurulumdan sonra projenizin olduğu dizinde şu komutu çalıştırmanız yeterlidir:

```bash
audit-pulse .
```

Belirli bir klasörü taramak isterseniz:

```bash
audit-pulse /proje/klasoru/yolu
```

## 🔍 Denetlenen Maddeler

-   **Frontend:** `<img>` alt etiketleri, `<title>` etiketi, `<meta description>`.
-   **Backend:** `.env` ve `node_modules` dosyalarının gitignore durumu.
-   **Güvenlik:** Sert kodlanmış şifreler, API anahtarları, güvensiz C fonksiyonları.
-   **Kod Kalitesi:** Python için bare except kullanımı, eksik `.gitignore` dosyası.
