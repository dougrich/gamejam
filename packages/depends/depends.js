const { createErrorType } = require('@dougrich/type-factory/create-error-type')

const MissingDependenciesError = createErrorType('TimeoutError', ({ requested, missing }) => `Missing dependencies: requested ${requested} and ${missing} weren't found`)

class Dependencies extends EventTarget {
  constructor (base) {
    super()
    this.dependencies = { ...base }
  }

  on (...requested) {
    const bag = {}
    const missing = []
    for (const key of requested) {
      const dependency = this.dependencies[key]
      if (dependency) {
        bag[key] = dependency
      } else {
        missing.push(key)
      }
    }
    if (missing.length) {
      throw new MissingDependenciesError(requested, missing)
    }
    return bag
  }

  provide (key, value) {
    this.dependencies[key] = value
  }

  destroy () {
    this.dispatchEvent(new CustomEvent('destroy'))
  }
}

module.exports = { Dependencies, MissingDependenciesError }
