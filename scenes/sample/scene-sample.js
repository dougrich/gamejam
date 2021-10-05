function createSceneSample (depends, config) {
  const { renderer } = depends.on('renderer')
  let rendering = false
  let transition = null
  let timestamp = performance.now()

  const transitionInDone = () => {
    transition = null
  }

  const transitionOutDone = () => {
    transition = null
    rendering = false
  }

  const scene = {
    transitionIn: ({ duration, fx }) => {
      transition = { duration, done: transitionInDone, start: timestamp, fx }
      if (!rendering) {
        requestAnimationFrame(scene.render)
      }
    },

    transitionOut: ({ duration, fx }) => {
      transition = { duration, done: transitionOutDone, start: timestamp, fx }
    },

    render: (t) => {
      timestamp = t
      let r = renderer
      if (transition) {
        r = transition.fx(r, timestamp - transition.start)
      }

      r
        .clear({ color: config.color })
        .flush()

      if (rendering) {
        requestAnimationFrame(scene.render)
      }
    }
  }

  return scene
}

module.exports = {
  createSceneSample
}
