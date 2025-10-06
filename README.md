# Village Administration Website

Website terbaik untuk mata kuliah Projek Rekayasa Perangkat Lunak (PRPL) di Universitas Gadjah Mada.

Sebelum mulai, **wajib** baca panduan development [di sini](./docs/development.md).

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

## 📝 Commit Convention

We follow a [standardized commit message](https://conventionalcommits.org) format to maintain a clean and informative git history. Each commit message should be structured as follows:

```
<type>(<scope>): <subject>
```

### Types:

-   **feat**: A new feature
-   **fix**: A bug fix
-   **build**: Changes to libraries, etc
-   **docs**: Documentation changes
-   **refactor**: Code changes that neither fix a bug nor add a feature
-   **perf**: Changes that improve performance
-   **test**: Adding or updating tests
-   **chore**: Changes to build process, auxiliary tools, or libraries

### Scope:

The scope is optional and can be anything specifying the place of the commit change (component, page, or file name).

### Subject:

The subject contains a brief description of the change:

-   Use the imperative, present tense: "change" not "changed" nor "changes"
-   Don't capitalize the first letter
-   No period (.) at the end

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

    %% Spasi untuk memisahkan alur
        rect rgb(240, 240, 240)
        Note over User, ObjectStorage: Contoh Alur 3: Mencatat Keputusan Kepala Desa (Modul Keputusan)
    end

    User->>Frontend: Mengisi form keputusan + unggah lampiran (opsional)
    Frontend->>Backend: POST /api/keputusan (metadata + file opsional)
    activate Backend

    alt Ada file lampiran
        Backend->>ObjectStorage: Upload file
        activate ObjectStorage
        ObjectStorage-->>Backend: Kembalikan URL file
        deactivate ObjectStorage
    end

    Backend->>Database: INSERT INTO KEPUTUSAN (metadata, file_url)
    activate Database
    Database-->>Backend: Sukses
    deactivate Database

    Backend-->>Frontend: Response: 201 Created
    deactivate Backend
    Frontend-->>User: Tampilkan notifikasi "Keputusan Kepala Desa Berhasil Dicatat"
```

## 👥 Contributors

<a href="https://github.com/sultandevin/desa/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=sultandevin/desa" />
</a>
