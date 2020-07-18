//made by patrick hultquist '21
var tabColor = '#1500ff'

function generateSheets() {
  var schoolNameCol = 3
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rosterSheet = ss.getSheetByName('Raw Roster Data');
  var rosterData = rosterSheet.getRange(1, 1, rosterSheet.getLastRow(), rosterSheet.getLastColumn()).getValues(); //gets entire sheet
  var sampleSheet = ss.getSheetByName('Example Sheet');
  
  
  var row;
  for (r=1; r<rosterData.length; r++){ //ignores 1st row, title row
    row = r + 1;
    var newSheet = ss.insertSheet(rosterData[r][schoolNameCol - 1], {template: sampleSheet})
    newSheet.setTabColor(tabColor);
    newSheet.getRange(1, 4).setValue(row); //gets field 'ENTRY LINE #' and fills in
    
    Utilities.sleep(1000);
  }
  
}
  
function getSchoolSheets() { //gets all sheets that are a school's individual sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var allsheets = ss.getSheets();
  
//  allsheets[0].getName()
  
  var schoolSheets = [];
  
  var color;
  for (s in allsheets){
    color = allsheets[s].getTabColor();
    if (color==tabColor){ //checks if sheet is part of school by tab color which is kind of lame but oh well
      schoolSheets.push(allsheets[s]);
    }
  }
  
  return schoolSheets;
}

function getLinkList(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var schoolSheets = getSchoolSheets();
  
  var baseUrl = ss.getUrl() + "#gid="
  
  var text = []
  
  for (z in schoolSheets){
    text.push({
      school: schoolSheets[z].getName(),
      url: baseUrl + schoolSheets[z].getSheetId()
    });
  }
  
  var indexDoc = DocumentApp.openByUrl("https://docs.google.com/document/d/1TvW3v-cO1tEPjTNajJkqAna6JeYTkVFw0bC6XOS5Xwk/edit"),
      body = indexDoc.getBody(),
      bodyText = body.editAsText();
  
  body.clear();
  for (f in text){
    bodyText.appendText(text[f].school).setLinkUrl(text[f].url)
    bodyText.appendText("\n\n");
  }
  //body.appendParagraph(text.join("\n\n"));

  Logger.log(text);
}

function onOpen(){
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('JHMC 2020')
      .addItem('Create Sheets By School', 'generateSheets')
      .addItem('Create/Update Score Sheets', 'createScoreSheets')
      .addItem('Update Individual Values', 'getData')
      .addToUi();
}

function deleteSheets(){
  //i used this function to delete all sheets to the right because i made a copy of the document before
  var allsheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for (i = 5; i<allsheets.length;i++){
    var sheet = allsheets[i];
    ss.deleteSheet(sheet);
  }
}

function deleteSchoolSheets(){
  
}


function getIndividualResults(){
  var startRow = 10,
      endRow = 24;
  
  var schoolSheets = getSchoolSheets();
  /*var person = {
    name: 'Beethoven',
    school: 'Avery Conley Middle School',
    group: 'AA'
    grade: 7,
    score: 30,
    isAlternate: false
  }
  */
  
  var range,
      schoolname,
      group,
      person;
  var ind = {
    n: 0,
    name: 1,
    score: 2
  }
  var people = []
  for (s in schoolSheets){
    schoolname = schoolSheets[s].getName();
    group = schoolSheets[s].getRange(4,11).getValue();
    var ranges = [schoolSheets[s].getRange(startRow, 2, endRow-startRow+1, 3).getValues(), schoolSheets[s].getRange(startRow, 5, endRow-startRow+1, 3).getValues()]; //account for seventh and eighth graders
    for (j in ranges){
      range = ranges[j];
      for (u in range){
        var isAlternate = false,
            grade = 7;
        
        if (j>0){
          grade = 8; 
        }
        
        if (u > 10){
          isAlternate = true; 
        }
        
        var n = range[u][ind.n],
            score = range[u][ind.score];
        if (n.length==0 || score.length==0){
          continue;
        }
        person = {
          name: range[u][ind.name],
          school: schoolname,
          group: group,
          grade: grade,
          score: score,
          isAlternate: isAlternate,
          getCompetitionName: function (){
            return this.grade+'th Grade Individual'
          },
          getScoringText: function() {
            return this.name+', '+this.school+'; '+this.score; 
          }
        }
        people.push(person);
      }
    }
  }
  //Logger.log(people);
  return people;
}

function getTeamResults(){
  /*var group = {
    name: 'Avery Conley Middle School Team 1',
    members: ['This guy', 'That guy', 'Ray Shang']
    school: 'Avery Conley Middle School',
    group: 'AA'
    grade: 7,
    score: 30,
    isAlternate: false
  }
  */
  var schoolSheets = getSchoolSheets();

  var teams = []
  var schoolname,
      group;
  var team;
  for (s in schoolSheets) {
    schoolname = schoolSheets[s].getName();
    group = schoolSheets[s].getRange(4,11).getValue();
    var seventhGradeTeamRanges = [[8,10,5,3], [14,10,5,3]];
    seventhGradeTeamRanges = seventhGradeTeamRanges.map(function (x){
      var range = schoolSheets[s].getRange(x[0],x[1],x[2],x[3]);
      teams.push(getTeam(range, schoolname, group, false, 7));
      return range;
    })
    var eighthGradeTeamRanges = [[8,13,5,3], [14,13,5,3]];
    eighthGradeTeamRanges = eighthGradeTeamRanges.map(function (x){
      var range = schoolSheets[s].getRange(x[0],x[1],x[2],x[3]);
      teams.push(getTeam(range, schoolname, group, false, 8));
      return range;
    })
    var seventhGradeAlternateRange = schoolSheets[s].getRange(20,10,5,3);
    teams.push(getTeam(seventhGradeAlternateRange, schoolname, group, true, 7))
    var eighthGradeAlternageRange = schoolSheets[s].getRange(20,13,5,3);
    teams.push(getTeam(seventhGradeAlternateRange, schoolname, group, true, 8))
    
    
  }
  
  //as you can see in the function below if the team has no score or has no members it returns false; this filters out all the ones that are false
  teams.filter(function (x){
    return (!(x===false)) 
  })
  //Logger.log(teams)
  return teams;
}

function getTeam(range, schoolname, group, isAlternate, grade){
    var values = range.getValues();
    var members = []
    for (d = 1; d<=4; d++){
      var member = values[d][1];
      if (member.length == 0) continue;
      members.push(values[d][1]);
    }
  
    if (members.length==0) return false;
  
    var score = values[4][2];
    if (score.length==0) return false;
    var team = {
      name: values[0][1], //row 0, column 1
      members: members,
      school: schoolname,
      group: group,
      grade: grade,
      score: score,
      isAlternate: isAlternate,
      getCompetitionName: function (){
        return this.grade+'th Grade Team'
      },
      getScoringText: function() {
        this.members.length > 2 ? this.members[2] = "\n"+this.members[2] : "";
        return this.school + "; " + this.score + "\n" + this.members.join(", ");
      }
    }
    return team;
}

function getCreativeTeamResults(){
  var schoolSheets = getSchoolSheets();
  var creativeTeams = [],
      schoolname,
      group;
  
  var ranges = []
  for (w = 0; w<2; w++){
    for (h = 0; h<4; h++){
      ranges.push([8 + parseInt(4*h), 19 + parseInt(4*w), 3, 3])
    }
  }
  var range;
  for (s in schoolSheets){
    schoolname = schoolSheets[s].getName();
    group = schoolSheets[s].getRange(4,11).getValue();
    ranges.map(function (x){
      range = schoolSheets[s].getRange(x[0],x[1],x[2],x[3])
      creativeTeams.push(getCreativeTeam(range, schoolname, group)); 
    })
  }
  
  //Logger.log(creativeTeams)
  
  return creativeTeams;
}

function getCreativeTeam(range, schoolname, group){
  var values = range.getValues();
  var members = [values[1][0], values[2][0]]
  var score = values[1][2];
  var time = values[2][2];
  
  if (members.length==0) return false;
  if (score.length==0) return false;
  
  var creativeTeam = {
    name: values[0][0],
    members: members,
    school: schoolname,
    group: group,
    score: score,
    time: time,
    getCompetitionName: function (){
      return 'Creative Thinking'
    },
    getScoringText: function() {
      this.members.length > 2 ? this.members[2] = "\n"+this.members[2] : "";
      return this.school + "; " + this.score + "\n" + this.members.join(", ");
    }
  }
  
  return creativeTeam;
}

function getSchoolScores() {
  /*
    var school = {
      name: 'Avery Conley Middle School',
      group: 'A',
      grade7individual: 400,
      grade8individual: 399,
      grade7team: 123,
      grade8team: 124,
      creativeThinking: 420,
      total: 999
    }
  */
  var schoolSheets = getSchoolSheets();
  var schools = [],
      schoolname,
      group;
  
  for (s in schoolSheets) {
    schoolname = schoolSheets[s].getName();
    group = schoolSheets[s].getRange(4,11).getValue();
    var range = schoolSheets[s].getRange(29,5,6);
    schools.push(getSchool(range, schoolname, group));
  }
  //Logger.log(schools)
  return schools;
}

function getSchool(range, schoolname, group) {
  var values = range.getValues();
  
  var school = {
    name: schoolname,
    group: group,
    grade7individual: values[0][0],
    grade8individual: values[1][0],
    grade7team: values[2][0],
    grade8team: values[3][0],
    creativeThinking: values[4][0],
    total: values[5][0],
    getScoringText: function (compscore){
      return this.name + '; ' + compscore;
    }
  }
  return school;
}



