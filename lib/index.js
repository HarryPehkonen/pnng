/*
 * An implementation of the Box-Muller transform.
 * http://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
 *
 */

function Pnng(mu, sigma) {
  "use strict";

  this.mu = mu;
  this.sigma = sigma;
}

(function() {

  // In a closure to keep static private variables.

  // The Box-Muller transform takes two uniformly-distributed
  // numbers and generates two normally-distributed numbers.
  // When we generate the first one, keep the other as a spare
  // for next time.
  var haveSpare = false;
  var rand1, rand2;
  var TWO_PI = Math.PI * 2;

  Pnng.prototype.generate = function() {
    "use strict";

    var result;

    if(haveSpare) {
      haveSpare = false;
      result = Math.sqrt(rand1) * Math.sin(rand2);
    } else {

      haveSpare = true;

      rand1 = Math.random();
      if (rand1 < Math.pow(10, -100)) {
        rand1 = Math.pow(10, -100);
      }

      rand1 = -2 * Math.log(rand1);
      rand2 = Math.random() * TWO_PI;

      result = Math.sqrt(rand1) * Math.cos(rand2);
    }

    return result * this.sigma + this.mu;

  };

}());

Pnng.prototype.getZScore = function(number) {
  "use strict";

  return (number - this.mu) / this.sigma;
};

if (typeof window === 'undefined') {
  module.exports = Pnng;
}

