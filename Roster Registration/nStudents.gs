function nStudents() {
  
  var sheet = SpreadsheetApp.getActiveSheet();
  
  var seventhGradeColumn = 3;
  var eighthGradeColumn = 6;
  
  var nStudents = 0;
  
  //count 7th graders
  for (var i = 0; i < 8; ++i){
    var entry = sheet.getRange(10+i,seventhGradeColumn);
    if (!(entry.isBlank()))
      nStudents++;
  }
  
  //count 7th grade alternates
  for (var i = 0; i < 4; ++i){
    var entry = sheet.getRange(21+i,seventhGradeColumn);
    if (!(entry.isBlank()))
      nStudents++;
  }
  
  //count 8th graders
  for (var i = 0; i < 8; ++i){
    var entry = sheet.getRange(10+i,eighthGradeColumn);
    if (!(entry.isBlank()))
      nStudents++;
  }
  
  //count 7th grade alternates
  for (var i = 0; i < 4; ++i){
    var entry = sheet.getRange(21+i,eighthGradeColumn);
    if (!(entry.isBlank()))
      nStudents++;
  }
  
  return nStudents;  
}
