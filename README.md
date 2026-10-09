# Atelier Matière — frontend (prototype)

Boutique e-commerce premium pour des créations en bois et en verre personnalisables par gravure.
Cette version est **uniquement le frontend** : toutes les pages sont navigables et interactives,
mais aucune donnée n'est enregistrée, aucun e-mail n'est envoyé et aucun paiement n'est possible.
Un bandeau « Prototype » le rappelle en haut de chaque page.

**Stack :** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · polices DM Sans et Cormorant Garamond (auto-hébergées).

## Démarrer

```bash
npm install
npm run dev          # http://localhost:3000
```

Production : `npm run build` puis `npm start` (Vercel ou Netlify avec le runtime Next.js).

## Photos

Les visuels sont de vraies photos Unsplash (licence Unsplash, usage commercial autorisé), **illustratives** :
elles ne représentent pas exactement les produits vendus, et les fiches produits l'indiquent.

- Par défaut, elles sont chargées depuis `images.unsplash.com`.
- Pour les stocker dans le projet : `npm run images:download` (rangement dans `public/assets/images/hero|products|categories|workshop`),
  puis `NEXT_PUBLIC_LOCAL_IMAGES=true` dans `.env.local`.
- Tous les chemins sont centralisés dans **`src/lib/data/image-manifest.json`**.

## Où modifier quoi

| Élément | Fichier |
|---|---|
| Textes de l'accueil, À propos, pied de page, ordre et visibilité des sections | `src/lib/data/defaults.ts` (`DEFAULT_CONTENT`) |
| Nom de la marque, contact, réseaux sociaux, bandeau d'annonce, livraison | `src/lib/data/defaults.ts` (`DEFAULT_SETTINGS`) |
| Mentions légales, CGU, CGV, confidentialité (modèles à compléter et faire valider) | `src/lib/data/defaults.ts` (`DEFAULT_LEGAL`) |
| Produits, catégories, prix, stock, options de gravure | `src/lib/data/demo-catalog.ts` |
| Couleurs, typographie, boutons | `src/app/globals.css` (bloc `@theme`) |

## Contenu

- **Accueil** : Hero éditoriale, catégories, « Les créations du moment », personnalisation, savoir-faire, processus en 4 étapes, avis (exemples signalés), appel final.
- **Boutique** : catégories, recherche, filtres, tri prix / nouveautés, états *Disponible / Bientôt disponible / Rupture de stock / Gravure sur demande*.
- **Fiche produit** : galerie, description, caractéristiques, entretien, livraison, produits associés, formulaire d'avis.
- **Personnalisation** : texte limité, date, police, motif, instructions, image de référence, **aperçu simulé** de la gravure, supplément et délai affichés.
- **Formulaires** sur mesure, contact et avis : validation côté serveur, consentement, messages d'erreur et de retour.
- **Panier** (dans le navigateur) : prix et stock recalculés côté serveur ; un produit en rupture bloque la commande.
- **Commande** : coordonnées, livraison, acceptation des CGV ; le paiement affiche un message explicite (aucun paiement simulé).
- **Documents légaux** en fenêtre modale (lien `#legal/cgv`, Échap, focus géré).
- **Responsive** : barre flottante en bas sur mobile/tablette, zones de sécurité respectées, pas de débordement horizontal.

## Pour passer en vrai site marchand

Les points à brancher sont regroupés dans `src/actions/public.ts` (formulaires, panier, commande) :
envoi des demandes, paiement Stripe avec vérification serveur du stock et webhook signé, administration, modération des avis.
