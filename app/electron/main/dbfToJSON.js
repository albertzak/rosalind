const Parser = require('node-dbf').default
const logger = require('./logger')

const dbfToJSON = async ({ path, encoding }) => {
  return new Promise((resolve, reject) => {
    const startAt = new Date()

    const dbf = new Parser(path, { encoding: encoding || 'latin1' })
    let records = []

    dbf.on('header', ({ fields, ...header}) => {
      logger.info(`[dbfToJSON] Opened ${path} with header ${JSON.stringify(header)} and ${fields.length} fields`)
    })

    dbf.on('record', (record) => {
      records.push(record)
    })

    dbf.on('end', () => {
      const recordsJSON = JSON.stringify(records)
      logger.info(`[dbfToJSON] Finished parsing ${records.length} records into ${recordsJSON.length} JSON bytes in ${(new Date() - startAt) / 1000} seconds`)
      resolve(recordsJSON)
    })

    dbf.on('error', e => {
      reject(e)
    })

    dbf.parse()
  })
}

module.exports = { dbfToJSON }
