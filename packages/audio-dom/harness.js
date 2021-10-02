const tracks = [
  require('./sample-tracks/track0.wav'),
  require('./sample-tracks/track1.wav'),
  require('./sample-tracks/track2.wav'),
  require('./sample-tracks/track3.wav'),
  require('./sample-tracks/track4.wav'),
  require('./sample-tracks/track5.wav'),
  require('./sample-tracks/track6.wav'),
  require('./sample-tracks/track7.wav'),
  require('./sample-tracks/track8.wav'),
  require('./sample-tracks/track9.wav')
]

const fx = [
  require('./sample-fx/Minimalist1.wav'),
  require('./sample-fx/Minimalist2.wav'),
  require('./sample-fx/Minimalist3.wav'),
  require('./sample-fx/Minimalist4.wav'),
  require('./sample-fx/Minimalist5.wav'),
  require('./sample-fx/Minimalist6.wav'),
  require('./sample-fx/Minimalist7.wav'),
  require('./sample-fx/Minimalist8.wav')
]

const { createAudio } = require('./audio-dom')
const depends = {
  on: () => ({
    document
  })
}
const audio = createAudio(depends)
audio.preload(...tracks.map(x => x.default), ...fx.map(x => x.default))

tracks.forEach((track, idx) => {
  const btn = document.createElement('button')
  document.body.appendChild(btn)
  btn.innerText = `Play ${idx}`
  btn.addEventListener('click', () => {
    audio.playBackground(track.default)
  })
})

fx.forEach((track, idx) => {
  const btn = document.createElement('button')
  document.body.appendChild(btn)
  btn.innerText = `Play FX ${idx}`
  btn.addEventListener('click', () => {
    audio.playEffect(track.default)
  })
})

{
  const btn = document.createElement('button')
  document.body.appendChild(btn)
  btn.innerText = 'Stop'
  btn.addEventListener('click', () => {
    audio.stop()
  })
}

{
  const btn = document.createElement('button')
  document.body.appendChild(btn)
  btn.innerText = 'Play FX 0 then track 0'
  btn.addEventListener('click', () => {
    audio.playEffect(fx[0].default).then(() => audio.playBackground(tracks[0].default))
  })
}
