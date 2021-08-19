import fastify from 'fastify'
import { PromoCodeService } from './promo-code/PromoCodeService'
import { PromoCodeDao } from './promo-code/PromoCodeDao'
import { PromoCodeController } from './PromoCodeController'

if (require.main === module) {
  main().catch(err => {
    console.error(`[FATAL ERROR] ${String(err?.message) ?? 'No message provided'}`, err)
    process.exit(1)
  })
}

async function main (): Promise<void> {
  // Instantiate server
  const app = fastify({ logger: true })

  // Instantiate promo code HTTP service
  const service = new PromoCodeService(new PromoCodeDao())
  const controller = new PromoCodeController(service)
  controller.setup(app)

  // Start server
  const port = process.env.PORT ?? 10180
  await app.listen(port, '0.0.0.0')
  console.log(`Server listening on http://0.0.0.0:${port}`)
}
