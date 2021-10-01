const { toMatchImageSnapshot } = require('jest-image-snapshot')
const fs = require('fs')
const { PNG } = require('pngjs')

const { GBA_WIDTH, GBA_HEIGHT, createRendererGBA } = require('./renderer-gba')

expect.extend({ toMatchImageSnapshot })

const createCanvas = () => require('canvas').createCanvas(GBA_WIDTH, GBA_HEIGHT)

const loadImage = (path) => new Promise((resolve, reject) => {
  fs.createReadStream(path)
    .pipe(new PNG())
    .on('parsed', function () {
      resolve({ width: this.width, height: this.height, data: this.data })
    })
    .on('error', function (error) {
      reject(error)
    })
})

test('clear - simple', () => {
  const canvas = createCanvas()
  createRendererGBA({ on: () => ({ canvas }) })
    .clear()
    .flush()
  const image = canvas.toBuffer('image/png')
  expect(image).toMatchImageSnapshot()
})

test('clear - color', () => {
  const canvas = createCanvas()
  createRendererGBA({ on: () => ({ canvas }) })
    .clear({ color: [255, 0, 0] })
    .flush()
  const image = canvas.toBuffer('image/png')
  expect(image).toMatchImageSnapshot()
})

test('clear - gradient', () => {
  const canvas = createCanvas()
  createRendererGBA({ on: () => ({ canvas }) })
    .clear({ gradient: [[255, 0, 0], [0, 255, 0]] })
    .flush()
  const image = canvas.toBuffer('image/png')
  expect(image).toMatchImageSnapshot()
})

test('drawImage - simple', async () => {
  const canvas = createCanvas()
  const img = await loadImage('test/smile.png')
  createRendererGBA({ on: () => ({ canvas }) })
    .clear()
    .drawImage(img, {
      srcX: 0,
      srcY: 0,
      destX: 32,
      destY: 32,
      W: 32,
      H: 32
    })
    .flush()
  const image = canvas.toBuffer('image/png')
  expect(image).toMatchImageSnapshot()
})
