# Udacity-AWS-Developer-Project5

## 1. Auth0 Authentication

_This project use Auth0 third-party for authentication and authorization_

You need to create a new Application as Single Page Application Type with RS256 algorithm

## 2. Backend project

_Backend service uses serverless framework_

### Download packages

```bash
npm install
```

### Install serverless CLI

```bash
npm install -g serverless
```

### Init serverless

```bash
serverless
```

### Configure AWS credentials (if not configure yet in init step)

```bash
serverless config credentials --provider aws --key {key} --secret {secret}
```

### Update environment in serverless.yml

`ATTACHMENT_S3_BUCKET`: _Need to change as AWS require unique bucket name on AWS Cloud_

`THUMBNAIL_ATTACHMENT_S3_BUCKET`: _Need to change as AWS require unique bucket name on AWS Cloud_

`JWKS_URL`: _Need to change as your Auth0 Jwks Endpoint_

### Deploy serverless

```bash
npm install
```

```bash
serverless deploy --verbose
```

# 3. Client project

_Client uses ReactJs_

### Download packages

```bash
npm install
```

### Update API configuration

File path: client\src\config.ts

- `apiId` : API ID of AWS service after deploy serverless
- `authConfig.domain` : Auth0 domain
- `authConfig.clientId` : Auth0 Client ID
- `authConfig.callbackUrl` : Host of web to callback after authenticate on Auth0

### Start web on local

```bash
npm run start
```

## 3. Infrastructure diagram:

![Infrastructure diagram](https://github.com/Linhtinh603/Udacity-AWS-Developer-Project5/blob/master/AWS%20backend%20serverless%20diagram.png)
