# node-messenger-webhook
NodeJS messenger webhook fully functional example (HTTPS only). This webhook will echo what the user has send.

Please read the Facebook official [Quickstart/ Getting started](https://developers.facebook.com/docs/messenger-platform/quickstart) guide.

# Usage
Clone the repo on your server
```
$ git clone https://github.com/madcoda/node-messenger-webhook
```
Edit your config in `.env` 

Obtain PAGE_ACCESS_TOKEN from [Facebook Developer](https://developers.facebook.com/apps/). 

Obtain SSL Certificate from [Let's Encrypt](https://github.com/letsencrypt/letsencrypt)
```
$ cd node-messenger-webhook
$ cp -p .env.example .env
$ nano .env
```
Start the server
```
$ npm start
```

# 
