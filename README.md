# PROJECT.TODO-LIST
This project was inspired by Saipos Code Challenge Job Interview Process.

# RUNNING APPLICATIONS
The applications were containerized to improve the experience of running them on any environment, so to see it working without installing manually its dependencies, type the command `docker-compose up --build` in the root directory of the application where it's located the `docker-compose.yaml` file. All the left steps are handled automatically, like data base set-up, so you don't have to worry about it.

### RUNNING APPLICATIONS TESTS:
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