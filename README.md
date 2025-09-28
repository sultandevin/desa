# Village Administration Website

Website terbaik untuk mata kuliah Projek Rekayasa Perangkat Lunak (PRPL) di Universitas Gadjah Mada.

Sebelum mulai, baca panduan development [di sini](./docs/development.md).

## 🚀 Modules

- Inventaris dan Kekayaan (Kelompok 2)
- Peraturan Desa (Kelompok 7)
- Keputusan Kepala Desa (Kelompok 8)

## 🛠️ Tech Stack

- NextJS 15 (Typescript)
- Tailwind
- shadcn/ui
- Better Auth
- Drizzle ORM
- PostgreSQL 16

## ⚡ User Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    participant ObjectStorage

    Note over User, ObjectStorage: Contoh Alur 1: Menambahkan Aset Baru (Modul Inventaris)

    User->>Frontend: Mengisi & submit form aset baru
    Frontend->>Backend: POST /api/assets (dengan data aset)
    activate Backend
    Backend->>Database: INSERT INTO ASSETS (...)
    activate Database
    Database-->>Backend: Sukses
    deactivate Database
    Backend-->>Frontend: Response: 201 Created
    deactivate Backend
    Frontend-->>User: Tampilkan notifikasi "Aset Berhasil Disimpan"

    %% Spasi untuk memisahkan alur
    rect rgb(240, 240, 240)
        Note over User, ObjectStorage: Contoh Alur 2: Mengunggah Peraturan Desa (Modul Peraturan)
    end


    User->>Frontend: Mengisi form & memilih file peraturan
    Frontend->>Backend: POST /api/peraturan (dengan metadata + file)
    activate Backend

    Backend->>ObjectStorage: Upload file
    activate ObjectStorage
    ObjectStorage-->>Backend: Kembalikan URL file
    deactivate ObjectStorage

    Backend->>Database: INSERT INTO PERATURAN (metadata, file_url)
    activate Database
    Database-->>Backend: Sukses
    deactivate Database

    Backend-->>Frontend: Response: 201 Created
    deactivate Backend
    Frontend-->>User: Tampilkan notifikasi "Peraturan Berhasil Diunggah"
```

## 👥 Contributors

<a href="https://github.com/sultandevin/desa/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=sultandevin/desa" />
</a>



