## ACCESS-CONTROL-BACKEND

### Target platforms
* linux

### Startup requirements
* docker [How to install docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
* docker-compose
* npm^5.7.0
* node@12.5

### HOW TO RUN DEV / PROD VERSION IN DOCKER?
Guide on how to run this project in Docker described [HERE](https://github.com/propuskator/composer/blob/master/README.md)

### RUN SEEDS IN DOCKER CONTAINER

#### CREATE ADMIN
`docker exec -it access-backend npm run seed:admin <login=admin> <password=admin>`

#### CREATE NOTIFICATIONS
`docker exec -it access-backend npm run seed:notifications <count>`

#### CREATE ACCESS LOGS
`docker exec -it access-backend npm run seed:access-logs <count>`

### Seed
In docker container `docker exec -it run access-backend`:
- `npm run seed:notifications`
- `npm run seed:access-logs`
- `npm run seed:admin` or `npm run seed:admin -- --login=admin --workspace=admin --password=2SmartAccess`

### MQTT scripts

Attach to the container:
```shell
docker exec -it access-backend sh
```

#### Dumper
Run the following command to see how to use the script
```shell
npm run mqtt:dumper -- --help
```

#### Setter
Run the following command to see how to use the script
```shell
npm run mqtt:setter -- --help
```

