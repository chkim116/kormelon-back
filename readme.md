- typeorm
- mysql
- nodejs
- jwt
- jest, supertest

# Quick Start

```js
npm run install
npm run dev

// or

yarn install
yarn dev
```

```sql
mysql -u root -p

# 비밀번호 보안 정책 수정
set global validate_password_policy=LOW;

# 유저확인
select user, host from user;
# 생성
create user USER_ID@localhost identified by 'PASSWORD_HERE'

# DB 생성 
CREATE DATABASE DB_NAME default CHARACTER SET UTF8;
# 권한
grant all privileges on DB_NAME.* to USER_ID@localhost;
```

# Env

```
DB_TEST_HOST=127.0.0.1
DB_TEST_PORT=3306
DB_TEST_NAME=
DB_TEST_USERNAME=
DB_TEST_PASSWORD=

DB_DEV_HOST=127.0.0.1
DB_DEV_PORT=3306
DB_DEV_NAME=
DB_DEV_USERNAME=
DB_DEV_PASSWORD=

# 배포시, 변경 필요
DB_PROD_HOST=127.0.0.1
DB_PROD_PORT=3306
DB_PROD_NAME=
DB_PROD_USERNAME=
DB_PROD_PASSWORD=

# JWT SECRET
JWT=

# AWS SECRET
AWS_SECRET_ACCESS_KEY=
AWS_ACCESS_KEY_ID=
```
