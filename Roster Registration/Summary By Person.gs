var numRowsBeforeContestants = 6; // will be 7 when division is added

function getData() {
//  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Raw Roster Data");
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Changed");
  var data = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  var topRow = data[0];
  var allPeople = [];
  var results;
  for (e = 1; e < data.length; e++){
    results = bySchool(data[e], topRow);
    for (g in results){
      allPeople.push(results[g]);
    }
  }
  
  var peopleSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("People");
  peopleSheet.clear();
  var dataToUpdate = [],
      person;
  
  var headerData = ["ID", "Name", "School Name", "Grade", "Ind. Alt.", "Individual", "Team Alt.", "Team", "Creative Thinking"];
  peopleSheet.getRange(1, 1, 1, headerData.length).setValues([headerData]);
  
  for (h in allPeople){
    dataToUpdate = [];
    person = allPeople[h];
    if (person.name.length == 0) continue;
    dataToUpdate.push(h, person.name, person.schoolName, person.grade, person.eventData.alternate, person.eventData.individual, person.eventData.teamAlternate, person.eventData.team, person.eventData.creativeThinking);
    /*for (v in person.events){
      dataToUpdate.push(person.events[v]);
    }*/
    dataToUpdate.push()
    peopleSheet.getRange(parseInt(h - 1 + 3), 1, 1, dataToUpdate.length).setValues([dataToUpdate]);
  }
  
}


function bySchool(rawRow, topRowData){
  var rowData = rawRow;
  var topData = topRowData;
    
  var schoolName = rowData[2],
      coachName = rowData[3];
  
  var schoolPeople = [];
  var peopleEvents = [];
  var eventTitle,
      personIndex,
      personName;
  for (r = numRowsBeforeContestants; r < rowData.length; r++){
    personName = rowData[r];
    if (personName.length == 0) continue;
    if (personName.indexOf("(") != -1){
      personName = personName.substr(0, personName.indexOf('(')-1)
    }
    if (personName[personName.length-1] === " "){
      personName = personName.substring(0, personName.length - 1);
    }
    personIndex = schoolPeople.indexOf(personName);
    if (personIndex == -1){
      schoolPeople.push(personName); //person name
      peopleEvents.push([topData[r]]); //event title
    } else {
      peopleEvents[personIndex].push(topData[r]);
    }
  }
  
  //generates people
  var peopleInSchool = [];
  var personObj;
  for (k in schoolPeople){
    personObj = {
      name: schoolPeople[k],
      coachName: coachName,
      schoolName: schoolName,
      events: peopleEvents[k],
      grade: peopleEvents[k][0].charAt(0),
      eventData: processEvents({events: peopleEvents[k]})
    }
    peopleInSchool.push(personObj);
  }
  
  peopleInSchool.sort(function(a,b){
    return a.name.localeCompare(b.name);
  })
  
  Logger.log(schoolName+"::"+peopleInSchool.length);
  
  return peopleInSchool;
}

function containsAllStrings(main, requested){ //main is a string, requested is an array of strings
  main = main.toUpperCase();
  var compstr;
  for (q in requested){
    compstr = requested[q].toUpperCase();
    if (main.indexOf(compstr) == -1){ //doesn't exist in main string
      return false;
    }
  }
  return true;
}

function processEvents(person){
  var events = person.events;
  
  var personData = {
    alternate: false,
    individual: false,
    teamAlternate: false,
    team: false,
    creativeThinking: false
  }
  
  var event;
  for (o in events){
    event = events[o];
    if (containsAllStrings(event, ["individual"])){
      if (containsAllStrings(event, ["alternate"])){
        personData.alternate = true;
      }
      personData.individual = true;
    } else if (containsAllStrings(event, ["team", "grade "])){ //the space is there to differentiate between "grade" and "grader"
      if (containsAllStrings(event, ["alternate"])){
        personData.teamAlternate = true;
      }
      personData.team = true;
    } else if (containsAllStrings(event, ["creative"])){
      personData.creativeThinking = true;
    }
  }
  return (personData);
}
