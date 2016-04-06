var getMatchUps = function() {
  $("#getMatch").on("click", function() {
    //var cb = Math.round(new Date().getTime() / 1000);
    //var year = prompt("Enter a year (YYYY)");
    //var month = prompt("Enter a month (MM)");
    //var day = prompt("Enter a day (DD)");
    var theDate = document.getElementById("dateInput").value;
    //console.log(theDate);
    var month = theDate.substr(0, 2);
    var day = theDate.substr(3, 2);
    var year = theDate.substr(6, 4);
    var compLink = "http://gd2.mlb.com/components/game/mlb/year_" + year + "/month_" + month + "/day_" + day + "/miniscoreboard.json";
    $.getJSON(compLink, function(a) {
      $("#quotesHere").html("");
        var oTeam;
        var team = prompt("What team? (e.g. WSH, NYY, BOS)").toLowerCase();    
        var wrapUrl;
        var home = false;
        var gameIndex;
        for (var i = 0; i < a.data.games.game.length; i++) {
          if (a.data.games.game[i].home_name_abbrev.toLowerCase() === team) {
            oTeam = a.data.games.game[i].away_name_abbrev;
            home = true;
            gameIndex = i;
          }
          else if (a.data.games.game[i].away_name_abbrev.toLowerCase() === team) {
            oTeam = a.data.games.game[i].home_name_abbrev;
            gameIndex = i;
            
          }
        }
        if (oTeam === undefined) {
          $("#matchHere").html("");
          $("#matchHere").append(team.toUpperCase() + " did not play that day.");
        };
        if (oTeam !== undefined) {
          wrapUrl = a.data.games.game[gameIndex].wrapup_link;
          $("#matchHere").html("");
          $("#matchHere").append("On " + month + "-" + day + "-" + year + ", " + team.toUpperCase() + " played " + oTeam + "<br /> <a href='http://www.mlb.com" + wrapUrl + "'>Wrap-Up</a>");
          document.getElementById("getMatch").style.visibility = "hidden";
          //$("#matchHere").append("<a href='http://www.mlb.com" + a.data.games.game[i].wrapup_link + "'>Wrap-Up</a>");
        };
    });
  });
};

$(document).ready(getMatchUps);