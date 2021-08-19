/* eslint-disable @typescript-eslint/strict-boolean-expressions,@typescript-eslint/brace-style */
import { PromoCodeDao } from './PromoCodeDao'
import { AllConditions, AnyConditions, ConditionProperties, PromoCode } from '../entities/PromoCode'
import { CodeRequestStatus, Failure, ValidationResult } from '../entities/ValidationResult'
import { Engine } from 'json-rules-engine'
import { WeatherDao } from './WeatherDao'
import { DateTime } from 'luxon'

/**
 * Values of these facts will be replaced
 */
export enum CompletedFacts {
  Temperature= 'temperature',
  WeatherName= 'weatherName',
  Date= 'date',
}

export class PromoCodeService {
  constructor (private readonly codes: PromoCodeDao, private readonly weather: WeatherDao) {
  }

  public async addCode (promoCode: PromoCode): Promise<void> {
    await this.codes.save(promoCode)
  }

  public async isAllowed (promoCodeName: string, facts: Record<string, string | number>): Promise<ValidationResult> {
    // We fetch promo code from database
    const promoCode = await this.codes.getByName(promoCodeName)
    if (!promoCode) {
      throw new Error(`Promo code not found with name: ${promoCodeName}`)
    }

    // We instantiate a new rule engine.
    const engine = new Engine()
    engine.addRule({ conditions: promoCode.conditions, event: { type: 'accepted' } })

    // We complete facts (weather, dates)
    const completedFacts = await this.completeFacts(facts)
    const internalResult = await engine.run(completedFacts)

    // Rules passed, we return Accepted status
    if (internalResult.results.length > 0) {
      return {
        status: CodeRequestStatus.Accepted,
        promoCodeName: promoCode.name,
        avantage: promoCode.avantage
      }
    }
    // Rules does not pass, we return Denied status
    else {
      const reasons = internalResult.failureResults.flatMap(r => this.getFailures(r.conditions))
      return {
        status: CodeRequestStatus.Denied,
        promoCodeName: promoCode.name,
        reasons
      }
    }
  }

  /**
   * This method extract failures from json-rules-engine result.
   * With more time we can do lot better.
   *
   * @param condition
   * @param currents
   * @private
   */
  private getFailures (condition: AllConditions | AnyConditions | ConditionProperties, currents: Failure[] = []): Failure[] {
    if (condition.result === true) {
      return []
    }

    if ('all' in condition) {
      return condition.all.flatMap(c => this.getFailures(c, currents))
    } else if ('any' in condition) {
      return condition.any.flatMap(c => this.getFailures(c, currents))
    } else {
      const text = `${condition.fact} MUST BE ${condition.operator} THAN/TO ${String(condition.value)}`
      return currents.concat([{
        text,
        fact: condition.fact,
        operator: condition.operator,
        value: String(condition.value)
      }])
    }
  }

  /**
   * This method complete facts if some 'magical' property names are used (see CompletedFacts)
   *
   * Ideally we can create a 'filter system' which would be more modular than just a method.
   *
   * @param facts
   * @private
   */
  private async completeFacts (facts: Record<string, string | number>): Promise<Record<string, string | number>> {
    const result = { ...facts }

    // Fetch weather or temperatures if necessary
    const hasTemperature = Object.keys(facts).filter(k => k === CompletedFacts.Temperature)
    const hasWeatherName = Object.keys(facts).filter(k => k === CompletedFacts.WeatherName)
    if (hasTemperature || hasWeatherName) {
      const weather = await this.weather.getWeather()

      if (hasTemperature) {
        result.temperature = weather.temperature
      }

      if (hasWeatherName) {
        result.weatherName = weather.name
      }
    }

    // Parse dates if any and transform them to timestamps
    const hasDate = Object.keys(facts).filter(k => k === CompletedFacts.Date)
    if (hasDate && typeof facts.date === 'string') {
      result.date = DateTime.fromISO(facts.date).toSeconds()
    }

    return result
  }
}
