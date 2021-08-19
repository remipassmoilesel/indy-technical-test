import { assert } from 'chai'
import { impressMe } from './main'

describe('main', () => {
  it('impressMe()', () => {
    assert.equal(impressMe(1, 1), 2)
  })
})
