var reloadPage = function() {
  location.reload();
}

var getMatchUps = function() {
  $("#dateInput").datepicker();
  $("#getMatch").on("click", function() {
    //var cb = Math.round(new Date().getTime() / 1000);
    //var year = prompt("Enter a year (YYYY)");
    //var month = prompt("Enter a month (MM)");
    //var day = prompt("Enter a day (DD)");
    var theDate = document.getElementById("dateInput").value;
    var team = document.getElementById("teamInput").value.toLowerCase();
    //console.log(theDate);
    var month = theDate.substr(0, 2);
    var day = theDate.substr(3, 2);
    var year = theDate.substr(6, 4);
    var compLink = "http://gd2.mlb.com/components/game/mlb/year_" + year + "/month_" + month + "/day_" + day + "/miniscoreboard.json";
    $.getJSON(compLink, function(a) {
      $("#quotesHere").html("");
      var oTeam;
      //var team = prompt("What team? (e.g. WSH, NYY, BOS)").toLowerCase();    
      var wrapUrl;
      var gdUrl;
      var linescore;
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
        document.getElementById("buttonHere").innerHTML = "<button onClick='reloadPage();' class='btn btn-danger'>Try again</button>";
      };
      if (oTeam !== undefined) {          
        $("#matchHere").html("");
        $("#matchHere").append("On " + month + "-" + day + "-" + year + ", " + team.toUpperCase() + " played " + oTeam);
        document.getElementById("buttonHere").innerHTML = "<button onClick='reloadPage();' class='btn btn-danger'>Try again</button>";
        //$("#buttonHere").append("<button onClick='reloadPage();' class='btn btn-danger'>Try again</button>");
        //$("#matchHere").append("<a href='http://www.mlb.com" + a.data.games.game[i].wrapup_link + "'>Wrap-Up</a>");
      };
      if (a.data.games.game[gameIndex].wrapup_link !== undefined) {
        wrapUrl = a.data.games.game[gameIndex].wrapup_link;
        $("#matchHere").append("<br /> <a href='http://www.mlb.com" + wrapUrl + "'>Wrap-Up</a>");
      }
      if (a.data.games.game[gameIndex].game_data_directory !== undefined) {
        gdUrl = "http://gd2.mlb.com" + a.data.games.game[gameIndex].game_data_directory;
        linescore = gdUrl + "/linescore.json";
        $.getJSON(linescore, function(e) {
          var innings = e.data.game.linescore.length;
          var sbContent = "<br /><table class='table table-bordered'><thead class='thead-inverse'><tr><th>" + e.data.game.status + "</th>";
          for (var k = 1; k <= innings; k++) {
            sbContent += "<th>" + k + "</th>";
          }
          sbContent += "<th>R</th><th>H</th><th>E</th></tr></thead>";
          sbContent += "<tbody><tr><td>" + e.data.game.away_team_name + "</td>";
          for (var k = 0; k < innings; k++) {
            sbContent += "<td>" + e.data.game.linescore[k].away_inning_runs + "</td>";
          }
          sbContent += "<td class='runs'>" + e.data.game.away_team_runs + "</td>" + "<td>" + e.data.game.away_team_hits + "</td>" + "<td>" + e.data.game.away_team_errors + "</td></tr>";
          sbContent += "<tr><td>" + e.data.game.home_team_name + "</td>";
          for (var k = 0; k < innings; k++) {
              sbContent += "<td>" + e.data.game.linescore[k].home_inning_runs + "</td>";
            if (e.data.game.linescore[k].home_inning_runs === "" && e.data.game.status === "Final") {
              sbContent += "<td>X</td>";
            }
          }
          sbContent += "<td class='runs'>" + e.data.game.home_team_runs + "</td>" + "<td>" + e.data.game.home_team_hits + "</td>" + "<td>" + e.data.game.home_team_errors + "</td></tr></tbody></table>";
          if (e.data.game.status === "In Progress") {
            $("#game_link").append("<br><a href='http://mlb.com" + e.data.game.preview + "'>Follow live on MLB Gameday");
          }
          $("#scoreboard").html(sbContent);
      });
      }
    });
  });
};


$(document).ready(getMatchUps);