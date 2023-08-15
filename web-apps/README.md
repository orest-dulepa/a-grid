# AGrid Web Apps

This repository houses our web applications, AGrid enables a transaction between **advertisers** and **publishers** or more commonly refered to as `buyer` and `seller`.

## Stack

The applications share a technology stack:
- Vue
- TypeScript
- Firebase
- Netlify


## Installation

For a full project installation, on the project root folder run:
```
$ make install
```

You can also install each app separately with the commands:
```
$ make install-seller
$ make install-buyer
```


## Development

### Web-apps

You can either develop using firebase's emulator or by calling the development environment on gcloud directly.
The emulator is useful for debugging and testing firebase rules. It's also useful if you want to test
changes to the firestore db without it affecting the dev database. The firestore emulator will
emulate those changes locally, you can view them in the console at http://localhost:4000

In any of the apps directories (`seller` or `buyer`), run:
- For development using the dev cloud environment:
```
$ npm run serve
```
- For development using firebase's emulators:
```
$ npm run serve:useEmulators
```

- If you want to use a specific emulator rather than all of them, you can do it by passing the environment variables, e.g.:
```
$ npm run serve:emulators & EMULATE_AUTH=true npm run serve
$ npm run serve:emulators & EMULATE_FIRESTORE=true npm run serve
$ npm run serve:emulators & EMULATE_FUNCTIONS=true npm run serve
```


#### `Firebase` and `gcloud` CLI

You should install the [Firebase CLI][firebase-cli] and the [gcloud SDK][gcloud-cli] to
aid in development.

[firebase-cli]: https://firebase.google.com/docs/cli
[gcloud-cli]: https://cloud.google.com/sdk/install


## Testing

In any of the applications directories, run:
```
$ npm run test:unit
$ npm run test:e2e
```


## Linting

In any of the applications directories, run:
```
$ npm run lint
```

You can automatically fix issues with the command:
```
$ npm run lint:fix
```


## Deployment

Deployment should be automatically handled by our CI/CD pipeline, however if you need to deploy some of the back-end pieces, you can.

In any of the applications directories, run:
```
$ npm run deploy:functions
$ npm run deploy:rules
$ npm run deploy:indexes
```

You can check which project is currently selected for deployment via the firebase cli:
```
$ firebase projects:list
```
