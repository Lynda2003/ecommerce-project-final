# ShopTN — E-Commerce MERN Stack

> Projet Final — Formation Développement Web Full Stack | GoMyCode Tunisie 2026

---

##  Liens de déploiement

| Service | URL |
|---------|-----|
|  Frontend (Netlify) | https://stupendous-kitten-b2210a.netlify.app |
|  Backend API (Azure) | https://mernapp-lynda-dzbqengsgzdhayfh.swedencentral-01.azurewebsites.net |
|  GitHub | https://github.com/Lynda2003/ecommerce-project-final |

---

##  Description du projet

ShopTN est une plateforme e-commerce complète développée avec le stack MERN. Elle permet aux utilisateurs tunisiens de parcourir des produits, gérer leur panier et passer des commandes en **Dinars Tunisiens (DT)**.

---

##  Technologies utilisées

| Couche | Technologie |
| **Frontend** | React.js, Redux Toolkit, CSS3, JavaScript |
| **Backend** | Node.js, Express.js, REST API |
| **Base de données** | MongoDB, Mongoose, MongoDB Atlas |
| **Authentification** | JWT (JSON Web Tokens) |
| **Images** | Cloudinary |
| **Déploiement** | Microsoft Azure (Backend) + Netlify (Frontend) |
| **Versioning** | Git, GitHub |
| **Outils** | VS Code, Postman, Canva |

---

##  Fonctionnalités

###  Utilisateur
-  Inscription et connexion sécurisée (JWT)
-  Catalogue produits avec filtres par catégorie
-  Recherche de produits
-  Page détail produit avec avis clients
-  Panier d'achat dynamique
-  Processus de commande en 3 étapes
-  Historique des commandes
-  Modification du profil

###  Admin
-  Dashboard avec statistiques
-  Gestion des produits (CRUD)
-  Gestion des commandes avec statuts
-  Gestion des clients

###  Design
-  Design moderne et responsive
-  Prix en Dinars Tunisiens (DT)
-  Mobile-first
-  Animations et transitions fluides

---

## Installation locale

### Prérequis
- Node.js v18+
- MongoDB Atlas account
- Git

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Variables d'environnement
Créer `backend/.env` :

---

##  Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
|  Admin | admin@ecommerce.com | admin123456 |
|  Client | Créer un compte | - |

---

---

##  API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Inscription |
| POST | /api/auth/login | Connexion |
| GET | /api/products | Liste produits |
| GET | /api/products/:id | Détail produit |
| POST | /api/orders | Créer commande |
| GET | /api/orders/myorders | Mes commandes |
| GET | /api/users/profile | Mon profil |

---

##  Développeusse

**Lynda Bedhiafi**
Formation Full Stack MERN — GoMyCode Tunisie 2026

---

© 2026 ShopTN — Projet Final GoMyCode Full Stack MERN