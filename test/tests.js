if (typeof require !== 'undefined') {
  var chai = require('chai');
  var Pnng = require('../lib');
}

var expect = chai.expect;

describe('Pnng', function() {
  it('should be able to calculate z-score', function() {

    var pnng = new Pnng(10, 3);
    var knownSigmas = [
      { value: 10, sigma: 0 },
      { value: 10.3, sigma: 3/30 },
      { value: 13.3, sigma: 1.1 },
      { value: 13, sigma: 1 },
      { value: 16, sigma: 2 },
      { value: 7, sigma: -1 },
      { value: -2, sigma: -4 },
      { value: 1, sigma: -3 },
      { value: 4, sigma: -2 },
      { value: 7, sigma: -1 },
      { value: 10, sigma: 0 },
      { value: 13, sigma: 1 },
      { value: 16, sigma: 2 },
      { value: 19, sigma: 3 },
      { value: 22, sigma: 4 },
    ];

    var i;
    for (i = knownSigmas.length - 1; i >= 0; i -= 1) {
      var value = knownSigmas[i].value;
      var expected = knownSigmas[i].sigma;
      var result = pnng.getZScore(value);
      expect(result).to.be.closeTo(expected, 0.001);
    }
  });

  describe('the distribution', function() {

    this.timeout(10000);
    var pnng = new Pnng(10, 3);
    var withinSigma = {};
    var n = 10000000;
    for (i = n; i; i -= 1) {
      var r = pnng.generate();
      var z = Math.ceil(Math.abs(pnng.getZScore(r)));
      if (isNaN(z)) {
        throw new Error("Not a number:  " + JSON.stringify(z));
      }

      // remember it
      var count;
      if (withinSigma.hasOwnProperty(z)) {
        count = withinSigma[z];
      } else {
        count = 0;
      }
      count += 1;
      withinSigma[z] = count;
    }

    it('should be about 68% within one standard deviation', function() {
      expect(withinSigma['1'] / n).to.be.within(0.681, 0.6838);
    });
    it('should be about 27% between one and two standard deviations', function() {
      expect(withinSigma['2'] / n).to.be.within(0.271, 0.273);
    });
    it('should be about 4.3% between two and three standard deviations', function() {
      expect(withinSigma['3'] / n).to.be.within(0.042, 0.0433);
    });

  });
});
