function createEventType (name) {
  const ctor = function (dict) {
    return new CustomEvent(name, dict)
  }
  Object.defineProperty(ctor, 'name', { value: name, writable: false })
  return ctor
}

module.exports = { createEventType }
