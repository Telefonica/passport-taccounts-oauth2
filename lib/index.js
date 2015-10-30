/**
 * @license
 * Copyright 2015 Telefónica Investigación y Desarrollo, S.A.U
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var OAuth2Strategy = require('passport-oauth2'),
    util = require('util'),
    request = require('request');

module.exports = TAccountsStrategy;

/**
 * Creates an instance of `TAccountsStrategy`.
 *
 * Applications must supply a `verify` callback, for which the function
 * signature is:
 *
 *     function(accessToken, refreshToken, profile, done) { ... }
 *
 * The verify callback is responsible for finding or creating the user, and
 * invoking `done` with the following arguments:
 *
 *     done(err, user, info);
 *
 * `user` should be set to `false` to indicate an authentication failure.
 * Additional `info` can optionally be passed as a third argument, typically
 * used to display informational messages.  If an exception occured, `err`
 * should be set.
 *
 * Options:
 *
 *   - `authorizationURL`  URL used to obtain an authorization grant
 *   - `tokenURL`          URL used to obtain an access token
 *   - `profileURL`        URL used to obtain a the user profile
 *   - `clientID`          identifies client to service provider
 *   - `clientSecret`      secret used to establish ownership of the client identifer
 *   - `callbackURL`       URL to which the service provider will redirect the user after obtaining authorization
 *   - `passReqToCallback` when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * @param {Object} options
 * @param {Function} verify
 * @constructor
 */
function TAccountsStrategy(options, verify) {
  options = options || {};

  options.scope = options.scope || [
        'accounts.user.read',
        'accounts.user.read.emails',
        'accounts.user.read.phones',
        'accounts.user.read.services',
        'accounts.user.read.profile'
      ];

  options.customHeaders = {
    Authorization: 'Basic ' + new Buffer(options.clientID + ':' + options.clientSecret).toString('base64')
  };

  options.authorizationURL = options.authorizationURL || 'https://accounts.tid.es/telefonica/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://accounts.tid.es/telefonica/oauth/token';
  options.profileURL = options.profileURL || 'https://accounts.tid.es/api/v1/telefonica/users/me';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'taccounts';

  // TODO add support for refresh token

  this.userProfile = getUserProfile;

  this.authorizationParams = getAuthorizationParams;

  ///////////////////

  function getAuthorizationParams() {
    return options.authorizeParams ? options.authorizeParams : {};
  }

  function getUserProfile(accessToken, callback) {
    var requestOptions = {
      url: options.profileURL,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      json: true
    };

    request.get(requestOptions, function onGetProfile(err, response, body) {
      if (err) {
        return callback(new Error(err.message));
      }
      if (response.statusCode !== 200) {
        return callback(new Error('Invalid response status: ' + response.statusCode));
      }

      return callback(null, body);
    });
  }
}

util.inherits(TAccountsStrategy, OAuth2Strategy);
