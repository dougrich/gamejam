const cheerio = require('cheerio')

module.exports = function (contents) {
  const $ = cheerio.load(contents, { xmlMode: true })
  const filename = $('page').attr('file')
  const height = Number.parseInt($('common').attr('lineHeight'))
  const characters = {}
  for (const c of $('char').toArray()) {
    const { id, x, y, width, height, xoffset, yoffset, xadvance } = c.attribs
    characters[id] = [Number.parseInt(x), Number.parseInt(y), Number.parseInt(width), Number.parseInt(height), Number.parseInt(xadvance), Number.parseInt(xoffset), Number.parseInt(yoffset)]
  }
  return `module.exports = { characters: ${JSON.stringify(characters)}, image: require('./${filename}'), height: ${height} }`
}
