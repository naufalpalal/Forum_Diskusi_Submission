# 💬 Forum Diskusi

Aplikasi forum diskusi berbasis web yang dibangun menggunakan **React** dan **Redux Toolkit**, memanfaatkan [Dicoding Forum API](https://forum-api.dicoding.dev/v1).

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Teknologi](#-teknologi)
- [Struktur Proyek](#-struktur-proyek)
- [Instalasi & Menjalankan](#-instalasi--menjalankan)
- [Skrip yang Tersedia](#-skrip-yang-tersedia)
- [Arsitektur State Management](#-arsitektur-state-management)
- [Halaman & Rute](#-halaman--rute)
- [Kriteria Pemenuhan](#-kriteria-pemenuhan)

---

## ✨ Fitur

### Wajib
- 🔐 **Register & Login** — Autentikasi akun pengguna
- 📋 **Daftar Thread** — Menampilkan semua thread beserta judul, preview isi, waktu, jumlah komentar, dan info pembuat
- 🗂️ **Detail Thread** — Menampilkan konten lengkap thread beserta seluruh komentar
- ✏️ **Buat Thread** — Pengguna terotentikasi dapat membuat thread baru dengan judul, isi, dan kategori
- 💬 **Buat Komentar** — Pengguna terotentikasi dapat berkomentar di dalam thread
- ⏳ **Loading Indicator** — Tampil saat memuat data dari API

### Unggul (Saran)
- 👍👎 **Vote Thread & Komentar** — Upvote / downvote dengan **Optimistic UI** (tampilan langsung update tanpa menunggu API)
- 🏆 **Leaderboard** — Halaman peringkat pengguna berdasarkan skor aktivitas
- 🔖 **Filter Kategori** — Filter daftar thread berdasarkan kategori, diproses murni di sisi frontend

---

## 🛠️ Teknologi

| Teknologi | Keterangan |
|---|---|
| [React 19](https://react.dev/) | Library UI utama |
| [Redux Toolkit](https://redux-toolkit.js.org/) | State management |
| [React Redux](https://react-redux.js.org/) | Integrasi React dengan Redux |
| [React Router DOM v7](https://reactrouter.com/) | Client-side routing |
| [date-fns](https://date-fns.org/) | Format tanggal & waktu |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [ESLint](https://eslint.org/) + [Airbnb Style Guide](https://github.com/airbnb/javascript) | Linter & code convention |

---

## 📁 Struktur Proyek

```
forum-diskusi/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/               # Komponen UI reusable
│   │   ├── CommentItem.jsx       # Item komentar dengan vote
│   │   ├── LoadingSpinner.jsx    # Indikator loading
│   │   ├── Navbar.jsx            # Navigasi utama
│   │   ├── ThreadCard.jsx        # Kartu thread di halaman list
│   │   └── VoteButtons.jsx       # Tombol upvote / downvote
│   ├── pages/                    # Halaman aplikasi
│   │   ├── HomePage.jsx          # Daftar thread + filter kategori
│   │   ├── LeaderboardPage.jsx   # Halaman leaderboard
│   │   ├── LoginPage.jsx         # Halaman login
│   │   ├── NewThreadPage.jsx     # Halaman buat thread baru
│   │   ├── RegisterPage.jsx      # Halaman register
│   │   └── ThreadDetailPage.jsx  # Detail thread + komentar
│   ├── store/                    # Redux state management
│   │   ├── authSlice.js          # State autentikasi pengguna
│   │   ├── leaderboardSlice.js   # State leaderboard
│   │   ├── threadDetailSlice.js  # State detail thread & komentar
│   │   ├── threadsSlice.js       # State daftar thread
│   │   └── index.js              # Konfigurasi Redux store
│   ├── utils/
│   │   └── api.js                # Semua fungsi pemanggilan API
│   ├── App.jsx                   # Root komponen & routing
│   ├── index.css                 # Global styles
│   └── main.jsx                  # Entry point (StrictMode + Provider)
├── .eslintrc.cjs                 # Konfigurasi ESLint (Airbnb)
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## 🚀 Instalasi & Menjalankan

### Prasyarat
- **Node.js** versi 18 atau lebih baru
- **npm** versi 8 atau lebih baru

### Langkah Instalasi

1. Clone repository ini
   ```bash
   git clone <url-repository>
   cd forum-diskusi
   ```

2. Install dependensi
   ```bash
   npm install
   ```

3. Jalankan development server
   ```bash
   npm run dev
   ```

4. Buka browser dan akses `http://localhost:5173`

---

## 📜 Skrip yang Tersedia

| Skrip | Perintah | Keterangan |
|---|---|---|
| Development | `npm run dev` | Menjalankan dev server dengan HMR |
| Build | `npm run build` | Build untuk produksi ke folder `dist/` |
| Preview | `npm run preview` | Preview hasil build produksi |
| Lint | `npm run lint` | Menjalankan ESLint pada seluruh source code |

---

## 🏗️ Arsitektur State Management

Seluruh state yang bersumber dari API dikelola di **Redux Store** dengan 4 slice:

```
Redux Store
├── auth            → Data user yang sedang login, status loading & error
├── threads         → Daftar semua thread, daftar users, filter kategori
├── threadDetail    → Detail thread yang sedang dibuka beserta komentar
└── leaderboard     → Data peringkat leaderboard
```

**Alur data:**
```
Komponen → dispatch(thunk) → API call (utils/api.js) → update Store → Komponen re-render
```

> Tidak ada pemanggilan REST API langsung di dalam komponen. Semua API call dilakukan melalui Redux Thunk di masing-masing slice, dan fungsi API terpusat di `src/utils/api.js`.

**Optimistic UI pada Vote:**
Ketika pengguna menekan tombol vote, state Redux diperbarui *sebelum* respons API datang menggunakan `optimisticVoteThread` / `optimisticVoteComment`. Hal ini membuat pengalaman pengguna terasa instan.

---

## 🗺️ Halaman & Rute

| Rute | Halaman | Akses |
|---|---|---|
| `/` | Daftar Thread | Publik |
| `/login` | Login | Publik |
| `/register` | Register | Publik |
| `/threads/new` | Buat Thread Baru | Harus Login |
| `/threads/:threadId` | Detail Thread | Publik |
| `/leaderboard` | Leaderboard | Publik |

---

## ✅ Kriteria Pemenuhan

### Kriteria Utama 1 — Fungsionalitas

| Kriteria | Status |
|---|---|
| Terdapat cara untuk mendaftar akun | ✅ |
| Terdapat cara untuk login akun | ✅ |
| Menampilkan daftar thread (judul, body, waktu, jumlah komentar, pembuat) | ✅ |
| Detail thread beserta komentar | ✅ |
| Pengguna dapat membuat thread | ✅ |
| Pengguna dapat membuat komentar | ✅ |
| Loading indicator saat memuat data | ✅ |

### Kriteria Utama 2 — Bugs Highlighting

| Kriteria | Status |
|---|---|
| Menggunakan ESLint | ✅ `.eslintrc.cjs` |
| Menerapkan Airbnb JavaScript Style Guide | ✅ |
| Tidak ada error ESLint | ✅ 0 error |
| Menggunakan React Strict Mode | ✅ `main.jsx` |

### Kriteria Utama 3 — Arsitektur Aplikasi

| Kriteria | Status |
|---|---|
| State aplikasi disimpan di Redux Store | ✅ |
| Tidak ada API call di lifecycle/efek komponen | ✅ |
| Kode UI dan State dipisah di folder berbeda | ✅ `pages/` & `components/` vs `store/` |
| React component modular dan reusable | ✅ |

### Saran (Nilai Unggul)

| Saran | Status |
|---|---|
| Fitur vote thread & komentar | ✅ |
| Indikasi visual tombol yang sudah di-vote | ✅ |
| Optimistic Apply Actions pada vote | ✅ |
| Menampilkan jumlah votes | ✅ |
| Halaman Leaderboard | ✅ |
| Filter daftar thread berdasarkan kategori | ✅ |

---

## 📡 API Reference

Aplikasi ini menggunakan **Dicoding Forum API**:
- Base URL: `https://forum-api.dicoding.dev/v1`
- Dokumentasi: [https://forum-api.dicoding.dev/](https://forum-api.dicoding.dev/)
