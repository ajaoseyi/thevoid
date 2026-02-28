import { createApp } from '../server.mjs'

const app = await createApp({ isProd: true })

export default app
