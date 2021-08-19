import { PromoCode } from './entities/PromoCode'

const db = new Map<string, PromoCode>()

export class PromoCodeDao {
  public async save (code: PromoCode): Promise<void> {
    db.set(code.name, code)
  }

  public async getByName (name: string): Promise<PromoCode | undefined> {
    return db.get(name)
  }
}
