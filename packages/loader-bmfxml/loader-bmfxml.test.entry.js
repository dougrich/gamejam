
const bmf = require('./example.font.xml')
const pkg = require('./package.json')

test('testBox', () => {
  expect(bmf.characters).toMatchSnapshot()
  expect(bmf.image).toEqual(pkg)
})
