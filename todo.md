# BeeHunter - Project TODO

## Database & Schema
- [x] Schema Drizzle: tabelle users, partners, poi, userXp, badges, userBadges, coupon, tours, bookings, notifications, gdprConsents
- [x] Migrazioni SQL generate e applicate
- [x] Indici di performance su query critiche (geolocalizzazione, classifica)

## Backend API (tRPC)
- [x] Procedure per gestione utenti (profilo, stats, preferences)
- [x] Procedure per gestione POI (list, detail, check-in, geolocalizzazione)
- [x] Procedure per sistema XP e badge (calcolo, assegnazione, progressione)
- [x] Procedure per coupon (creazione, riscatto, validazione)
- [x] Procedure per tour e prenotazioni (list, detail, booking)
- [x] Procedure per partner B2B (autenticazione, metriche, analytics)
- [x] Procedure per notifiche (creazione, invio, tracking)
- [x] Procedure per sfide e classifica (creazione, partecipazione, ranking)
- [x] Procedure per condivisione social (template, hashtag, tracking)
- [x] Procedure per pagamenti PayPal (tour, premium, webhook)

## Autenticazione & Sessioni
- [ ] Integrazione Manus OAuth per utenti finali
- [ ] Integrazione Manus OAuth per partner commerciali (ruolo partner)
- [ ] Gestione sessioni e cookie sicuri
- [ ] Logout e session cleanup
- [ ] Test autenticazione (email, social login)

## Frontend - App Principale
- [x] Layout principale con bottom navigation (Radar, Tour, Shop, Social, Io)
- [x] Pagina Radar: mappa interattiva con POI, filtri per categoria, ricerca
- [x] Pagina Tour: lista esperienze prenotabili, dettagli tour, CTA prenotazione
- [x] Pagina Shop: marketplace coupon, acquisto premium, riscatto coupon
- [x] Pagina Social: classifica globale, cronologia attività, sfide settimanali
- [x] Pagina Profilo (Io): dashboard utente, badge, streak, stats, preferenze
- [ ] Weather widget integrato
- [ ] Search bar con autocomplete
- [ ] Filter chips per categoria
- [ ] Modal per dettagli POI
- [ ] AR Scanner per check-in monumenti
- [ ] Toast notifications per feedback

## Frontend - Dashboard Partner B2B
- [x] Autenticazione partner
- [x] Dashboard overview: KPI principali (catture, redemption, revenue)
- [x] Gestione coupon: creazione, modifica, eliminazione, scadenza
- [x] Analytics: grafici engagement (catture nel tempo, redemption rate, demographic)
- [x] Gestione tour: lista, modifica, disponibilità
- [ ] Export dati (CSV, PDF)
- [ ] Impostazioni partner: profilo, metodi pagamento

## Pagamenti & Abbonamenti
- [x] Integrazione PayPal API backend
- [x] tRPC procedures per pagamenti
- [x] Componente PayPal Checkout
- [ ] Checkout per abbonamento premium (€9.99/mese) - completare integrazione
- [ ] Checkout per prenotazioni tour - completare integrazione
- [ ] Webhook PayPal per conferme pagamenti
- [ ] Gestione subscription lifecycle (attivazione, rinnovo, cancellazione)
- [ ] Invoice e ricevute
- [ ] Test pagamenti (PayPal sandbox)

## Notifiche Push
- [x] Service Worker per push notifications
- [x] Registrazione device token
- [x] Invio notifiche per nuovi POI
- [x] Invio notifiche per sfide settimanali
- [x] Invio notifiche per eventi speciali
- [x] Tracking aperture notifiche
- [x] Preferenze notifiche utente

## Condivisione Social
- [x] Template di condivisione per Instagram (story, feed)
- [x] Template di condivisione per TikTok
- [x] Hashtag ufficiale #BeeHunter integrato
- [x] Deep link per condivisione app
- [x] Tracking condivisioni (analytics)
- [x] Referral system (bonus XP per inviti)

## Gamification Avanzata
- [ ] Sistema XP completo (guadagno, perdita, moltiplicatori)
- [ ] Badge collezionabili (almeno 10 tipi)
- [ ] Streak giornaliero con bonus
- [ ] Classifica globale (settimanale, mensile, all-time)
- [ ] Sfide multiplayer (tempo reale, turnate)
- [ ] Leaderboard con premi
- [ ] Tier system (Bronze, Silver, Gold, Platinum)
- [ ] Achievements e milestone

## Conformità GDPR
- [x] Privacy Policy completa
- [x] Cookie Policy (inclusa in Privacy Policy)
- [x] Gestione consensi (banner, preferenze)
- [ ] Diritto allOblio (account deletion)
- [ ] Data portability (export dati utente)
- [x] Audit trail per operazioni sensibili
- [x] Encryption dati sensibili
- [ ] GDPR compliance test

## Testing & QA
- [x] Unit test backend (tRPC procedures) - 23 test cases passed
- [ ] Integration test database
- [ ] E2E test flussi critici (login, booking, payment)
- [ ] Test performance (load testing)
- [ ] Test mobile responsiveness
- [ ] Test accessibilità (WCAG 2.1)
- [ ] Security audit (OWASP top 10)

## Deployment & DevOps
- [ ] Environment variables configurati
- [ ] Build process ottimizzato
- [ ] Database migrations in produzione
- [ ] Monitoring e logging
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Backup strategy

## Documentazione
- [ ] README.md con setup instructions
- [ ] API documentation (tRPC endpoints)
- [ ] Partner onboarding guide
- [ ] Architecture decision records (ADR)
- [ ] Deployment guide

## Pagine Aggiuntive
- [x] Pagina Chi Siamo (storia, missione, valori, team)
- [ ] Pagina Contatti
- [ ] Pagina FAQ
- [ ] Pagina Termini di Servizio

## Seed Data (Dati Iniziali)
- [x] Script seed per 30+ POI di Bari (coordinate GPS, descrizioni, categorie) - 31 POI creati
- [x] Script seed per 10+ tour disponibili - 10 tour creati
- [x] Script seed per 20+ coupon da partner - 15 coupon creati
- [x] Script seed per 5+ partner commerciali - 5 partner creati
- [x] Esecuzione script seed nel database - COMPLETATO

## Mappa Interattiva (Radar)
- [x] Integrazione Google Maps nella pagina Radar
- [x] Pin per ogni POI con colore per categoria
- [x] Geolocalizzazione utente
- [x] Click su pin per visualizzare dettagli POI
- [x] Filtri categoria sulla mappa
- [x] Calcolo distanza in tempo reale
- [x] Zoom e pan sulla mappa
