import { Differ, InstructionType } from '../lib/services/differ.service'
import { SimpleComperator } from '../lib/services/simple-comperator.service'
import { ContentType } from '../lib/content-type.interface'

const createType = (seed: string | number): ContentType => ({
  name: String(seed),
  id: String(seed),
  fields: [],
})

const data = ['foo', 'bar'].map(createType)

describe('migrator', () => {
  let differ: Differ

  beforeEach(() => {
    differ = new Differ(new SimpleComperator())
  })

  it('should not create too much', () => {
    const results = differ.compare([data[0]], data)

    expect(results.length).toBe(1)
  })

  it('should create stuff that does not exist', () => {
    const results = differ.compare(data, [])

    expect(results.length).toBe(data.length)
    results.forEach(({ operation }) => { expect(operation).toBe(InstructionType.CREATE) },
    )
  })

  it('should not create dupes', () => {
    const results = differ.compare(data, data)

    expect(results.length).toBe(0)
  })

  it('should delete stuff that we no longer need', () => {
    const results = differ.compare([], data)

    expect(results.length).toBe(data.length)
    results.forEach(({ operation }) => { expect(operation).toBe(InstructionType.DELETE) },
    )
  })

  it('should not delete too much', () => {
    const results = differ.compare([data[0]], data)

    expect(results.length).toBe(1)
    results.forEach(({ operation }) => { expect(operation).toBe(InstructionType.DELETE) },
    )
  })
})
