import { useEffect, useState } from 'react'
import { AtomicGenerator } from '../atomic'
import { demoJsx } from './data'
import config from './config'

// 过滤出带小写字母、数字、横线（-）、冒号（:）的非空字符串，unocss 是只要有字母就行（ /[a-z?]/）
function isValidSelector(selector = '') {
  return /^[a-z0-9-:!]+$/.test(selector)
}

const getTokens = (fileContent: string) =>
  fileContent?.split(/[\s'"`;]+/g).filter(isValidSelector) || []

const atomic = new AtomicGenerator(config)

function App() {
  const [value, setValue] = useState(demoJsx)
  const [direction, setDirection] = useState(['tsx(className)', 'style'])
  const tokens = Array.from(new Set(getTokens(value)))
  const [result, setResult] = useState({
    sheet: [],
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
    <div className="flex h-screen flex-col p-2 box-border">
      <div className="mb-2">
        <div className="text-lg">Playground</div>
        <div className="text-base text-center">
          {direction[0]}
          <span
            onClick={() => {
              setDirection((dir) => {
                return [dir[1], dir[0]]
              })
            }}
          >
            {' '}
            -&gt;
          </span>{' '}
          {direction[1]}
        </div>
      </div>
      <div className="flex flex-1">
        <textarea
          placeholder="请用空格分割"
          className="w-1/2 border-solid border-[1px] border-gray-300 text-base"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="w-1/2 p-1">
          css:
          <br />
          <p
            dangerouslySetInnerHTML={{ __html: css.replace(/{/g, ' {').replace(/\n/g, '<br/>') }}
          ></p>
          <br />
          <br />
          未识别的 tokens:
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
        </div>
      </div>
    </div>
  )
}

export default App
