const casual = require('casual')
const _ = require('lodash')

const path = require('path')
const root = path.join(__dirname, '..', '..', '..')
const config = require(path.join(root, 'config'))

casual.seed(config.seeds.seed)

exports.seed = async function(knex) {
  const schedule = (
    await knex('scheduled_range_supervision')
      .select('id').whereNotNull('supervisor_id')).map(({id}) => id)

  process.stdout.write(`${schedule.length} range supervisions...`)
  const supervisions = await Promise.all(
    schedule.map(id => casual.range_supervision(id)))
  console.log('done')

  process.stdout.write('Inserting...')
  await Promise.all(
    _.chunk(supervisions, config.seeds.chunkSize)
      .map(async (supervisionChunk) => (
        knex('range_supervision')
          .insert(supervisionChunk))))
  console.log('done')
}

casual.define('range_supervision', async (supervisionId) => {
  const state = ['absent', 'confirmed', 'not confirmed', 'en route', 'present']

  return {
    scheduled_range_supervision_id: supervisionId
    , range_supervisor: state[casual.integer(0, state.length - 1)]
    , notice: casual.description.substring(0, 255)
  }
})
