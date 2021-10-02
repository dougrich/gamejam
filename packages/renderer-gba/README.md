# renderer-gba

This is a render layer designed to emulate a GBA's appearance.

- [x] clear with solid color
- [x] clear with gradient color
- [x] draw image from a src at a destination (srcX, srcY, destX, destY, W, H)
  - used for drawing a simple sprite
- [x] draw repeating image with clamping (srcX, srcY, destX, destY, srcW, srcH, destW, destH, srcXOffset, srcYOffset, repeatX, repeatY)
  - used for drawing a background, front effects like rain
  - repeatX, repeatY are bool; if false, then it clamps
- [x] draw box
- [x] draw text inside a box (font, { srcX, srcY, W, H, align }, text)
- [x] alpha-blending
- [x] primitive: rectangular fill
- [x] FX: functional mask
- [x] FX: functional color modifier