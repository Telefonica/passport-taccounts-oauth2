'use strict';

var events = require('events'),
    util = require('util'),
    sinon = require('sinon'),
    nock = require('nock'),
    request = require('supertest'),
    express = require('express'),
    OAuth2Strategy = require('passport-oauth2'),
    TAccountsStrategy = require('../../lib');

var TACCOUNTS_PROFILE = {
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
    expect(options.logoutURL).to.exist;
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
      expect(profile.displayName).to.be.deep.equal(fakeProfile.name);
      expect(profile.id).to.be.deep.equal(fakeProfile.sub);
      expect(profile.emails[0].value).to.be.deep.equal(fakeProfile.email);
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

describe('TAccounts logout', function() {
  it('should throw when trying to use logout mw and no option for logoutCallbackURL has been defined', function() {
    var options = {
      clientID: '2b8672be-5c80-ac91-96da-f4b922105431',
      clientSecret: 'f5d689ac-fc2c-4e32-ac8a-321212ca1a8d'
    };
    function verify() {}

    var strategy = new TAccountsStrategy(options, verify);

    function createLogout() {
      return strategy.logout();
    }

    expect(createLogout).to.throw(TypeError);
  });

  it('should redirect to Telefonica when calling logout', function(done) {
    var options = {
      clientID: '2b8672be-5c80-ac91-96da-f4b922105431',
      clientSecret: 'f5d689ac-fc2c-4e32-ac8a-321212ca1a8d',
      logoutCallbackURL: 'http://localhost/auth/logout'
    };
    function verify() {}

    var strategy = new TAccountsStrategy(options, verify);

    var app = express();
    app.get('/auth/taccounts/logout', strategy.logout());

    request(app)
        .get('/auth/taccounts/logout')
        .expect(302)
        .end(function(err, res) {
          expect(res.header.location).to.be.eql(options.logoutURL + '?post_logout_redirect_uri=' + options.logoutCallbackURL);
          done(err);
        });
  });
});
