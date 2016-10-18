// server.js
// where your node app starts
var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var _ = require('underscore');
var config = require('config');

var EloRater = require('./elo_rater.js');
var EloRaterWithHistory = require('./elo_rater_with_history.js');
var MatchCounter = require('./match_counter.js');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var uri = 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@'+process.env.MONGO_HOST+':'+process.env.MONGO_PORT+'/'+process.env.MONGO_DB;

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/history", function (request, response) {
  response.sendFile(__dirname + '/views/history.html');
});

app.post("/matches", urlencodedParser, function (request, response) {
  
  if (request.body.token != process.env.SLACK_TOKEN) {
    response.sendStatus(401);
    return;
  }
  
  var textSplit = request.body.text.split(" ");
    
  var teamA = _.map(textSplit[0].split(","), normalizedName);
  var teamB = _.map(textSplit[1].split(","), normalizedName);
  
  var wrongNames = _.filter(teamA.concat(teamB), function(name) {
    return !_.contains(config.get("players"), name);
  });
  
  if (wrongNames.length > 0) {
    response.json({
      "response_type": "in_channel",
      "text": "You entered some wrong names: " + wrongNames.join(", ")
    });
    return;
  }
  
  mongodb.MongoClient.connect(uri, function(err, db) {
    if (err) {
      throw err;
    }
    
    db.collection("matches").insert({
      teamA: teamA,
      teamB: teamB,
      scoreA: parseInt(textSplit[2].split(":")[0]),
      scoreB: parseInt(textSplit[2].split(":")[1])
    });
    
    response.json({
      "response_type": "in_channel",
      "text": "Match added. Results and ratings: https://shore-seed.hyperdev.space/"
    });
  });
});

app.get("/matches", function(request, response) {
  mongodb.MongoClient.connect(uri, function(err, db) {
    if (err) {
      throw err;
    }
    
    db.collection("matches").find({}).toArray(function(err, matches) {
      if (err) {
        throw err;
      }
      
      _.each(matches, function(match) { match.time = match._id.getTimestamp(); });
      response.json(matches);
    }); 
  });
});

app.get("/players", function(request, response) {
  mongodb.MongoClient.connect(uri, function(err, db) {
    if (err) {
      throw err;
    }
    
    db.collection("matches").find({}).toArray(function(err, matches) {
      if (err) {
        throw err;
      }
      
      var ratings = new EloRater().calculate(matches);
      var matchCounts = new MatchCounter().calculate(matches);
      
      var players = _.map(ratings, function(rating, name) {
        return {
          name: name,
          rating: rating,
          matches: {
            won: matchCounts[name].won,
            lost: matchCounts[name].lost,
            draw: matchCounts[name].draw
          }
        };
      });
      var sorted = _.sortBy(players, function(el) { return -el.rating; });
      response.json(sorted);
    }); 
  });
});

app.get("/players/history", function(request, response) {
  mongodb.MongoClient.connect(uri, function(err, db) {
    if (err) {
      throw err;
    }
    
    db.collection("matches").find({}).toArray(function(err, matches) {
      if (err) {
        throw err;
      }
      
      var ratings = new EloRaterWithHistory().calculate(matches);
      response.json(ratings);
    }); 
  });
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


function normalizedName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}