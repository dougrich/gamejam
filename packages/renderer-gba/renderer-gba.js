// taken from https://en.wikipedia.org/wiki/Game_Boy_Advance
const GBA_WIDTH = 240
const GBA_HEIGHT = 160

function createRendererGBA (depends, config) {
  const { canvas } = depends.on('canvas')

  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, GBA_WIDTH, GBA_HEIGHT)
  const data = imageData.data

  const r = {
    clear: () => {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 0
        data[i + 1] = 0
        data[i + 2] = 0
        data[i + 3] = 255
      }
      return r
    },
    flush: () => {
      ctx.putImageData(imageData, 0, 0)
      return r
    }
  }

  return r
}

module.exports = {
  GBA_WIDTH,
  GBA_HEIGHT,
  createRendererGBA
}
