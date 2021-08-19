# Technical test for Indy


## Prerequisites

- NodeJS 14 or >
- NPM 7 or > 


## Useful commands

    $ npm install           # Install dependencies
    
    $ npm run build         # Build sources
    $ npm run start         # Start server
    
    $ npm run watch         # Watch sources then build
    $ npm run start:dev     # Start server and restart it when build directory changes

    $ npm run lint          # Lint code with ts-standard      
    $ npm run lint:fix      # Format code with ts-standard


## Sample requests

Register a promo code:  

    $ curl -d '{"name":"StudentReduction","avantage":{"percent":50},"conditions":{"all":[{"fact":"age","operator":"greaterThan","value":15},{"fact":"age","operator":"lessThan","value":18}]}}' \
           -v -H "Content-Type: application/json" \
           http://localhost:10180/promo-code


Test promo code, request accepted:    

    $ curl -d '{"name":"StudentReduction","facts":{"age":16}}' \
           -v -H "Content-Type: application/json" \
           http://localhost:10180/promo-code/validity

    // Response
    {"status":"Accepted","promoCodeName":"StudentReduction","avantage":{"percent":50}}


Test promo code, request denied:    

    $ curl -d '{"name":"StudentReduction","facts":{"age":55}}' \
           -v -H "Content-Type: application/json" \
           http://localhost:10180/promo-code/validity

    // Response
    {"status":"Denied","promoCodeName":"StudentReduction","reasons":[{"text":"age MUST BE lessThan THAN/TO 18","fact":"age","operator":"lessThan","value":"18"}]}


## TODO

- API endpoint for promocode registration
- API endpoint for promocode checks
```
    // Input
    
     {
      "promocode_name": "WeatherCode",
      "arguments": {
        "age": 25,
        "meteo": { "town": "Lyon" }
      }
    }

    // Output, code accepted
    
    {
      "promocode_name": "WeatherCode",
      "status": "accepted",
      "avantage": { "percent": 20 }
    }
    
    // Output, code denied
    
    {
      "promocode_name": "WeatherCode",
      "status": "denied",
      "reasons": {
        "meteo": "isNotClear"
      }
    }
```
- Add a rule engine
```
    or
    and
    
    eq
    lt
    gt
    after -> gt ?
    before -> lt ?
    is -> equal ?
```
- Make these rules work
```
    // Sample 1
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
              "gt": 15,
              "lt": 30,
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
    
    // Sample 2
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
```
- Connect weather API
- Add documentation
- Lint, sort package json
- Publish private repository and share with: RomainKoenig, Cedric25, romaric-juniet, edas, EmelineDava
- List of things to do further
  - Input / output validation
  - ...
