const jsDemos = {
    'classNames': `
text-2xl text-2xl !text-5xl
font500
leading-3
w-1/2
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

const cssDemos = {
    'design tool': `
width: 24px;
height: 16px;
font-size: 16px;
color: #FF7700;
line-height: 16px;
font-weight: 500;
border-style: solid;
width: 80px;
height: 28px;
background: #407CFF;
border-radius: 3px;
    `,
    'module.scss': `
.wrapper {
    text-align: center;
    .top {
        font-size: 12px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.8);
        line-height: 12px;
        margin-bottom: 4px;
        .need {
            margin-left: 8px;
            .hightlight {
                font-size: 14px;
                font-weight: 500;
                color: rgba(255, 119, 0, 1);
                line-height: 12px;
            }
        }
    }
}
.card {
    display: flex;
    align-items: center;
    height: 106px;
    min-width: 492px;
    padding: 16px;
    box-sizing: border-box;
    position: relative;
    background: url('../xxx.png@2x.png') no-repeat;
    background-size: contain;
}
.type {
    position: absolute;
    line-height: 12px;
    padding: 4px;
    font-size: 12px;
    color: #ff7700;
    background: #fff6e6;
    border-radius: 3px 0 3px 0;
    top: 0;
    left: 0;
}
.amount {
    flex: 0 1 auto;
    color: #b1955d;
    padding: 28px 0 0 0;
    border-right: 1px dashed #ebebeb;
    text-align: center;
    min-width: 110px;
}
.discount {
    font-size: 32px;
    line-height: 12px;
}
.yen {
    font-size: 12px;
    margin-right: 2px;
}
.requireAmount {
    font-size: 12px;
    line-height: 32px;
}
.detail {
    flex: 1;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
    line-height: 20px;
    padding-left: 16px;
}
.name {
    line-height: 14px;
    margin-bottom: 4px;
    color: rgba(0, 0, 0, 0.8);
}
.getTime {
    display: flex;
}
.list {
    margin-top: 24px;
}
.title {
    display: flex;
    justify-content: space-between;
    line-height: 12px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.8);
    margin-bottom: 12px;
}
.tip {
    color: rgba(0, 0, 0, 0.4);
}
.useDetail {
    background: #f7f8fa;
    border-radius: 3px;
    padding: 16px;
    display: flex;
    align-items: center;
}
.item {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    text-align: left;
    flex: 1;
}
.itemValue {
    color: rgba(0, 0, 0, 0.8);
    font-size: 16px;
    margin-top: 8px;
}
.unit {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    margin-left: 4px;
}
    `
}

export const jsDemoEntries = Object.entries(jsDemos).map(item => {
    return [item[0], item[1].replace('\n', '')]
})

export const cssDemosEntries = Object.entries(cssDemos).map(item => {
    return [item[0], item[1].replace('\n', '')]
})
