/*
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
  }
}
*/
var result = {
  group: 'A', 
  name: '8th Grade Individual',
  firstplacetext: 'William Yu, Test District; 42',
  secondplacetext: 'James Jochum, Holy Cross; 33\nRobert Barnhisel, St. Michael; 33',
  thirdplacetext: 'Ryan Geraghty, Old Quarry Middle School; 30\nSean Jost, St. Michael; 30'
}

function createTextSlide(slideshow, text, index){
  var slide = slideshow.insertSlide(index);
  var title = slide.insertTextBox(text);
  var w = 10*72; //in pts
  var h = 7.5*72 //in pts
  title.getText().getTextStyle().setBold(true).setFontSize(40);
  title.getText().getParagraphs()[0].getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  title.setWidth(w);
  title.setTop(h/2-40);
}

function createTopSlides(type, titleText, bodyText, slidesA, slidesAA){
  if (type.toUpperCase()=="A"){
    var num = slidesA.getSlides().length;
    var newSlide = slidesA.insertSlide(num);    
  } else {
    var num = slidesAA.getSlides().length;
    var newSlide = slidesAA.insertSlide(num);
  }
  var w = 10*72; //in pts
  var h = 7.5*72 //in pts
  var title = newSlide.insertTextBox(titleText);
  //title.alignOnPage(SlidesApp.AlignmentPosition.HORIZONTAL_CENTER);
  title.getText().getTextStyle().setBold(true).setFontSize(40);
  title.getText().getParagraphs()[0].getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  title.setWidth(w);
  title.setTop(20);
  
  var bottomText = newSlide.insertTextBox(bodyText);
  bottomText.getText().getParagraphs()[0].getRange().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  bottomText.setTop(h/2 - 40);
  bottomText.setWidth(w);
  bottomText.getText().getTextStyle().setFontSize(35).setBold(true).setForegroundColor(70, 70, 70)
}

function createSlide(res, slidesA, slidesAA, optIndex) {
  var template;
  if (res.group == 'A'){
    template = slidesA.getSlides()[1]; //second slide is template slide
  } else {
    template = slidesAA.getSlides()[1]; 
  }
  var newSlide = template.duplicate();
  if (optIndex != null){
    newSlide.move(optIndex)
  }
  
  newSlide.replaceAllText('*title*', res.name);
  newSlide.replaceAllText('*firstplace*', res.firstplacetext);
  newSlide.replaceAllText('*secondplace*', res.secondplacetext);
  newSlide.replaceAllText('*thirdplace*', res.thirdplacetext);
}

function generateSlides() { 
  var slidesA = SlidesApp.openByUrl('https://docs.google.com/a/imsa.edu/open?id=1cyioh0q9sa1vY5XbMh-N1pD7teeEDkP5tWHEKSAKkNU');
  var slidesAA = SlidesApp.openByUrl('https://docs.google.com/presentation/d/19TJ4WpP8BKsX_8vfveNvxgrMNUj2rMLt7MsV2Y2UQ_c/edit#slide=id.p1');
 var twoGradeItems = [names.individual.a,
                 names.individual.aa,
                 names.team.a,
                 names.team.aa];
 
 var oneGradeItems = [names.creativeThinking.a,
                 names.creativeThinking.aa];
  
 twoGradeItems.map(function (dl){
   var grade7Data = sortScores(dl).grade7
   var grade8Data = sortScores(dl).grade8
   createSlide(generateResult(grade7Data), slidesA, slidesAA);
   createSlide(generateResult(grade8Data), slidesA, slidesAA);
 });
  
  oneGradeItems.map(function (ol){
    var data = sortScores(ol).all;
    createSlide(generateResult(data, ol), slidesA, slidesAA);
  });
  
  var divs = ["a", "aa"];
  var divSlides = [slidesA, slidesAA];
  
  for (div in divs){
    var dSlide = divSlides[div],
        division = divs[div].toUpperCase();
    var topResults = getTotalsData(divs[div]);
    
    var seventhIndividual = topResults.seventhIndividual
    createSlide(formatTotals(seventhIndividual, "7th Grade Individual Overall", division), slidesA, slidesAA, dSlide.getSlides().length)
    
    createTextSlide(dSlide, "School Overall Rankings", dSlide.getSlides().length); 
    var totals = topResults.schoolTotal;
    Logger.log("TOTALS")
    Logger.log(totals)
    for (op = 2; op>=0;op--){
      createTopSlides(division, ending(parseInt(op)+parseInt(1))+" Place Overall", totals[op].schoolName+"; "+totals[op].score, slidesA, slidesAA);
    }
  }
}

function formatTotals(totals, text, group){
  var res = {
    group: group,
    name: text,
    firstplacetext: null,
    secondplacetext: null,
    thirdplacetext: null
  }
  res.firstplacetext = totals[0].schoolName + "; " + totals[0].score;
  res.secondplacetext = totals[1].schoolName + "; " + totals[1].score;
  res.thirdplacetext = totals[2].schoolName + "; " + totals[2].score;
  return res;
}

function ending(number){
  if (number==1){
    return number + "st"
  } else if (number==2){
    return number + "nd"
  } else if (number==3){
    return number + "rd"
  } else {
    return number + "th"
  }
}

function generateResult(data, type) {
  var result = {
    group: data[0].group,
    name: data[0].getCompetitionName(),
    firstplacetext: '',
    secondplacetext: '',
    thirdplacetext: ''
  }
    
  var firstplace = [],
      secondplace = [],
      thirdplace = [];
  var topscore = data[0].score,
      secondscore,
      thirdscore;
  
  if (type==names.creativeThinking.a || type==names.creativeThinking.aa){
    var topscores = data;
    
    /*for (b in data){
      if (data[b].score == topscore){
        topscores.push(data[b]) 
      }
    }*/
    
    topscores = topscores.sort(function (a, b){
      if (a.score == b.score){
        if (a.time < b.time) return -1;
        if (b.time < a.time) return 1;
      }
      return 0;
    })
    
    firstplace.push(topscores[0]);
    secondplace.push(topscores[1]);
    thirdplace.push(topscores[2]);
    
  } else {
    var places = determinePlaces(data);
    
    firstplace = places.first;
    secondplace = places.second;
    thirdplace = places.third;
  }
  
  firstplace = firstplace.map(function (c) {
    return c.getScoringText()
  })  
  secondplace = secondplace.map(function (c) {
    return c.getScoringText()
  })  
  thirdplace = thirdplace.map(function (c) {
    return c.getScoringText()
  })    
  
  result.firstplacetext = firstplace.join('\n');
  result.secondplacetext = secondplace.join('\n');
  result.thirdplacetext = thirdplace.join('\n');
  
  Logger.log(result);
  
  return result;
}

function determinePlaces(data) {
  var firstplace = [],
      secondplace = [],
      thirdplace = [];
  var topscore = data[0].score,
      secondscore,
      thirdscore;
  
  for (q in data){
    if (data[q].score == topscore){
      firstplace.push(data[q]) 
    } else {
      secondscore = data[q].score;
      break; 
    }
  }
  
  for (e in data){
    if (data[e].score == secondscore){
      secondplace.push(data[e]);
    } else if (data[e].score < secondscore){
      thirdscore = data[e].score;
      break;
    }
  }
  
  for (g in data){
    if (data[g].score == thirdscore){
      thirdplace.push(data[g])
    } else if (data[g].score < thirdscore){
      break; 
    }
  }
  
  return {
    first: firstplace,
    second: secondplace,
    third: thirdplace
  };
}



