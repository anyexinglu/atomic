import { useEffect, useState } from 'react'
import { AtomicGenerator, StringifiedUtil } from '../atomic'
import { jsDemoEntries, cssDemosEntries } from './data'
import config from './config'
import {
  bgAttachments,
  bgBlendModes,
  bgClips,
  bgImages,
  bgOrigins,
  bgPositions,
  bgSizes,
  bgRepeats
} from '../atomic/rules/background'

// 过滤出带小写字母、数字、横线（-）、冒号（:）的非空字符串，unocss 是只要有字母就行（ /[a-z?]/）
function isValidSelector(selector = '') {
  return /^[a-z0-9-:!\/]+$/.test(selector)
}

const getTokens = (fileContent: string) =>
  fileContent?.split(/[\s'"`;]+/g).filter(isValidSelector) || []

const atomic = new AtomicGenerator(config)

const defaultTypeIndex = 0

function App() {
  const [direction, setDirection] = useState(['tsx(className)', 'style'])
  const demoEntries = direction[0] === 'tsx(className)' ? jsDemoEntries : cssDemosEntries
  const [type, setType] = useState(demoEntries[defaultTypeIndex][0])
  const [value, setValue] = useState(demoEntries[defaultTypeIndex][1])

  useEffect(() => {
    setValue(demoEntries.find((item) => item[0] === type)?.[1] || '')
  }, [type, demoEntries])

  return (
    <div className="flex h-screen flex-col p-2 box-border">
      <div className="mb-2">
        <div className="text-lg">Playground</div>
        <div className="text-base text-center">
          {direction[0]}
          <span
            className="bg-gray-200 py-2 px-4 rounded-5 m-4 inline-block cursor-pointer"
            title="点击改变转化方向"
            onClick={() => {
              setType((direction[1] === 'tsx(className)' ? jsDemoEntries : cssDemosEntries)[0][0])
              setDirection([direction[1], direction[0]])
            }}
          >
            {' '}
            -&gt;
          </span>{' '}
          {direction[1]}
        </div>
        <div className="inline-flex text-12 rounded-3 p-2 m-4 leading-2 bg-gray-200">
          {demoEntries.map(([itemType]) => {
            return (
              <span
                key={itemType}
                onClick={() => {
                  setType(itemType)
                }}
                className={`${
                  type === itemType ? 'bg-slate-100 text-sky-600' : 'text-black'
                } rounded-3 min-w-[60px] px-4 cursor-pointer text-center`}
              >
                {itemType}
              </span>
            )
          })}
        </div>
      </div>
      <div className="flex flex-1">
        <textarea
          placeholder="请用空格分割"
          className="w-1/2 border-solid border-1 border-gray-300 text-base p-4"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="w-1/2 p-4">
          {direction[0] === 'tsx(className)' ? (
            <FromAtomic value={value} />
          ) : (
            <ToAtomic value={value} />
          )}
        </div>
      </div>
    </div>
  )
}

function FromAtomic({ value }: { value: string }) {
  const tokens = Array.from(new Set(getTokens(value)))
  const [result, setResult] = useState({
    sheet: [] as StringifiedUtil[],
    css: ''
  })
  const { css, sheet } = result
  const unknownTokens = tokens.filter((item) => !sheet.find((st) => st[3] === item))

  useEffect(() => {
    ;(async () => {
      atomic.tokens = new Set(getTokens(value))
      const result = await atomic.generate()
      console.log('...result', result)
      setResult(result)
    })()
  }, [value])

  return (
    <>
      classNames:
      <br />
      <p
        dangerouslySetInnerHTML={{
          __html: css.replace(/{/g, ' {').replace(/\n/g, '<br/>')
        }}
      ></p>
      <br />
      <br />
      未识别的组合:
      <br />
      {unknownTokens.map((item, index) => (
        <span key={index}>{item} </span>
      ))}
      <br />
      <br />
      全部的 tokens:
      <br />
      {tokens.map((item, index) => (
        <span key={index}>{item} </span>
      ))}
      <br />
      <br />
    </>
  )
}

function ToAtomic({ value }: { value: string }) {
  const styles = value
    .split('\n')
    .filter((item) => item.includes(':'))
    .map((item) => item.trim())

  // tokens 形如：['line-height', '12px', 'line-height: 12px']
  const tokens = Array.from(
    new Set(
      styles
        .filter((item) => item.includes(':') && item.indexOf(':') === item.lastIndexOf(':'))
        .map((item) => [...item.split(':'), item].map((x) => x.trim().replace(';', '')))
    )
  )

  const classes: string[] = []
  const unknownTokens: string[][] = []
  tokens.forEach((token) => {
    const className = processToAtomic(token)
    if (className) {
      classes.push(className)
    } else {
      unknownTokens.push(token)
    }
  })

  console.log('..识别出来全部的组合：', tokens)

  return (
    <>
      css:
      <br />
      <p>
        {classes.map((item) => (
          <div>{item}</div>
        ))}
      </p>
      <br />
      <br />
      未识别的 tokens:
      <br />
      {unknownTokens.map((item, index) => (
        <div key={index}>{item[2]}; </div>
      ))}
      <br />
      <br />
      识别出来全部的组合，见控制台打印
      <br />
      <br />
    </>
  )
}

const spacingTypes = {
  padding: 'p',
  margin: 'm'
}
const directions = {
  left: 'l',
  top: 't',
  bottom: 'b',
  right: 'r'
}
const directionsEntries = Object.entries(directions)
const spacingRules = Object.entries(spacingTypes).reduce((total, [long1, short1]) => {
  return {
    ...total,
    ...directionsEntries.reduce((result, [long2, short2]) => {
      return {
        ...result,
        [long1 + '-' + long2]: short1 + short2
      }
    }, {})
  }
}, {})

const basicRules: {
  [key: string]: string
} = {
  'font-size': 'text-',
  'font-weight': 'font',
  'line-height': 'leading-',
  'border-radius': 'rounded-',
  width: 'w-',
  height: 'h-',
  top: 'top-',
  bottom: 'bottom-',
  left: 'left-',
  right: 'right-',
  flex: 'flex-',
  padding: 'p',
  margin: 'm',
  ...spacingRules
}

const lineRules: { [key: string]: string } = [
  bgAttachments,
  bgBlendModes,
  bgClips,
  bgImages,
  bgOrigins,
  bgPositions,
  bgSizes,
  bgRepeats
]
  .flat(1)
  .reduce((result, item) => {
    return {
      ...result,
      [JSON.stringify(item[1])]: item[0]
    }
  }, {})

console.log(
  '..rules',
  basicRules,
  [bgAttachments, bgBlendModes, bgClips, bgImages, bgOrigins, bgPositions, bgSizes, bgRepeats].flat(
    1
  )
)

const dynamicRules: [RegExp, (matched: RegExpMatchArray, value?: string) => string][] = [
  [/box-sizing:(.*)-box/, (matched) => 'box-' + matched[1]?.trim()],
  [/background-position/, (matched) => 'bg-' + matched[1]?.trim()]
]

function processToAtomic(token: string[]) {
  const [key, value, tokenLine] = token
  const { rulesStaticMap } = atomic.config

  // map static
  for (const rule of Object.entries(rulesStaticMap)) {
    const [ruleName, ruleConfig] = rule
    const ruleValue = ruleConfig?.[1] || {}
    if (
      Object.keys(ruleValue).length === 1 &&
      JSON.stringify([key, value]) === JSON.stringify(Object.entries(ruleValue)[0])
    ) {
      console.log('...', tokenLine, ruleName)
      return ruleName
    }
  }

  // map dynamic

  // basic
  if (basicRules[key]) {
    return basicRules[key] + parseInt(value)
  }

  // if (key === 'background-size' || key === 'box-sizing') {
  //   debugger
  // }

  let lineValue = lineRules[JSON.stringify({ [key]: value })]
  if (lineValue) {
    return lineValue
  }

  for (const dynamicRule of dynamicRules) {
    const [reg, handler] = dynamicRule
    let matched = tokenLine.match(reg)
    if (matched) {
      return handler(matched, value)
    }
  }
}

export default App
