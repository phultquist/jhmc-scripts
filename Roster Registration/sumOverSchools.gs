function sumOverSchools(column,row) {
    var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    var sum = 0;
  
    //starts summing the entries in specified cell for each school sheet
    for (var i = 2; i < sheets.length ; i++ ) {
        var sheet = sheets[i];
        var range = sheet.getRange(column,row);
        var val = range.getValue();

        if (typeof(val) == 'number') {
            sum += val;   
        }       
    }

    return sum;
}