process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')

// This enables live reloading of pages when Rails templates / locales change
if (process.env.RAILS_ENV == "development") {
  const chokidar = require('chokidar')
  environment.config.devServer.before = (app, server) => {
    chokidar.watch([
      'config/locales/*.yml',
      'app/views/**/*.erb'
    ], {
      awaitWriteFinish: true
    }).on('change', () => server.sockWrite(server.sockets, 'content-changed'))
  }
}

environment.config.merge({
  devtool: 'cheap-source-map'
})

module.exports = environment.toWebpackConfig()
