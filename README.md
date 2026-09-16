# Ventik — Backend

Ventik adalah platform website jual beli tiket yang dibuat untuk mempermudah pengguna dalam mencari dan membeli tiket berbagai kegiatan atau acara yang diselenggarakan secara terbuka.

Beberapa jenis kegiatan yang dapat tersedia di Ventik antara lain:

* Konser
* Seminar
* Workshop
* Pertunjukan
* Event komunitas
* Kegiatan umum lainnya

Repository ini berisi **backend dari aplikasi Ventik** yang bertanggung jawab dalam mengelola data, autentikasi pengguna, transaksi tiket, serta komunikasi antara database dan frontend.

---

##Tentang Project

Ventik dikembangkan sebagai sebuah sistem yang dapat membantu proses pembelian tiket secara digital.

Melalui Ventik, pengguna dapat melihat berbagai event yang tersedia, memperoleh informasi mengenai event, memilih tiket yang diinginkan, dan melakukan proses pembelian.

Pada sisi backend, sistem menangani berbagai proses utama seperti:

* Manajemen pengguna
* Autentikasi dan otorisasi
* Manajemen event
* Manajemen kategori event
* Manajemen tiket
* Pengelolaan stok tiket
* Pemesanan tiket
* Pengelolaan transaksi
* Validasi data
* Penyimpanan data ke database
* Penyediaan REST API untuk frontend

---

##Tujuan

Ventik dibuat dengan tujuan untuk:

1. Mempermudah pengguna dalam menemukan event dan tiket yang tersedia.
2. Mempermudah proses pembelian tiket secara online.
3. Membantu penyelenggara dalam mengelola event dan tiket.
4. Menyediakan sistem backend yang terstruktur untuk mendukung proses jual beli tiket.
5. Menghubungkan frontend dengan database melalui API.

---

##Arsitektur Sistem

Secara umum, sistem Ventik terdiri dari beberapa komponen:

```text
┌───────────────┐
│    Frontend   │
│   Ventik Web  │
└───────┬───────┘
        │
        │ HTTP Request
        ▼
┌───────────────┐
│    Backend    │
│   Ventik API  │
└───────┬───────┘
        │
        │ Query / Transaction
        ▼
┌───────────────┐
│    Database   │
└───────────────┘
```

Backend berperan sebagai penghubung antara frontend dan database serta menangani seluruh business logic yang dibutuhkan oleh aplikasi.

---

##Fitur Backend

### 1. Authentication

Backend menyediakan sistem autentikasi untuk pengguna.

Fitur yang dapat digunakan antara lain:

* Registrasi akun
* Login
* Logout
* Validasi kredensial
* Pengelolaan session/token
* Proteksi endpoint tertentu

---

### 2. User Management

Sistem dapat mengelola data pengguna yang terdaftar di Ventik.

Data pengguna dapat mencakup:

* Nama
* Email
* Password yang telah diamankan
* Role pengguna
* Informasi akun lainnya

Role pengguna dapat dibedakan berdasarkan kebutuhan sistem, misalnya:

```text
USER
ADMIN
```

---

### 3. Event Management

Backend menyediakan pengelolaan data event.

Informasi event dapat mencakup:

* Nama event
* Deskripsi
* Lokasi
* Tanggal event
* Waktu event
* Poster/banner
* Kategori
* Informasi penyelenggara

---

### 4. Ticket Management

Setiap event dapat memiliki satu atau beberapa jenis tiket.

Contohnya:

```text
Event: Music Festival 2026

- Regular   : Rp100.000
- VIP       : Rp250.000
- VVIP      : Rp500.000
```

Backend bertanggung jawab untuk mengelola:

* Jenis tiket
* Harga tiket
* Jumlah tiket
* Stok tiket
* Status ketersediaan tiket

---

### 5. Ticket Purchase

Pengguna dapat melakukan pembelian tiket melalui sistem.

Alur sederhananya:

```text
User
  │
  ▼
Memilih Event
  │
  ▼
Memilih Jenis Tiket
  │
  ▼
Menentukan Jumlah
  │
  ▼
Membuat Pesanan
  │
  ▼
Melakukan Pembayaran
  │
  ▼
Pesanan Berhasil
  │
  ▼
Mendapatkan Tiket
```

Backend memastikan proses tersebut dilakukan dengan validasi dan aturan bisnis yang sesuai.

---

### 6. Order & Transaction

Backend menangani data pesanan dan transaksi pengguna.

Informasi transaksi dapat meliputi:

* ID transaksi
* User
* Event
* Tiket
* Jumlah tiket
* Total harga
* Status pembayaran
* Waktu transaksi

Contoh status transaksi:

```text
PENDING
PAID
CANCELLED
EXPIRED
```

---

## 🔌 API

Backend Ventik menyediakan API yang digunakan oleh frontend untuk berkomunikasi dengan server.

Contoh endpoint:

| Method   | Endpoint             | Deskripsi                   |
| -------- | -------------------- | --------------------------- |
| `POST`   | `/api/auth/register` | Registrasi pengguna         |
| `POST`   | `/api/auth/login`    | Login pengguna              |
| `GET`    | `/api/events`        | Mendapatkan daftar event    |
| `GET`    | `/api/events/:id`    | Mendapatkan detail event    |
| `POST`   | `/api/events`        | Membuat event               |
| `PUT`    | `/api/events/:id`    | Mengubah event              |
| `DELETE` | `/api/events/:id`    | Menghapus event             |
| `GET`    | `/api/tickets`       | Mendapatkan data tiket      |
| `POST`   | `/api/orders`        | Membuat pesanan             |
| `GET`    | `/api/orders`        | Mendapatkan riwayat pesanan |
| `GET`    | `/api/orders/:id`    | Mendapatkan detail pesanan  |

> Endpoint di atas merupakan contoh struktur API dan dapat disesuaikan dengan implementasi backend Ventik.

---

##Gambaran Data

Relasi data pada sistem secara umum dapat digambarkan sebagai berikut:

```text
User
 │
 ├──────────────┐
 │              │
 ▼              ▼
Order          Event
 │              │
 │              │
 ▼              ▼
Ticket ◄────── Ticket
```

Contoh entitas utama:

```text
User
├── id
├── name
├── email
├── password
└── role

Event
├── id
├── name
├── description
├── location
├── date
└── category_id

Ticket
├── id
├── event_id
├── name
├── price
└── stock

Order
├── id
├── user_id
├── ticket_id
├── quantity
├── total_price
└── status
```

Struktur tersebut dapat berbeda sesuai dengan rancangan database yang digunakan pada implementasi sebenarnya.

---

## Teknologi

Teknologi yang digunakan pada backend Ventik:

* Backend: Nest.JS
* Programming Language: TypeScript
* Database: MYSQL
* Authentication: JWT
* API: REST API
* Tools: Git & GitHub



## Security

Backend Ventik menerapkan beberapa mekanisme untuk menjaga keamanan aplikasi, seperti:

* Password tidak disimpan dalam bentuk plaintext.
* Endpoint tertentu membutuhkan autentikasi.
* Validasi input dari client.
* Penggunaan environment variable untuk konfigurasi sensitif.
* Pembatasan akses berdasarkan role pengguna.
* Validasi data sebelum diproses ke database.

---

## Backend Developer

Pada project ini, saya berperan dalam pengembangan **bagian backend Ventik**.

Tanggung jawab utama meliputi:

* Merancang dan mengembangkan REST API.
* Membuat logic untuk autentikasi pengguna.
* Mengembangkan sistem pengelolaan event.
* Mengembangkan sistem tiket.
* Mengembangkan proses pemesanan tiket.
* Mengelola transaksi dan data pengguna.
* Menghubungkan backend dengan database.
* Melakukan validasi request dan response.
* Mengintegrasikan backend dengan frontend.

---
## License

Project ini dibuat untuk keperluan pembelajaran dan pengembangan website.

---
