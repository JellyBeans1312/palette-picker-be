const express = require('express')
const app = express();
const cors = require('cors')
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.use(express.json(), cors());

app.get('/', (req, res) => {
  res.send('hello')
});

app.get('/api/v1/projects', async (request, response) => {
  const projects = await database('projects').select();
  return response.status(200).json(projects)
});

app.get('/api/v1/palettes', async (request, response) => {
  const palettes = await database('palettes').select();
  const { palette_name } = request.query;
  if(palette_name) {
    const foundPalette = await database('palettes').where('palette_name', 'like', `%${palette_name}%`).select();
    if(foundPalette.length) {
      return response.status(200).json(foundPalette)
    } else {
      return response.status(404).json({ error: 'That palette does not exist' })
    }    
  }
  return response.status(200).json(palettes)
});

app.get('/api/v1/projects/:id', async (request, response) => {
  const project = await database('projects').where('id', request.params.id)

  if(project.length) {
    return response.status(200).json(project)
  } else {
    return response.status(404).json({error: 'Could not find project with matching ID'})
  }
});

app.get('/api/v1/palettes/:id', async (request, response) => {
  const palette = await database('palettes').where('id', request.params.id)
  if(palette.length) {
    return response.status(200).json(palette)
  } else {
    return response.status(404).json({error: 'Could not find palette with matching ID'})
  }
});

app.post('/api/v1/projects', async (request, response) => {
  const project = request.body;
  const existingProjects = await database('projects');
  let existingProjectNames = existingProjects.filter(existingProject => {
    return existingProject.project_name === project.project_name
  });

  if(!existingProjectNames.length) {
    for(let requiredParameter of ['project_name']) {
      if(!project[requiredParameter]) {
        return response.status(422).send({ error: `Expected format: { project_name: <string> }. You're missing a "${requiredParameter}" property.`})
      }
    }
  } else {
    return response.status(409).json({ error: `Error: ${project.project_name} already exists. Please choose a different name`})
  }

  const newProject = await database('projects').insert(project, 'id');
  return response.status(201).json({ id: newProject[0] })
});

app.post('/api/v1/palettes', async (request, response) => {
  const palette = request.body;
  console.log('palette: ', palette)
  for (let requiredParameter of ['project_id', 'palette_name', 'color_one', 'color_two', 'color_three', 'color_four', 'color_five']) {
    if (!palette[requiredParameter]) {
      console.log('reqParam: ', requiredParameter)
      return response.status(422).send({ error: `Expected format: { project_id: <integer> project_name: <string>, color_one: <string>, color_two: <string>, color_three: <string>, color_four: <string>, color_five: <string> }. You're missing a "${requiredParameter}" property.` })
    }
  }

  const newPalette = await database('palettes').insert(palette, 'id');
  return response.status(201).json({ id: newPalette[0] })
});

app.patch('/api/v1/projects/:id', async (request, response) => {
  const { project_name } = request.body;

  if(!project_name) {
    return response.status(422).json({ error: 'Please add a valid project name' })
  } 

  await database('projects')
  .where('id', request.params.id)
  .update({ project_name })
  
  return response.status(202).json({ id: request.params.id })
});

app.patch('/api/v1/palettes/:id', async (request, response) => {
  const paletteToUpdate = request.body;

  for (let requiredParameter of ['project_id', 'palette_name', 'color_one', 'color_two', 'color_three', 'color_four', 'color_five']) {
    if(!paletteToUpdate[requiredParameter]) {
      return response.status(422).json({ error: `Please add a valid ${requiredParameter} value` })
    } 
  }
  await database('palettes')
  .where('id', request.params.id)
  .update({ ...paletteToUpdate })
  
  return response.status(202).json({ id: request.params.id })
});

app.delete('/api/v1/projects/:id', async (request, response) => {
  const foundProject = await database('projects').where('id', request.params.id);

  if (foundProject.length) {
    await database('palettes').where('project_id', request.params.id).del();
  
    await database('projects').where('id', request.params.id).del();
  
    return response.status(204).send();
  } else {
    return response.status(422).json({error: 'Unable to delete project.'})
  }
});

app.delete('/api/v1/palettes/:id', async (request, response) => {
  const foundPalette = await database('palettes').where('id', request.params.id);

  if(foundPalette.length) {
    await database('palettes').where('id', request.params.id).del();

    return response.status(204).send();
  } else {
    return response.status(422).json({error: 'Unable to delete palette.'})
  }
});

module.exports = app;