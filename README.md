# PROJECT.TODO-LIST
This project was inspired by Saipos Code Challenge Job Interview Process.

# RUNNING APPLICATIONS
The applications were containerized to improve the experience of running them on any environment, so to see it working without installing manually its dependencies, type the command **docker-compose up** in the root directory of the application where it's located the `docker-compose.yaml` file.

### Setting up the application data-base
In order to execute the application, we need to apply the prisma migrate with the following command `npx prisma migrate deploy` and to seed the `TaskStatus` table with the default data, so after type this command at the root directory if it's your first time running the application: `npx prisma db seed --preview-feature`

# UTILS CMDS

### Executing postgres bash and login database defined on docker file

``` 
docker exec -ti backend_postgres_1 bash
psql -h postgres -U user db
pass 
```