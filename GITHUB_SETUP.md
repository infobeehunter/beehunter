# Guida: Caricamento del Progetto BeeHunter su GitHub

Questa guida ti mostra come caricare il progetto BeeHunter su GitHub passo-passo.

## 📋 Prerequisiti

1. **Account GitHub**: Se non hai un account, creane uno su [github.com](https://github.com)
2. **Git installato**: Scarica da [git-scm.com](https://git-scm.com)
3. **SSH Key configurata** (opzionale ma consigliato): Per evitare di inserire la password ogni volta

## 🔑 Configurazione SSH (Opzionale ma Consigliato)

### 1. Genera una SSH Key

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Premi Enter per accettare il percorso di default e inserisci una passphrase (o premi Enter per saltarla).

### 2. Aggiungi la SSH Key a GitHub

```bash
# Copia la chiave pubblica
cat ~/.ssh/id_ed25519.pub
```

- Vai su [GitHub Settings > SSH Keys](https://github.com/settings/keys)
- Clicca "New SSH key"
- Incolla il contenuto della chiave
- Clicca "Add SSH key"

### 3. Testa la connessione

```bash
ssh -T git@github.com
```

Dovresti vedere: `Hi username! You've successfully authenticated...`

## 📤 Caricamento del Progetto su GitHub

### Opzione 1: Crea un Nuovo Repository (Consigliato)

#### Passo 1: Crea il Repository su GitHub

1. Vai su [github.com/new](https://github.com/new)
2. **Repository name**: `beehunter-app-new` (o il nome che preferisci)
3. **Description**: "App per scoprire i segreti di Bari con mappa interattiva"
4. **Visibility**: Scegli "Public" o "Private"
5. **Initialize repository**: NON selezionare nulla (aggiungeremo i file locali)
6. Clicca "Create repository"

#### Passo 2: Configura Git Localmente

Naviga nella cartella del progetto:

```bash
cd /home/ubuntu/beehunter-app-new
```

Inizializza il repository git (se non lo è già):

```bash
git init
```

Configura il tuo nome e email (se non già configurato):

```bash
git config user.name "Il Tuo Nome"
git config user.email "tua_email@example.com"
```

#### Passo 3: Aggiungi i File

```bash
# Aggiungi tutti i file
git add .

# Verifica i file da aggiungere
git status
```

#### Passo 4: Commit Iniziale

```bash
git commit -m "Initial commit: BeeHunter app with Radar feature"
```

#### Passo 5: Connetti al Repository Remoto

Sostituisci `USERNAME` con il tuo username GitHub:

```bash
# Se usi SSH (consigliato)
git remote add origin git@github.com:USERNAME/beehunter-app-new.git

# Se usi HTTPS
git remote add origin https://github.com/USERNAME/beehunter-app-new.git
```

#### Passo 6: Rinomina il Branch (se necessario)

```bash
# Se il branch locale è "master", rinominalo in "main"
git branch -M main
```

#### Passo 7: Push del Codice

```bash
git push -u origin main
```

Se usi HTTPS, inserisci il tuo username GitHub e una personal access token come password.

### Opzione 2: Fork di un Repository Esistente

Se il progetto è già su GitHub e vuoi farne un fork:

1. Vai al repository originale
2. Clicca il pulsante "Fork" in alto a destra
3. Clicca "Create fork"
4. Clona il tuo fork localmente:

```bash
git clone https://github.com/USERNAME/beehunter-app-new.git
cd beehunter-app-new
```

## 🔄 Aggiornamenti Successivi

Una volta che il progetto è su GitHub, per aggiornarlo:

```bash
# Apporta modifiche ai file...

# Aggiungi i cambiamenti
git add .

# Commit con un messaggio descrittivo
git commit -m "Descrizione delle modifiche"

# Push al repository remoto
git push origin main
```

## 📝 Messaggi di Commit Buoni

Usa messaggi di commit chiari e descrittivi:

```bash
# ✅ Buoni
git commit -m "Add Radar page with map integration"
git commit -m "Fix POI list scrolling issue"
git commit -m "Add database migrations for POI table"

# ❌ Cattivi
git commit -m "Fix stuff"
git commit -m "Update"
git commit -m "asdf"
```

## 🏷️ Versioning con Tag

Per creare una versione del progetto:

```bash
# Crea un tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push il tag
git push origin v1.0.0

# Oppure push tutti i tag
git push origin --tags
```

## 📋 Checklist Pre-Push

Prima di fare il push, verifica:

- [ ] Tutti i test passano: `pnpm test`
- [ ] Nessun errore TypeScript: `pnpm check`
- [ ] Il codice è formattato: `pnpm format`
- [ ] Il file `.env` NON è incluso (controlla `.gitignore`)
- [ ] I file di log NON sono inclusi
- [ ] Il file `node_modules` NON è incluso
- [ ] Hai scritto un messaggio di commit descrittivo

## 🔒 Protezione del Repository

Dopo aver creato il repository, configura le protezioni:

1. Vai a **Settings > Branches**
2. Clicca "Add rule" sotto "Branch protection rules"
3. Configura:
   - Branch name pattern: `main`
   - Require pull request reviews: ✓
   - Require status checks to pass: ✓
   - Require branches to be up to date: ✓

## 🚀 GitHub Actions (Opzionale)

Crea un file `.github/workflows/test.yml` per eseguire i test automaticamente:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Run tests
        run: pnpm test
        
      - name: Check TypeScript
        run: pnpm check
```

## 📚 Risorse Utili

- [GitHub Docs](https://docs.github.com/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub CLI](https://cli.github.com/) - Alternativa a git da linea di comando
- [GitHub Desktop](https://desktop.github.com/) - Interfaccia grafica per Git

## 🆘 Risoluzione Problemi

### Errore: "fatal: remote origin already exists"

```bash
# Rimuovi il remote esistente
git remote remove origin

# Aggiungi il nuovo remote
git remote add origin https://github.com/USERNAME/beehunter-app-new.git
```

### Errore: "Permission denied (publickey)"

Assicurati che la tua SSH key sia configurata:

```bash
ssh -T git@github.com
```

Se non funziona, usa HTTPS al posto di SSH.

### Errore: "fatal: 'origin' does not appear to be a 'git' repository"

Assicurati di essere nella cartella corretta:

```bash
cd /home/ubuntu/beehunter-app-new
git status
```

### Errore: "Updates were rejected because the tip of your current branch is behind"

Sincronizza il tuo repository locale:

```bash
git pull origin main
git push origin main
```

## 💡 Consigli Finali

1. **Commit frequenti**: Fai commit piccoli e frequenti, non uno grande alla fine
2. **Messaggi chiari**: Scrivi messaggi di commit che spiegano il "perché", non solo il "cosa"
3. **Branch per feature**: Per feature importanti, crea un branch separato
4. **Pull requests**: Usa le PR per code review prima di mergiare
5. **README aggiornato**: Mantieni il README.md sempre aggiornato
6. **Changelog**: Considera di mantenere un CHANGELOG.md

## 📞 Supporto

Se hai problemi durante il caricamento su GitHub:

1. Controlla la [documentazione ufficiale di GitHub](https://docs.github.com/)
2. Cerca il tuo errore su [Stack Overflow](https://stackoverflow.com/questions/tagged/github)
3. Apri un issue nel repository del progetto

---

**Buon lavoro con BeeHunter su GitHub! 🚀**
