# PROJECT.TODO-LIST
This project was inspired by Saipos Code Challenge Job Interview Process.

# RODANDO AS APLICAÇÕES
The applications were containerized to improve the experience of running them on any environment, so to see it working without installing manually its dependencies, type the command **docker-compose up** in the root directory of the application where it's located the docker-compose.yaml file.

# UTILS CMDS

## Executing postgres bash and login database defined on docker file

docker exec -ti postgres bash
psql -h postgres -U user db
pass