Salut Rémi, 

J'espère que tu vas bien. Comme convenu, voici les consignes pour le test technique.

Le but est de le faire en 4 heures.
Pour la restitution tu peux créer un repo github privé avec RomainKoenig, Cedric25, romaric-juniet, edas et EmelineDaval en collaborateur.

Note importante : il faut que tu fasses au moins 2 commits pour aider nos correcteurs à avoir les bonnes informations :
1 au démarrage du test. Permettant de bien voir à quelle heure tu as commencé le test
1 au bout des 4 heures 

Tu pourras également continuer après les deux heures en créant une nouvelle branche.

Consignes

## Test technique back-end

### Contexte

L'idée est de faire un microservice qui valide ou non des requêtes de promocode.
Vous êtes une entreprise de réservation de VTC type Uber ou Chauffeur-Privé et tu souhaites encourager tes clients à réserver lorsqu'il fait beau.
L'équipe marketing peut ajouter des "promocodes" en base dont la structure sera détaillée en dessous.
Les clients peuvent appeler l'API sur une autre route avec des arguments pour demander une réduction.


### Spécifications

Pour cela, il s'agit de réaliser une API en Node.js. L'utilisation de n'importe quel framework, librairie, outil est autorisé.
Voici un exemple de promocode en base, il valide une demande de réduction de 20% si :

l'âge du client est soit
- de 40 ans (c'est l'âge du patron de l'entreprise ! 😂
- entre 15 et 35 ans (pour encourager la jeunesse)

la date de la demande du code est
- après le 1er janvier 2019 inclus
- avant le 30 juin 2020 inclus

le météo
- claire (pas de pluie)
- suffisamment douce, plus de 15°C


    // PROMOCODE :
    
    {
    
      "_id": "...",
    
      "name": "WeatherCode",
    
      "avantage": { "percent": 20 },
    
      "restrictions": {
    
        "@or": [
    
          {
    
            "@age": {
    
              "eq": 40
    
            }
    
          },
    
          {
    
            "@age": {
    
              "lt": 30,
    
              "gt": 15
    
            }
    
          }
    
        ],
    
        "@date": {
    
          "after": "2019-01-01",
    
          "before": "2020-06-30"
    
        },
    
        "@meteo": {
    
          "is": "clear",
    
          "temp": {
    
            "gt": "15" // Celsius here.
    
          }
    
        }
    
      }
    
    }

Il s'agit d'un exemple, il peut exister des promocodes de bien d'autres forme dans le cadre de cette exercice, voici un autre exemple potentiel d'un promocode de
ce service :
    
    {
    
      "_id": "...",
    
      "name": "WeatherCodeBis",
    
      "avantage": { "percent": 30 },
    
      "restrictions": {
    
        "@or": [
    
          {
    
            "@age": {
    
              "eq": 40
    
            }
    
          },
    
          {
    
            "@date": {
    
              "after": "2020-01-01",
    
              "before": "2029-01-01"
    
            }
    
          },
    
          {
    
            "@date": {
    
              "after": "2099-01-01"
    
            }
    
          }
    
        ],
    
        "@age": {
    
          "lt": 30,
    
          "gt": 15
    
        }
    
      }
    
    }

Qui se lit en : "Pour que le code soit valide, il faut que "l'age soit compris entre 15 et 30" 
ET ("l'age égale 40" OU "la date est comprise entre 2020 et 2029" OU "la date est après 2099") 
Il doit aussi pouvoir être validé ou non en fonction des paramètres qu'on va envoyer au service.

Vous pouvez retrouver ce JSON bien formaté sur ce gist : https://gist.github.com/cedric25/0b08ac65d7f3cc94f792adb3a4a6663d

Pour qu'une demande de réduction soit acceptée, toutes les règles du promocode demandé doivent être validées (c'est à dire celles dans l'attribut restrictions). Dans le 
promocode ci dessus il s'agirait donc de @date, @meteo et @or. On peut voir ici que certaines règles peuvent en inclure d'autres (comme @or, @and ...) et cela peut aller 
jusqu'à une profondeur arbitraire.

Exemple d'un message pour faire une demande de réduction :
    
    // DEMANDE DE RÉDUCTION :
    
    {
    
      "promocode_name": "WeatherCode",
    
      "arguments": {
    
        "age": 25,
    
        "meteo": { "town": "Lyon" }
    
      }
    
    }
    
    // RÉPONSE si météo claire à l'heure actuelle
    
    {
    
      "promocode_name": "WeatherCode",
    
      "status": "accepted",
    
      "avantage": { "percent": 20 }
    
    }
    
    // RÉPONSE si météo pluvieuse à l'heure actuelle
    
    {
    
      "promocode_name": "WeatherCode",
    
      "status": "denied",
    
      "reasons": {
    
        "meteo": "isNotClear"
    
      }
    
    }

Pour la structure des données, le format est donné en exemple mais n'hésites pas à faire une autre proposition si tu la juges plus pertinente. Les spécifications sont 
minimales, pour laisser au candidat la liberté de rajouter les choses qu'ils trouvent nécessaires ou utiles aux routes comme les erreurs, le format des réponses, 
règles supplémentaires etc...

Tu peux aussi changer les clés des rules : lt, bt, before, after etc... si tu le souhaites dans quelquechose qui est plus pratique pour toi

autre exemple de format possible pour les rules :
    
    [
    
      {
    
        "restriction_name": "meteo",
    
        "restrictions": [
    
          {
    
            // ...
    
          }
    
        ]
    
      },
    
      {
    
        // ...
    
      }
    
    ]

### Consignes

Dans l'exercice il faut au minimum :
- Une route pour ajouter un promocode.
- Une route pour faire une demande de réduction.
- Que les promocodes en exemple (ci-dessus) fonctionnent


### Bonus (dans le désordre) :

- Ajouter des tests automatisés
- Une règle @and explicite, une règle @not explicite (qui inverse une règle prise en paramètre), si tu as d'autres idées n'hésites pas.
- Ajouter dans un readme.md ou dans le mail, une liste de commande curl ou un lien vers une collection postman avec des requêtes pour pouvoir tester l'API
- Faire une authentification pour que la route "ajouter un promocode" ne soit accessible que si la requête est authentifiée.
- Héberger le service dans le Cloud, et nous donner l'url pour tester.
- N'importe quelle idée à toi !


### Aides

Pour la météo, possibilité d'utiliser openWeatherMap avec l'API key suivante :
https://openweathermap.org/ (doc sur le site, API KEY: d0562f476913da692a065c608d0539f6 (60 calls/min))

Pour l'hébergement, Heroku dispose d'un tiers gratuit et facile d'utilisation.
Penses bien à l'architecture des dossiers/fichiers. Respecte les bonnes pratiques.

⚠️ Pour l'algo n'oublie pas que la profondeur des restrictions est arbitraire et sans limite.

Bon courage :)