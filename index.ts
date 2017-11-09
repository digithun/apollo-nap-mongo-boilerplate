require('dotenv').config({})
import config from './config'
import initApp from './server'
import { Connection, Model } from 'mongoose'
import chalk from 'chalk'
import * as DBConnection from './lib/db.connection'

const logger = {
  log: (message) => {
    console.log(message)
  }
}

async function run() {
  const __connection: Connection = await DBConnection.initConnection({
    logger,
    config
  })
  const SVContext: SVContext = {
    config,
    logger,
    __connection,

  }
  const app = await initApp(SVContext)
  async function clearConnection() {
    logger.log(chalk.green('closing app...'))
    await __connection.close()
    process.exit(0)
  }
  process.on('SIGTERM', clearConnection)
  process.on('SIGINT', clearConnection)

  app.start()
}

run()
