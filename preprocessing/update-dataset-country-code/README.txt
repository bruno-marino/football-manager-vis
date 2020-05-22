Dal dataset originale ho tolto due giocatori
- 214395 - Ayrton Statie
- non me lo ricordo ahah

erano entrambi di due nazioni che avevano solo loro come giocatori e non erano sulla mappa
------

Nel .py controllo anche che non ci siano giocatori con una nazione non presente nel dizionario (final_football_manager_countries.csv)
Il nuovo campo l'ho chiamato "CountryCode".
Ho modificato (a mano) i nomi dei campi aggiungendo un underscore tra le parole, così in javascript avremo player.country_code e non player.countrycode.