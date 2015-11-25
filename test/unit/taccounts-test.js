'use strict';

var events = require('events'),
    util = require('util'),
    sinon = require('sinon'),
    nock = require('nock'),
    OAuth2Strategy = require('passport-oauth2'),
    TAccountsStrategy = require('../../lib');

var TACCOUNTS_PROFILE = {
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
};

describe('TAccounts basic tests', function() {
  it('should create a TAccounts object', function(done) {
    expect(TAccountsStrategy.prototype instanceof OAuth2Strategy).to.be.true;
    done();
  });

  it('should set an Authorization header', function(done) {
    var options = {
      clientID: '2b8672be-5c80-ac91-96da-f4b922105431',
      clientSecret: 'f5d689ac-fc2c-4e32-ac8a-321212ca1a8d'
    };

    function verify() {};

    var strategy = new TAccountsStrategy(options, verify);

    var authHeader = 'Basic MmI4NjcyYmUtNWM4MC1hYzkxLTk2ZGEtZjRiOTIyMTA1NDMxOmY1ZDY4OWFjLWZjMmMtNGUzMi1hYzhhLTMyMTIxMmNhMWE4ZA==';
    expect(options.customHeaders.Authorization).to.be.equal(authHeader);
    done();
  });

  it('should set default option values', function(done) {
    var options = {
      clientID: '2b8672be-5c80-ac91-96da-f4b922105431',
      clientSecret: 'f5d689ac-fc2c-4e32-ac8a-321212ca1a8d'
    };
    function verify() {};

    var strategy = new TAccountsStrategy(options, verify);

    expect(options.authorizationURL).to.exist;
    expect(options.tokenURL).to.exist;
    expect(options.profileURL).to.exist;
    expect(options.scope).to.exist;
    done();
  });
});

describe('TAccounts user profile', function() {
  it('should normalize the user profile', function(done) {
    var options = {
      clientID: '2b8672be-5c80-ac91-96da-f4b922105431',
      clientSecret: 'f5d689ac-fc2c-4e32-ac8a-321212ca1a8d'
    };
    function verify() {};

    var strategy = new TAccountsStrategy(options, verify);

    var fakeProfile = TACCOUNTS_PROFILE;
    nock(options.profileURL).get('').reply(200, fakeProfile);

    strategy.userProfile('faketoken', function(err, profile) {
      expect(err).to.not.exist;
      expect(profile.displayName).to.be.deep.equal(fakeProfile.profile.fullname);
      expect(profile.id).to.be.deep.equal(fakeProfile.userId);
      expect(profile.emails[0].value).to.be.deep.equal(fakeProfile.identities.emails[0].address);
      expect(profile.payload).to.be.deep.equal(fakeProfile);
      done();
    });
  });

  it('should throw an error if it can get the profile', function(done) {
    var options = {
      clientID: '2b8672be-5c80-ac91-96da-f4b922105431',
      clientSecret: 'f5d689ac-fc2c-4e32-ac8a-321212ca1a8d'
    };
    function verify() {};

    var strategy = new TAccountsStrategy(options, verify);

    var fakeProfile = {foo: 'bar'};
    nock(options.profileURL).get('').reply(500);

    strategy.userProfile('faketoken', function(err, profile) {
      expect(err).to.be.instanceof(Error);
      expect(profile).to.not.exist;
      done();
    });
  });

  it('should use authorization params', function(done) {
    var options = {
      clientID: '2b8672be-5c80-ac91-96da-f4b922105431',
      clientSecret: 'f5d689ac-fc2c-4e32-ac8a-321212ca1a8d',
      authorizeParams:{
        prompt: 'login'
      }
    };
    function verify() {};

    var strategy = new TAccountsStrategy(options, verify);

    var params = strategy.authorizationParams();
    expect(params).to.be.deep.equal(options.authorizeParams);

    done();
  });
});
