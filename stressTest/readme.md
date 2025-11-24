install dulu k6 kalo mau coba

1. 'winget install k6 --source winget'     || kalo pake chocolatey 'choco install k6'              //di powershell
2. seharusnya dh otomatis ke path system, tapi cek dulu lagi, search edit the system environtment variabel, environtment variabel, system variable path. kalo ada tinggal oke dan lanjut ke 
3. buka cmd lagi terus tulis 'k6 version' (tanpa tanda kutip)
4. kalo ada version nya berarti dh ke install

kalo belum ada version nya.

5. kalo belum balik ke 2, tambahkan path nya di system environtment tadi, C:\\program files\K6\ (tergantung dimanat taruh tadi)
6. cek lagi version nya


running program nya

1. masuk ke direktori nya desa/stressTest
2. k6 run (nama file.js) 