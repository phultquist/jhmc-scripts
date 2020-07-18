function checkLunch(row) {
  //opens raw data spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  //selects raw data sheet
  var sheet = ss.getSheetByName('Raw Roster Data');
  
  //Defines target cell
    
  //Selects 
  var range = sheet.getRange(row,5);
  if (range.getValue() == 'We would like to order lunch through IMSA\'s food provider')
    return 'YES';
  else if (range.getValue() == 'We will be bringing our own lunches')
    return 'NO';
  else
    return 'NO ENTRY';
}
