import { useEffect, useState } from 'react'
import { AtomicGenerator, StringifiedUtil } from '../atomic'
import { demoEntries } from './data'
import config from './config'

// 过滤出带小写字母、数字、横线（-）、冒号（:）的非空字符串，unocss 是只要有字母就行（ /[a-z?]/）
function isValidSelector(selector = '') {
  return /^[a-z0-9-:!]+$/.test(selector)
}

const getTokens = (fileContent: string) =>
  fileContent?.split(/[\s'"`;]+/g).filter(isValidSelector) || []

const atomic = new AtomicGenerator(config)

const demoTypes = demoEntries.map((item) => item[0])
const defaultTypeIndex = 0

function App() {
  const [type, setType] = useState(demoTypes[defaultTypeIndex])
  const [value, setValue] = useState(demoEntries[defaultTypeIndex][1])
  const [direction, setDirection] = useState(['tsx(className)', 'style'])
  const tokens = Array.from(new Set(getTokens(value)))
  const [result, setResult] = useState({
    sheet: [] as StringifiedUtil[],
    css: ''
  })
  const { css, sheet } = result
  const unknownTokens = tokens.filter((item) => !sheet.find((st) => st[3] === item))

  useEffect(() => {
    setValue(demoEntries.find((item) => item[0] === type)?.[1] || '')
  }, [type])

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
        <div className="inline-flex text-[12px] rounded-[3px] p-1 leading-[2] bg-gray-200">
          {demoTypes.map((itemType) => {
            return (
              <span
                onClick={() => {
                  setType(itemType)
                }}
                className={`${
                  type === itemType ? 'bg-slate-100 text-sky-600' : 'text-black'
                } rounded-[3px] min-w-[60px] px-1 cursor-pointer text-center`}
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
          className="w-1/2 border-solid border-[1px] border-gray-300 text-base p-[4px]"
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
