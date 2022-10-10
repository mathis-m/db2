# Todo App

This is a simple todo app using .NET, React.js and mongodb.


## Configuration

**Configure API**  
- Adjust MongoDBConfig, JWT and Swagger (for reverse proxy route rewrite) in [appsettings.json](src\TodoApi\TodoApi\appsettings.json) or [appsettings.Development.json](src\TodoApi\TodoApi\appsettings.Development.json) if neccesary.  
- You can change the port of the api in [launchSettings.json](src\TodoApi\TodoApi\Properties\launchSettings.json). If you run it via commandline change the `TodoApi` profile.
- for docker compose you can override the hosting url by using the env var `ASPNETCORE_URLS`


**Configure UI**  
- Adjust the API Url in [api.js](src\todo-ui\src\api.js)
- For production change the nginx config [here](src\todo-ui\default.prod.conf)

**Configure Nginx**
- You can change the nginx config [here](src\server\default.conf)

## Docker compose setup

**Architecture**
```
[Browser] ----> [server] - route /api (rewrite to /) -----> [api] -----> [mongodb]
                   |- route / ------> [ui]
```

### UI Development
[docker-compose.yml](docker-compose.yml)
- server = nginx
- ui = Running webpack dev server in docker with code volume mount
- api = Production
- mongodb = just mongodb default image

### Production
[`docker compose -f docker-compose.prod.yml up --build`](docker-compose.prod.yml)
- server = nginx
- ui = nginx hosting static files
- api = Production
- mongodb = just mongodb default image
