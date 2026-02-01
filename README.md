# Trade Dashboard

Dashboard minimaliste et futuriste pour référencer vos trades, avec graphiques et persistance des données.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## Fonctionnalités

- **Formulaire de trade** : date, heure, gain/perte, devise
- **Liste des derniers trades** : suppression rapide.
- **Persistance** : les données sont enregistrées dans le navigateur (localStorage), vous n’avez pas à tout ressaisir à chaque visite.
- **Statistiques** : PnL total, win rate, nombre de trades gagnants, profit factor.
- **Graphiques** :
  - PnL cumulé dans le temps
  - PnL par symbole (top 10)
  - PnL Long vs Short (camembert)
  - PnL par mois (12 derniers mois)
