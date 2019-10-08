const projectData = require('../../../projectData')

const createProject = (knex, project) => {
  return knex('projects').insert({
    project_name: project.project_name,
  }, 'id')
  .then(projectId => {
    let palettePromises = [];

    project.palettes.forEach(palette => {
      palettePromises.push(
        createPalette(knex, {
          palette_name: palette.palette_name,
          project_id: projectId[0],
          color_one: palette.color_one,
          color_two: palette.color_two,
          color_three: palette.color_three,
          color_four: palette.color_four,
          color_five: palette.color_five
        })
      )
    })

    return Promise.all(palettePromises);
  })
};

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette);
}

exports.seed = function(knex) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let projectPromises = [];

      projectData.forEach(project => {
        projectPromises.push(createProject(knex, project))
      })

      return Promise.all(projectPromises)
    })
    .catch(error => {
      console.log(`Error seeding projects: ${error}`)
    })
};
