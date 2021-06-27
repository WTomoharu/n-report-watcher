/*
MIT License

Copyright (c) 2017 Ivan Demidov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/Scrum/webpack-extension-manifest-plugin
*/


const merge = require("deepmerge")
const webpack = require("webpack")
process.traceDeprecation = true

class WebpackExtensionManifestPlugin {
  constructor(options) {
    this.options = options;
  }

  generateJson() {
    if (typeof this.options !== 'object') {
      throw new TypeError('options it should be `object`.');
    }

    if (
      Reflect.has(this.options, 'config') &&
      typeof this.options.config !== 'object'
    ) {
      throw new Error('config it should be `object`.');
    }

    let json = '';

    if (Reflect.has(this.options.config, 'base')) {
      json = merge(
        this.options.config.base,
        this.options.config.extend || {}
      );
    }

    if (!Reflect.has(this.options.config, 'base')) {
      json = this.options.config || {};
    }

    return JSON.stringify(json, undefined, this.options.minify ? undefined : 2);
  }

  webpack4(_compiler) {
    _compiler.hooks.emit.tap(
      'WebpackExtensionManifestPlugin',
      compilation => {
        const jsonString = this.generateJson();

        compilation.assets['manifest.json'] = {
          source: () => jsonString,
          size: () => jsonString.length
        };
        return true;
      }
    );
  }

  webpack5(_compiler) {
    _compiler.hooks.thisCompilation.tap(
      'WebpackExtensionManifestPlugin',
      compilation => {
        const jsonString = this.generateJson();

        compilation.hooks.processAssets.tap(
          {
            name: 'WebpackExtensionManifestPlugin',
            stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS
          },
          _ => {
            compilation.emitAsset('manifest.json', {
              source: () => jsonString,
              size: () => jsonString.length
            });
          }
        );

        return true;
      }
    );
  }

  apply(compiler) {
    if (webpack.version.startsWith('5.')) {
      this.webpack5(compiler);
    } else {
      this.webpack4(compiler);
    }
  }
}

module.exports = WebpackExtensionManifestPlugin
