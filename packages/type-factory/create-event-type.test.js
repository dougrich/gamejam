const { createEventType } = require('./create-event-type')

test('createEventType', () => {
  const TestEvent = createEventType('event:test')
  const ev = new TestEvent({ a: 1, b: 2 })
  expect(ev).toBeInstanceOf(CustomEvent)
  expect(ev.type).toEqual('event:test')
  expect(ev.a).toEqual(1)
  expect(ev.b).toEqual(2)
})
