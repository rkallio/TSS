const _ = require('lodash')

exports.seed = async function(knex) {
  const truncate =  async(table) => {
    process.stdout.write(`Truncate ${table}...`)
    const response = await knex(table).del()
    console.log('done')
    return response
  }
  await truncate('track_supervision_history')
  await truncate('track_supervision')
  await truncate('range_supervision')
  await truncate('scheduled_range_supervision')
  await truncate('range_reservation')
  await truncate('track')
  await truncate('range')
  await truncate('supervisor')
  await truncate('user')
}
