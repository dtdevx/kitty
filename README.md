# Kitty - a Nest starter

## Description

See: [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install

# prisma migrations & seed
$ npx prisma migrate dev
$ npx prisma generate
$ npm run seed
```

## Preparing local SSL
```bash
# install mkcert (see: https://github.com/FiloSottile/mkcert)

# generate certification files
$ mkdir -p src/cert
$ mkcert -install
$ mkcert -key-file ./src/cert/key.pem -cert-file ./src/cert/cert.pem localhost
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# prisma studio
$ npx prisma studio
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Update NestJS

```bash
# use npm-check-updates
$ npx npm-check-updates

# if updates available, run
$ npx npm-check-updates -u

# install newest packages with
$ npm install
```


## License

Nest is [MIT licensed](LICENSE).
