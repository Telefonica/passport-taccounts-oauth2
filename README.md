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
  "email": "frodo.bolson@telefonica.com",
  "local_company_alias": "HI_frodo",
  "company": "Telefónica S.A.",
  "tags": [
      "ldap_auth",
      "telefonica_user"
  ],
  "sub": "9d2ccf1f-746d-4455-9793-44e1bc8caaa6",
  "locale": "es",
  "email_verified": true,
  "updated_at": "2016-10-25T10:28:35.289Z",
  "name": "FRODO BOLSON",
  "phone_number": "+34666666666",
  "phone_number_verified": true
}
```

## Advanced options

You can pass extra parameters as options. They are usually not needed, unless you
are running your own TAccounts service:
* authorizationURL
* tokenURL
* profileURL
* authorizeParams: supports prompt='login'

### Logout from Telefónica Accounts

The strategy exposes a new method `logout` as an addition to the common passportJS ones. Use this method to create a middleware that logouts the user directly from
Telefónica Accounts and redirects back to the specified `logoutCallbackURL`

```js

var options = {
   // Other options
  logoutCallbackURL: 'http://localhost/auth/logout'
};

var strategy = new TAccountsStrategy(options, verify);

passport.use(strategy);

app.get('/auth/taccounts/', passport.authenticate('taccounts'));
app.get('/auth/taccounts/callback', passport.authenticate('taccounts'));
app.get('/auth/taccounts/logout', strategy.logout());

app.get('/auth/logout', function(req, res) {
  // Gets redirected here after logging out from Telefónica Accounts
  req.logout();
  res.redirect('/');
});
```


## License

Copyright 2015 [Telefónica Investigación y Desarrollo, S.A.U](http://www.tid.es)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
