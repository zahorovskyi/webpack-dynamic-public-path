'use strict';

const fs = require('fs');
const path = require('path');

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
        this.afterEmit = this.afterEmit.bind(this);
    }

    apply(compiler) {
        compiler.hooks.afterPlugins.tap({name: 'WebpackDynamicPublicPath'}, this.afterPlugins);
        compiler.hooks.afterEmit.tapPromise({name: 'WebpackDynamicPublicPath'}, this.afterEmit);
    }

    afterPlugins(compilation) {
        if (typeof compilation.options.output === 'undefined' || typeof compilation.options.output.publicPath === 'undefined') {
            throw new Error('Params missing: output.publicPath must be defined in webpack config (used only as placeholder, make it distinctive)');
        }

        if (typeof this.options === 'undefined' || typeof this.options.externalPublicPath === 'undefined') {
            throw new Error(`Params missing: externalPublicPath - name of global variable you want to use as publicPath.`);
        }
    }

    afterEmit(compilation) {
        this.publicPath = compilation.options.output.publicPath;

        const chunks = this.options.chunkNames ?
            compilation.chunks.filter(chunk => this.options.chunkNames.includes(chunk.name)) :
            compilation.chunks;

        if (!chunks.length) {
            throw new Error(`Chunks array is empty.`);
        }

        const fileNames = chunks.map(
            chunk => chunk.files.find(
                file => file.match(/.*\.js$/)
            )
        );

        const replacePromises = fileNames
            .map(fileName => path.resolve(compilation.assets[fileName].existsAt))
            .map(filePath => this.replacePublicPath(filePath));

        return Promise.all(replacePromises);
    }

    /**
     * Replace publicPath
     * @param filePath
     * @return {Promise<any>}
     */
    replacePublicPath(filePath) {
        return new Promise((resolve, reject) => {
            fs.exists(filePath, exists => {
                if (exists) {
                    fs.readFile(filePath, 'utf8', (readFileError, data) => {
                        if (readFileError) {
                            reject(readFileError);
                        } else {
                            const result = data.replace(`"${this.publicPath}"`, this.options.externalPublicPath);

                            fs.writeFile(filePath, result, 'utf8', writeFileError => {
                                if (writeFileError) {
                                    reject(writeFileError);
                                } else {
                                    console.log(`publicPath replaced to ${this.options.externalPublicPath}`);
                                    resolve();
                                }
                            });
                        }
                    });
                } else {
                    reject(`Could not find file ${filePath}`);
                }
            });
        });
    }
}


module.exports = WebpackDynamicPublicPath;