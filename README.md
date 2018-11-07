
# Installazione

- Dopo aver clonato da github eseguire "npm install"
- Aggiungere un file src/keys.js che contenga "export const firebaseapiKey = 'CHIAVE FIREBASE'"
- Finita l'installazione di npm eseguire npm start

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