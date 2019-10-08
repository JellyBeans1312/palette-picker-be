import request from 'supertest';
import app from './app';
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

describe('Server', () => {

  beforeEach( async () => {
    await database.seed.run()
  });

  describe('init', () => {
    it('should return 200 status', async () => {
      const res = await request(app).get('/')
      expect(res.status).toBe(200)
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should return a status of 200 and an array of all projects', async () => {
      const expectedProjects = await database('projects').select()

      const response = await request(app).get('/api/v1/projects')
      const projects = response.body

      expect(response.status).toBe(200);
      expect(JSON.stringify(projects)).toEqual(JSON.stringify(expectedProjects));
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('should return a status of 200 and an array of all palettes', async () => {
      const expectedPalettes = await database('palettes').select()

      const response = await request(app).get('/api/v1/palettes')
      const palettes = response.body

      expect(response.status).toBe(200);
      expect(JSON.stringify(palettes)).toEqual(JSON.stringify(expectedPalettes));
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should return a specific project with a status code of 200', async () => {
      const expectedProject = await database('projects').first();
      const id = expectedProject.id

      const res = await request(app).get(`/api/v1/projects/${id}`);
      const result = res.body[0];

      expect(res.status).toBe(200);
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedProject));
    });

    it('should return a 404 error if the specific project does not exist in the database', async () => {
      const invalidId = -1;

      const res = await request(app).get(`/api/v1/projects/${invalidId}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toEqual('Could not find project with matching ID')
    });
  });

  describe('GET /api/v1/palettes/:id', () => {
    it('should return a specific palette with a status code of 200', async () => {
      const expectedPalette = await database('palettes').first();
      const id = expectedPalette.id

      const res = await request(app).get(`/api/v1/palettes/${id}`);
      const result = res.body[0];

      expect(res.status).toBe(200);
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedPalette));
    });

    it('should return a 404 error if the specific palette does not exist in the database', async () => {
      const invalidId = -1;

      const res = await request(app).get(`/api/v1/palettes/${invalidId}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toEqual('Could not find palette with matching ID')
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should post a new project to the db', async () => {
      const newProject = {
        project_name: 'testProject'
      }
  
      const res = await request(app).post('/api/v1/projects').send(newProject);
  
      const projects = await database('projects').where('id', res.body.id);
      const project = projects[0];
  
      expect(res.status).toBe(201);
      expect(project.project_name).toEqual(newProject.project_name);
    });

    it('should return a 404 status and an error if the project is missing a parameter', async () => {
      const newProject = {
        
      }

      const res = await request(app).post('/api/v1/projects').send(newProject);

      expect(res.status).toBe(422);
      expect(res.body.error).toEqual(`Expected format: { project_name: <string> }. You're missing a "project_name" property.`);
      });
    });

  describe('POST /api/v1/palettes', () => {
    it('should post a new palette to the db', async () => {
      const newPalette = {
        palette_name: 'test palette 2',
        color_one: '#000',
        color_two: '#fff',
        color_three: '#333',
        color_four: '#FA8072',
        color_five: '#00FF00'
      }

      const res = await request(app).post('/api/v1/palettes').send(newPalette);

      const palettes = await database('palettes').where('id', res.body.id);
      const palette = palettes[0];

      expect(res.status).toBe(201);
      expect(palette.palette_name).toEqual(newPalette.palette_name);
    });

    it('should return a 404 status and an error if the project is missing a parameter', async () => {
      const newPalette = {
        palette_name: 'palette 2', 
        color_one: '#000', 
        color_three: '#333', 
        color_four: '#FA8072', 
        color_five: '#00FF00' 
      }

      const res = await request(app).post('/api/v1/palettes').send(newPalette);

      expect(res.status).toBe(422);
      expect(res.body.error).toEqual(`Expected format: { project_name: <string>, color_one: <string>, color_two: <string>, color_three: <string>, color_four: <string>, color_five: <string> }. You're missing a "color_two" property.`);
    });
  });
});