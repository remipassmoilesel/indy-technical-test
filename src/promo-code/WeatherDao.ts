import { Weather } from '../entities/Weather'

export class WeatherDao {
  public async getWeather (): Promise<Weather> {
    const seed = Math.random()
    return {
      name: seed > 0.5 ? 'clear' : 'cloudy',
      temperature: seed * 30
    }
  }
}
