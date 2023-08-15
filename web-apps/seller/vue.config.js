const webpack = require('webpack');
const devConfig = require('./config/dev.js');
const demoConfig = require('./config/demo.js');
const prodConfig = require('./config/prod.js');

const isBranchMaster = process.env.BRANCH === 'main';

let globalConfig;
if (process.env.CONTEXT === 'production') {
  globalConfig = isBranchMaster ? prodConfig : demoConfig;
} else {
  globalConfig = devConfig;
}

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        GLOBALCONFIG: JSON.stringify(globalConfig),
        EMULATE_FIRESTORE: process.env.EMULATE_FIRESTORE || false,
        EMULATE_FUNCTIONS: process.env.EMULATE_FUNCTIONS || false,
        EMULATE_AUTH: process.env.EMULATE_AUTH || false,
      }),
      new webpack.DefinePlugin({
        'process.env.CONTEXT': JSON.stringify(process.env.CONTEXT || 'development'),
      }),
    ],
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    // allow to import svg icons inline via adding ?inline query
    // example: import Icon from '../assets/icons/icon.svg?inline';
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .options({
        svgo: {
          plugins: [{ cleanupIDs: false }],
        },
      })
      .end()
      .end()
      .oneOf('external')
      .use('url-loader')
      .loader('url-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]',
        esModule: false,
      });
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/styles/global.scss";',
      },
    },
  },
  // lintOnSave: false,
};
