# Linee Guida per i Contributi a BeeHunter

Grazie per l'interesse nel contribuire a BeeHunter! Questo documento fornisce le linee guida per contribuire al progetto.

## 🤝 Come Contribuire

### Segnalazione di Bug

Se trovi un bug, per favore apri un issue su GitHub con:

1. **Titolo chiaro**: Descrivi brevemente il bug
2. **Descrizione dettagliata**: Spiega cosa è successo e cosa ti aspettavi
3. **Steps per riprodurre**: Elenca i passi per riprodurre il bug
4. **Screenshot/Video**: Allega screenshot o video se applicabile
5. **Ambiente**: Specifica il tuo sistema operativo, browser, versione di Node.js

### Suggerimenti di Feature

Per suggerire una nuova feature:

1. Apri un issue con il tag `enhancement`
2. Descrivi la feature e il suo valore
3. Fornisci esempi di utilizzo
4. Spiega come potrebbe migliorare l'app

### Pull Requests

Per contribuire con codice:

1. **Fork il repository**
2. **Crea un branch**: `git checkout -b feature/AmazingFeature`
3. **Fai i tuoi cambiamenti**
4. **Aggiungi test**: Scrivi test per le nuove feature
5. **Verifica i test**: `pnpm test`
6. **Commit**: `git commit -m "Add AmazingFeature"`
7. **Push**: `git push origin feature/AmazingFeature`
8. **Apri una Pull Request**

## 📋 Checklist per Pull Requests

Prima di aprire una PR, assicurati che:

- [ ] Il codice segue lo stile del progetto
- [ ] Hai aggiunto test per le nuove feature
- [ ] Tutti i test passano: `pnpm test`
- [ ] Nessun errore TypeScript: `pnpm check`
- [ ] Il codice è formattato: `pnpm format`
- [ ] Il README è aggiornato se necessario
- [ ] Hai aggiunto commenti dove il codice non è ovvio
- [ ] Non hai aggiunto dipendenze non necessarie

## 🎯 Aree di Contribuzione

### Frontend
- Nuove pagine e componenti
- Miglioramenti UI/UX
- Ottimizzazione performance
- Accessibilità

### Backend
- Nuove procedure tRPC
- Ottimizzazione query database
- Miglioramenti sicurezza
- Gestione errori

### Database
- Nuove tabelle e relazioni
- Migrazioni
- Ottimizzazione indici
- Seed data

### Testing
- Nuovi test
- Aumento copertura test
- Test di integrazione
- Test di performance

### Documentazione
- Miglioramenti README
- Documentazione API
- Commenti nel codice
- Guide per gli sviluppatori

## 🎨 Stile di Codice

### TypeScript
- Usa `const` per default, `let` se necessario
- Evita `any`, usa `unknown` se necessario
- Aggiungi type hints per le funzioni
- Usa interfaces per gli oggetti

```typescript
// ✅ Buono
interface User {
  id: number;
  name: string;
  email: string;
}

const getUser = async (id: number): Promise<User> => {
  // ...
};

// ❌ Cattivo
const getUser = async (id) => {
  // ...
};
```

### React
- Usa functional components
- Usa hooks per la logica
- Evita prop drilling, usa context se necessario
- Memoizza i componenti costosi

```typescript
// ✅ Buono
const UserCard: React.FC<{ user: User }> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div onClick={() => setIsOpen(!isOpen)}>
      {user.name}
    </div>
  );
};

// ❌ Cattivo
function UserCard(props) {
  // ...
}
```

### Tailwind CSS
- Usa le classi utility di Tailwind
- Evita CSS custom quando possibile
- Usa i design tokens (colori, spacing, etc.)
- Mantieni le classi leggibili

```html
<!-- ✅ Buono -->
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h2 class="text-lg font-semibold">Title</h2>
  <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Action
  </button>
</div>

<!-- ❌ Cattivo -->
<div style="display: flex; justify-content: space-between; padding: 16px;">
  <h2 style="font-size: 18px; font-weight: bold;">Title</h2>
  <button style="background-color: #0066cc; color: white;">Action</button>
</div>
```

### Naming Conventions
- Variabili e funzioni: `camelCase`
- Classi e interfaces: `PascalCase`
- Costanti: `UPPER_SNAKE_CASE`
- Cartelle: `kebab-case`

```typescript
// ✅ Buono
const MAX_RETRIES = 3;
interface UserProfile {}
const getUserData = () => {};
const isValidEmail = (email: string) => {};

// ❌ Cattivo
const max_retries = 3;
interface userProfile {}
const GetUserData = () => {};
const isvalidemail = (email: string) => {};
```

## 📝 Commit Messages

Usa commit messages chiari e descrittivi:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Tipi di Commit
- `feat`: Nuova feature
- `fix`: Correzione di bug
- `docs`: Documentazione
- `style`: Formattazione, non cambia la logica
- `refactor`: Refactoring del codice
- `perf`: Miglioramenti performance
- `test`: Aggiunta o modifica di test
- `chore`: Aggiornamenti dipendenze, configurazione

### Esempi
```
feat(radar): add filter by distance

Allow users to filter POI by distance from their location.
Implements a new distance slider in the Radar page.

Closes #123
```

```
fix(poi): fix check-in proximity validation

The proximity check was using incorrect calculation.
Now uses proper haversine formula for distance calculation.

Fixes #456
```

## 🧪 Testing

### Scrivere Test

Usa Vitest per i test:

```typescript
import { describe, it, expect } from "vitest";

describe("POI Router", () => {
  it("should list all POI", async () => {
    const result = await caller.poi.list({});
    expect(Array.isArray(result)).toBe(true);
  });

  it("should filter POI by category", async () => {
    const result = await caller.poi.list({ category: "Cultura" });
    expect(result.every((p: any) => p.category === "Cultura")).toBe(true);
  });
});
```

### Eseguire Test

```bash
# Esegui tutti i test
pnpm test

# Esegui test in watch mode
pnpm test --watch

# Esegui test con coverage
pnpm test --coverage
```

## 🔍 Code Review

Quando ricevi feedback in una PR:

1. **Leggi attentamente** i commenti
2. **Fai domande** se non capisci
3. **Apporta le modifiche** richieste
4. **Rispondi ai commenti** quando hai finito
5. **Richiedi una nuova review** se necessario

## 📚 Risorse Utili

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Git Documentation](https://git-scm.com/doc)

## 🚀 Processo di Release

1. Aggiorna la versione in `package.json`
2. Aggiorna il `CHANGELOG.md`
3. Crea un tag: `git tag -a v1.0.0 -m "Release 1.0.0"`
4. Push il tag: `git push origin v1.0.0`
5. Crea una release su GitHub

## 💬 Comunicazione

- **Issues**: Per bug report e feature requests
- **Discussions**: Per domande e discussioni generali
- **Pull Requests**: Per contributi di codice

## 📞 Contatti

Se hai domande, contatta il team di sviluppo o apri una discussione su GitHub.

---

Grazie per aver contribuito a BeeHunter! 🙏
