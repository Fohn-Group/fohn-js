/**
 * Webpack v4 configuration file.
 *
 * Use mode from env variable pass to webpack in order to
 * differentiate build mode.
 * Use a function that return configuration object based
 * on env variable.
 *
 * Using Development
 *  - set webpack config mode to development
 *  - devtools will use source-map under package name;
 *
 * Using Production
 *  - set webpack config mode to production
 *  - change name of output file by adding .min
 *
 * Module export will output default value
 * using libraryExport : 'default' for backward
 * compatibility with previous release of the library.
 *
 * @type {webpack}
 */
const webpack = require('webpack');
const path = require('path');
// VUe file loader.
// const VueLoaderPlugin = require('vue-loader/dist/plugin').default;
const { VueLoaderPlugin } = require('vue-loader');
const TerserPlugin = require('terser-webpack-plugin');
const packageVersion = require('./package.json').version;

module.exports = (env) => {
  // determine which mode
  const isProduction = env.production || env.distribution;
  const srcDir = path.resolve(__dirname, './src');
  const outputDir = env.distribution ? path.resolve(__dirname, './dist') : path.resolve(__dirname, '../fohn-ui/public');
  const libraryName = 'fohn';
  const filename = libraryName + '-ui';

  const prodPerformance = {
    hints: false,
    maxEntrypointSize: 640000,
    maxAssetSize: 640000,
  };

  return {
    entry: { [filename]: srcDir + '/fohn-ui.js' },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    performance: isProduction ? prodPerformance : {},
    output: {
      path: outputDir,
      filename: isProduction ? '[name].min.js' : '[name].js',
      library: libraryName,
      libraryTarget: 'umd',
      libraryExport: 'default',
      umdNamedDefine: true,
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /(\.jsx|\.js)$/,
          loader: 'babel-loader',
          exclude: /(node_modules|bower_components)/,
        },
        // load .vue file
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        // this will apply to both plain `.css` files
        // AND `<style>` blocks in `.vue` files
        {
          test: /\.css$/,
          use: [
            // 'vue-style-loader',
            'style-loader',
            'css-loader',
          ],
        },
      ],
    },
    externals: { jQuery: 'jQuery', fohn: 'fohn' },
    resolve: {
      alias: { vue$: 'vue/dist/vue.esm-bundler.js' },
      modules: [
        path.resolve(__dirname, 'src/'),
        'node_modules',
      ],
      extensions: [
        '.json',
        '.js',
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(packageVersion),
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
      }),
      new VueLoaderPlugin(),
    ],
  };
};
