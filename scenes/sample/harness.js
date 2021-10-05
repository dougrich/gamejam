const { createRendererGBA, GBA_WIDTH, GBA_HEIGHT } = require('@dougrich/renderer-gba')
const { createSceneSample } = require('./scene-sample')

const canvas = document.createElement('canvas')
canvas.width = GBA_WIDTH
canvas.height = GBA_HEIGHT
canvas.style.transform = 'scale(2.0)'
document.body.appendChild(canvas)

const renderer = createRendererGBA({ on: () => ({ canvas })}, {})

const scene = createSceneSample({ on: () => ({ renderer })}, { color: [255, 255, 0] })

document.addEventListener('click', () => {
  scene.transitionIn({
    duration: 1000,
    fx: r => r.fx.mask((i, j) => i < GBA_WIDTH / 2)
  })
})