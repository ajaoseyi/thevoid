import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import express from 'express'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const distClientDir = path.join(rootDir, 'dist', 'client')
const distServerEntry = path.join(rootDir, 'dist', 'server', 'entry-server.js')
const indexHtmlPath = path.join(distClientDir, 'index.html')

const isProdFromEnv = process.argv.includes('--prod') || process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT) || 5173

export async function createApp({ isProd = isProdFromEnv } = {}) {
  const app = express()

  if (isProd) {
    const prodTemplate = await fs.readFile(indexHtmlPath, 'utf-8')
    const serverEntry = await import(pathToFileURL(distServerEntry).href)
    const prodRender = serverEntry.render
    app.use(express.static(distClientDir, { index: false }))

    app.use(async (req, res) => {
      const appHtml = prodRender(req.originalUrl)
      const html = prodTemplate.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    })

    return app
  }

  const { createServer: createViteServer } = await import('vite')
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })
  app.use(vite.middlewares)

  app.use(async (req, res) => {
    try {
      const url = req.originalUrl
      let template = await fs.readFile(path.join(rootDir, 'index.html'), 'utf-8')
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

  return app
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectRun) {
  const app = await createApp()
  app.listen(port, () => {
    console.log(`SSR server running at http://localhost:${port}`)
  })
}
