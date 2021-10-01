function createErrorType (name, msg) {
  const s = Symbol.for(`error:${name}`)
  const c = class extends Error {
    constructor (props) {
      super(msg(props))
      Object.assign(this, props)
      this.type = s
      this.name = name
    }
  }
  Object.defineProperty(c, 'type', { value: s, writable: false })
  return c
}

module.exports = {
  createErrorType
}
