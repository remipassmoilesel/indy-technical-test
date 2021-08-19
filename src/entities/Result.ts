import { Avantage } from './Avantage'

export declare type Result = AcceptedCode | DeniedCode

export enum CodeRequestStatus {
  Accepted = 'Accepted',
  Denied = 'Denied',
}

export interface AcceptedCode {
  status: CodeRequestStatus.Accepted
  promoCodeName: string
  avantage: Avantage
}

export interface DeniedCode {
  status: CodeRequestStatus.Denied
  promoCodeName: string
  reasons: Failure[]
}

export interface Failure {
  text: string
  fact: string
  operator: string
  value: string
}
