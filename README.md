# Cargoful

App React Native (Expo) Cargoful: autenticazione JWT, lista prodotti paginata con ricerca, dettaglio prodotto e invio dati a un endpoint webhook esterno.

## Requisiti coperti


| #   | Funzionalità                       | Endpoint                         |
| --- | ---------------------------------- | -------------------------------- |
| 1   | Login JWT                          | `POST /auth/login`               |
| 2   | Sessione persistente + logout      | `GET /auth/me`                   |
| 3   | Lista prodotti con infinite scroll | `GET /products`                  |
| 4   | Ricerca con debounce               | `GET /products/search`           |
| 5   | Dettaglio prodotto                 | `GET /products/{id}`             |
| 6   | Pulsante Buy                       | `POST` verso webhook configurato |


## Installazione

### Prerequisiti

- Node.js 18+
- npm
- Expo Go su dispositivo fisico, oppure emulatore Android/iOS configurato

### Setup

```bash
git clone <repository-url>
cd cargoful
npm install
```

### Variabili d'ambiente

Copia il file di esempio e configura l'URL del webhook:

```bash
cp .env.example .env
```

Modifica `.env`:

```env
EXPO_PUBLIC_WEBHOOK_URL=https://webhook.site/your-unique-id
```

Genera un URL univoco su [webhook.site](https://webhook.site) dalla home page. Il pulsante **Buy** invierà una `POST` con body JSON `{ "title": "..." }` a quell'endpoint.

> Dopo ogni modifica a `.env`, riavvia il bundler Expo.

## Sviluppo (Expo Go)

Per sviluppare e testare l'app in locale:

```bash
# Avvia il dev server
npm start

# Avvia direttamente su Android (emulatore o dispositivo con Expo Go)
npm run android

# Avvia direttamente su iOS (macOS)
npm run ios
```

## Build APK (solo EAS)

Il progetto usa il **workflow managed** di Expo: non c'è cartella `android/` nel repository e **non è prevista una build Gradle in locale**.
Al momento l'unico modo per generare un APK installabile è **EAS Build** (compilazione Gradle sui server Expo)

```bash
# APK per distribuzione interna (profilo preview)
npm run build:apk

# App bundle per Play Store (profilo production)
npm run build:android
```

### Prerequisiti build

- Account Expo EAS
- File `.env` configurato (le variabili `EXPO_PUBLIC_*` vengono incluse nel build EAS)

Il profilo `preview` in `eas.json` produce un APK. Scarica il file dal link Expo e installalo sul dispositivo.

## Architettura

Il progetto segue un approccio **feature-first** con un layer `core` condiviso.

```
src/
├── app/                    # Composizione app (providers, navigazione, schermate)
│   ├── AppProviders.js     # SafeArea, React Query, Auth
│   ├── AppRoot.js          # Splash + gate autenticazione
│   ├── navigation/         # Stack navigator (Home → Dettaglio)
│   └── Screen/             # Login, Home, Dettaglio, Splash
├── core/
│   ├── api/                # httpClient, ApiError, interceptor JWT
│   ├── config/             # Costanti (API URL, page size, debounce)
│   └── storage/            # TokenStorage + SecureTokenStorage
├── features/
│   ├── auth/               # Login API, AuthContext, schema Zod
│   ├── products/           # API, hook React Query, componenti lista/ricerca
│   └── purchase/           # Invio POST al webhook (Buy)
├── components/             # UI riusabile (Button, TextField, stati)
├── hooks/                  # useDebouncedValue
└── theme/                  # Colori, spacing, tipografia
```

### Scelte principali

- **React Query** (`useInfiniteQuery`, `useQuery`, `useMutation`) per cache, paginazione, stati di loading/errore e retry automatici.
- **expo-secure-store** per persistenza sicura di `accessToken` e `refreshToken`.
- **httpClient** centralizzato: allega il Bearer token a tutte le richieste DummyJSON; il webhook usa `fetch` diretto senza auth.
- **React Navigation** (native stack) per la navigazione tra lista e dettaglio nell'area autenticata.
- **Zod** per validazione client-side del form di login.


### Flusso autenticazione

1. Login → `POST /auth/login` → salva token in SecureStore.
2. Riavvio app → verifica presenza token → `GET /auth/me` per validazione formale.
3. Token non valido → cancellazione token e redirect al login.
4. Logout → `clearTokens()` e redirect al login.


## Decisioni tecniche

- **Validità del token:** un token salvato è considerato valido se `GET /auth/me` risponde con successo. DummyJSON non mantiene sessioni server-side; la validazione è solo formale sul JWT inviato.
- **refreshToken:** viene salvato come richiesto dall'esercizio (`POST /auth/login` restituisce entrambi i token). Non è stato implementato il refresh automatico tramite `POST /auth/refresh` — l'esercizio richiede solo la persistenza del token, non il suo utilizzo.
- **Paginazione:** scelta **infinite scroll** (`onEndReached`) al posto del pull-to-refresh. Motivazione: esperienza più fluida e intuitiva per l'utente; gli stati loading/empty/error coprono i casi limite.
- **Debounce ricerca:** 600 ms (`SEARCH_DEBOUNCE_MS`) per ridurre chiamate API durante la digitazione. Oltre a migliorare le prestazioni (meno richieste e re-render), limita l’uso della rete e quindi il consumo energetico del dispositivo.
- **Webhook:** l'URL è configurabile via `.env`.
- **ApiError come classe:** gli errori HTTP delle chiamate API sono modellati con `class ApiError extends Error` anziché oggetti plain. Scelta motivata da: compatibilità con il meccanismo nativo degli errori JS, possibilità di distinguere errori API (`isApiError`) da altri fallimenti, e factory `fromResponse` per costruire l'errore in modo uniforme da `httpClient`.
- **Build solo EAS:** nessun progetto nativo (`android/`, `ios/`) versionato; sviluppo con Expo Go, APK solo tramite EAS Build in cloud. 
