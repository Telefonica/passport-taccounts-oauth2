'use strict';

var events = require('events'),
    util = require('util'),
    sinon = require('sinon'),
    OAuth2Strategy = require('passport-oauth2'),
    TAccountsStrategy = require('../../lib');

describe('TAccounts Tests', function() {
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
