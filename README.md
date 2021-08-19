# Technical test for Indy

## Prerequisites

- NodeJS 14 or >
- NPM 7 or > 


## Getting started

```bash
  $ git clone git@github.com:remipassmoilesel/indy-technical-test.git
  $ npm install
  $ npm run build
  $ npm run start
```


## Sample requests

Register a promo code:  
```bash
    $ curl -d '{"name":"StudentReduction","avantage":{"percent":50},"conditions":{"all":[{"fact":"age","operator":"greaterThan","value":15},{"fact":"age","operator":"lessThan","value":18}]}}' \
           -v -H "Content-Type: application/json" \
           http://localhost:10180/promo-code
```

Test promo code by submitting facts, request accepted:    
```bash
    $ curl -d '{"name":"StudentReduction","facts":{"age":16}}' \
           -v -H "Content-Type: application/json" \
           http://localhost:10180/promo-code/validity

    // Response
    {"status":"Accepted","promoCodeName":"StudentReduction","avantage":{"percent":50}}
```

Test promo code, request denied:    
```bash
    $ curl -d '{"name":"StudentReduction","facts":{"age":55}}' \
           -v -H "Content-Type: application/json" \
           http://localhost:10180/promo-code/validity

    // Response
    {"status":"Denied","promoCodeName":"StudentReduction","reasons":[{"text":"age MUST BE lessThan THAN/TO 18","fact":"age","operator":"lessThan","value":"18"}]}
```

## Promo code format

Sample request from subject can be expressed as this:  

```json
{
  "name": "WeatherCode1",
  "avantage": {
    "percent": 20
  },
  "conditions": {
    "all": [
      {
        "any": [
          {
            "fact": "age",
            "operator": "equal",
            "value": 40
          },
          {
            "all": [
              {
                "fact": "age",
                "operator": "greaterThan",
                "value": 15
              },
              {
                "fact": "age",
                "operator": "lessThan",
                "value": 30
              }
            ]
          }
        ]
      },
      {
        "fact": "requestDate",
        "operator": "greaterThan",
        "value": 1546297200
      },
      {
        "fact": "requestDate",
        "operator": "lessThan",
        "value": 1640991600
      },
      {
        "fact": "weatherName",
        "operator": "equal",
        "value": "clear"
      },
      {
        "fact": "temperature",
        "operator": "greaterThan",
        "value": 15
      }
    ]
  }
}
```


## Useful commands

```bash
    $ npm install           # Install dependencies
    
    $ npm run build         # Build sources
    $ npm run start         # Start server
    
    $ npm run watch         # Watch sources then build
    $ npm run start:dev     # Start server and restart it when build directory changes

    $ npm run lint          # Lint code with ts-standard      
    $ npm run lint:fix      # Format code with ts-standard
```

## When is the weather forecast called ? 

The weather is called if one of the facts has the name `weatherName` or `temperature`. I decided to implement it this way 
to make the use of the weather reusable. 


## Problems 

Dates are usable in ISO format only if fact is named `date`. Otherwise timestamps are needed. This problem should be easily 
addressable by using [custom operators](https://github.com/CacheControl/json-rules-engine/blob/master/examples/06-custom-operators.js).


## Things to do

- Improve facts completion structure and logic
- Validate inputs and outputs in HTTP controller
- Integration tests for API contracts
- Create our conditions model for database storage (see PromoCode.ts)


## TODO

- Share with: RomainKoenig, Cedric25, romaric-juniet, edas, EmelineDava
