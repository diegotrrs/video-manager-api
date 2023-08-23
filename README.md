# Video Manager API

## General 

This project provides a simple REST API for managing videos and annotations. The app can be deployed as a Docker container, but it can also be run outside of a container.

The application is a NodeJS application written in TypeScript with Express as the API framework.

I used [Prisma](https://www.prisma.io/) as the ORM because of the type-safety benefits it provides and because I was familiar with it.

[Zod](https://zod.dev/) was used for runtime schema validations. The plugin [Zod-Prisma-Types](https://github.com/chrishoermann/zod-prisma-types) was employed to generate TypeScript types from the Prisma schema, eliminating the need to define types redundantly.

## Database

SQLite was chosen for the database due to its simplicity and time constraints. In a production environment, a more robust database system should be considered (e.g., PostgreSQL, MySQL). This server would run in a separate container. Integrating docker-compose would be also necessary.

## Authentication

The chosen method of authentication is an API Key. Every request should include a header named `x-api-key` with the appropriate key value. The API Key was shared with the recruiter.

## How to Run

### Locally

- Download the code.
- Rename .env.example to .env and set the API_KEY.
- Install dependencies:
    ``` 
    npm i
    ```
- Apply Prisma migrations:
    ``` 
    npx prisma migrate deploy 
    ```
- Generate Prisma client:
    ``` 
    npx prisma generate 
    ```
- Start the server:
    ``` 
    npm run start 
    ```

### Docker

- Pull the Docker image:
    ```
    docker pull diegotrrs/video-manager-api:latest
    ```
- Run the Docker image:
    ```
    docker run -p 3000:3000 diegotrrs/video-manager-api:latest
    ```

## How to Test

You can find a Postman collection in the repository named `video_manager_api.postman_collection.json`. Import this file into Postman, add the `x-api-key` header, and you can test the endpoints with ease.

## Assumptions

- Annotations are tied to a video, not to a user. This assumption arose from the statement, "As a user, I would like to be able to delete my annotations." For now, Users do not exist as a model in the DB and users do not have annotations directly associated with them. The API, however, allows users to delete individual annotations.
  
- Similarly, with the statement, "As a user, I would like to be able to update my annotation details", annotations are associated with videos. The API permits users to update individual annotations.

- The datatype for annotations is a string, with no specific format required.

## Improvements

Due to time constraints, the following improvements were not implemented:

- Validate that the `link` attribute for video creation corresponds to a valid URL.
- Addition of unit tests.
