const { Dependencies, MissingDependenciesError } = require('./depends')

test('dependencies simple provide', () => {
  const depends = new Dependencies()
  depends.provide('s1', Symbol.for('s1'))
  const { s1 } = depends.on('s1')
  expect(s1).toEqual(Symbol.for('s1'))
})

test('dependencies base provide', () => {
  const depends = new Dependencies({ s1: Symbol.for('s1') })
  const { s1 } = depends.on('s1')
  expect(s1).toEqual(Symbol.for('s1'))
})

test('dependencies missing', () => {
  const depends = new Dependencies()
  depends.provide('s1', Symbol.for('s1'))
  expect(() => depends.on('s1', 's2', 's3')).toThrow(MissingDependenciesError)
})

test('destroy cleans up dependencies', () => {
  const depends = new Dependencies()
  const destroy = jest.fn()
  depends.addEventListener('destroy', destroy)
  depends.destroy()
  expect(destroy).toHaveBeenCalled()
})
