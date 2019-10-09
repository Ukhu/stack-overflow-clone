# Stack Overflow Clone
This project is a simple implementation of the basic features of StackOverflow. It was developed using the stack below, and managed with Pivotal Tracker

[![Coverage Status](https://coveralls.io/repos/github/Ukhu/stack-overflow-clone/badge.svg?branch=develop)](https://coveralls.io/github/Ukhu/stack-overflow-clone?branch=develop) [![Build Status](https://travis-ci.com/Ukhu/stack-overflow-clone.svg?branch=develop)](https://travis-ci.com/Ukhu/stack-overflow-clone)


## Stack

- **Server:** NodeJS, Express
- **Database:** MongoDB (with Mongoose ORM)

## Hosted Application

- Base Application: https://osaukhu-stack-overflow.herokuapp.com/
- Version 1 API: https://osaukhu-stack-overflow.herokuapp.com/api/v1

## Project Management

- Pivotal Tracker Board: https://www.pivotaltracker.com/projects/2402465

## Documentation

- OpenAPI Documentation: https://osaukhu-stack-overflow.herokuapp.com/docs

## Features

- Signup
- Login
- Ask Questions
- View Questions
- Upvote or Downvote a question
- Answer Question
- Search (Questions, Answers, Users)

## Getting Started

- Clone the repo
- Ensure you set up environment variables based on the .env.sample file
- Run the following commands
```
npm install
```

```
npm run start:dev
```

## API

#### Signup

POST /api/v1/auth/signup

###### Sample Request

- required: displayName, email, password

```
{
  "displayName": "john123",
  "email": "johnDoe@gmail.com",
  "password": "john1234",
}
```

###### Response

```

{
    "message": "sucessfully created user!",
    "data": {
        "id": "5d9e17a86ad68437fc740109",
        "email": "johndoe@gmail.com",
        "displayName": "john123",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkOWUxN2E4NmFkNjg0MzdmYzc0MDEwOSIsImlhdCI6MTU3MDY0MjA3NCwiZXhwIjoxNTcwNzI4NDc0fQ.itSBwRRaN22OWzzToBoSP-u1HbhIeYUcmWQzLjeFafk"
    }
}
```

#### Login

POST /api/v1/auth/login

###### Sample Request

- required: email, password

```
{
  "email": "johnDoe@gmail.com",
  "password": "john1234",
}
```

###### Response

```

{
  "message": "login successful",
  "data": {
    "id": "5d9e17a86ad68437fc740109",
    "email": "johndoe@gmail.com",
    "displayName": "john123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkOWUxN2E4NmFkNjg0MzdmYzc0MDEwOSIsImlhdCI6MTU3MDY0MjA3NCwiZXhwIjoxNTcwNzI4NDc0fQ.itSBwRRaN22OWzzToBoSP-u1HbhIeYUcmWQzLjeFafk"
  }
}
```

#### Ask a Question

POST /api/v1/questions

###### Sample Request

- required: title, body, authorization(in header)
- optional: tags

```
{
	"title": "Javascript or python, which is better",
	"body": "I want to know the better of javascript and python",
	"tags": ["javascript", "python"]
}
```

###### Response

```

{
  "message": "successfully asked a question!",
  "data": {
    "tags": [
        "javascript",
        "python"
    ],
    "answers": [],
    "_id": "5d9e19bf6ad68437fc74010a",
    "owner": "5d9e17a86ad68437fc740109",
    "title": "Javascript or python, which is better",
    "body": "I want to know the better of javascript and python",
    "votes": [],
    "updatedAt": "2019-10-09T17:32:47.734Z",
    "createdAt": "2019-10-09T17:32:47.734Z",
    "__v": 0
  }
}
```

#### View all Questions

GET /api/v1/questions

###### Sample Request

- required: authorization(in header)
- optional: page (defaults to 1), limit (defaults to 20)

###### Response

```

{
  "message": "succesfully returned questions",
  "currentPage": 1,
  "totalPages": 1,
  "limit": 20,
  "data": [
    {
      "id": "5d9e19bf6ad68437fc74010a",
      "owner": "john123",
      "title": "Javascript or python, which is better",
      "body": "I want to know the better of javascript and python",
      "tags": [
          "javascript",
          "python"
      ],
      "answers": [],
      "upvotes": 0,
      "downvotes": 0,
      "createdAt": "2019-10-09T17:32:47.734Z",
      "updatedAt": "2019-10-09T17:32:47.734Z"
    }
  ]
}
```

#### View single Question

GET /api/v1/questions/:questionId

###### Sample Request

- required: authorization(in header)
- where: questionId = 5d9a5867e0c2622f2805848f

###### Response

```

{
  "message": "successfully returned question",
  "data": [
    {
      "id": "5d9e19bf6ad68437fc74010a",
      "title": "Javascript or python, which is bettere",
      "body": "I want to know the better of javascript and python",
      "tags": [
          "javascript",
          "python"
      ],
      "answers": [],
      "upvotes": 0,
      "downvotes": 0,
      "createdAt": "2019-10-09T17:32:47.734Z",
      "updatedAt": "2019-10-09T17:32:47.734Z"
    }
  ]
}
```

#### Upvote or Downvote a Question

PATCH /api/v1/questions/:questionId/vote

###### Sample Request

- required: voteType (in query), authorization(in header)
- where: questionId = 5d9a5867e0c2622f2805848f, voteType = up

###### Response

```

{
  "message": "you have successfully upvoted this question"
}
```

#### Answer a Question

POST /api/v1/questions/:questionId/answers

###### Sample Request

- required: body, authorization(in header)
- where: questionId = 5d9a5867e0c2622f2805848f

```
{
	"body": "both are very good"
}
```

###### Response

```

{
  "message": "successfully answered a question!",
  "data": {
    "_id": "5d9e1ea06ad68437fc74010c",
    "owner": "5d9e17a86ad68437fc740109",
    "body": "both are very good",
    "updatedAt": "2019-10-09T17:53:36.750Z",
    "createdAt": "2019-10-09T17:53:36.750Z",
    "__v": 0
  }
}
```

#### Search Questions, Answers or Users

GET /api/v1/search

###### Sample Request

- required: type (in query), value (in query), authorization(in header)
- where: type = questions, value = python

###### Response

```

{
  "message": "successfully returned questions",
  "data": [
    {
      "id": "5d9e19bf6ad68437fc74010a",
      "owner": "john123",
      "title": "Javascript or python, which is bettere",
      "body": "I want to know the better of javascript and python",
      "tags": [
          "javascript",
          "python"
      ],
      "answers": [
          {
              "body": "both a very good",
              "createdAt": "2019-10-09T17:53:36.750Z"
          }
      ],
      "upvotes": 1,
      "downvotes": 0,
      "createdAt": "2019-10-09T17:32:47.734Z",
      "updatedAt": "2019-10-09T17:53:36.753Z"
    }
  ]
}
```

## Contributions

Contributions are welcome, kindly clone the repo, create a new branch and raise a Pull Request
