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
  });
})