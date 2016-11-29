const http = require('http')
const httpProxy = require('http-proxy')

const PROXY_TARGET_SERVICE_NAME = process.env[ 'PROXY_TARGET_SERVICE_NAME' ]
const PROXY_TARGET_HOST = process.env[ `${PROXY_TARGET_SERVICE_NAME}_HOST` ] || 'no-proxy-target-host'
const PROXY_TARGET_PORT = process.env[ `${PROXY_TARGET_SERVICE_NAME}_PORT` ] || 'no-proxy-target-port'
const proxyTarget = `http://${PROXY_TARGET_HOST}:${PROXY_TARGET_PORT}`

const proxy = httpProxy.createProxyServer({
  ws: true,
  xfwd: true
})

const server = http.createServer((req, res) => {
  console.log(`proxying request from ${req.headers.host} --> ${proxyTarget}`)
  proxy.web(req, res, {
    target: proxyTarget
  }, (err) => {
    logError(err, req)
  })
})

server.on('upgrade', (req, res) => {
  console.log(`upgrading connection from ${req.headers.host}`)
  proxy.ws(req, res, {
    target: proxyTarget
  }, (err) => {
    logError(err, req)
  })
})

server.listen(3000)
console.log('server listening on port 3000')

function logError (err, req) {
  console.error(err.message)
  console.log(`${req.headers.host} --> ${proxyTarget}`)
}
