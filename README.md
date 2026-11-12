# Tamagotchi — Compagnon Virtuel Interactif

Un jeu web inspiré du célèbre Tamagotchi, conçu et développé de l'illustration des personnages jusqu'à la mécanique de jeu en temps réel.

---

## À propos du projet

L'objectif de ce projet était de donner vie à des illustrations originales créées sur **Figma** en les intégrant dans une interface web interactive. Le joueur crée son compagnon virtuel, veille sur ses besoins vitaux au fil du temps et le fait gagner en expérience pour passer les niveaux.

---

## Fonctionnalités principales

* **Création personnalisée :** Choix parmi plusieurs créatures dessinées à la main sur Figma et attribution d'un nom unique.
* **Gestion des besoins en temps réel :** Trois jauges vitales qui diminuent progressivement avec le temps :
  * **Bonheur**
  * **Energie**
  * **Faim**
* **Panel d'actions interactives :** Interagissez avec votre compagnon pour le **nourrir**, **jouer** avec lui, le faire **dormir** ou le **soigner** lorque ses jauges sont au plus bas.
* **Système de niveaux & d'expérience :** Gagnez de l'expérience (jauge sur 100 points) en prenant soin de votre Tamagotchi pour le faire monter de niveau.
* **Sauvegarde automatique :** Persistance des données permettant de quitter la page et de retrouver son compagnon exactement dans l'état où on l'a laissé.
* **Historique des scores :** Consultation des records et des parties passées.

---

## Technologies & Outils utilisés

* **Design & Illustrations :** Figma (création vectorielle des *pets* et maquettage UI)
* **Front-End :** HTML5, CSS3, JavaScript (ES6+)
* **Persistance des données :** LocalStorage

---

## Installation et lancement

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/Sanitikhan/Tamagotchi.git
   ```
2. **Accéder au dossier du projet :**
   ```bash
   cd Tamagotchi
   ```
3. **Lancer l'application :**
   Ouvrez simplement le fichier `index.html` dans votre navigateur préféré (ou utilisez une extension comme *Live Server* sur VS Code).

---

## Ce que j'ai appris

* **De l'illustration au code :** Transformer des créations vectorielles Figma en composants web vivants et réactifs.
* **Logique temporelle en JavaScript :** Gestion des intervalles de temps, décroissance dynamique des états et équilibrage du gameplay.
* **Persistance côté client :** Sauvegarde et récupération structurée de l'état d'une application entre deux sessions utilisateur.

---

## Améliorations futures (Idées)

* Mini-jeux intégrés pour gagner des points de bonheur et d'expérience.
* Système d'évolution visuelle de la créature à certains paliers de niveaux.
* Différents types de nourriture à donner avec différents points de bonheur et d'expérience.
* Trouver un système plus attractif pour le bouton **Soigner**.
* Ajouter un système de monnaie à gagner et dépenser dans les actions.


---

*Conçu et développé par — [Sanitikhan](https://github.com/Sanitikhan)*
