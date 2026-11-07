# You're Døomed 🕯️ · version synchronisée

Tes recettes, repas, séances, poids, créatine, objectifs et profils sont partagés
entre tous tes appareils (Fold, Mac…) qui ont le même code de synchro.
Les données sont stockées sur ton compte Netlify (Netlify Blobs), protégées par ce code.

## Contenu du dossier

- `public/` : l'appli (les mêmes fichiers que d'habitude)
- `netlify/functions/sync.mjs` : le petit serveur de synchro (adresse `/api/sync`)
- `netlify/lib/core.mjs` : vérification du code et enregistrement
- `netlify.toml`, `package.json` : réglages pour Netlify

## 1. GitHub (une seule fois)

1. Sur github.com : bouton **+** → **New repository**.
   - Nom : `youre-doomed`
   - Coche **Private**.
   - **Create repository**.
2. Clique le lien **uploading an existing file**.
3. Glisse **tout le contenu** du dossier décompressé : le dossier `public`, le dossier `netlify`, `netlify.toml`, `package.json` et ce fichier.
4. **Commit changes**.

## 2. Netlify (une seule fois)

**Garde ton site actuel** : en le reliant à GitHub, l'adresse ne change pas, donc l'appli
déjà installée sur tes appareils et les données qu'elle contient restent en place.

1. Sur app.netlify.com, ouvre ton site You're Døomed actuel.
2. **Project configuration** (ou **Site configuration**) → **Build & deploy** → **Continuous deployment** → **Link repository** (ou « Link to Git »).
3. Choisis **GitHub**, autorise l'accès si demandé, puis le dépôt `youre-doomed`.
4. Laisse les réglages proposés (ils viennent de `netlify.toml` : dossier publié `public`) et valide.
5. **Project configuration → Environment variables → Add a variable** :
   - Key : `CODE_SYNC`
   - Value : ton code de synchro, **12 caractères ou plus** (ex. `Doom-Synchro-4821`). Ne le mets nulle part dans GitHub.
6. **Deploys → Trigger deploy → Deploy project**, pour que le code soit pris en compte.

Si Netlify refuse de relier ton site actuel, crée un nouveau projet avec
**Add new project → Import an existing project → GitHub**, puis fais les étapes 5 et 6.
L'adresse changera : sur chaque appareil, avant de passer à la nouvelle, ouvre l'ancienne appli
→ 💾 Mes données → **Copier mes données**, puis **Importer** dans la nouvelle.

## 3. Activer sur chaque appareil

1. Ouvre l'appli (ferme-la et rouvre-la deux fois pour charger la nouvelle version).
2. Touche la ligne « 📱 Enregistré sur cet appareil uniquement » en bas de l'écran
   (ou le bouton 💾 Mes données).
3. Section **☁️ Synchro entre appareils** : tape le code, **Activer**.
4. Fais pareil sur l'autre appareil avec **le même code**.

Au premier branchement, ce qui n'existe que sur l'appareil est envoyé : recettes perso,
séances, poids, créatine, et les repas d'un même jour sont fusionnés.

## Au quotidien

- Une modification part en une seconde environ. Les autres appareils la reçoivent
  quand tu rouvres l'appli, ou dans les 30 secondes si elle est déjà ouverte.
- **Hors ligne** : tu peux tout faire. La ligne du bas indique « modif. en attente de réseau »,
  et tout part au retour du réseau.
- Si tu modifies la même chose sur deux appareils au même moment, la dernière modification gagne.
- **Le Labo** (aliments perso et réglages du calculateur) reste propre à chaque appareil.
- **Sauvegarde** : le serveur garde une copie automatique de tes données par jour (Netlify Blobs, entrées `backup-AAAA-MM-JJ`).

## Mettre à jour l'appli

Sur GitHub, ouvre le dépôt → **Add file → Upload files** → glisse le contenu du nouveau
dossier (les fichiers du même nom sont remplacés) → **Commit changes**. Netlify republie
tout seul en une minute environ. Tes données ne sont pas touchées.

## Changer le code

Modifie `CODE_SYNC` dans Netlify, relance un déploiement, puis sur chaque appareil :
💾 Mes données → Désactiver ici → entre le nouveau code.
