
export const demos = {
    'classNames': `text-2xl text-2xl !text-5xl
        font500
        leading-3
        b b-1 border-solid border-black border-gray-100 rounded-1
        m1 m-y-2 p-t-4 pt4 mx-auto m-auto
        flex-1 justify-center flex-row flex-col flex-wrap	
        inline block flex 
        absolute relative
        text-center
        ws-nowrap
        select-none
        box-border
        top-0 bottom-5
        color-indigo-2 color-white 
        !children:hover:border-solid children:hover:border-1 active:b
    `,
    'tsx': `
        <div className="h-full text-center flex select-none all:transition-400">
            <div className={"ma"}>
                <div className="text-5xl fw100 animate-bounce b animate-count-infinite animate-1s">
                    unocss
                </div>
                <div className="op30 m-y-2 pt-4 text-lg fw300 m1">
                    The instant on-demand Atomic CSS engine.
                </div>
                <div className="m2 flex justify-center text-2xl op30 hover:op80 hover:m3 border-rounded-1">
                    <a
                    i-carbon-logo-github
                    text-inherit
                    href="https://github.com/antfu/unocss"
                    target="_blank"
                    ></a>
                </div>
            </div>
        </div>
        <div className="absolute bottom-5 right-0 left-0 text-center op30 fw300">
            on-demand · instant · fully customizable
        </div>
    `
}


