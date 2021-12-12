// tailwind.config.js

const regularPx = (count) =>
  new Array(count).fill().reduce((result, item, index) => {
    return {
      ...result,
      [index]: `${index}px`
      // [`${index}px`]: `${index}px`
    }
  }, {})

const regularNum = (count) =>
  new Array(count).fill().reduce((result, item, index) => {
    return {
      ...result,
      [index]: index
    }
  }, {})

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    fontSize: regularPx(21),
    spacing: regularPx(21),
    borderWidth: regularPx(10),
    borderRadius: regularPx(10),
    lineHeight: regularNum(3)
  },
  // corePlugins: {
  //   preflight: false,
  // },
  plugins: []
}
