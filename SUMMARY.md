# Riepilogo Progetto BeeHunter

BeeHunter è un'applicazione web full-stack moderna progettata per esplorare la città di Bari. Gli utenti possono scoprire punti di interesse (POI), guadagnare punti esperienza (XP), sbloccare badge e partecipare a sfide.

## 🏗️ Architettura del Progetto

Il progetto segue una struttura monorepo con frontend e backend integrati:

| Cartella | Descrizione |
| :--- | :--- |
| `client/` | Applicazione frontend React 19 con TypeScript e Tailwind CSS 4. |
| `server/` | Backend Express con API tRPC 11 per una comunicazione type-safe. |
| `shared/` | Codice, tipi e costanti condivisi tra frontend e backend. |
| `drizzle/` | Schema del database, migrazioni e configurazione ORM. |
| `patches/` | Patch per dipendenze esterne (es. `wouter`). |

## 🚀 Funzionalità Principali

1.  **Mappa Interattiva (Radar)**: Visualizzazione dei POI di Bari su Google Maps con filtri per categoria (Cultura, Natura, Food, Eventi, Segreto).
2.  **Sistema di Gamification**: Guadagno di XP tramite check-in nei POI, sblocco di badge esclusivi e classifica globale.
3.  **Marketplace (Shop)**: Possibilità di riscattare coupon offerti dai partner locali.
4.  **Esperienze (Tour)**: Prenotazione di tour guidati ed esperienze locali con integrazione PayPal.
5.  **Social & Sfide**: Partecipazione a sfide settimanali e condivisione dei progressi sui social media.
6.  **Dashboard Partner**: Area dedicata ai commercianti per gestire coupon, tour e visualizzare analytics.

## 🛠️ Stack Tecnologico

-   **Frontend**: React, TypeScript, Tailwind CSS, Lucide React, Framer Motion, Radix UI.
-   **Backend**: Node.js, Express, tRPC, Zod (validazione).
-   **Database**: MySQL/TiDB gestito tramite Drizzle ORM.
-   **Autenticazione**: Integrazione con Manus OAuth.
-   **Pagamenti**: PayPal SDK.
-   **Testing**: Vitest per unit e integration test.

## 📁 Contenuto dei File Principali

-   `package.json`: Gestione delle dipendenze e script (dev, build, test, db:push).
-   `vite.config.ts`: Configurazione ottimizzata per lo sviluppo e la build.
-   `README.md`: Guida completa all'installazione e all'uso.
-   `GITHUB_SETUP.md`: Istruzioni dettagliate per il caricamento su GitHub.
-   `ARCHITECTURE.md`: Documentazione tecnica sull'architettura del sistema.
-   `todo.md`: Elenco delle attività completate e future.

## ✅ Correzioni Effettuate

Durante l'analisi, sono state apportate le seguenti migliorie:
-   **Risoluzione Errori TypeScript**: Corretti identificatori duplicati in `server/routers.ts`.
-   **Ottimizzazione Codice**: Sistemati gli import in `client/src/App.tsx` per garantire la corretta inizializzazione di React.
-   **Pulizia Progetto**: Rimossi file di backup (`.bak`) e file zip ridondanti per un repository più pulito.
-   **Verifica Dipendenze**: Assicurata la compatibilità di tutte le librerie tramite `pnpm install`.

---
*Progetto preparato e verificato con successo per il caricamento su GitHub.*
