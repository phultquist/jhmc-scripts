function getTotalsData(type) {
  //type = "aa";
  var schoolSheets = getSchoolSheets();
  
  var schoolSheet,
      results = {};
  
  var schoolResults = [];
  for (b in schoolSheets){
    results = {};
    schoolSheet = schoolSheets[b];
    results.seventhIndividual = schoolSheet.getRange(29,5).getValue();
    results.eigthIndividual = schoolSheet.getRange(30,5).getValue();
    results.seventhTeam = schoolSheet.getRange(31,5).getValue();
    results.eigthTeam = schoolSheet.getRange(32,5).getValue();
    results.creativeThinking = schoolSheet.getRange(33,5).getValue();
    results.schoolTotal = schoolSheet.getRange(34,5).getValue();
    results.division = schoolSheet.getRange(4,11).getValue();
    results.schoolName = schoolSheet.getRange(4,3).getValue();
    schoolResults.push(results);
  }
  
  var topPlacingSchools = {
    type: type,
    seventhIndividual: null,
    eigthIndividual: null,
    seventhTeam: null,
    eigthTeam: null,
    creativeThinking: null,
    schoolTotal: null
  }
  
  schoolResults = schoolResults.filter(function(a){
    return a.division == type.toUpperCase();
  });
  
  Logger.log(schoolResults)
  
  var keys = Object.keys(topPlacingSchools),
      sorted;
  for (n in keys){
    sorted = schoolResults.sort(function(a,b){
      return b[keys[n]] - a[keys[n]];
    });
    //Logger.log(sorted);
    
    //topPlacingSchools[keys[n]] = [sorted[0], sorted[1], sorted[2]];
    topPlacingSchools[keys[n]] = [];
    for (qu = 0; qu < 3; qu++){ // top 3 schools
      topPlacingSchools[keys[n]].push({
        comp: keys[n],
        schoolName: sorted[qu].schoolName,
        score: sorted[qu][keys[n]]
      });
    }
  }
  return topPlacingSchools;
}

function getTotals(type){
  var topPlacingSchools = getTotalsData(type);
  var orderedData = [topPlacingSchools.seventhIndividual, topPlacingSchools.eigthIndividual, topPlacingSchools.seventhTeam, topPlacingSchools.eigthTeam, topPlacingSchools.creativeThinking, topPlacingSchools.schoolTotal];
  var comps = ["Seventh Grade Individual", "Eigth Grade Individual", "Seventh Grade Team", "Eigth Grade Team", "Creative Thinking", "School Totals"];
  var range = [];
  var compOrderedData,
      newRow;
  for (od in orderedData){
    compOrderedData = orderedData[od];
    newRow = [comps[od]];
    //Logger.log("COMPORDEREDDATA");
    //Logger.log(compOrderedData)
    for (ji = 0; ji < 3; ji++){
      newRow.push(compOrderedData[ji].schoolName + "; " + compOrderedData[ji].score);
    }
    range.push(newRow);
  }
  
  return range;
}
