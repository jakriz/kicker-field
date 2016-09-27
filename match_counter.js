var _ = require('underscore');

function MatchCounter() {
}

MatchCounter.prototype.calculate = function(matches) {
  var results = {};
  
  _.each(matches, function(match) {
    _.each(match.teamA.concat(match.teamB), function(player) {
      if (results[player] === undefined) {
        results[player] = {
          won: 0,
          lost: 0,
          draw: 0
        };
      }
    });
    
    if (match.scoreA > match.scoreB) {
      increase(results, match.teamA, "won");
      increase(results, match.teamB, "lost");
    } else if (match.scoreA == match.scoreB) {
      increase(results, match.teamA.merge(match.teamB), "draw");
    } else {
      increase(results, match.teamA, "lost");
      increase(results, match.teamB, "won");
    }
  });
  
  return results;
  
  
  function increase(results, players, what) {
    _.each(players, function(player) {
      results[player][what]++;
    });
  }
};

module.exports = MatchCounter;