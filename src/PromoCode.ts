import { Avantage } from './Avantage'

export interface PromoCode {
  name: string
  avantage: Avantage
  conditions: TopLevelCondition
}

// These types where imported from json-rules-engine
// FIXME: we must create our own model
export interface ConditionProperties {
  fact: string
  operator: string
  value: { fact: string } | any
  path?: string
  priority?: number
  params?: Record<string, any>
  result?: boolean
}

type NestedCondition = ConditionProperties | TopLevelCondition
export interface AllConditions { all: NestedCondition[], result?: boolean }
export interface AnyConditions { any: NestedCondition[], result?: boolean }
export type TopLevelCondition = AllConditions | AnyConditions
