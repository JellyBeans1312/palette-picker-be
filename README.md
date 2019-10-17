# Pallette Picker BE/API

## About
Palette Picker is an application that allows users to create projects and palettes, which are collections of five, randomly-generated hex codes, and save those palettes to a specific project.

## Endpoints
* GET `/api/v1/projects` returns all projects in the database.
* GET `/api/v1/palettes` returns all palettes in the database.
* GET `/api/v1/palettes?name={name}` allows a user to search for a specific palette based on a name.
* GET `/api/v1/projects/:id` returns a single project in the database based on a its specific id.
* GET `/api/v1/palettes/:id` returns a single palette in the database based on a its specific id.
* POST `/api/v1/projects` allows a user to create a new project.
* POST `/api/v1/palettes` allows a user to create a new palette.
* PATCH `/api/v1/projects/:id` allows a user to update (patch) a specified project.
* PATCH `/api/v1/palettes/:id` allows a user to update (patch) a specified palette.
* DELETE `/api/v1/projects/:id` allows a user to delete a specified project.
* DELETE `/api/v1/palettes/:id` allows a user to delete a specified palette.

## Project endpoints

### Return all projects:

| Url | Verb  | Options | Sample Response  |
|---|---|---|---|
| `/api/v1/projects` | GET | Not needed | An array of projects: `[{"id": 1, "project_name": "project 1", "created_at": "2019-10-09T21:08:56.005Z", "updated_at": "2019-10-09T21:08:56.005Z"}, {"id": 2, "project_name": "project 2", "created_at": "2019-10-09T21:08:56.005Z", "updated_at": "2019-10-09T21:08:56.005Z"}]` |

If the request is not successful, a `500` error will be returned.
___
### Return a single project based on an id:

| Url | Verb  | Options | Sample Response  |
|---|---|---|---|
| `/api/v1/projects/:id` | GET | Not needed | A 200 status code with an array containing the single project object: `[{"id": 1, "project_name": "project 1", "created_at": "2019-10-09T21:08:56.005Z", "updated_at": "2019-10-09T21:08:56.005Z"}]` |

If the request is not successful, a `404` error will be returned with the message `Could not find project with matching ID`.
___
### Create a new project:

| Url | Verb  | Options | Sample Response  |
|---|---|---|---|
| `/api/v1/projects` | POST | An object with the updated project name: `{ project_name: 'New Project'}` | A 201 status code with the id of the updated palette: `{"id": "2"}` |

If the request is missing a required parameter, a `422` error will be returned with the message `Expected format: { project_name: <string> }. You're missing a "${requiredParameter}" property.`

If the name of the project already exists in the database, a `409` error will be returned with the message `error: Error: ${project_name} already exists. Please choose a different name`}).
___
### Update a single project based on an id:

| Url | Verb  | Options | Sample Response  |
|---|---|---|---|
| `/api/v1/projects/:id` | PATCH | An object with the name of the new project: `{ project_name: 'New Project2'}` | A 201 status code with the id of the updated palette: `{"id": "4"}` |

If the request does not include a `project_name` key, a `422` status with the message `error: Please add a valid project name` will be returned.
___
### Delete a single project based on an id:

| Url | Verb  | Options | Sample Response  |
|---|---|---|---|
| `/api/v1/projects/:id` | DELETE | Not needed | A 204 status code. |

If the request is not successful, a `422` error will be returned with the message `Unable to delete project.`

## Palette endpoints
___
### Return all palettes:

| Url | Verb  | Options | Sample Response  |
|---|---|---|---|
| `/api/v1/palettes` | GET | Not needed | An array of all existing palettes: `{"id": 2, "palette_name": "palette 2", "project_id": 2, "color_one": "#000","color_two": "#fff", "color_three": "#333", "color_four": "#FA8072", "color_five": "#00FF00", "created_at": "2019-10-09T21:08:56.013Z", "updated_at": "2019-10-09T21:08:56.013Z"}, {"id": 1, "palette_name": "palette 1", "project_id": 1, "color_one": "#000", "color_two": "#fff", "color_three": "#333", "color_four": "#FA8072", "color_five": "#00FF00", "created_at": "2019-10-09T21:08:56.011Z", "updated_at": "2019-10-09T21:08:56.011Z"}]` |

If getting all palettes, if the request is not successful, a `500` error will be returned.
___
### Return a single palette based on an id:

| Url | Verb  | Options | Sample Response  |
|---|---|---|---|
| `/api/v1/palettes/:id` | GET | Not needed | An array with the specified palette object: `[{"id": 2, "palette_name": "palette 2", "project_id": 2, "color_one": "#000","color_two": "#fff", "color_three": "#333", "color_four": "#FA8072", "color_five": "#00FF00", "created_at": "2019-10-09T21:08:56.013Z", "updated_at": "2019-10-09T21:08:56.013Z"}]` |

If the request is unsuccessful, a `404` status will be returned with the message `Could not find palette with matching ID`.
___
### Search for a specific palette based on its name: 

| Url | Verb  | Options | Sample Response  |
|---|---|---|---|
| `/api/v1/palettes?name=[name]` | GET | Not needed | The found palette object: `{"palette_name": "palette 2", "project_id": 2, "color_one": "#000","color_two": "#fff", "color_three": "#333", "color_four": "#FA8072", "color_five": "#00FF00"}`  |

If searching for a specific palette, if the request is not successful, a `404` error will be returned with the message `That palette does not exist`.
___
### Create a new palette: 

| Url | Verb  | Options | Sample Response  |
|---|---|---|---|
| `/api/v1/palettes` | POST | An object with palette_name, project_id, and color_one through color_five: `{"palette_name": "palette 2", "project_id": 2, "color_one": "#000","color_two": "#fff", "color_three": "#333", "color_four": "#FA8072", "color_five": "#00FF00"}`| The id of the created palette: `{"id": 7}`  |

If the request does not contain a required parameter, a `422` status with the message `error: Expected format: { project_id: <integer> project_name: <string>, color_one: <string>, color_two: <string>, color_three: <string>, color_four: <string>, color_five: <string> }. You're missing a "${requiredParameter}" property` will be returned.
___
### Update a single palette based on an id:

| Url | Verb  | Options | Sample Response  |
|---|---|---|---|
| `/api/v1/projects/:id` | PATCH | An object with the updated color: `{id: 2, palette_name: palette 2, project_id: 2, color_one: #fa564e,color_two: #fff, color_three: #333, color_four: #FA8072, color_five: #00FF00}` | A 202 status code with the id of the updated palette: `{"id": "2"}` |

If the request is missing a required parameter, a `422` status along with the message `error: Please add a valid ${requiredParameter} value` will be returned.
___
### Delete a single palette based on an id:

| Url | Verb  | Options | Sample Response  |
|---|---|---|---|
| `/api/v1/palettes/:id` | DELETE | Not needed | A 204 status code. |

If the request is unsuccessful, a `422` status along with the message `Unable to delete palette.` will be returned.
