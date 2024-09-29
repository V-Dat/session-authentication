# Readme

## 1. Import Postman collection

- import file Collection to Postman: session-authen.postman_collection.json

## 2. Application dependancies

- https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/
- Redis client: sudo apt-get install redis

```bash
    # success install
    redis-cli
    redis 127.0.0.1:6379> ping
    PONG
```

## 3. Start

- npm install
- npm start
  - we have 2 example ( server-basic-session.js | server-redis-session.js)
    - default when we using npm start -> it run server-redis-session.js
    - can change start script to server-basic-session from on package json or manual start nodemon server-basic-session.js
