## JS drag window

一个可随意拖拽、自由缩放大小的 js 浮窗插件
### 使用方法
需要引入index.js 和index.css

```javascript
const dragWindow = new JSDragWindow({
    contentTemplate: `
<div id="box" style=" text-align: center">
content
</div>`,
    dragWindowStyle: {
        width: 600,
        height: 400,
        backgroundColor: "#fff",
        borderWidth: 2,
        // 出现位置
        right: 200,
        top: 100,
    },
    // 是否显示拖拽图标
    // isDrag: true,
    // 自定义标题模板
    headTemplate: "<div>wisen snippets</div>",
});
```

### 配置项

| 名称     |  说明    | 默认值 |
| ---- | ---- | ---- |
|  contentTemplate    | 内容html模板 | null |
| dragWindowStyle | 窗口样式配置     | {width: 600, height: 300, backgroundColor: "#fff", borderWidth: 2} |
| isDrag | 是否显示拖拽图标 | true |
| headTemplate | 标题模板 | null |

### 实例方法

| 名称 | 说明     |
| ---- | -------- |
| hide | 隐藏窗口 |
| show | 显示窗口 |

