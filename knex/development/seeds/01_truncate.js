const _ = require('lodash')

exports.seed = function(knex) {

  function truncate(table) {
    return knex(table)
      .del()
  }

  truncateTrackSupervision = _.partial(truncate, 'track_supervision')
  truncateRangeSupervision = _.partial(truncate, 'range_supervision')
  truncateScheduledRangeSupervision = _.partial(truncate, 'scheduled_range_supervision')
  truncateRangeReservation = _.partial(truncate, 'range_reservation')
  truncateTrack = _.partial(truncate, 'track')
  truncateRange = _.partial(truncate, 'range')
  truncateSupervisor = _.partial(truncate, 'supervisor')
  truncateUser = _.partial(truncate, 'user')

  return truncateTrackSupervision()
    .then(truncateRangeSupervision)
    .then(truncateScheduledRangeSupervision)
    .then(truncateRangeReservation)
    .then(truncateTrack)
    .then(truncateRange)
    .then(truncateSupervisor)
    .then(truncateUser)
}
