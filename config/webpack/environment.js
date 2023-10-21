// environment.js
const { environment } = require('@rails/webpacker')

const path = require('path')

const customConfig = {
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '..', '..', 'app/javascript/src'),
      '@utils': path.resolve(__dirname, '..', '..', 'app/javascript/src/utils'),
      '@comps': path.resolve(__dirname, '..', '..', 'app/javascript/src/components'),
    }
  }
}

environment.config.merge(customConfig);

environment.splitChunks()

module.exports = environment