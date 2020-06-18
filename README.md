# TP

Aplikacja w Angularze powinna ruszysz po wpisaniu w konsolę: 
npm install 
npm start
Powinna działać na porcie localhost:4200

Bazę i komunikację z bazą zrobiłam w PHP i MySQL (tak jak kiedyś robiliśmy u Piernika ;P)
Ten folder TP z plikami .php trzeba wrzucić do xampp/htdocs
jak zaimportujesz plik .sql to powinno być 4 użytkowników
wrzuciłam print screena jak to powinno wyglądać 

Gra wymaga komunikacji z serwerem. Aby uruchomić serwer należy wejść do katalogu Server i wywołać komendę node app.js.
Tryb multiplayer obsługuje obecnie 2 graczy. Aby go przetestować można odpalić klienta w dwóch oknach przeglądarki.
W trybie multiplayer po położeniu karty na planszy należy kliknąć przycisk Koniec tury, dopiero wtedy dane o ruchu wysyłane są do serwera i przez niego do innych graczy.
Ruch można cofnąć dopóki nie naciśniemy Koniec tury. Wymiana kart automatycznie kończy ruch i wysyła informacja na serwer.
W celu rozegrania krótkiej, często zwycięskiej partii, należy w pliku server/app.js odkomentować inicjalizację zmiennej array.


