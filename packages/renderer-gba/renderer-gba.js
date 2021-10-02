// taken from https://en.wikipedia.org/wiki/Game_Boy_Advance
const GBA_WIDTH = 240
const GBA_HEIGHT = 160

function bound (min, max, v) {
  return Math.max(min, Math.min(max, v))
}

function inMask (masks, i, j) {
  for (const m of masks) {
    if (!m(i, j)) return false
  }
  return true
}

function createLoop (masks) {
  return (top, left, bottom, right, cb) => {
    top = bound(0, GBA_HEIGHT, top)
    bottom = bound(0, GBA_HEIGHT, bottom)
    left = bound(0, GBA_WIDTH, left)
    right = bound(0, GBA_WIDTH, right)
    for (let j = top; j < bottom; j++) {
      for (let i = left; i < right; i++) {
        if (inMask(masks, i, j)) {
          cb(i, j)
        }
      }
    }
  }
}

function idx (width, x, y) {
  return (y * width + x) * 4
}

function createBlendPixel (filters) {
  return (src, dest, srcIdx, destIdx) => {
    let color = src.slice(srcIdx, srcIdx + 4)
    for (const f of filters) {
      color = f(color)
    }
    const alpha = color[3] / 255
    const ialpha = 1 - alpha
    dest[destIdx + 0] = Math.floor(color[0] * alpha + dest[destIdx + 0] * ialpha)
    dest[destIdx + 1] = Math.floor(color[1] * alpha + dest[destIdx + 1] * ialpha)
    dest[destIdx + 2] = Math.floor(color[2] * alpha + dest[destIdx + 2] * ialpha)
  }
}

function fontAt (font, c) {
  const [srcX, srcY, srcW, srcH, xadvance, xoffset, yoffset] = font.characters[c.charCodeAt(0)] || [0, 0, 1, 1, 0, 0, 0]
  return { srcX, srcY, srcW, srcH, xadvance, xoffset, yoffset }
}

function measure (font, text) {
  let l = 0
  for (const c of text) {
    const { xadvance } = fontAt(font, c)
    l += xadvance
  }
  return l
}

function createFXRendererGBA (ctx, imageData, fx) {
  const data = imageData.data
  const masks = []
  const filters = []
  for (const f of fx) {
    if (f.mask) {
      masks.push(f.mask)
    }
    if (f.filter) {
      filters.push(f.filter)
    }
  }
  const loop = createLoop(masks)
  const blendPixel = createBlendPixel(filters)

  const r = {
    clear: (options = {}) => {
      let color = [0, 0, 0]
      if (options.color) {
        color = options.color
      }

      loop(0, 0, GBA_HEIGHT, GBA_WIDTH, (x, y) => {
        if (options.gradient) {
          const [from, to] = options.gradient
          const distance = y / GBA_HEIGHT
          const blended = [0, 0, 0].map((_, i) => ((Math.floor(from[i] * (1 - distance) + to[i] * distance)) >> 3) << 3)
          color = blended
        }
        const i = idx(GBA_WIDTH, x, y)
        blendPixel([...color, 255], data, 0, i)
        data[i + 3] = 255
      })
      return r
    },
    drawImage: (img, { srcX, srcY, destX, destY, W, H, destW, destH, srcW, srcH, repeatX, repeatY, offsetX, offsetY }) => {
      if (destW == null) destW = W
      if (destH == null) destH = H
      if (srcW == null) srcW = W
      if (srcH == null) srcH = H
      if (offsetX == null) offsetX = 0
      if (offsetY == null) offsetY = 0
      loop(destY, destX, destY + destH, destX + destW, (i, j) => {
        let oX = (i - destX - offsetX)
        if (repeatX && oX < 0) oX = srcW - (Math.abs(oX) % srcW)
        let oY = (j - destY - offsetY)
        if (repeatY && oY < 0) oY = srcH - (Math.abs(oY) % srcH)
        oX = repeatX ? oX % srcW : bound(0, srcW - 1, oX)
        oY = repeatY ? oY % srcH : bound(0, srcH - 1, oY)
        const srcIdx = idx(img.width, srcX + oX, srcY + oY)
        const destIdx = idx(GBA_WIDTH, i, j)
        blendPixel(img.data, data, srcIdx, destIdx)
      })
      return r
    },
    drawText: (font, { destX, destY, destW }, text) => {
      let left = destX; let baseline = destY
      const words = text.split(' ').map(x => x + ' ')
      for (const w of words) {
        const wordlength = measure(font, w)
        if ((left + wordlength) > (destX + destW)) {
          baseline += font.height
          left = destX
        }
        for (const c of w) {
          const { srcX, srcY, srcW, srcH, xadvance, xoffset, yoffset } = fontAt(font, c)
          r.drawImage(font.image, { destX: left + xoffset, destY: baseline + yoffset, srcX, srcY, W: srcW, H: srcH })
          left += xadvance
        }
      }
      return r
    },
    drawRectangle: ({ destX, destY, destW, destH, fill }) => {
      loop(destY, destX, destY + destH, destX + destW, (i, j) => {
        const destIdx = idx(GBA_WIDTH, i, j)
        blendPixel(fill, data, 0, destIdx)
      })
      return r
    },
    drawBox: ({ image, borderWidth }, { destX, destY, destH, destW }) => {
      return r
        .drawImage(image, { srcX: 0, srcY: 0, srcW: borderWidth, srcH: borderWidth, destX, destY, destW: borderWidth, destH: borderWidth }) // top left
        .drawImage(image, { srcX: image.width - borderWidth, srcY: 0, srcW: borderWidth, srcH: borderWidth, destX: destX + destW - borderWidth, destY, destW: borderWidth, destH: borderWidth }) // top right
        .drawImage(image, { srcX: image.width - borderWidth, srcY: image.height - borderWidth, srcW: borderWidth, srcH: borderWidth, destX: destX + destW - borderWidth, destY: destY + destH - borderWidth, destW: borderWidth, destH: borderWidth }) // bottom right
        .drawImage(image, { srcX: 0, srcY: image.height - borderWidth, srcW: borderWidth, srcH: borderWidth, destX, destY: destY + destH - borderWidth, destW: borderWidth, destH: borderWidth }) // bottom right
        .drawImage(image, { srcX: borderWidth, srcY: 0, srcW: image.width - 2 * borderWidth, srcH: borderWidth, destX: destX + borderWidth, destY, destW: destW - 2 * borderWidth, destH: borderWidth, repeatX: true }) // top
        .drawImage(image, { srcX: borderWidth, srcY: image.height - borderWidth, srcW: image.width - 2 * borderWidth, srcH: borderWidth, destX: destX + borderWidth, destY: destY + destH - borderWidth, destW: destW - 2 * borderWidth, destH: borderWidth, repeatX: true }) // bottom
        .drawImage(image, { srcX: image.width - borderWidth, srcY: borderWidth, srcW: borderWidth, srcH: image.height - 2 * borderWidth, destX: destX + destW - borderWidth, destY: destY + borderWidth, destW: borderWidth, destH: destH - 2 * borderWidth, repeatY: true }) // right
        .drawImage(image, { srcX: 0, srcY: borderWidth, srcW: borderWidth, srcH: image.height - 2 * borderWidth, destX, destY: destY + borderWidth, destW: borderWidth, destH: destH - 2 * borderWidth, repeatY: true }) // left
        .drawImage(image, { srcX: borderWidth, srcY: borderWidth, srcW: image.width - 2 * borderWidth, srcH: image.height - 2 * borderWidth, destX: destX + borderWidth, destY: destY + borderWidth, destW: destW - 2 * borderWidth, destH: destH - 2 * borderWidth, repeatX: true, repeatY: true })
    },
    flush: () => {
      ctx.putImageData(imageData, 0, 0)
      return r
    },
    fx: {
      mask: (fn) => {
        return createFXRendererGBA(ctx, imageData, [...fx, { mask: fn }])
      },
      filter: (fn) => {
        return createFXRendererGBA(ctx, imageData, [...fx, { filter: fn }])
      }
    }
  }

  return r
}

function createRendererGBA (depends, config) {
  const { canvas } = depends.on('canvas')

  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, GBA_WIDTH, GBA_HEIGHT)

  return createFXRendererGBA(ctx, imageData, [])
}

module.exports = {
  GBA_WIDTH,
  GBA_HEIGHT,
  createRendererGBA
}
