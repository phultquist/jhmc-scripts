//made by patrick hultquist '21

var ss = SpreadsheetApp.getActiveSpreadsheet()
var names = {
  individual: {
    a: 'A Individual Results',
    aa: 'AA Individual Results'
  },  
  team: {
    a: 'A Team Results',
    aa: 'AA Team Results'
  },
  creativeThinking: {
    a: 'A Creative Thinking Results',
    aa: 'AA Creative Thinking Results'
  },
  schoolTotals: {
    a: 'A School Totals',
    aa: 'AA School Totals'
  }
}

function createScoreSheets() {
  var keys = Object.keys(names)
  for (k in keys){
    var groups = Object.keys(names[keys[k]]);
    for (g in groups){
      var name = names[keys[k]][groups[g]];
      try{
        var sheet = ss.insertSheet(name, 4);
      }catch(e){
        var sheet = ss.getSheetByName(name);
        Logger.log('Sheet already made, updating...');
      }
      sheet.getRange(1, 1).setValue(name)
          .setFontWeight('bold')
          .setFontSize(28)
      update(name)
    }
  }
}

function update(type){
  if (type !== names.schoolTotals.a && type !== names.schoolTotals.aa){
    var scores = sortScores(type);
  }
  var data;
  var data2; //allows for eighth graders: simply put as another data source
  if (type==names.individual.a || type==names.individual.aa){
    data = scores.grade7.map(function(i){
      return [i.name, i.school, i.grade, i.score, i.isAlternate ? 'alternate' : ''];
    })
    data2 = scores.grade8.map(function(i){
      return [i.name, i.school, i.grade, i.score, i.isAlternate ? 'alternate' : ''];
    })
    
  } else if (type==names.team.a || type==names.team.aa){
    
    data = scores.grade7.map(function(i){
      return [i.members.join(', '), i.school, i.name, i.grade, i.score, i.isAlternate ? 'alternate' : ''];
    })
    data2 = scores.grade8.map(function(i){
      return [i.members.join(', '), i.school, i.name, i.grade, i.score, i.isAlternate ? 'alternate' : ''];
    })
    
  } else if (type==names.creativeThinking.a || type==names.creativeThinking.aa){
    data = scores.all.map(function(i){
      return [i.members.join(', '), i.school, i.name, i.time, i.score];
    })
  } else if (type==names.schoolTotals.a){
    data = getTotals("a");
  } else if (type==names.schoolTotals.aa){
    data = getTotals("aa");
  }
  
  var sheet = ss.getSheetByName(type);
  clearSheet(sheet);
  sheet.getRange(2, 1, data.length, data[0].length).setValues(data)
  if (data2 != undefined){
    sheet.getRange(2, 8, data2.length, data2[0].length).setValues(data2)
  }
}

function sortScores(type){ //can be any of 'names' above
  var results,
      byGrade,
      wantsA;
 //two different groups;
  
  if (type==names.individual.a){
    wantsA = true;
    results = getIndividualResults();
    byGrade = true;
  } else if (type==names.individual.aa){
    wantsA = false;
    results = getIndividualResults(); 
    byGrade = true;
  } else if (type==names.team.a){
    wantsA = true;
    results = getTeamResults(); 
    byGrade = true;
  } else if (type==names.team.aa){
    wantsA = false
    results = getTeamResults(); 
    byGrade = true;
  } else if (type==names.creativeThinking.a){
    wantsA = true
    results = getCreativeTeamResults();
    byGrade = false;
  } else if (type==names.creativeThinking.aa){
    wantsA = false;
    results = getCreativeTeamResults();
    byGrade = false;
  } /*else if (type==names.schoolTotals.a){
    wantsA = true;
    results = get
  }*/
  
  var resultsAA = {
      all: [],
      grade7: [],
      grade8: []
    },
    resultsA = {
      all: [],
      grade7: [],
      grade8: []
    };
  
  results.map(function (x){
    if (x.group == 'AA') {
      resultsAA.all.push(x); 
    } else if (x.group == 'A'){
      resultsA.all.push(x); 
    }
    return;
  })
  
  var desiredResult = resultsA;
  if (wantsA==false){
    desiredResult = resultsAA; 
  }
  
  return sortGroup(desiredResult, byGrade, true); //choosing to remove alternates
}

function sortGroup(group, byGrade, removeAlternates){
  if (removeAlternates){
    group.all = group.all.filter(function(x){
      if (x.isAlternate) return false;
      return true;
    })
  }
                   
  group.all.sort(function (a, b){
    if (a.score > b.score) return -1;
    if (b.score > a.score) return 1;
    return 0;
  })
  
  if (byGrade){
    group.all.map(function (f){
      if (f.grade == 7) {
        group.grade7.push(f); 
        return;
      }
      group.grade8.push(f);
    })
  }
  
  return group;
}

function clearSheet(sheet){
  try{
    sheet.getRange(2, 1, sheet.getLastRow()-1,sheet.getLastColumn()).clear() 
  }catch(e){}
}

function findSchoolWinners() {
  var data = getSchoolScores();
  
  var aa = [],
      a = [];
  
  data.map(function (x){
    if (x.group=='AA') aa.push(x);
    if (x.group=='A') a.push(x);
  })
  
  var sortBy = ['grade7individual',
               'grade8individual',
               'grade7team',
               'grade8team',
               'creativeThinking',
               'total']
  
  var sortedArraysAA = [],
      sortedArraysA = [];
  for (v in sortBy){
    aa.sort(function (a, b){
      if (a[sortBy[v]] > b[sortBy[v]]) return -1;
      if (b[sortBy[v]] > a[sortBy[v]]) return 1;
      return 0;
    })
    
    a.sort(function (a, b){
      if (a[sortBy[v]] > b[sortBy[v]]) return -1;
      if (b[sortBy[v]] > a[sortBy[v]]) return 1;
      return 0;
    })
    
    sortedArraysAA.push(aa);
    sortedArraysA.push(a);
  }
  
}

