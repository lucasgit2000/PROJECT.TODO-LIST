# PROJECT.TODO-LIST
This project was inspired by Saipos Code Challenge Job Interview Process.

# RUNNING APPLICATIONS
The applications were containerized to improve the experience of running them on any environment, so to see it working without installing manually its dependencies, type the command **docker-compose up --build** in the root directory of the application where it's located the `docker-compose.yaml` file. After that see how to set-up the data base below.

# SETTING UP THE APPLICATION DATA-BASE
In order to execute the application, we need to apply the prisma migrate with the following command at the root directory of backend app `npx prisma migrate deploy` and after that we need to seed the `TaskStatuses` table with the default its data, so as well as the first command you need to run `npx prisma db seed --preview-feature`. The applications is now ready to run!

### TESTING APPLICATIONS:
- Backend:
just run `yarn test` on cmd terminal :)

- Frontend:
in development :(

# UTILS CMDS
### Executing postgres bash and login database defined on docker file

``` 
docker exec -ti backend_postgres_1 bash
psql -h postgres -U user db
pass 
```