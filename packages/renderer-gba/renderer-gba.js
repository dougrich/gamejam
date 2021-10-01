// taken from https://en.wikipedia.org/wiki/Game_Boy_Advance
const GBA_WIDTH = 240
const GBA_HEIGHT = 160

function bound (min, max, v) {
  return Math.max(min, Math.min(max, v))
}

function loop (top, left, bottom, right, cb) {
  top = bound(0, GBA_HEIGHT, top)
  bottom = bound(0, GBA_HEIGHT, bottom)
  left = bound(0, GBA_WIDTH, left)
  right = bound(0, GBA_WIDTH, right)
  for (let j = top; j < bottom; j++) {
    for (let i = left; i < right; i++) {
      cb(i, j)
    }
  }
}
function idx (width, x, y) {
  return (y * width + x) * 4
}

function blendPixel (src, dest, srcIdx, destIdx) {
  if (src[srcIdx + 3] > 128) {
    dest[destIdx + 0] = src[srcIdx + 0]
    dest[destIdx + 1] = src[srcIdx + 1]
    dest[destIdx + 2] = src[srcIdx + 2]
  }
}

function createRendererGBA (depends, config) {
  const { canvas } = depends.on('canvas')

  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, GBA_WIDTH, GBA_HEIGHT)
  const data = imageData.data

  const r = {
    clear: (options = {}) => {
      if (options.gradient) {
        const [from, to] = options.gradient
        loop(0, 0, GBA_HEIGHT, GBA_WIDTH, (x, y) => {
          const distance = y / GBA_HEIGHT
          const blended = [0, 0, 0].map((_, i) => ((Math.floor(from[i] * (1 - distance) + to[i] * distance)) >> 3) << 3)
          blended.push(255)
          blendPixel(blended, data, 0, idx(GBA_WIDTH, x, y))
          data[idx(GBA_WIDTH, x, y) + 3] = 255
        })
      } else {
        let color = [0, 0, 0]
        if (options.color) {
          color = options.color
        }
        for (let i = 0; i < data.length; i += 4) {
          data[i] = color[0]
          data[i + 1] = color[1]
          data[i + 2] = color[2]
          data[i + 3] = 255
        }
      }
      return r
    },
    drawImage: (img, { srcX, srcY, destX, destY, W, H }) => {
      loop(destY, destX, destY + H, destX + W, (i, j) => {
        const srcIdx = idx(img.width, i - destX, j - destY)
        const destIdx = idx(GBA_WIDTH, i, j)
        blendPixel(img.data, data, srcIdx, destIdx)
      })
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
