var slideshow = SlidesApp.openByUrl("https://docs.google.com/presentation/d/1jfS2Xht1SZCoQIlU401HNKKiPVG4sgYMnrDOQhFzDxs/edit?folder=16Uh6HQAOwbSshuJ7SY6pCy014pxVXLlb#slide=id.g6ccff2b381_0_6");
var ss = SpreadsheetApp.getActiveSpreadsheet();
var templateslide = slideshow.getSlides()[0]; //first slide
var templateback = slideshow.getSlides()[1]; //first slide
var mainsheet = ss.getSheets()[0];
var mapsheet = ss.getSheets()[1];

var times = {
    individual: "9:40 AM", 
    team: "10:35 AM", 
    creativeThinking: "11:30 AM"
  };

var cols = {
  id: 1,
  name: 2,
  school: 3,
  grade: 4,
  alternate: 5,
  individual: 6,
  teamAlternate: 7,
  team: 8,
  creativeThinking: 9
}

var mapcols = {
  school: 1,
  numStudents: 2,
  division: 3,
  seven: 4,
  eight: 5, 
  creativeThinking: 6,
  sevenAlt: 7,
  eightAlt: 8
}

function main(){
  createSlides(getData());
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Name Tags')
      .addItem('Generate All', 'getData')
      .addItem('Specific Range', 'mainSpecific')
      .addToUi();
}

function mainSpecific(){
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt('Enter Range Below', 'Emit spaces; ex. 1-12 or 1,2,5', ui.ButtonSet.OK).getResponseText();
  var separated = response.split("-");
  var commas = false;
  if (separated.length == 1){ //commas
    separated = response.split(",");
    commas = true;
  }
  
  if (commas){
    for (c in separated){
      createSlides(getData('specific', separated[c], separated[c]));
    }
  } else {
    createSlides(getData('specific', separated[0], separated[1]));
  }
}

function getData(mode, a, b) {
  var allData;
  if (mode == 'specific'){
    allData = mainSheet.getRange(a, 1, b-a+1, mainSheet.getLastColumn()).getValues();  
  } else {
    allData = mainsheet.getRange(1, 1, mainsheet.getLastRow(), mainsheet.getLastColumn()).getValues();
  }
  var mapData = mapsheet.getRange(1, 1, mapsheet.getLastRow(), mapsheet.getLastColumn()).getValues();
  var schoolNames = transpose(mapData)[0];
  
  var people = [];
  var name,
      school,
      grade,
      division;
  var events = [];
  
  
  /*events.push({
    name: "String",
    room: "Room",
    time: "Time"
  });*/
  
  for (i = 1; i < allData.length; i++){ //allData.length
    events = [];
    name = allData[i][cols.name - 1];
    school = allData[i][cols.school - 1];
    grade = allData[i][cols.grade - 1];
    
    if (!name || name.length <= 1) continue;
    
    var row = schoolNames.indexOf(school);
    
    division = mapData[row][mapcols.division - 1];
    Logger.log(mapData[row])
    Logger.log(division)
    
    var alternate = allData[i][cols.alternate - 1];
    var individual = allData[i][cols.individual - 1];
    var team = allData[i][cols.team - 1];
    var creativeThinking = allData[i][cols.creativeThinking - 1];
    var teamAlternate = allData[i][cols.teamAlternate - 1];
    
    if (grade == "7"){
      
      if (individual && !alternate){
        Logger.log(events)
        //7th grade ind
        events.push({
          name: "Grade 7",
          room: mapData[row][mapcols.seven-1],
          time: times.individual
        });
      } else if (individual && alternate){ //may have to change this line
        //7th grade alt
        events.push({
          name: "Grade 7 Alt.",
          room: mapData[row][mapcols.sevenAlt-1],
          time: times.individual
        });
      }
      
      if (team && !teamAlternate){
        //7th grade team
        events.push({
          name: "Grade 7 Team",
          room: mapData[row][mapcols.seven-1],
          time: times.team
        });
      } else if (team && teamAlternate){
        events.push({
          name: "Grade 7 Team Alt.",
          room: mapData[row][mapcols.sevenAlt-1],
          time: times.team
        });
      }
      
      
    } else if (grade == "8"){
      
      if (individual && !alternate){
        events.push({
          name: "Grade 8",
          room: mapData[row][mapcols.eight-1],
          time: times.individual
        });
      } else if (individual && alternate){ //may have to change this line
        events.push({
          name: "Grade 8 Alt.",
          room: mapData[row][mapcols.eightAlt-1],
          time: times.individual
        });
      }
      
      if (team && !teamAlternate){
        events.push({
          name: "Grade 8 Team",
          room: mapData[row][mapcols.eight-1],
          time: times.team
        });
      } else if (team && teamAlternate){
        events.push({
          name: "Grade 8 Team Alt.",
          room: mapData[row][mapcols.eightAlt-1],
          time: times.team
        });
      }
    }
    
    if (creativeThinking){ //creative thinking doesn't depend on grade, so
      events.push({
        name: "Creative Thinking",
        room: mapData[row][mapcols.creativeThinking-1],
        time: times.creativeThinking
      });
    }
    
    while (events.length < 3){ //number of possible events
      //filling with blank values
      events.push({
        name: "",
        room: "",
        time: ""
      })
    }
    
    people.push({
      name: name,
      school: school,
      grade: grade,
      division: division,
      events: events
    })
  }
  Logger.log(people);
  return people;
}

function createSlides(people){
  var newSlide, newBack;
  people.forEach(function(person){
    newSlide = templateslide.duplicate();
    newBack = templateback.duplicate();
    templateback.move(1);
    
    newSlide.replaceAllText("*name*", person.name.toUpperCase());
    newSlide.replaceAllText("*school*", person.school);
    newSlide.replaceAllText("*grade*", "Grade "+person.grade);
    newSlide.replaceAllText("*division*", "Division "+person.division);
    newSlide.replaceAllText("*role*", "PARTICIPANT");
    
    for (i in person.events){
      newBack.replaceAllText("*event"+(parseInt(i)+1)+"*", person.events[i].name);
      newBack.replaceAllText("*room"+(parseInt(i)+1)+"*", person.events[i].room);
      newBack.replaceAllText("*time"+(parseInt(i)+1)+"*", person.events[i].time);
    }
  });
}

function transpose(a) {
  return Object.keys(a[0]).map(function (c) { return a.map(function (r) { return r[c]; }); });
}