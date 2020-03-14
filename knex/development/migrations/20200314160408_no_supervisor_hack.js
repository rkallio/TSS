exports.up = function(knex) {
  return knex.schema.alterTable('range_reservation', reservation => {
    reservation.boolean('available')
      .nullable()
      .alter()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('range_reservation', reservation => {
    reservation.boolean('available')
      .notNullable()
      .alter()
   })
}
