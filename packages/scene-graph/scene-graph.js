
function createSceneGraph (depends, config) {
  const { events } = depends.on('events')
  const { start, startTransition, scenes } = config
  let scene = null

  events.addEventListener('g-startscene', e => {
    const next = scenes[e.detail.id]
    if (scene) scene.transitionOut(e.detail.transition)
    if (next) next.transitionIn(e.detail.transition)
    scene = next
  })

  events.dispatch(new CustomEvent('g-startscene', { detail: { id: start, transition: startTransition }}))
}

module.exports = {
  createSceneGraph
}
