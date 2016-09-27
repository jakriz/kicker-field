$(function() {
  $.get('/matches', function(matches) {
    console.log(matches);
    matches.forEach(function(match) {
      $('#matches').append(
        $('<tr>')
          .append($('<td>').text(match.teamA.join(", ")))
          .append($('<td>').text(match.teamB.join(", ")))
          .append($('<td>').text(match.scoreA + ":" + match.scoreB))
      );
    });
  });
  
  $.get('/players', function(players) {
    console.log(players);
    players.forEach(function(player, i) {
      $('#players').append(
        $('<tr>')
          .append($('<td>').text(i+1))
          .append($('<td>').text(player.name))
          .append($('<td>').text(Math.round(player.rating)))
          .append($('<td>').text(player.matches.won + player.matches.lost))
          .append($('<td>').text(player.matches.won))
          .append($('<td>').text(player.matches.lost))
      );
    });
  });
});
