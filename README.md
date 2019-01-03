
# Installazione

- Dopo aver clonato da github eseguire "npm install"
- Aggiungere un file src/keys.js che contenga "export const firebaseapiKey = 'CHIAVE FIREBASE'"
- Finita l'installazione di npm eseguire npm start

# Test

HOME: 
Per un test completo è necessario eseguire l'accesso con l'account twitch tramite il link "Accedi con Twitch" nella parte alta a sinistra della pagina.
- Nel riquadro di test (nella parte alta a destra della pagina) è possibile indicare nel textbox un nick tra quelli dei vari streamer della lista per testare l'invio e la ricezione di messaggi e di richieste di coop.
- Invio di messaggi: Dopo aver cliccato su uno dei riqudri delle coop basta scrivere un messaggio nel textbox inbasso a destra e premere "manda messaggio"
- Invio richiesta coop: Dopo aver cliccato su uno dei riqudri delle coop basta premere il bottone "PARTECIPA!" per mandare una richiesta di partecipazione alla coop (questa funzione è utilizzabile solo da chi è già in lista di ricerca coop, quindi è necessario prima scegliere uno dei nick e inserirlo nel riquadro di test" (per verificare che la richiesta sia arrivata basta inserire il nick di quello che dovrebbe ricevere la richiesta nel textbox del riquadro di test e comparirà nella chat un messaggio che permette di accettarla o rifiutarla)
- Aggiunta streaming alla lista: è possibile aggiungere streamer solo tra quelli attualmente live, per farlo basta inserire il nick dello streamer nel textbox del riquadro di test e cliccare sul bottone "Aggiungi alla lista" in alto a sinistra

MULTISTREAM:
Per la visualizzazione delle pagine di multistream non è necessario alcun accesso, basta aggiungere all'url una lista di nicknames separati da "/" es."localhost:3000/BobRoss/Elvie/TEAMEVGA" o "https://tcoop-6668f.firebaseapp.com/BobRoss/Elvie/TEAMEVGA" a seconda di quale versione stiamo testando


# Hostare

- Cambiare gli url in home.js, topbar.js e su twitch dev con quello di firebase
- npm install -g firebase-tools
- firebase login
- npm run build
- firebase init (impostare come cartella "build")
- firebase deploy

# Link

- [test pagina](https://tcoop-6668f.firebaseapp.com/)
- This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).