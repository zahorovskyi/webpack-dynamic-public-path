<div align="center">
  <h1>Dynamic Public Path Plugin</h1>
  <p>Replace publicPath inside a chunk, or chunks, to a variable.</p>
</div>

<h2 align="center">Install</h2>

```bash
npm install --save-dev webpack-dynamic-public-path
```

<h2 align="center">Usage</h2>

> :warning: This plugin is compatible only with webpack 4.

**webpack.config.js**
```js
const WebpackDynamicPublicPathPlugin = require("webpack-dynamic-public-path");

module.exports = {
    output: {
        publicPath: "publicPathPlaceholder",
    },
    plugins: [
        new WebpackDynamicPublicPathPlugin({
            externalPublicPath: "window.externalPublicPath"
        }),
    ]
}
```

**bundle.js**
```js
// before
__webpack_require__.p = "publicPathPlaceholder";

// after
__webpack_require__.p = window.externalPublicPath;
```

<h2 align="center">Options</h2>

```js
new WebpackDynamicPublicPathPlugin(options: object)
```

|Name|Type|Description|
|:--:|:--:|:----------|
|**`externalPublicPath`**|`{String}`|JavaScript code, here you can define some variable or condition.|
|**`chunkNames`**|`{Array}`|Chunk names in which `publicPath` will be replaced.|


### `chunkNames`

In case if you have several entries you should define plugin instance for each of them.
Check example.

**webpack.config.js**
```js
const WebpackDynamicPublicPathPlugin = require("webpack-dynamic-public-path");

module.exports = {
    entry: {
        'index': path.resolve(__dirname, 'src', 'index.js'),
        'second-chunk': path.resolve(__dirname, 'src', 'second-chunk.js')
    },
    output: {
        filename: '[name].bundle.js',
        publicPath: "publicPathPlaceholder"
    },
    plugins: [
        new WebpackDynamicPublicPathPlugin({
            externalPublicPath: "window.externalPublicPathForMainChunk",
            chunkNames: ['index']
        }),
        new WebpackDynamicPublicPathPlugin({
            externalPublicPath: '"./"',
            chunkNames: ['second-chunk']
        }),
    ]
}
```

**index.bundle.js**
```js
__webpack_require__.p = window.externalPublicPathForMainChunk;
```

**second-chunk.bundle.js**
```js
__webpack_require__.p = "./";
```