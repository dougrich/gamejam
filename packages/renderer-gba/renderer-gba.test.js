const { toMatchImageSnapshot } = require('jest-image-snapshot')

const { GBA_WIDTH, GBA_HEIGHT, createRendererGBA } = require('./renderer-gba')

expect.extend({ toMatchImageSnapshot })

const createCanvas = () => require('canvas').createCanvas(GBA_WIDTH, GBA_HEIGHT)

test('clear', () => {
  const canvas = createCanvas()
  createRendererGBA({ on: () => ({ canvas }) })
    .clear()
    .flush()
  const image = canvas.toBuffer('image/png')
  expect(image).toMatchImageSnapshot()
})
