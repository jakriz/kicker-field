var _ = require('underscore');
const MAX_RELATIVE_RESULT = 1;
const INITIAL_RATING = 1000;

function EloRaterWithHistory() {
  this.baseKFactor = 4.8;
}

EloRaterWithHistory.prototype.calculate = function(matches) {
  var points = createInitialHash(matches);
  
  var _this = this;
  
  _.each(matches, function(match) {
    var ratingA = average(_.map(match.teamA, function(player) {
      return (points[player][points[player].length-1] || INITIAL_RATING);
    }));
    var ratingB = average(_.map(match.teamB, function(player) {
      return (points[player][points[player].length-1] || INITIAL_RATING);
    }));
    
    var expectA = expectation(ratingA, ratingB);
    var expectB = MAX_RELATIVE_RESULT - expectA;
    
    var resA = result(match.scoreA, match.scoreB);
    var resB = MAX_RELATIVE_RESULT - resA;
    
    var diffRatingA = kFactor(match) * (resA - expectA);
    var diffRatingB = -diffRatingA;
    
    duplicateLastElement(points);
    addPointsTo(match.teamA, diffRatingA);
    addPointsTo(match.teamB, diffRatingB);
  });
  
  _.each(points, function(pointArr) {
    pointArr.splice(0, 1);
  });
  return points;
  
  
  
  function createInitialHash(matches) {
    return _.chain(matches)
      .map(function(match) {
        return match.teamA.concat(match.teamB);
      })
      .flatten()
      .reduce(function(hash, player) {
        if (hash[player] === undefined) {
          hash[player] = [null];
        }
        return hash;
      }, {})
      .value();
  }
  
  function duplicateLastElement(points) {
    _.each(_.values(points), function(pointsArr) {
      pointsArr.push(pointsArr[pointsArr.length-1]);
    });
  }
  
  function addPointsTo(players, diff) {
    _.each(players, function(player) {
      if (points[player][points[player].length-1] === null) {
        points[player][points[player].length-1] = INITIAL_RATING + diff;
      } else {
        points[player][points[player].length-1] += diff;
      }
    });
  }
  
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

module.exports = EloRaterWithHistory;
