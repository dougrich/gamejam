
function createSceneGraph (depends, config) {
  const { events } = depends.on('events')
  const { start, scenes } = config
  let scene = scenes[start]
  scene.start()

  events.addEventListener('g-startscene', e => {
    const next = scenes[e.detail.id]
    scene.transitionOut(e.detail.transition)
    next.transitionIn(e.detail.transition)
    scene = next
  })
}

module.exports = {
  createSceneGraph
}
