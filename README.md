# BeeHunter - Scopri i Segreti di Bari

BeeHunter è un'applicazione web innovativa che permette agli utenti di scoprire i luoghi più affascinanti di Bari attraverso una mappa interattiva, guadagnare XP e sbloccare badge esclusivi.

## 🎯 Caratteristiche Principali

### Pagina Radar
- **Mappa Interattiva**: Visualizza i punti di interesse (POI) di Bari su una mappa Google Maps in tempo reale
- **Filtri per Categoria**: Filtra i POI per categoria (Cultura, Natura, Food, Eventi, Segreto)
- **Ricerca**: Cerca i POI per nome o descrizione
- **Calcolo Distanza**: Visualizza la distanza in km da ogni POI
- **Check-in**: Esegui il check-in nei POI per guadagnare XP
- **Marker Colorati**: Ogni categoria ha un colore distintivo sulla mappa
- **Dettagli POI**: Visualizza i dettagli di ogni POI in una card interattiva

### Sistema di XP e Badge
- **XP System**: Guadagna XP visitando i POI
- **Badge**: Sblocca badge esclusivi raggiungendo determinati obiettivi
- **Leaderboard**: Competi con altri giocatori

### Autenticazione
- **Manus OAuth**: Autenticazione sicura tramite Manus
- **Profilo Utente**: Visualizza il tuo profilo, XP totali e badge sbloccati

## 🏗️ Architettura Tecnica

### Stack Tecnologico
- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Express 4 + tRPC 11
- **Database**: MySQL/TiDB
- **ORM**: Drizzle ORM
- **Mappa**: Google Maps API (tramite proxy Manus)
- **Build**: Vite 7 + esbuild

### Struttura del Progetto

```
beehunter-app-new/
├── client/                      # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx        # Homepage con feature overview
│   │   │   ├── Radar.tsx       # Pagina principale con mappa e POI
│   │   │   └── NotFound.tsx    # Pagina 404
│   │   ├── components/
│   │   │   ├── Map.tsx         # Componente mappa Google Maps
│   │   │   └── ui/             # Componenti shadcn/ui
│   │   ├── lib/
│   │   │   └── trpc.ts         # Client tRPC
│   │   ├── App.tsx             # Router principale
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Asset statici
│   └── index.html              # HTML principale
├── server/                      # Backend Express + tRPC
│   ├── routers.ts              # Definizione procedure tRPC
│   ├── db.ts                   # Query helper database
│   ├── radar.test.ts           # Test Vitest
│   └── _core/                  # Framework interno
├── drizzle/                     # Schema e migrazioni database
│   ├── schema.ts               # Definizione tabelle
│   └── migrations/             # File SQL migrazioni
├── package.json                # Dipendenze progetto
└── README.md                   # Questo file
```

## 🚀 Guida Rapida

### Prerequisiti
- Node.js 18+
- pnpm 10+
- Database MySQL/TiDB

### Installazione Locale

1. **Clona il repository**
```bash
git clone https://github.com/tuonome/beehunter-app-new.git
cd beehunter-app-new
```

2. **Installa dipendenze**
```bash
pnpm install
```

3. **Configura variabili d'ambiente**
Crea un file `.env` nella root del progetto:
```env
DATABASE_URL=mysql://user:password@localhost:3306/beehunter
JWT_SECRET=your-secret-key
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://forge.butterfly-effect.dev
```

4. **Inizializza il database**
```bash
pnpm run db:push
```

5. **Avvia il server di sviluppo**
```bash
pnpm run dev
```

L'app sarà disponibile su `http://localhost:3000`

## 📊 Database Schema

### Tabelle Principali

#### `users`
Tabella utenti con autenticazione Manus OAuth
- `id`: ID univoco
- `openId`: Identificatore Manus OAuth
- `name`: Nome utente
- `email`: Email
- `role`: Ruolo (user/admin)
- `xpTotal`: XP totali accumulati

#### `poi` (Points of Interest)
Punti di interesse di Bari
- `id`: ID univoco
- `name`: Nome del POI
- `description`: Descrizione
- `category`: Categoria (Cultura, Natura, Food, Eventi, Segreto)
- `latitude`: Latitudine
- `longitude`: Longitudine
- `xpReward`: XP ricompensa per il check-in

#### `userXp`
Cronologia XP degli utenti
- `userId`: ID utente
- `xpAmount`: Quantità XP
- `source`: Fonte XP (checkIn, bonus, referral, badge)
- `poiId`: ID POI (se applicabile)

#### `badges`
Definizione badge
- `id`: ID univoco
- `name`: Nome badge
- `description`: Descrizione
- `xpReward`: XP ricompensa
- `requirement`: Requisito per sbloccare

#### `userBadges`
Badge sbloccati dagli utenti
- `userId`: ID utente
- `badgeId`: ID badge
- `unlockedAt`: Data sblocco

### Altre Tabelle
- `partners`: Partner commerciali
- `tours`: Tour disponibili
- `bookings`: Prenotazioni tour
- `challenges`: Sfide attive
- `notifications`: Notifiche utenti
- `coupons`: Coupon e sconti
- `socialShares`: Condivisioni social
- `gdprConsents`: Consensi GDPR

## 🔌 API tRPC

### POI Router

#### `poi.list`
Lista tutti i POI, opzionalmente filtrati per categoria
```typescript
trpc.poi.list.useQuery({ category: "Cultura" })
```

#### `poi.detail`
Ottiene i dettagli di un POI specifico
```typescript
trpc.poi.detail.useQuery({ id: 1 })
```

#### `poi.nearby`
Trova POI vicini a una posizione
```typescript
trpc.poi.nearby.useQuery({
  latitude: 41.1371,
  longitude: 16.8755,
  radiusKm: 5
})
```

#### `poi.checkIn`
Esegue il check-in in un POI (richiede autenticazione)
```typescript
trpc.poi.checkIn.useMutation({
  poiId: 1,
  latitude: 41.1351,
  longitude: 16.8746
})
```

### User Router

#### `user.profile`
Ottiene il profilo dell'utente autenticato
```typescript
trpc.user.profile.useQuery()
```

#### `user.stats`
Ottiene le statistiche dell'utente
```typescript
trpc.user.stats.useQuery()
```

### Badge Router

#### `badge.list`
Lista tutti i badge disponibili
```typescript
trpc.badge.list.useQuery()
```

#### `badge.userBadges`
Ottiene i badge sbloccati dall'utente
```typescript
trpc.badge.userBadges.useQuery()
```

### Leaderboard Router

#### `leaderboard.global`
Ottiene la classifica globale
```typescript
trpc.leaderboard.global.useQuery({
  timeframe: "all",
  limit: 100
})
```

## 🧪 Test

Esegui i test con:
```bash
pnpm test
```

I test includono:
- Test delle procedure tRPC (POI, Badge, Leaderboard, User)
- Test di autenticazione
- Test di filtri e ricerca

## 📱 Responsive Design

L'app è completamente responsive e funziona su:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

La mappa si adatta automaticamente alle dimensioni dello schermo.

## 🔐 Sicurezza

- **Autenticazione OAuth**: Tramite Manus OAuth
- **Procedure Protette**: Uso di `protectedProcedure` per operazioni sensibili
- **Validazione Input**: Con Zod schema validation
- **CORS**: Configurato per il dominio dell'app
- **HTTPS**: Obbligatorio in produzione

## 🎨 Design e UX

### Colori per Categoria POI
- **Cultura**: 🏛️ Rosso (#FF6B6B)
- **Natura**: 🌿 Verde (#51CF66)
- **Food**: 🍽️ Giallo (#FFD93D)
- **Eventi**: 🎉 Viola (#6C5CE7)
- **Segreto**: 🔐 Blu (#A29BFE)

### Layout Radar
- **Header**: Sticky, contiene titolo, ricerca e filtri
- **Mappa**: 60% dello spazio disponibile
- **Elenco POI**: 40% dello spazio, scrollabile
- **Card Dettagli**: Overlay sulla mappa, posizionato in basso a sinistra

## 📈 Metriche Disponibili

- XP Totali: Somma di tutti gli XP guadagnati
- Badge Sbloccati: Numero di badge completati
- Luoghi Visitati: Numero di check-in effettuati
- Classifica: Posizione nella leaderboard globale

## 🚢 Deployment

### Manus Hosting
L'app è pronta per il deployment su Manus:
1. Crea un checkpoint
2. Clicca il pulsante "Publish" nell'UI
3. L'app sarà disponibile su `https://[subdomain].manus.space`

### Deployment Personalizzato
Per deployment su altri provider:
```bash
pnpm run build
pnpm run start
```

## 📚 Documentazione Aggiuntiva

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [tRPC Documentation](https://trpc.io/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Maps API](https://developers.google.com/maps)

## 🤝 Contribuire

Per contribuire al progetto:
1. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
2. Commit i tuoi cambiamenti (`git commit -m 'Add some AmazingFeature'`)
3. Push al branch (`git push origin feature/AmazingFeature`)
4. Apri una Pull Request

## 📝 Licenza

Questo progetto è licenziato sotto la licenza MIT - vedi il file LICENSE per i dettagli.

## 👥 Autori

- **BeeHunter Team** - Sviluppo applicazione

## 🐛 Segnalazione Bug

Se trovi un bug, per favore apri un issue su GitHub con:
- Descrizione del bug
- Steps per riprodurlo
- Comportamento atteso
- Screenshot (se applicabile)

## 📞 Supporto

Per domande o supporto, contatta il team di sviluppo o apri una discussione su GitHub.

---

**Versione**: 1.0.0  
**Ultimo Aggiornamento**: Marzo 2026  
**Stato**: ✅ Produzione
