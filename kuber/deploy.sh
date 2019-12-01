#!/bin/bash

name_template='test-mongo'
helm install --name-template $name_template --set usePassword=false stable/mongodb
export MONGODB_ENDP="mongodb://$name_template-mongodb/mytestdb"
export APP_PORT=8080
kubectl apply -f test-app-pod.yaml
kubectl apply -f test-app-svc.yaml