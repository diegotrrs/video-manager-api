# TODO
- Review typescript settings.
- Linting
- Review cors
- Review SQlite

# "start": "npm run build && node build/index.js"

Things I wish I had more time:
- nodemon
- linting
- 

Things needed for the code to be productive:
- const dotenv = require('dotenv'); ???
- Use another DB system so it has a separate server process
- logging

Things I hadn't done
- Generate a JWT token.

In this case would the node js server and the database live in different containers?
Yes, in a typical production setup, the Node.js server (application) and the database would live in different containers. This separation provides several benefits:

Persistence in Containers: If you're using containers, remember that SQLite creates a file on the filesystem. If that file is stored inside a container, it will be lost when the container is destroyed. To persist data across container restarts, you'll need to store the SQLite file on a volume or bind mount.

Concurrency: SQLite is great for many use-cases, but it has limitations with write concurrency (only one write can happen at a time). This might be fine for applications with low to moderate write demands, but for high-concurrency situations, a more robust database system might be better.


Why I chose prisma.

# Assumptions:
As a user I would like to be able to delete my annotations > I'm assuming it's the video's annotations associated to the user.
This assumption was made based on the description of the program (Create a simple restful API to manage videos and related annotations) and because Individual Annotation Deletion would be a more common action

As a user I would like to be able to specify annotation type and add additional notes
> Assumption: annotation type is a string

As a user I would like to be able to update my annotation details
> Assumption: I would like to able to update the annotations of a video.



# Steps:
npx prisma migrate dev --name init
npx prisma generate


# Commas
