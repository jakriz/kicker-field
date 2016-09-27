var _ = require('underscore');
const MAX_RELATIVE_RESULT = 1;

function EloRater() {
  this.initialRating = 1000;
  this.baseKFactor = 4.8;
}

EloRater.prototype.calculate = function(matches) {
  var results = {};
  
  var _this = this;
  
  _.each(matches, function(match) {
    _.each(match.teamA.concat(match.teamB), function(player) {
      if (results[player] === undefined) {
        results[player] = _this.initialRating;
      }
    });
    
    var ratingA = average(_.map(match.teamA, function(player) { return results[player]; }));
    var ratingB = average(_.map(match.teamB, function(player) { return results[player]; }));
    
    var expectA = expectation(ratingA, ratingB);
    var expectB = MAX_RELATIVE_RESULT - expectA;
    
    var resA = result(match.scoreA, match.scoreB);
    var resB = MAX_RELATIVE_RESULT - resA;
    
    var diffRatingA = kFactor(match) * (resA - expectA);
    var diffRatingB = -1 * diffRatingA;
    
    console.log("Ratings: " + ratingA + "   " + ratingB);
    console.log("Result coefs:" + resA + "   " + resB);
    console.log("Expectations: " + expectA + "   " + expectB);
    console.log("Rating diffs:" + diffRatingA + "   " + diffRatingB);
    
    _.each(match.teamA, function(player) {
      results[player] += diffRatingA;
    });
    _.each(match.teamB, function(player) {
      results[player] += diffRatingB;
    });
  });
  
  return results;
  
  
  function average(arr) {
    var sum = _.reduce(arr, function(memo, num) { return memo + num; }, 0);
    return sum / arr.length;
  }
  
  function expectation(a, b) {
    return MAX_RELATIVE_RESULT / (1 + Math.pow(10, (b-a)/400));
  }
  
  function result(a, b) {
    var winningScore = Math.max(a,b);
    
    if (winningScore === 0) {
      return MAX_RELATIVE_RESULT / 2; //but this should never happen
    }
    
    var relativeDiff = (a - b) * MAX_RELATIVE_RESULT / winningScore;
    var resA = (MAX_RELATIVE_RESULT + relativeDiff) / 2;
    
    return resA;
  }
  
  function kFactor(match) {
    
    return _this.baseKFactor * Math.max(match.scoreA, match.scoreB);
  }
  
};

module.exports = EloRater;
