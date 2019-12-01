# test-project

This project is based on Express framework and uses MongoDB as database

### Deployment

1. docker-compose contains two files:
1.1 docker-compose.yaml implements basic MongoDB deployment without authentication
1.2 docker-compose-with-auth.yaml deploys MongoDB with password authentication. It also requires init.js to create a user for application.
2. kuber directory contains bash script that deploys mongodb and the application into AWS EKS using Helm and kubectl.

For docker-compose you can use 'docker-compose up'. If you want to change a port which is used by Express you can use 'export APP_PORT=8080' for example.

#### Default users
The application checks how many users in database during start. If count == 0, the appliation creates
admin:admin
and
administrator:administrator

If you accidentaly deleted all users you can restart the app.
