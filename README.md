<div align="center">
  <h1>Dynamic Public Path Plugin</h1>
  <p>Replace publicPath inside a chunk, or chunks, to a variable.</p>
</div>

<h2 align="center">Install</h2>

```bash
npm install --save-dev webpack-dynamic-public-path
```

<h2 align="center">Usage</h2>

> :warning: This plugin is only compatible with webpack 4.

```js
const WebpackDynamicPublicPathPlugin = require("webpack-dynamic-public-path");

module.exports = {
    output: {
        publicPath: "publicPathPlaceholder",
    },
    ...
    plugins: [
        new WebpackDynamicPublicPathPlugin({
            externalPublicPath: "window.externalPublicPath"
        }),
    ]
}
```

<h2 align="center">Options</h2>

```js
new WebpackDynamicPublicPathPlugin(options: object)
```

|Name|Type|Description|
|:--:|:--:|:----------|
|**`externalPublicPath`**|`{String}`|Unique ident for this plugin instance. (For advanced usage only, by default automatically generated)|
|**`chunkNames`**|`{Array}`|Name of the result file. May contain `[name]`, `[id]` and `[contenthash]`|