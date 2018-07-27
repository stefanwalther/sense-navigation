/* global describe, it */
'use strict';

define(['chai', './properties'], function (chai, properties) {
  const expect = chai.expect;
  describe('properties', function () {
    it('should return', function () {
      expect(properties).to.have.a.property('type').to.be.equal('items');
      expect(properties).to.have.a.property('component').to.be.equal('accordion');
      expect(properties).to.have.a.property('items');
    });
    it('getIcons()', function () {
      expect(properties).to.have.a.property('__test_only__').to.have.a.property('getIcons').to.be.a('function');
      let icons = properties.__test_only__.getIcons();
      expect(icons).to.be.an('array');
    });
  });
});
