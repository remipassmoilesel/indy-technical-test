import { PromoCode } from '../entities/PromoCode'
import { DateTime } from 'luxon'
import { PromoCodeService } from './PromoCodeService'
import { PromoCodeDao } from './PromoCodeDao'
import { expect } from 'chai'
import { CodeRequestStatus } from '../entities/ValidationResult'
import { WeatherDao } from './WeatherDao'
import * as sinon from 'sinon'
import { SinonStubbedInstance } from 'sinon'

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
          fact: 'date',
          operator: 'greaterThan',
          value: DateTime.fromObject({ year: 2019, month: 1, day: 1 }).toSeconds()
        },
        {
          fact: 'date',
          operator: 'lessThan',
          value: DateTime.fromObject({ year: 2022, month: 1, day: 1 }).toSeconds()
        },
        // Weather conditions
        { fact: 'weatherName', operator: 'equal', value: 'clear' },
        { fact: 'temperature', operator: 'greaterThan', value: 15 }
      ]
    }
  }

  let weatherDao: SinonStubbedInstance<WeatherDao>
  let service: PromoCodeService
  beforeEach(async () => {
    weatherDao = sinon.createStubInstance(WeatherDao)
    service = new PromoCodeService(new PromoCodeDao(), weatherDao as unknown as WeatherDao)
    await service.addCode(sampleCode1)
  })

  describe('isAllowed', () => {
    it('should return allowed', async () => {
      // Prepare
      const facts = {
        age: 40,
        date: '2019-02-01',
        weatherName: '', // These facts will be replaced
        temperature: 0
      }
      weatherDao.getWeather.resolves({ name: 'clear', temperature: 25 })

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
        date: '2019-02-01',
        weatherName: '',
        temperature: 0
      }
      weatherDao.getWeather.resolves({ name: 'clear', temperature: 25 })

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
        date: '2019-02-01',
        weatherName: '',
        temperature: 0
      }
      weatherDao.getWeather.resolves({ name: 'clear', temperature: 5 })

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

    it('should return denied if date does not fit', async () => {
      // Prepare
      const facts = {
        age: 18,
        date: '2023-02-01',
        weatherName: '',
        temperature: 0
      }
      weatherDao.getWeather.resolves({ name: 'clear', temperature: 25 })

      // Act
      const result = await service.isAllowed('WeatherCode1', facts)

      // Assert
      expect(result).deep.equals({
        status: CodeRequestStatus.Denied,
        promoCodeName: 'WeatherCode1',
        reasons: [
          { text: 'date MUST BE lessThan THAN/TO 1640991600', fact: 'date', operator: 'lessThan', value: '1640991600' }
        ]
      })
    })
  })
})
