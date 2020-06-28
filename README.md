# TP

Aplikacja pozwala na rozgrywkę w internetową wersję gry karcianej Bandido. Działa na porcie localhost:4200
Została stworzona w Angularze z wykorzystaniem technologii html/css. Aplikacja komunikuje się z serwerem gry oraz wykorzystuje stworzoną w MySQlu bazę danych.

Instrukcja uruchomienia:
1. Pobrać repozytorium
2. Pobrać i zainstalować node.js
3. W folderze TP/Projekt zainstalować npm wywołując komendę npm install
4. Następnie uruchomić grę w tym samym folderze wywołując komendę npm start lub ng serve. Gra będzie dostępne pod adresem http://localhost:4200
5. Należy uruchomić serwer gry. W tym celu należy przejść do folderu TP/Server i wywołać komendę node app.js
6. Połączenie z bazą realizowane jest za pośrednictwem Xampp. Należy pobrać Xampp. Następnie przekopiować folder TP/TP (zawierający pliki .php i .sql) do katalogu xampp/htdocs (xampp to folder, w którym Xampp został zainstalowany). Następnie uruchomić plik xampp-control.exe znajdujący się w folderze xampp i kliknąć start przy Apache i MySQL. 
7. W tym momencie działają wszystkie elementy gry, zatem na stronie http://localhost:4200 można zalogować się do gry używając utworzonego wcześniej konta lub przejść na stronę rejestracja i stworzyć nowego użytkownika.

W celu rozegrania krótkiej, często zwycięskiej partii, należy w pliku server/app.js zakomentować linię 11 i odkomentować linię 12, przez co w rozgrywce weźmie udział mniej kart.


