import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { PromoCodeService } from './promo-code/PromoCodeService'
import { ValidationRequest } from './entities/ValidationRequest'
import { PromoCode } from './entities/PromoCode'
import 'fastify-sensible'
/* eslint-disable @typescript-eslint/no-floating-promises */ // This rule is a bit picky with fastify

// FIXME: validate inputs and outputs with AJV schemas
export class PromoCodeController {
  constructor (private readonly service: PromoCodeService) {
  }

  public setup = (app: FastifyInstance): void => {
    app.post('/promo-code', this.save)
    app.post('/promo-code/validity', this.checkValidity)
  }

  private readonly save = async (req: FastifyRequest<{ Body: PromoCode }>, reply: FastifyReply): Promise<void> => {
    const promoCode = req.body
    await this.service.addCode(promoCode)
    reply.send({ status: 'saved' })
  }

  private readonly checkValidity = async (req: FastifyRequest<{ Body: ValidationRequest }>, reply: FastifyReply): Promise<void> => {
    const request = req.body
    const result = await this.service.isAllowed(request.name, request.facts)
    reply.send(result)
  }
}
