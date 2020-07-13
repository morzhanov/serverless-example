# serverless-example

Serverless example with NodeJS, AWS Lambda and DynamoDB

## Description

Simple AWS Lamda function:

- Updates DynamoDB table on POST requests
- Returns values from DynamoDB table on GET requests

## How to run

- npm i
- npm run build
- npm run deploy

## How to cleanup

- npm run remove

## How to use

- POST - https://<url>/dev/users - register new user
- GET - https://<url>/dev/users - list users
- GET - https://<url>/dev/users/{id} - get a single user
