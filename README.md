# CuoreConnesso ❤️

Un'applicazione per connettere due persone ovunque si trovino, permettendo di scambiarsi vibrazioni e cuori colorati in tempo reale.

## ✨ Funzionalità

- **Creazione Stanza**: Genera un codice unico per invitare il tuo partner.
- **Unione Stanza**: Inserisci il codice per connetterti.
- **Scambio Cuori**: Invia cuori colorati che appaiono sullo schermo del partner.
- **Vibrazione**: Il dispositivo vibra alla ricezione (su dispositivi supportati).
- **Notifiche**: Notifiche locali e supporto PWA.

## 🚀 Deploy su Vercel

Questa applicazione è pronta per essere deployata su Vercel con Backend integrato (Serverless Functions) e Vercel KV (Redis) per lo stato.

### Prerequisiti

1. Un account [Vercel](https://vercel.com).
2. Un database KV (Redis). Vercel offre Vercel KV che è perfetto per questo.

### Passo 1: Deploy

Clicca sul bottone qui sotto per deployare direttamente:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftuo-user%2Fcuoreconnesso)

*(Sostituisci l'URL con il tuo repository Git reale)*

Oppure, se hai clonato il repo:

1. Installa Vercel CLI: `npm i -g vercel`
2. Esegui `vercel` nella cartella del progetto.

### Passo 2: Configurazione Database (Vercel KV)

Per far funzionare il backend, devi collegare un database KV.

1. Vai sulla dashboard del tuo progetto su Vercel.
2. Vai su **Storage** > **Create Database** > **KV**.
3. Scegli una regione e crea il database.
4. Una volta creato, Vercel imposterà automaticamente le variabili d'ambiente necessarie (`KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, ecc.) nel tuo progetto.
5. Se stai eseguendo in locale, devi scaricare queste variabili:
   ```bash
   vercel env pull .env.local
   ```

### Passo 3: Utilizzo

1. Apri l'app dal link di deploy.
2. **Utente A**: Clicca su "Crea Stanza", inserisci il nome e condividi il codice generato.
3. **Utente B**: Clicca su "Unisciti", inserisci il codice ricevuto e il proprio nome.
4. Inviatevi cuori! ❤️

## 📱 Installazione (PWA)

Questa è una Progressive Web App (PWA).

- **Android (Chrome)**: Apri il menu e clicca "Installa app" o "Aggiungi a schermata home".
- **iOS (Safari)**: Clicca il tasto Condividi (freccia in su) e scorri fino a "Aggiungi alla schermata Home".

Una volta installata, l'app funzionerà come un'app nativa a tutto schermo.

## 🛠 Sviluppo Locale

1. Clona il repo.
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```
   *Nota: Per far funzionare il backend in locale, assicurati di aver configurato le variabili d'ambiente di Vercel KV come descritto sopra o usa `vercel dev`.*

## 📝 Note Tecniche

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Vercel Serverless Functions (TypeScript)
- **Database**: Vercel KV (Redis)
- **Real-time**: Polling (ogni 3 secondi) per semplicità e compatibilità Serverless.
