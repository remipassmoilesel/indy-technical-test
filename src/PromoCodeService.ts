import { PromoCodeDao } from './PromoCodeDao'
import { AllConditions, AnyConditions, ConditionProperties, PromoCode } from './PromoCode'
import { CodeRequestStatus, Result } from './Result'
import { Engine } from 'json-rules-engine'

export class PromoCodeService {
  constructor (private readonly codes: PromoCodeDao) {
  }

  public async addCode (promoCode: PromoCode): Promise<void> {
    return await this.codes.save(promoCode)
  }

  public async isAllowed (promoCodeName: string, facts: Record<string, string | number>): Promise<Result> {
    const promoCode = await this.codes.getByName(promoCodeName)
    if (promoCode == null) {
      throw new Error(`Promo code not found with name: ${promoCodeName}`)
    }

    const engine = new Engine()
    engine.addRule({ conditions: promoCode.conditions, event: { type: 'accepted' } })

    const internalResult = await engine.run(facts)
    if (internalResult.results.length > 0) {
      return {
        status: CodeRequestStatus.Accepted,
        promoCodeName: promoCode.name,
        avantage: promoCode.avantage
      }
    } else {
      const reasons = internalResult.failureResults.flatMap(r => this.getFailures(r.conditions))
      return {
        status: CodeRequestStatus.Denied,
        promoCodeName: promoCode.name,
        reasons
      }
    }
  }

  private getFailures (condition: AllConditions | AnyConditions | ConditionProperties, currents: string[] = []): string[] {
    if (condition.result === true) {
      return []
    }

    if ('all' in condition) {
      return condition.all.flatMap(c => this.getFailures(c, currents))
    } else if ('any' in condition) {
      return condition.any.flatMap(c => this.getFailures(c, currents))
    } else {
      return currents.concat([`${condition.fact} MUST BE ${condition.operator} THAN/TO ${String(condition.value)}`])
    }
  }
}
