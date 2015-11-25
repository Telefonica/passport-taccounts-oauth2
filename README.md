# passport-taccounts-oauth2

Passport strategy for authenticating with Telefonica Accounts OAuth 2.0 API

[![npm version](https://badge.fury.io/js/passport-taccounts-oauth2.svg)](http://badge.fury.io/js/passport-taccounts-oauth2)
[![Build Status](https://travis-ci.org/TDAF/passport-taccounts-oauth2.svg)](https://travis-ci.org/TDAF/passport-taccounts-oauth2)
[![Coverage Status](https://img.shields.io/coveralls/TDAF/passport-taccounts-oauth2.svg)](https://coveralls.io/r/TDAF/passport-taccounts-oauth2)

## Basic usage

```javascript
var passport = require('passport'),
    TAccountsStrategy = require('passport-taccounts-oauth2');

var options = {
  clientID: '2b8672be-5c80-ac91-96da-f4b922105431',
  clientSecret: 'f5d689ac-fc2c-4e32-ac8a-321212ca1a8d',
  callbackURL: 'http://localhost/auth/taccounts/callback'
};

var strategy = new TAccountsStrategy(options, verify);

function verify(accessToken, refreshToken, user, done) {
  return done(null, user);
}

passport.use(strategy);
```

## User profile

To make integrations easier, the user profile is normalized according to [passport recommendations](http://passportjs.org/docs/profile).
The original payload is also returned for those who need additional information from Telefonica Accounts. For example:

```json
{
    "provider": "taccounts",
    "id": "e2a1e7c5-9a9b-40b4-b24d-1a7925ba7b92",
    "displayName": "Andrés Iniesta",
    "emails": [
        {
            "value": "andres@iniesta.com",
            "primary": true
        }
    ],
    "payload": {
        "profile": {
            "language_pages": true,
            "fullname": " Andrés Iniesta",
            "language_code": "es"
        },
        "lastUpdateTime": "2015-11-09T19:27:36.100Z",
        "userId": "e2a1e7c5-9a9b-40b4-b24d-1a7925ba7b92",
        "creationTime": "2015-09-18T09:06:53.724Z",
        "accountStatus": 1,
        "hasPassword": true,
        "identities": {
            "emails": [
                {
                    "verified": true,
                    "verificationTime": "2015-09-18T09:08:14.324Z",
                    "url": "https://accounts.tid.es/telefonica/validate/email",
                    "creationTime": "2015-09-18T09:06:53.724Z",
                    "address": "andres@iniesta.com",
                    "main": true
                }
            ]
        }
    }
}
```

## Advanced options

You can pass extra parameters as options. They are usually not needed, unless you
are running your own TAccounts service:
* authorizationURL
* tokenURL
* profileURL
* authorizeParams: supports prompt='login'

## License

Copyright 2015 [Telefónica Investigación y Desarrollo, S.A.U](http://www.tid.es)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
