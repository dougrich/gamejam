const { createErrorType } = require('./create-error-type')

test('createErrorType', () => {
  const TestError = createErrorType('TestError', ({ a, b, c }) => `a: ${a}, b: ${b}, c: ${c}`)
  const e = new TestError({ a: 1, b: 2, c: 3 })
  expect(e).toBeInstanceOf(Error)
  expect(e.a).toEqual(1)
  expect(e.b).toEqual(2)
  expect(e.c).toEqual(3)
  expect(e.name).toEqual('TestError')
  expect(e.type).toEqual(TestError.type)
  expect(e.message).toEqual('a: 1, b: 2, c: 3')
})
