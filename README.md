# PugApi 🐾

Base d'API REST construite avec **Express.js** et **PostgreSQL**, incluant un système d'authentification complet via **JWT HS256** avec refresh token, rotation et reuse detection. Hébergée sur [Render](https://render.com).

---

## Stack technique

- **Runtime** : Node.js 20
- **Framework** : Express.js 5
- **ORM** : Sequelize 6
- **Base de données** : PostgreSQL 16
- **Auth** : JWT HS256 + Refresh Token avec Reuse Detection
- **Conteneurisation** : Docker + Docker Compose
- **Hébergement** : Render

---

## Utilisation en production

L'API est disponible publiquement sans installation :

```
https://pug-api-88vz.onrender.com
```

> ⚠️ L'instance est hébergée sur un plan gratuit Render. Le premier appel peut prendre ~90 secondes (cold start).

---

## Installation locale

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé
- [Git](https://git-scm.com/)

### 1. Cloner le projet

```bash
git clone https://github.com/aarnow/PugApi.git
cd PugApi
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Édite `.env` et renseigne les valeurs manquantes :

```env
PORT=3000

DB_HOST=db
DB_PORT=5432
DB_USER=puguser
DB_PASSWORD=pugpassword
DB_NAME=pugapi
DB_SSL=false

JWT_SECRET=           # générer avec : node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_EXPIRES_IN=15m

REFRESH_TOKEN_DAYS=7
REFRESH_TOKEN_INACTIVITY=3
```

### 3. Lancer les containers

```bash
docker-compose up --build
```

Docker va automatiquement :
- Démarrer une instance PostgreSQL
- Exécuter les migrations Sequelize
- Insérer les rôles par défaut (`ROLE_EDITOR`, `ROLE_MODERATOR`, `ROLE_ADMIN`)
- Démarrer l'API sur le port `3000`

### 4. Vérifier que tout fonctionne

```bash
curl http://localhost:3000/health
```

Réponse attendue :

```json
{
  "status": "ok",
  "api": "up",
  "database": "up"
}
```

### Commandes utiles

```bash
# Démarrer en arrière-plan
docker-compose up -d --build

# Voir les logs
docker-compose logs -f api

# Arrêter les containers (données conservées)
docker-compose down

# Arrêter et supprimer les données (repart de zéro)
docker-compose down -v
```

---

## Documentation des endpoints

### Système

#### `GET /health`
Vérifie que l'API et la base de données sont opérationnelles.

**Réponse `200`**
```json
{
  "status": "ok",
  "timestamp": "2026-02-17T10:00:00.000Z",
  "api": "up",
  "database": "up"
}
```

---

### Authentification — `/api/auth`

#### `POST /api/auth/register`
Crée un nouveau compte. Le rôle `ROLE_EDITOR` est assigné par défaut.

**Body**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Réponse `201`**
```json
{
  "message": "User created",
  "access_token": "eyJhbGci...",
  "refresh_token": "a3f8e2c1...",
  "userId": 1,
  "roles": ["ROLE_EDITOR"]
}
```

---

#### `POST /api/auth/login`
Authentifie un utilisateur. Révoque tous les refresh tokens actifs précédents.

**Body**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Réponse `200`**
```json
{
  "message": "User connected",
  "access_token": "eyJhbGci...",
  "refresh_token": "a3f8e2c1...",
  "userId": 1,
  "roles": ["ROLE_EDITOR"]
}
```

---

#### `POST /api/auth/refresh`
Émet un nouveau couple de tokens. Applique la **rotation** (l'ancien refresh token est révoqué) et la **Reuse Detection** (si le token a déjà été utilisé, tous les tokens du compte sont révoqués).

**Body**
```json
{
  "refresh_token": "a3f8e2c1..."
}
```

**Réponse `200`**
```json
{
  "access_token": "eyJhbGci...",
  "refresh_token": "b7d4f9e2..."
}
```

---

#### `POST /api/auth/logout`
Révoque le refresh token. L'access token reste valide jusqu'à son expiration naturelle (15 min).

**Body**
```json
{
  "refresh_token": "a3f8e2c1..."
}
```

**Réponse `200`**
```json
{
  "message": "Logged out successfully"
}
```

---

### Routes protégées — `/api/test`

Ces routes nécessitent un header `Authorization: Bearer {access_token}`.

#### `GET /api/test/all`
Route publique, aucun token requis.

**Réponse `200`**
```json
{
  "message": "Public content - accessible by everyone"
}
```

---

#### `GET /api/test/user`
Accessible par tous les utilisateurs connectés (`ROLE_EDITOR`, `ROLE_MODERATOR`, `ROLE_ADMIN`).

**Headers**
```
Authorization: Bearer eyJhbGci...
```

**Réponse `200`**
```json
{
  "message": "User content - accessible by ROLE_EDITOR, ROLE_MODERATOR, ROLE_ADMIN",
  "user": { "id": 1, "email": "user@example.com" }
}
```

---

#### `GET /api/test/mod`
Accessible par `ROLE_MODERATOR` et `ROLE_ADMIN` uniquement.

**Réponse `200`**
```json
{
  "message": "Moderator content - accessible by ROLE_MODERATOR, ROLE_ADMIN",
  "user": { "id": 1, "email": "user@example.com" }
}
```

---

#### `GET /api/test/admin`
Accessible par `ROLE_ADMIN` uniquement.

**Réponse `200`**
```json
{
  "message": "Admin content - accessible by ROLE_ADMIN only",
  "user": { "id": 1, "email": "user@example.com" }
}
```

---

---

## Sécurité — mécanismes auth

| Mécanisme | Description |
|-----------|-------------|
| **JWT HS256** | Access token signé, expiration 15 min |
| **Refresh Token opaque** | Généré avec `crypto.randomBytes(64)`, stocké en base |
| **Rotation** | Chaque `/refresh` révoque l'ancien token et en émet un nouveau |
| **Reuse Detection** | Si un token déjà révoqué est présenté → tous les tokens du compte sont révoqués |
| **Inactivité** | Token non utilisé depuis 3 jours révoqué automatiquement |
| **Révocation au login** | Tous les tokens actifs sont révoqués à chaque nouvelle connexion |
| **bcrypt** | Mots de passe hashés avec un coût de 10 |