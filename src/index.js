'use strict';

class WebpackDynamicPublicPath {

    /**
     *
     * @param {Object} options
     * @param {string} options.externalPublicPath - variable with new publicPath
     * @param {Array<string>} [options.chunkNames] - list of chuck names in which publicPath will be replaced,
     * in case if parameter is not defined publicPath will be replaced for all chunks
     */
    constructor(options) {
        this.options = options;

        this.afterPlugins = this.afterPlugins.bind(this);
        this.emit = this.emit.bind(this);
    }

    apply(compiler) {
        compiler.hooks.afterPlugins.tap({name: 'WebpackDynamicPublicPath'}, this.afterPlugins);
        compiler.hooks.emit.tapPromise({name: 'WebpackDynamicPublicPath'}, this.emit);
    }

    afterPlugins(compilation) {
        if (typeof compilation.options.output === 'undefined' || typeof compilation.options.output.publicPath === 'undefined') {
            throw new Error('WebpackDynamicPublicPath: params missing - output.publicPath must be defined in webpack config (used only as placeholder, make it distinctive)');
        }

        if (typeof this.options === 'undefined' || typeof this.options.externalPublicPath === 'undefined') {
            throw new Error(`WebpackDynamicPublicPath: params missing - externalPublicPath - name of global variable you want to use as publicPath.`);
        }

        this.publicPath = `"${compilation.options.output.publicPath}"`;
    }

    emit(compilation) {
        const chunks = this.options.chunkNames ?
            compilation.chunks.filter(chunk => this.options.chunkNames.includes(chunk.name)) :
            compilation.chunks;

        if (!chunks.length) {
            throw new Error('WebpackDynamicPublicPath: chunks array for replacing publicPath is empty.');
        }

        const fileNames = chunks.map(
            chunk => chunk.files.find(
                file => file.match(/.*\.js/)
            )
        );

        const replacePromises = fileNames.map(fileName => this.replacePublicPath(fileName, compilation));

        return Promise.all(replacePromises).then(() => console.log('WebpackDynamicPublicPath: publicPath replaced.'));
    }

    /**
     * Replace publicPath
     * @param {string} fileName
     * @param {object} compilation
     * @return {Promise<any>}
     */
    replacePublicPath(fileName, compilation) {
        return new Promise((resolve) => {
            const source = compilation.assets[fileName].source();
            const publicPath = this.publicPath;
            const externalPublicPath = this.options.externalPublicPath;

            compilation.assets[fileName].source = function () {
                return source.replace(publicPath, externalPublicPath);
            };

            resolve();
        });
    }
}


module.exports = WebpackDynamicPublicPath;