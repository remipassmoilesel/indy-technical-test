import { Avantage } from './Avantage'

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
  reasons: string[]
}

export declare type Result = AcceptedCode | DeniedCode
