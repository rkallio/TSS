const path = require('path')
const root = path.join(__dirname, '..', '..', '..')
const config = require(path.join(root, 'config'))

const _ = require('lodash')
const casual = require('casual')

casual.seed(config.seeds.seed)

exports.seed = async function(knex) {

  process.stdout.write(`${config.seeds.ranges} ranges...`)
  const ranges = await Promise.all(
    _.times(
      config.seeds.ranges
      , casual._shooting_range))
  console.log('done')

  process.stdout.write('Inserting...')
  await Promise.all(
    _.chunk(ranges, config.seeds.chunkSize)
      .map(async (rangeChunk) => knex('range').insert(rangeChunk)))
  console.log('done')
};

casual.define('shooting_range', async function() {
  return {
    name: casual.company_name + ' Shooting Range'
  }
})
