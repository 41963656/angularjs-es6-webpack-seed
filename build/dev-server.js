let express = require('express')
let proxyMiddleware = require('http-proxy-middleware')
let config = require('../config')
let proxyTable = config.dev.proxyTable
let webpack = require('webpack')
let webPackConfig = require('../config/webpack.dev.config')
let app = express()
let compiler = webpack(webPackConfig)
let mockReader = require('./mock-reader')
let devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: config.dev.publicPath,
  quiet: false
})
let hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
if (config.dev.localData) {
  app.all('/data/*', (res, rsp) => {
    mockReader.process(res, rsp)
  })
}
Object.keys(proxyTable).forEach(function (context, p2, p3) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(options.A || context, options))
})

app.use(require('connect-history-api-fallback')())

app.use(devMiddleware)
app.use(hotMiddleware)

app.use(config.dev.publicPath + 'static', express.static('./static'))

console.log('> Starting dev server...')

var server = app.listen(config.dev.port, function () {
  console.log('Example router listening at port %s', config.dev.port)
})

module.exports = {
  ready: function () {
    console.log('------------------------')
  },
  close: function () {
    server.close()
  }
}
