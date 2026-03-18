# BeeHunter - Architettura Tecnica

## Panoramica

BeeHunter è una piattaforma di gamification urbana che trasforma l'esplorazione della città in un'esperienza ludica. L'architettura è costruita su un stack moderno con React 19 + Tailwind CSS nel frontend, Express 4 + tRPC nel backend e MySQL (TiDB) come database.

## Stack Tecnologico

| Layer | Tecnologia | Scopo |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS 4 | UI responsiva e moderna |
| **Backend** | Express 4, tRPC 11, TypeScript | API type-safe e procedures |
| **Database** | MySQL/TiDB, Drizzle ORM | Persistenza dati |
| **Autenticazione** | Manus OAuth | Login sicuro (email, social) |
| **Pagamenti** | Stripe API | Abbonamenti e prenotazioni |
| **Notifiche** | Web Push API, Service Worker | Notifiche real-time |
| **Storage** | S3 (Manus) | File e media |
| **Deployment** | Manus Platform | Hosting e CDN |

## Architettura Database

### Tabelle Principali

La struttura del database è organizzata in 10 tabelle principali:

**Tabella `users`**: Memorizza informazioni utenti con autenticazione OAuth. Campi: `id` (PK), `openId` (unique), `name`, `email`, `role` (user/admin), `xpTotal`, `premiumUntil`, `createdAt`, `updatedAt`.

**Tabella `partners`**: Gestisce partner commerciali (ristoranti, hotel, tour operator). Campi: `id` (PK), `userId` (FK), `businessName`, `category`, `location`, `contactEmail`, `verified`, `createdAt`.

**Tabella `poi` (Points of Interest)**: Contiene i 30+ punti di interesse di Bari. Campi: `id` (PK), `name`, `category` (Cultura/Natura/Food/Eventi/Segreto), `description`, `latitude`, `longitude`, `xpReward`, `imageUrl`, `createdAt`.

**Tabella `userXp`**: Traccia guadagni XP per ogni utente. Campi: `id` (PK), `userId` (FK), `poiId` (FK), `xpAmount`, `timestamp`, `source` (check-in/challenge/referral).

**Tabella `badges`**: Definisce i badge collezionabili. Campi: `id` (PK), `name`, `description`, `icon`, `requirement`, `tier` (bronze/silver/gold).

**Tabella `userBadges`**: Associazione molti-a-molti tra utenti e badge. Campi: `userId` (FK), `badgeId` (FK), `unlockedAt`.

**Tabella `coupon`**: Coupon gestiti dai partner. Campi: `id` (PK), `partnerId` (FK), `code`, `discount`, `expiresAt`, `redeemCount`, `maxRedeems`.

**Tabella `tours`**: Esperienze prenotabili. Campi: `id` (PK), `partnerId` (FK), `title`, `description`, `price`, `duration`, `maxParticipants`, `schedule`.

**Tabella `bookings`**: Prenotazioni tour. Campi: `id` (PK), `userId` (FK), `tourId` (FK), `stripePaymentId`, `status` (pending/confirmed/cancelled), `createdAt`.

**Tabella `notifications`**: Log notifiche push. Campi: `id` (PK), `userId` (FK), `title`, `message`, `type` (poi/challenge/event), `read`, `createdAt`.

### Relazioni Chiave

La tabella `users` è il fulcro centrale, con relazioni verso `partners` (uno-a-molti), `userXp` (uno-a-molti), `userBadges` (molti-a-molti), `bookings` (uno-a-molti) e `notifications` (uno-a-molti). La tabella `partners` si collega a `coupon` e `tours` (uno-a-molti). La tabella `poi` si collega a `userXp` (uno-a-molti).

## Architettura API (tRPC)

### Procedure Pubbliche

Le procedure pubbliche sono accessibili senza autenticazione e includono: `poi.list` (lista POI con filtri), `poi.detail` (dettagli singolo POI), `tours.list` (lista tour pubblici), `tours.detail` (dettagli tour).

### Procedure Protette

Le procedure protette richiedono autenticazione e includono: `user.profile` (profilo personale), `user.updateProfile` (modifica profilo), `poi.checkIn` (registra visita), `badges.list` (badge utente), `coupon.redeem` (riscatta coupon), `bookings.create` (crea prenotazione), `social.share` (traccia condivisione).

### Procedure Partner

Le procedure partner sono riservate ai commercianti e includono: `partner.dashboard` (KPI), `partner.coupons.manage` (CRUD coupon), `partner.analytics` (metriche engagement), `partner.tours.manage` (CRUD tour), `partner.export` (esporta dati).

### Procedure Admin

Le procedure admin sono riservate agli amministratori e includono: `admin.poi.manage` (CRUD POI), `admin.users.list` (lista utenti), `admin.analytics.global` (analytics globali), `admin.notifications.broadcast` (invia notifiche broadcast).

## Flussi Critici

### Flusso di Registrazione e Login

L'utente accede tramite Manus OAuth (email o social). Il backend riceve il callback OAuth, estrae l'`openId`, e crea o aggiorna il record in `users`. Una sessione cookie viene generata e inviata al client. Il frontend memorizza lo stato autenticato e reindirizza alla home.

### Flusso di Check-in POI

L'utente apre il Radar, seleziona un POI, e scansiona il QR code o utilizza la geolocalizzazione. Il frontend invia `poi.checkIn` al backend. Il backend verifica la prossimità geografica (entro 100m), registra l'evento in `userXp`, calcola i badge sbloccati, e restituisce il feedback (XP guadagnato, badge nuovo). Il frontend mostra un toast di celebrazione.

### Flusso di Prenotazione Tour

L'utente seleziona un tour dalla sezione Tour, clicca "PRENOTA ORA", e viene reindirizzato a Stripe Checkout. Stripe gestisce il pagamento e invia un webhook al backend. Il backend crea il record in `bookings` con status "confirmed", invia una notifica push all'utente, e notifica il partner. L'utente riceve una conferma email con i dettagli.

### Flusso di Riscatto Coupon

L'utente accede al Shop, visualizza i coupon disponibili (ordinati per scadenza), clicca "RISCATTA", e il backend valida il coupon (non scaduto, non esaurito), decrementa `redeemCount`, e registra l'evento. Il partner riceve una notifica e può tracciare il cliente acquisito tramite il coupon.

### Flusso di Condivisione Social

L'utente completa una sfida o sblocca un badge, clicca "CONDIVIDI", e vede un modal con template predefiniti per Instagram/TikTok. Il template include una descrizione personalizzata, l'hashtag #BeeHunter, e un deep link all'app. Il frontend traccia la condivisione (anche se non viene completata) e assegna bonus XP (referral).

## Modello di Gamification

### Sistema XP

Ogni POI assegna XP variabili in base alla difficoltà e al valore culturale. I "Segreti" (Speakeasy, Terrazza Nascosta) offrono 280-300 XP, mentre i POI standard offrono 70-150 XP. Le sfide settimanali assegnano XP bonus (50-200). Il referral (invitare amici) assegna 100 XP per ogni amico che si registra. Il sistema applica moltiplicatori (2x durante weekend, 1.5x per streak di 7 giorni).

### Badge Collezionabili

I badge sono organizzati per categoria: **Esploratore** (City Explorer, Sea Hunter, Night Owl), **Gourmet** (Foodie Hunter, Street Food Master), **Culturale** (Heritage Seeker, San Nicola Explorer), **Sociale** (Social Butterfly, Dream Hunter). Ogni badge ha un requisito specifico (es. "City Explorer" richiede 20 POI visitati).

### Streak Giornaliero

Lo streak traccia i giorni consecutivi di attività. Ogni check-in giornaliero incrementa lo streak di 1. Uno streak di 7 giorni sblocca un bonus di 50 XP e un badge speciale. Se l'utente non accede per 24 ore, lo streak si azzera. Il massimo streak è visibile nel profilo come achievement.

### Classifica Globale

La classifica è calcolata in tempo reale basata su XP totale e aggiornata ogni ora. Esistono tre varianti: settimanale (XP della settimana corrente), mensile (XP del mese corrente), all-time (XP totale). I top 10 utenti ricevono badge speciali (Gold Crown, Silver Crown, Bronze Crown) e accesso a coupon esclusivi.

### Sfide Multiplayer

Le sfide settimanali sono pubblicate ogni lunedì e includono obiettivi come "Visita 5 POI Food" o "Raccogli 3 badge questa settimana". Gli utenti competono in tempo reale, con la classifica aggiornata ogni ora. I top 3 ricevono premi (coupon, badge, XP bonus).

## Sicurezza

### Autenticazione

Manus OAuth gestisce l'autenticazione in modo sicuro. Il backend valida il token OAuth, estrae l'`openId`, e crea una sessione cookie HTTP-only, Secure, SameSite=None. Il frontend non ha accesso diretto al token OAuth.

### Autorizzazione

Ogni procedure tRPC verifica il ruolo dell'utente (`user`, `partner`, `admin`). Le procedure partner verificano che l'utente sia il proprietario del partner. Le procedure admin verificano il ruolo admin.

### Dati Sensibili

I dati sensibili (email, numero carta) non sono mai memorizzati nel database. Stripe gestisce i dati di pagamento. Le password non sono utilizzate (OAuth). I dati personali sono criptati a riposo.

### GDPR Compliance

Ogni utente può richiedere l'export dei propri dati (GDPR Article 20). Ogni utente può richiedere la cancellazione dell'account (GDPR Article 17). Un audit trail registra tutte le operazioni sensibili. Una privacy policy chiara descrive la raccolta e l'uso dei dati.

## Performance

### Ottimizzazioni Database

Gli indici sono creati su colonne frequentemente interrogate: `users.openId`, `poi.category`, `userXp.userId`, `bookings.status`. Le query di geolocalizzazione utilizzano indici spaziali (SPATIAL INDEX su latitude/longitude). Le query di classifica sono cachate in Redis per 1 ora.

### Ottimizzazioni Frontend

Il codice è code-split per ridurre il bundle iniziale. Le immagini sono ottimizzate e servite tramite CDN. Il Service Worker cachea i dati offline. Le liste lunghe utilizzano virtual scrolling.

### Ottimizzazioni Backend

Le procedure tRPC utilizzano batch loading per ridurre le query N+1. I webhook Stripe sono processati in background. Le notifiche push sono inviate in batch.

## Monitoraggio e Logging

### Logging

Tutti gli errori sono loggati con stack trace. Tutte le operazioni sensibili (login, pagamento, cancellazione account) sono loggati con timestamp e user ID. I log sono inviati a un servizio di aggregazione (es. Sentry).

### Metriche

Le metriche chiave tracciati includono: DAU (Daily Active Users), Conversion Rate (premium), Retention Rate (30 giorni), ARPU (Average Revenue Per User), Engagement (check-in per utente per giorno).

## Roadmap di Implementazione

**Fase 1 (Settimane 1-2)**: Schema database e migrazioni SQL. Backend API core (POI, XP, badge). Autenticazione Manus OAuth.

**Fase 2 (Settimane 3-4)**: Frontend app (Radar, Tour, Shop, Social, Profilo). Integrazione Stripe. Notifiche push.

**Fase 3 (Settimane 5-6)**: Dashboard partner B2B. Condivisione social. Sfide multiplayer.

**Fase 4 (Settimana 7)**: GDPR compliance, testing, ottimizzazione, deployment.

## Considerazioni Future

L'app potrebbe essere espansa con funzionalità AR avanzate (riconoscimento monumenti), integrazione con servizi di trasporto pubblico, e espansione a livello nazionale (altre città italiane). Un'app mobile nativa (iOS/Android) potrebbe essere sviluppata in seguito utilizzando React Native.
