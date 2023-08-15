# `Reports` Service

A python based cloud run service for serving report data to the web app(s).

## Develop

Install depedencies and run the [FastAPI](https://fastapi.tiangolo.com/) based web app:

```bash
$ make install-deps
$ make run-local
```

## Authentication

```js
const idToken = await firebase.auth().currentUser.getIdToken(true);
```
