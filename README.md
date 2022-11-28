# Subscription Service

## Running

To run the application follow these steps:

- Create a copy of the [`.envcopy`](.envcopy) file with the name `.env`
- Change the values to your MySQL instance values (The user should have permissions to create tables). e.g;
```dotenv
DATABASE_USER=user
DATABASE_PASSWORD=p4ssw0rd
DATABASE_NAME=subscription
DATABASE_PORT=3306
DATABASE_HOST=localhost
JWT_SECRET=SUPER_SECRET_KEY
```
- Run the command ```npm install```
- Run the command ```npm run start:dev```

The application should be ready in your localhost port 3000                  

## Using the application

The examples in this document will use `curl`, you can use any tool that you prefer to interact with the API

### Listing all subscriptions

```shell
curl -XGET 'localhost:3000/subscription'
```
```json
[{"id":1,"name":"ZumCare","cost":10},{"id":2,"name":"ZumCare+","cost":20}]
```

### Login

The application has 3 users that you can try:

| Username | Password |
|----------|----------|
| Mario    | pass123! |
| Ari      | pass123! |
| Veronika | pass123! |

Use the username and password as body: `{"username":"Mario", "password": "pass123!"}`

```shell
curl -XPOST -H "Content-type: application/json" -d '{"username":"Mario", "password": "pass123!"}' 'localhost:3000/auth/login'
```
It will return an access token 

```json
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hcmlvIiwic3ViIjoxLCJpYXQiOjE2Njk2MDQ4NjgsImV4cCI6MTY2OTYwNTQ2OH0.-6ASD-kfCnr_OAnFF8McK-wqsqN-ZnKpuwRwH7yA--o"}
```

### List user information

Use the access token as authorisation bearer. 
The token contains the user id information, therefore doesn't need an additional parameter and add increased security

```shell
curl -XGET -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hcmlvIiwic3ViIjoxLCJpYXQiOjE2Njk2MDQ4NjgsImV4cCI6MTY2OTYwNTQ2OH0.-6ASD-kfCnr_OAnFF8McK-wqsqN-ZnKpuwRwH7yA--o' -H "Content-type: application/json" 'localhost:3000/users'
```

```json
{"id":1,"name":"Mario","subscription":null}
```

### Purchase subscription

Use the access token as authorisation bearer.      
As the body use the subscription id `{"subscription_id": 1}`

```shell
curl -XPOST -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hcmlvIiwic3ViIjoxLCJpYXQiOjE2Njk2MDU1NDcsImV4cCI6MTY2OTYwNjE0N30.xq4SMI4Ztz5Y8ZZwcpRdKHgpeMCEFFAOesCFrdkBOlk' -H "Content-type: application/json" -d '{"subscription_id":1}' 'localhost:3000/users/purchase'
```

```json
{"id":1,"name":"Mario","subscription":{"id":1,"name":"ZumCare","cost":10}}
```