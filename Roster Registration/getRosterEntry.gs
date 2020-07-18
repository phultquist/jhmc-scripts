function getRosterEntry(row,column) {
  
  //opens raw data spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  //selects raw data sheet
  var sheet = ss.getSheetByName('Raw Roster Data');
      
  //Selects 
  var range = sheet.getRange(row,column);
  Utilities.sleep(50);
  return range.getValue();
}