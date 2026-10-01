# Portfolio Backend

API REST Express/TypeScript alimentant le formulaire de contact du portfolio de Boris Dhaene.

## Stack

- **Runtime** : Node.js
- **Framework** : Express 4
- **Langage** : TypeScript
- **Validation** : Zod
- **Mail** : Nodemailer (SMTP)
- **Sécurité** : CORS + Rate limiting (5 req / 15 min)

## Routes

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/health` | Vérifie que le serveur est actif |
| `POST` | `/api/contact` | Envoie un e-mail via le formulaire de contact |

### `POST /api/contact`

**Body JSON :**
```json
{
  "name": "string (1–100 caractères)",
  "email": "string (email valide)",
  "message": "string (10–2000 caractères)"
}
```

**Réponse succès :**
```json
{ "success": true }
```

## Installation

```bash
# Cloner le dépôt et aller dans le dossier
cd portfolio-backend

# Installer les dépendances
npm install
```

## Variables d'environnement

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173

# SMTP (optionnel, sans ces variables, les messages sont loggés en console)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
CONTACT_TO=votre@email.com
```

> Sans configuration SMTP, les soumissions du formulaire sont affichées dans la console plutôt qu'envoyées par e-mail.

## Scripts

```bash
npm run dev      # Démarrage en mode développement (tsx watch)
npm run build    # Compilation TypeScript → dist/
npm run start    # Démarrage du build compilé
```

## Structure

```
src/
├── index.ts          # Point d'entrée, configuration Express
└── routes/
    └── contact.ts    # Route POST /api/contact
```
