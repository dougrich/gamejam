async function loadAudioBuffer (ctx, url) {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  return await ctx.decodeAudioData(buffer)
}

function createAudio (depends, config) {
  const buffers = {}
  const ctx = new AudioContext()
  let current = null
  const a = {
    preload: async (...audioURL) => {
      const promises = []
      for (const url of audioURL) {
        if (!buffers[url]) {
          buffers[url] = loadAudioBuffer(ctx, url)
        }
        promises.push(buffers[url])
      }
      return Promise.all(promises)
    },
    playBackground: async (audioURL) => {
      a.stop()
      const [buffer] = await a.preload(audioURL)
      const source = ctx.createBufferSource()
      const gain = ctx.createGain()
      source.buffer = buffer
      source.connect(gain)
      gain.connect(ctx.destination)
      gain.gain.value = 0.25
      source.start()
      source.loop = true
      current = source
    },
    playEffect: async (fxURL, after) => {
      const [buffer] = await a.preload(fxURL)
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.connect(ctx.destination)
      source.start()
      return new Promise((resolve) => {
        const onEnd = () => {
          if (after) {
            resolve(after())
          } else {
            resolve()
          }
          source.removeEventListener('ended', onEnd)
        }
        source.addEventListener('ended', onEnd)
      })
    },
    stop: () => {
      if (current) {
        current.stop()
        current = null
      }
    }
  }
  return a
}

module.exports = {
  createAudio
}
