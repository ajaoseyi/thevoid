import fs from 'node:fs/promises'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const isProd = process.argv.includes('--prod') || process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT) || 5173
const app = express()

let prodTemplate = ''
let prodRender

if (isProd) {
  prodTemplate = await fs.readFile('./dist/client/index.html', 'utf-8')
  const serverEntry = await import('./dist/server/entry-server.js')
  prodRender = serverEntry.render
  app.use(express.static('./dist/client', { index: false }))
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      let template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      const serverEntry = await vite.ssrLoadModule('/src/entry-server.tsx')
      const appHtml = serverEntry.render(url)
      const html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (error) {
      vite.ssrFixStacktrace(error)
      res.status(500).end((error instanceof Error ? error.stack : String(error)) ?? 'SSR render failed')
    }
  })
}

if (isProd) {
  app.use('*', async (req, res) => {
    const appHtml = prodRender(req.originalUrl)
    const html = prodTemplate.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  })
}

app.listen(port, () => {
  console.log(`SSR server running at http://localhost:${port}`)
})

