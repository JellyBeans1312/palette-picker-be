const express = require('express')
const app = express();
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello')
});

app.get('/api/v1/projects', async (request, response) => {
  const projects = await database('projects').select();
  return response.status(200).json(projects)
});

app.get('/api/v1/palettes', async (request, response) => {
  const palettes = await database('palettes').select();
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

  for(let requiredParameter of ['project_name']) {
    if(!project[requiredParameter]) {
      return response.status(422).send({ error: `Expected format: { project_name: <string> }. You're missing a "${requiredParameter}" property.`})
    }
  }

  const newProject = await database('projects').insert(project, 'id');
  return response.status(201).json({ id: newProject[0] })
});


module.exports = app;