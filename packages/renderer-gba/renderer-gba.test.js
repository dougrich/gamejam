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

test('drawImage - alpha-blending', async () => {
  const canvas = createCanvas()
  const img = {
    width: 4,
    height: 4,
    data: new Uint8Array([
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x99, 0xff, 0xff, 0xff, 0x66, 0xff, 0xff, 0xff, 0x22,
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x99, 0xff, 0xff, 0xff, 0x66, 0xff, 0xff, 0xff, 0x22,
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x99, 0xff, 0xff, 0xff, 0x66, 0xff, 0xff, 0xff, 0x22,
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x99, 0xff, 0xff, 0xff, 0x66, 0xff, 0xff, 0xff, 0x22
    ])
  }
  createRendererGBA({ on: () => ({ canvas }) })
    .clear()
    .drawImage(img, {
      srcX: 0,
      srcY: 0,
      destX: 32,
      destY: 32,
      W: 4,
      H: 4
    })
    .flush()
  const image = canvas.toBuffer('image/png')
  expect(image).toMatchImageSnapshot()
})

test('drawImage - clamped', async () => {
  const canvas = createCanvas()
  const img = await loadImage('test/grid-pattern.png')
  createRendererGBA({ on: () => ({ canvas }) })
    .clear()
    .drawImage(img, {
      srcX: 0,
      srcY: 0,
      srcW: 8,
      srcH: 8,
      destX: 32,
      destY: 32,
      destW: 12,
      destH: 12,
      offsetX: 2,
      offsetY: 2
    })
    .flush()
  const image = canvas.toBuffer('image/png')
  expect(image).toMatchImageSnapshot()
})

test('drawImage - repeat', async () => {
  const canvas = createCanvas()
  const img = await loadImage('test/grid-pattern.png')
  createRendererGBA({ on: () => ({ canvas }) })
    .clear()
    .drawImage(img, {
      srcX: 0,
      srcY: 0,
      srcW: 8,
      srcH: 8,
      destX: 32,
      destY: 32,
      destW: 64,
      destH: 64,
      repeatX: true,
      repeatY: true,
      offsetX: 8,
      offsetY: 8
    })
    .flush()
  const image = canvas.toBuffer('image/png')
  expect(image).toMatchImageSnapshot()
})

test('drawBox', async () => {
  const canvas = createCanvas()
  const image = await loadImage('test/box-pattern.png')
  createRendererGBA({ on: () => ({ canvas }) })
    .clear()
    .drawBox({ borderWidth: 4, image }, {
      destX: 4,
      destY: 4,
      destW: 128,
      destH: 64
    })
    .flush()
  const snapshot = canvas.toBuffer('image/png')
  expect(snapshot).toMatchImageSnapshot()
})

test('drawText - left', async () => {
  const canvas = createCanvas()
  const image = await loadImage('test/fibberish.png')
  const characters = require('./test/fibberish.json')
  createRendererGBA({ on: () => ({ canvas }) })
    .clear()
    .drawText({ characters, image, height: 16 }, {
      destX: 4,
      destY: 4,
      destW: 128,
      destH: 64,
      align: 'left'
    }, 'This is a test . . . . . . . . . . .')
    .flush()
  const snapshot = canvas.toBuffer('image/png')
  expect(snapshot).toMatchImageSnapshot()
})
