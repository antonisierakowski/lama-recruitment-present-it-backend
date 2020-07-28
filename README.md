## present-it
This repo hosts backend for Lama Media recruitment task called present-it. [For the frontend part, visit this link.](https://github.com/antonisierakowski/lama-recruitment-present-it-frontend)  

## Intall & run

You can run the server in two ways:

### Docker
##### Prerequisites:
* `docker`
* `docker-compose`

In project root run `cp .env.dist .env`. This will copy default environment variables.  
Then `docker-compose up` will build the images and run the Docker containers. Once it's done, you will see in the console output that the server is ready to receive requests on port specified in `.env` file.

### Node
##### Prerequisites:
* `node` or `nvm`
* `yarn`
* `postgresql` (including `psql` CLI)

Same as above, in project root run `cp .env.dist .env`. You will need to edit the environment variables so the server can access your local PostgreSQL installation.  
Once you make sure PostgreSQL server is up, run `yarn init-db` to set up the database for the app.   
Next: install dependencies, compile TypeScript and finally run the server:
```
yarn
yarn build
yarn start
```
Development mode: `yarn dev`  
Clear static storage: `yarn clear-static`

## API

### REST
The REST api (on default port :8000) exposes the following endpoints: 

| Endpoint                                     | Method | Request body                                                                                                | Example response |
|----------------------------------------------|--------|-------------------------------------------------------------------------------------------------------------|------------------|
| `/api/presentation`                          | POST   | `.pdx` or `.pttf` file. The file must be under `presentation` key and request must be of `form-data` type.  | <code>  </code>  |
| `/api/presentation/:presentationId`          | GET    | -                                                                                                           |                  |
| `/api/presentation/:presentationId/metadata` | GET    | -                                                                                                           |                  |
| `/api/presentation/:presentationId`          | PUT    | <pre>{<br>   "currentSlide": number<br>}</pre>                                                              |                  |
| `/api/presentation/:presentationId`          | DELETE | -                                                                                                           |                  |

### WebSocket

To receive messages over the WebSocket protocol, you will need to connect using an endpoint composed of the base host and port and an ID of the channel/presentation you'd like to listen to.
So using default port in development that would be:
```
ws://localhost:8080/:presentationId
```
Once you're connected, you will receive updates on the presentation entity of which ID you passed in.
