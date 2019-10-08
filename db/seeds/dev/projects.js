
exports.seed = function(knex) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        
      ])
    })
};
