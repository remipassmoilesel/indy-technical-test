import { PromoCode } from './entities/PromoCode'
import { DateTime } from 'luxon'
import { PromoCodeService } from './PromoCodeService'
import { PromoCodeDao } from './PromoCodeDao'
import { expect } from 'chai'
import { CodeRequestStatus } from './entities/ValidationResult'

describe('PromoCodeService', () => {
  const sampleCode1: PromoCode = {
    name: 'WeatherCode1',
    avantage: { percent: 20 },
    conditions: {
      all: [
        // Age conditions
        {
          any: [
            { fact: 'age', operator: 'equal', value: 40 },
            {
              all: [
                { fact: 'age', operator: 'greaterThan', value: 15 },
                { fact: 'age', operator: 'lessThan', value: 30 }]
            }
          ]
        },
        // Request date conditions
        {
          fact: 'requestDate',
          operator: 'greaterThan',
          value: DateTime.fromObject({ year: 2019, month: 1, day: 1 }).toSeconds()
        },
        {
          fact: 'requestDate',
          operator: 'lessThan',
          value: DateTime.fromObject({ year: 2022, month: 1, day: 1 }).toSeconds()
        },
        // Weather conditions
        { fact: 'weatherName', operator: 'equal', value: 'clear' },
        { fact: 'temperature', operator: 'greaterThan', value: 15 }
      ]
    }
  }

  let service: PromoCodeService
  beforeEach(async () => {
    service = new PromoCodeService(new PromoCodeDao())
    await service.addCode(sampleCode1)
  })

  describe.only('isAllowed', () => {
    it('should return allowed', async () => {
      // Prepare
      const facts = {
        age: 40,
        requestDate: DateTime.fromObject({ year: 2019, month: 2, day: 1 }).toSeconds(),
        weatherName: 'clear',
        temperature: 25
      }

      // Act
      const result = await service.isAllowed('WeatherCode1', facts)

      // Assert
      expect(result).deep.equals({
        status: CodeRequestStatus.Accepted,
        promoCodeName: 'WeatherCode1',
        avantage: { percent: 20 }
      })
    })

    it('should return denied if age does not fit', async () => {
      // Prepare
      const facts = {
        age: 55,
        requestDate: DateTime.fromObject({ year: 2019, month: 2, day: 1 }).toSeconds(),
        weatherName: 'clear',
        temperature: 25
      }

      // Act
      const result = await service.isAllowed('WeatherCode1', facts)

      // Assert
      expect(result).deep.equals({
        status: CodeRequestStatus.Denied,
        promoCodeName: 'WeatherCode1',
        reasons: [
          { text: 'age MUST BE equal THAN/TO 40', fact: 'age', operator: 'equal', value: '40' },
          { text: 'age MUST BE lessThan THAN/TO 30', fact: 'age', operator: 'lessThan', value: '30' }
        ]
      })
    })

    it('should return denied if request temperature does not fit', async () => {
      // Prepare
      const facts = {
        age: 18,
        requestDate: DateTime.fromObject({ year: 2020, month: 2, day: 1 }).toSeconds(),
        weatherName: 'clear',
        temperature: 5
      }

      // Act
      const result = await service.isAllowed('WeatherCode1', facts)

      // Assert
      expect(result).deep.equals({
        status: CodeRequestStatus.Denied,
        promoCodeName: 'WeatherCode1',
        reasons: [
          { text: 'temperature MUST BE greaterThan THAN/TO 15', fact: 'temperature', operator: 'greaterThan', value: '15' }
        ]
      })
    })
  })
})
