var img;
var boxSize = 7;
var sized=12;
var xOffset=-100;
var yOffset=272;
var w;
var h;
var posi;
var posi1=0;
var ptMap1;
var ptMap2 = -1;
var oldPoint;
// pointList will have points stored as [X,Y,locked?] (1 = unlocked. -1 = locked)
var pointList = [];
var fixedList = [];
var curPoly = [];
var polyList = [];
var myTiling;
var myImage;
var baseX = 10;
var baseY = 10;
var Ax = 20000;
var Ay = 0;
var Bx = 0;
var By = 20000;
var mode = 0;
var newPointList = [];
var newPolyList = [];
var newAx = 0;
var newAy = 0;
var newBx = 0;
var newBy = 0;
var nextBlah = [];

function init() {
//  sized=13;
//  xOffset=-100;
//  yOffset=272;
sized=1;
  xOffset=0;
  yOffset=0;
  pointList = [];
  curPoly = [];
  polyList = [];
  mode = 0;
  var c = document.getElementById("myCanvas");
  var context = c.getContext("2d");
  c.height = window.innerHeight-135;
  c.width = window.innerWidth-195;
  context.rect(0,0,c.width,c.height);
  context.fillStyle = "white";
  context.fill();
  var d = document.getElementById("canvasDiv");
  d.style.maxHeight= window.innerHeight-110 + "px";
  d.style.height = window.innerHeight-110 + "px";
  d.style.maxWidth= window.innerWidth-170 + "px";
//do2024();
//do192();
//  oct884();
//fill2024();
// newMerge();
//right1248();
//fill1248();
//newMerge();
//  polyList.forEach(function(nextPoly) {
//    nextPoly.reverse();
//  });
//dee();
//fillDee();
//ob();
//fillOb();
  draw();
}

function resize() {
  var d = document.getElementById("canvasDiv");
  d.style.maxHeight= window.innerHeight-110 + "px";
  d.style.height = window.innerHeight-110 + "px";
  d.style.maxWidth= window.innerWidth-170 + "px";
  if (img) { draw(); }
  else {
  var c = document.getElementById("myCanvas");
  var context = c.getContext("2d");
  c.height = (window.innerHeight-135)*sized;
  c.width = (window.innerWidth-195)*sized;
  draw(); }
}


function do192() {
  Ax = 20000;
  By = 20000;
  addRegPoly(192,0,0,30.555*5,0.01636246,-1);
  addRegPoly(112,0,50.8994*5,18.61233*5,0.0280499,-1);
  addRegPoly(112,35.9913*5,35.9913*5,18.61233*5,0.0280499,-1);
} // end do192

function addPoly(myPtList) {
  let newPoly = [];
  myPtList.forEach(function(myNextPt) {
    newPoly.push([pointList.length,[0,0]]);
    pointList.push([myNextPt[0],myNextPt[1],myNextPt[2]]);
  });
  polyList.push(newPoly);
}

function addRegPoly(numSides,centX,centY,radius,startAngle,lock) {
  let newPoly = [];
  for (let i = 0; i<numSides;i++) {
    let newAngle = i/numSides*2*Math.PI+startAngle;
    let newX = (Math.cos(newAngle)*radius)+centX;
    let newY = (Math.sin(newAngle)*radius)+centY;
    newPoly.push([pointList.length,[0,0]]);
    pointList.push([newX,newY,lock]); // -1 locked, 1 unlocked
  }
  polyList.push(newPoly);
}


function makeDiamond(gridList,convex) {

  let diamondList = [];
  let grandma = gridList[0];
  let previous = gridList[1];

  grandma = setLimits(grandma,previous);

  let gridLineType = 0;
  let firstHalf = [];
  let secondHalf = [];
  let secondGrandma = [];
  let firstGrandma = [];
  let corrector = 0;

  for (let curNum = 2; curNum< gridList.length; curNum++) {


//  for (let curNum = 2; curNum< 22; curNum++) {

    if (gridLineType === 1) {corrector = 0; gridLineType = 2;}
    if (gridLineType === 3) {corrector = 0; gridLineType = 4;}

    let thisLine = setLimits(gridList[curNum],previous);
    for (let g = 0; g < thisLine.length; g++) {
      if (gridLineType === 1) { corrector = 1; }
      if (gridLineType === 3) { corrector = 1; }
      let myDiamond = [];
      if (thisLine[g][4]===0) { // upper grow
        myDiamond.push(thisLine[g]);
        myDiamond.push(thisLine[g+1]);
        myDiamond.push(previous[g+1]);
        myDiamond.push(grandma[g]);
        myDiamond.push(previous[g]);
        diamondList.push(myDiamond);
        let myCutPoint = thisLine[g][1];
        g++;
        gridLineType = 1;
        firstHalf = setLimits(gridList[curNum],[[0,-2],[0,myCutPoint]]);
        secondHalf = setLimits(gridList[curNum],[[0,myCutPoint+.1],[0,2000]]);
        secondGrandma = setLimits(previous,secondHalf);

      } else if (thisLine[g][4]===2) { // lower grow
        myDiamond.push(thisLine[g]);
        myDiamond.push(thisLine[g+1]);
        myDiamond.push(previous[g+1]);
        myDiamond.push(grandma[g]);
        myDiamond.push(previous[g]);
        diamondList.push(myDiamond);
        let myCutPoint = thisLine[g][1];
        g++;
        gridLineType = 3;
        firstHalf = setLimits(gridList[curNum],[[0,-2],[0,myCutPoint]]);
        secondHalf = setLimits(gridList[curNum],[[0,myCutPoint+.1],[0,2000]]);
        firstGrandma = setLimits(previous,firstHalf);

      } else { // normal
        myDiamond.push(thisLine[g]);
        myDiamond.push(previous[g+1-corrector]);
        myDiamond.push(grandma[g-corrector]);
        myDiamond.push(previous[g-corrector]);
        diamondList.push(myDiamond);
      }
    } // end g loop

    grandma = JSON.parse(JSON.stringify(previous));
    previous = JSON.parse(JSON.stringify(gridList[curNum]));

    if (gridLineType === 1) { previous = JSON.parse(JSON.stringify(firstHalf));}
    if (gridLineType === 2) { 
      grandma = grandma.concat(secondGrandma);
      previous = previous.concat(secondHalf);
      gridLineType = 0;
    } // end gridLineType ===2
    if (gridLineType === 3) { previous = JSON.parse(JSON.stringify(secondHalf));}
    if (gridLineType === 4) { 
      grandma = firstGrandma.concat(grandma);
      previous = firstHalf.concat(previous);
      gridLineType = 0;
    } // end gridLineType ===4

  grandma = setLimits(grandma,previous);

  } // end curNum loop

// alert(JSON.stringify(diamondList));

//goSaveFill(diamondList);

  diamondList.forEach(function(diamond) {
    let hasNull = 0;
    diamond.forEach(function(pt) {
 //      alert(pt);
       if (typeof(pt) === "undefined") {hasNull = 1}
    });
    
//alert(JSON.stringify(diamond));

    if (hasNull === 0) {
//alert("*");
      if (diamond.length >4) {
        heptaPoly(diamond);
      } else 
        if (diamond[2][4]===0){
          pentaLPoly(diamond);
      } else
        if (diamond[3][4]===2){
          pentaRPoly(diamond);
      } else {
        normalPoly(diamond);
      }
    } // end filteredDiamond case
  }); // end diamondList loop
} // end makeDiamond()


function setLimits(A,B) {

  //  return list A within the limits of B.
  let maxB = -5;
  let minB = 2000;
  for (let ii = 0; ii < B.length; ii++) {
    if (maxB < B[ii][1]) {maxB = B[ii][1]}
    if (minB > B[ii][1]) {minB = B[ii][1]}
  }
  let newA = [];
  for (let ii = 0; ii < A.length; ii++) {
    if (minB <= A[ii][1] && maxB >= A[ii][1]) {
      newA.push(A[ii]);
    }
  }
  return(newA);

}

function normalPoly(diamond) {

  let a0x = diamond[0][2];
  let a0y = diamond[0][3];
  let a1x = diamond[1][2];
  let a1y = diamond[1][3];
  let a2x = diamond[2][2];
  let a2y = diamond[2][3];
  let a3x = diamond[3][2];
  let a3y = diamond[3][3];
  let m0x = (a0x+a1x)/2;
  let m0y = (a0y+a1y)/2;
  let m1x = (a1x+a2x)/2;
  let m1y = (a1y+a2y)/2;
  let m2x = (a2x+a3x)/2;
  let m2y = (a2y+a3y)/2;
  let m3x = (a3x+a0x)/2;
  let m3y = (a3y+a0y)/2;
  let startPt = pointList.length;
  pointList.push([a0x,a0y,1]);
  pointList.push([m0x,m0y,1]);
  pointList.push([a1x,a1y,1]);
  pointList.push([m1x,m1y,1]);
  pointList.push([a2x,a2y,1]);
  pointList.push([m2x,m2y,1]);
  pointList.push([a3x,a3y,1]);
  pointList.push([m3x,m3y,1]);
  let nextPoly = [];
  nextPoly.push([startPt,[0,0]]);
  nextPoly.push([startPt+1,[0,0]]);
  nextPoly.push([startPt+3,[0,0]]);
  nextPoly.push([startPt+4,[0,0]]);
  nextPoly.push([startPt+5,[0,0]]);
  nextPoly.push([startPt+7,[0,0]]);
  polyList.push(nextPoly);
  nextPoly = [];
  nextPoly.push([startPt+1,[0,0]]);
  nextPoly.push([startPt+2,[0,0]]);
  nextPoly.push([startPt+3,[0,0]]);
  polyList.push(nextPoly);
  nextPoly = [];
  nextPoly.push([startPt+5,[0,0]]);
  nextPoly.push([startPt+6,[0,0]]);
  nextPoly.push([startPt+7,[0,0]]);
  polyList.push(nextPoly);
} // end normalPoly()

function heptaPoly(diamond) {
  let a0x = diamond[0][2];
  let a0y = diamond[0][3];
  let a1x = diamond[1][2];
  let a1y = diamond[1][3];
  let a2x = diamond[2][2];
  let a2y = diamond[2][3];
  let a3x = diamond[3][2];
  let a3y = diamond[3][3];
  let a4x = diamond[4][2];
  let a4y = diamond[4][3];
  let m1x = (a1x+a2x)/2;
  let m1y = (a1y+a2y)/2;
  let m2x = (a2x+a3x)/2;
  let m2y = (a2y+a3y)/2;
  let m3x = (a3x+a4x)/2;
  let m3y = (a3y+a4y)/2;
  let m4x = (a4x+a0x)/2;
  let m4y = (a4y+a0y)/2;
  let startPt = pointList.length;
  pointList.push([a0x,a0y,1]);
  pointList.push([a1x,a1y,1]);
  pointList.push([m1x,m1y,1]);
  pointList.push([a2x,a2y,1]);
  pointList.push([m2x,m2y,1]);
  pointList.push([a3x,a3y,1]);
  pointList.push([m3x,m3y,1]);
  pointList.push([a4x,a4y,1]);
  pointList.push([m4x,m4y,1]);
  let nextPoly = [];
  nextPoly.push([startPt,[0,0]]);
  nextPoly.push([startPt+1,[0,0]]);
  nextPoly.push([startPt+2,[0,0]]);
  nextPoly.push([startPt+4,[0,0]]);
  nextPoly.push([startPt+5,[0,0]]);
  nextPoly.push([startPt+6,[0,0]]);
  nextPoly.push([startPt+8,[0,0]]);
  polyList.push(nextPoly);
  nextPoly = [];
  nextPoly.push([startPt+2,[0,0]]);
  nextPoly.push([startPt+3,[0,0]]);
  nextPoly.push([startPt+4,[0,0]]);
  polyList.push(nextPoly);
  nextPoly = [];
  nextPoly.push([startPt+6,[0,0]]);
  nextPoly.push([startPt+7,[0,0]]);
  nextPoly.push([startPt+8,[0,0]]);
  polyList.push(nextPoly);
} // end heptaPoly()

function pentaLPoly(diamond) {
  let a0x = diamond[0][2];
  let a0y = diamond[0][3];
  let a1x = diamond[1][2];
  let a1y = diamond[1][3];
  let a2x = diamond[2][2];
  let a2y = diamond[2][3];
  let a3x = diamond[3][2];
  let a3y = diamond[3][3];
  let m0x = (a0x+a1x)/2;
  let m0y = (a0y+a1y)/2;
  let m2x = (a2x+a3x)/2;
  let m2y = (a2y+a3y)/2;
  let m3x = (a3x+a0x)/2;
  let m3y = (a3y+a0y)/2;
  let startPt = pointList.length;
  pointList.push([a0x,a0y,1]);
  pointList.push([m0x,m0y,1]);
  pointList.push([a1x,a1y,1]);
  pointList.push([a2x,a2y,1]);
  pointList.push([m2x,m2y,1]);
  pointList.push([a3x,a3y,1]);
  pointList.push([m3x,m3y,1]);
  let nextPoly = [];
  nextPoly.push([startPt,[0,0]]);
  nextPoly.push([startPt+1,[0,0]]);
  nextPoly.push([startPt+3,[0,0]]);
  nextPoly.push([startPt+4,[0,0]]);
  nextPoly.push([startPt+6,[0,0]]);
  polyList.push(nextPoly);
  nextPoly = [];
  nextPoly.push([startPt+1,[0,0]]);
  nextPoly.push([startPt+2,[0,0]]);
  nextPoly.push([startPt+3,[0,0]]);
  polyList.push(nextPoly);
  nextPoly = [];
  nextPoly.push([startPt+4,[0,0]]);
  nextPoly.push([startPt+5,[0,0]]);
  nextPoly.push([startPt+6,[0,0]]);
  polyList.push(nextPoly);
} // end pentaLPoly()

function pentaRPoly(diamond) {
  let a0x = diamond[0][2];
  let a0y = diamond[0][3];
  let a1x = diamond[1][2];
  let a1y = diamond[1][3];
  let a2x = diamond[2][2];
  let a2y = diamond[2][3];
  let a3x = diamond[3][2];
  let a3y = diamond[3][3];
  let m0x = (a0x+a1x)/2;
  let m0y = (a0y+a1y)/2;
  let m1x = (a1x+a2x)/2;
  let m1y = (a1y+a2y)/2;
  let m3x = (a3x+a0x)/2;
  let m3y = (a3y+a0y)/2;
  let startPt = pointList.length;
  pointList.push([a0x,a0y,1]);
  pointList.push([m0x,m0y,1]);
  pointList.push([a1x,a1y,1]);
  pointList.push([m1x,m1y,1]);
  pointList.push([a2x,a2y,1]);
  pointList.push([a3x,a3y,1]);
  pointList.push([m3x,m3y,1]);
  let nextPoly = [];
  nextPoly.push([startPt,[0,0]]);
  nextPoly.push([startPt+1,[0,0]]);
  nextPoly.push([startPt+3,[0,0]]);
  nextPoly.push([startPt+4,[0,0]]);
  nextPoly.push([startPt+6,[0,0]]);
  polyList.push(nextPoly);
  nextPoly = [];
  nextPoly.push([startPt+1,[0,0]]);
  nextPoly.push([startPt+2,[0,0]]);
  nextPoly.push([startPt+3,[0,0]]);
  polyList.push(nextPoly);
  nextPoly = [];
  nextPoly.push([startPt+4,[0,0]]);
  nextPoly.push([startPt+5,[0,0]]);
  nextPoly.push([startPt+6,[0,0]]);
  polyList.push(nextPoly);
} // end pentaRPoly()


function twoArcs() {
  Ax = 20000;
  By = 20000;
  let blah = [];

//  let yAdder = -220;
//sized = 12;
//yOffset = 180;
//xOffset = -10;

//polygons are centered on y axis. 



/*
// original
  let edgeLen = 2;
  let bigNumSides = 2024;
  let bigRad = 644.26;
  let bigCentY = -440;
  let lilNumSides = 1248;
  let lilRad = 398.72;
  let gap = 3.48;
  let starti = 477.5;
  let endi = 381;

// this works. original x 10.
  let edgeLen = 20;
  let bigNumSides = 2024;
  let bigRad = 6442.6;
  let bigCentY = -6000;
  let lilNumSides = 1248;
  let lilRad = 3987.2;
  let gap = 34.8;
  let starti = 477.5;
  let endi = 381;

// this is ugly
  let edgeLen = 5;
  let bigNumSides = 200;
  let bigRad = 397;
  let bigCentY = -200;
  let lilNumSides = 150;
  let lilRad = 298;
  let gap = 30;
  let starti = 35.5;
  let endi = 15;

*/


  let edgeLen = parseFloat(prompt("Edge Length?"));
  let bigNumSides = parseInt(prompt("Number of sides of upper polygon?"));
  let idealbigRad = edgeLen*edgeLen/Math.asin(2*Math.PI/bigNumSides)/2;
  let bigRad = parseFloat(prompt("Upper arc radius? (Should be " + idealbigRad +")"));
  let bigCentY = parseFloat(prompt("Upper arc center Y?"));
  let lilNumSides = parseInt(prompt("Number of sides of lower polygon?"));
  let ideallilRad = edgeLen*edgeLen/Math.asin(2*Math.PI/lilNumSides)/2;
  let lilRad = parseFloat(prompt("Lower arc radius? (Should be " + ideallilRad +")"));
  let gap = parseFloat(prompt("Gap between arcs? (Each layer should be " + edgeLen*Math.sqrt(3) + ")"));

  let starti = parseFloat(prompt("Start i? (< "+(bigNumSides*.25) + ")"));
  let endi = parseFloat(prompt("End i? (between 0 and" + starti + ")"));


  let bigBotY = bigCentY-bigRad;


  let bigTopY = bigCentY+bigRad;
  let lilBotY = bigTopY + gap;
  let lilTopY = lilBotY + 2*lilRad;
//alert([bigBotY,bigTopY,lilBotY,lilTopY]);

  let dist1 = (lilRad*gap+2*lilRad*bigRad)/(bigRad-lilRad);
  let dist1Prime = dist1 + gap;
  let inv1Rad = Math.sqrt(dist1*dist1Prime); // r
  let inv1CentY = lilBotY+dist1; // C
  let inv2CentY = inv1CentY - inv1Rad; // K
//alert([dist1,dist1Prime,inv1Rad,inv1CentY,inv2CentY]);
  
  let inv2Rad = 20; // we could pick any radius
  let bigBot2Y = inv2Rad*inv2Rad/(bigBotY-inv2CentY) +inv2CentY;
  let bigTop2Y = inv2Rad*inv2Rad/(bigTopY-inv2CentY) +inv2CentY;
  let lilBot2Y = inv2Rad*inv2Rad/(lilBotY-inv2CentY) +inv2CentY;
  let lilTop2Y = inv2Rad*inv2Rad/(lilTopY-inv2CentY) +inv2CentY;
  let midLineY = (lilTop2Y+bigBot2Y)/2; // L
  let loCent2Y = (lilTop2Y+lilBot2Y)/2; // K(M) center
  let bigCent2Y = (bigTop2Y+bigBot2Y)/2; // K(N) center
//alert([loCent2Y, bigCent2Y]);

// need from above: inv2CentY, inv2Rad, bigCent2Y, midLineY, edgeLen 
  let gridList = [];
  let baseLilIndex = 0;

  for (let i = starti; i>endi;i--) {
 //   let yAdder = bigCentY/2;

    let newAngle = i/bigNumSides*2*Math.PI;
    let hiPtX = (Math.cos(newAngle)*bigRad); //0
    let hiPtY = (Math.sin(newAngle)*bigRad) + bigCentY; //1

    let hiPtDist = Math.sqrt((hiPtY-inv2CentY)**2 + hiPtX*hiPtX); // dist
    let hiPtDist2 = inv2Rad*inv2Rad/hiPtDist; // newDist
    let hiPt2X = hiPtX/hiPtDist*hiPtDist2; // K(x)
    let hiPt2Y = (hiPtY-inv2CentY)/hiPtDist*hiPtDist2+inv2CentY; // K(y)
    let arcCent2X = hiPt2X+(hiPt2Y-bigCent2Y)/hiPt2X*(hiPt2Y-midLineY); // CentX
  //  let arcCent2Y = midLineY; // CentY

    let loPt2X = hiPt2X; // K(x')
    let loPt2Y = 2*midLineY-hiPt2Y; // K(y')
    let loPtDist2 = Math.sqrt((loPt2Y-inv2CentY)**2 + loPt2X * loPt2X); // dist
    let loPtDist = inv2Rad*inv2Rad/loPtDist2; // newDist
    let loPtX = loPt2X/loPtDist2*loPtDist; // new x //2
    if (i === starti) 
       {baseLilIndex = Math.acos(loPtX/lilRad)/2/Math.PI*lilNumSides +1.5;}
    let loPtY = (loPt2Y-inv2CentY)/loPtDist2*loPtDist+inv2CentY; // new y //3
  //alert([loPtX, loPtY]);

    let altPt2X = arcCent2X+Math.sqrt((hiPt2Y-midLineY)**2 + (hiPt2X-arcCent2X)**2); // Px
    let altPt2Y = midLineY; // Py
    let altPtDist2 = Math.sqrt((altPt2Y-inv2CentY)**2 + altPt2X*altPt2X); // dist
    let altPtDist = inv2Rad*inv2Rad/altPtDist2; // newDist
    let altPtX = altPt2X/altPtDist2*altPtDist; // new x
    let altPtY = (altPt2Y-inv2CentY)/altPtDist2*altPtDist+inv2CentY; // new y

    let arcCentPt = findCirCent(hiPtX,hiPtY,loPtX,loPtY,altPtX,altPtY); // 4 & 5
  //alert([hiPtX, hiPtY, altPtX, altPtY, loPtX, loPtY, arcCentPt[0],arcCentPt[1]]);
    let arcRad = Math.sqrt( (arcCentPt[0]-hiPtX)**2 + (arcCentPt[1]-hiPtY)**2 ); //6
    let arcAng1 = Math.atan2(hiPtY-arcCentPt[1],hiPtX-arcCentPt[0]); //7
    let arcAng2 = Math.atan2(loPtY-arcCentPt[1],loPtX-arcCentPt[0]); //8
    let arcDist = (arcAng2-arcAng1)*arcRad; //9
    let arcNumRows = arcDist/Math.sqrt(3)/edgeLen; //10
    let arcRoundRows = Math.round(arcNumRows); //11
    let arcRowParity = arcRoundRows%2; // 12
    let hiIndex = starti+1.5-i; //13
    let hiParity = hiIndex%2; //14
    let bothParity = (hiParity+arcRowParity)%2; //15
    let loIndex = baseLilIndex-Math.acos(loPtX/lilRad)/2/Math.PI*lilNumSides; //16
    let pickLoIndex = Math.round((loIndex+1-bothParity)/2)*2-1+bothParity; //17
    let loParity = pickLoIndex%2; //18

    blah.push([hiPtX,hiPtY,loPtX,loPtY,arcCentPt[0],arcCentPt[1],arcRad,arcAng1,arcAng2,arcDist,arcNumRows,      arcRoundRows,arcRowParity,hiIndex,hiParity,bothParity,loIndex,pickLoIndex,loParity,1,0,0,0,0]);

  } // end i loop

  for (let i = 0;i<blah.length-1;i++) {
   // [19] usually stays 1. If 0, hi increases. if 2, lo increases.
    blah[i][19]=blah[i+1][17]-blah[i][17]; // 19 grow
//   if (blah[i][19]===0) {blah[i-1][20]=1} // 20 hi (unused)
//    if (blah[i][19]===2) {blah[i-1][21]=1} // 21 lo (unused)
  }
  let myMult = (Math.sqrt(5)+1)/2-1;
  let multiplier = 1;

  for (let i = 0;i<blah.length-1;i++) {
//    if (blah[i][20]+blah[i][21]>0) {
    let gridLine = [];
    blah[i].push(blah[i][7]-blah[i][8]); // 24 arcAngTot
    blah[i].push(blah[i][24]/blah[i][10]); // 25 angPerRow
    if (blah[i][14]===1.5) {blah[i].push(-0.5)}
      else {blah[i].push(0.5)} // 26 startGridCoord
    blah[i].push(-blah[i][26]*blah[i][25]); // 27 startAdd
    blah[i].push(blah[i][27]+blah[i][7]); // 28 gridStart
    if (blah[i][18]===1.5) {blah[i].push(-0.5*blah[i][25])}
      else {blah[i].push(0.5*blah[i][25])} // 29 endAdd
    blah[i].push(blah[i][29]+blah[i][8]); // 30 gridEnd
    blah[i].push(blah[i][30]-blah[i][28]); // 31 gridAngTot
    blah[i].push((blah[i][18]+blah[i][14]-2+blah[i][11])/2); // 32 gridRows
  
    if (blah[i][19] === 0) {
      blah[i][22]= multiplier*myMult-Math.floor(multiplier*myMult); //22 growDecimal
      blah[i][23]=Math.floor((blah[i][32]-1)*blah[i][22])+1; //23 7gon place
      blah[i][32] += 0.5; // fix 32 grid rows when growing
      multiplier++;
    }

    if (blah[i][19] ===2) {
      blah[i][22]= multiplier*myMult-Math.floor(multiplier*myMult); //22 growDecimal
      blah[i][23]=Math.floor((blah[i][32]-1)*blah[i][22])+1; //23 7gon place
      blah[i][32] += 0.5  - (blah[i][26]+0.5)/2; // fix 32 grid rows when growing
      multiplier++;
    }

    if (blah[i][19] === 2 && blah[i][18] === 1.5) {
      blah[i][32] += .5 ; // fix 32 grid rows when growing
    }

    blah[i].push(blah[i][31]/blah[i][32]); // 33 angPerGrid
    blah[i].push((blah[i][17]-blah[i][16])/blah[i][32]); // 34 fixRadPerGrid

    if (blah[i][19] === 2 && blah[i][18] === 0.5) {
      blah[i][32] += .5 ; // fix 32 grid rows when growing
    }

    if (i>0 && blah[i-1][19]===0) {
      blah[i][32]= Math.floor((blah[i-1][23]*2+blah[i-1][26]-blah[i][26])/2);
    }

//if (i===blah.length-2) {blah[i][32]*=2; blah[i][33]*=.5; blah[i][34]*=.5;}

    for (let j = 0; j<= blah[i][32]; j++) {
      let nextGrid = [];
      nextGrid.push(blah[i][13]);
      nextGrid.push(blah[i][26]+2*j);
      nextGrid.push(Math.cos(blah[i][28]+j*blah[i][33])*(blah[i][6]+j*edgeLen*blah[i][34])+blah[i][4]);
      nextGrid.push(Math.sin(blah[i][28]+j*blah[i][33])*(blah[i][6]+j*edgeLen*blah[i][34])+blah[i][5]);
  //    pointList.push([nextGrid[2],nextGrid[3],1]);
      let hepta = 1;
//if (i===blah.length-2) {hepta = 0;}
      if (blah[i][19] === 0) { 
        if (blah[i][23]*2+blah[i][26] === nextGrid[1]) {
          hepta = blah[i][19]; 
//if (i===blah.length-2) {hepta = 0;}
          j -= 0.5;
        }
      }
      if (blah[i][19] === 2) { 
        if (blah[i][23]*2+blah[i][26] === nextGrid[1]) {
          hepta = blah[i][19]; 
//if (i===blah.length-2) {hepta = 0;}
          for (let k = j+.5; k<= blah[i][32]; k++) {
            nextGrid.push(hepta);
            gridLine.push(nextGrid);
            nextGrid = [blah[i][13]];
            nextGrid.push(blah[i][26]+2*k);
            nextGrid.push(Math.cos(blah[i][28]+k*blah[i][33])*(blah[i][6]+k*edgeLen*blah[i][34])+blah[i][4]);
            nextGrid.push(Math.sin(blah[i][28]+k*blah[i][33])*(blah[i][6]+k*edgeLen*blah[i][34])+blah[i][5]);
 //           pointList.push([nextGrid[2],nextGrid[3],1]);
            hepta = 1;
//if (i===blah.length-2) {hepta = 0;}
          } // end k loop
          nextGrid.push(hepta);
          gridLine.push(nextGrid);
          gridList.push(gridLine);
          gridLine = []; 
          blah[i][6] += edgeLen;
          continue;
     //     j -= 0.5;
        }
      }
      nextGrid.push(hepta);
      gridLine.push(nextGrid);
    } // end j loop
    gridList.push(gridLine);
  } // end i loop

//  goSaveFill(gridList);
//  goSaveFill(blah);

  makeDiamond(gridList);

//  goSaveFill(gridList);
//  goSaveFill(blah);
 newMerge();
 draw();
} // end twoArcs()





function ob() {
// this one is a good curve for tip
  Ax = 20000;
  By = 20000;

  let curveNumSides = 1248;
  let curveRadius = 398.72;
  let curveY = 409.11;

  let newPoly = [];
  for (let i = 938; i<990;i++) {
    let newAngle = i/curveNumSides*2*Math.PI;
    let newX = (Math.cos(newAngle)*curveRadius);
    let newY = (Math.sin(newAngle)*curveRadius)+curveY;
    newPoly.push([pointList.length,[0,0]]);
    pointList.push([newX,newY,-1]); // -1 locked, 1 unlocked
  }
  polyList.push(newPoly);
  // and the straight line
  for (let x = -569.92+400.46; x<570+400.46; x+=569.92*2/571) {
    pointList.push([x,0,-1]);
  }

} 


function arcLine() {
// we will find the arcs to a horizontal line
  Ax = 20000;
  By = 20000;
  let blah = [];
//  let edgeLen = 2;
  let gridList = [];
//  let curveNumSides = 1248;
//  let curveRadius = 398.72;
//  let curveY = 409.11;
//  let starti = 938.5;
//  let endi = 988;
//  let convex = 1; // 1 or -1
//  let bigStart = 1.5; // .5 or 1.5

  let curveNumSides = parseInt(prompt("Number of sides?"));
  let curveRadius = parseFloat(prompt("Curve radius?"));
  let curveY = parseFloat(prompt("Y value of center?"));
  let starti = parseFloat(prompt("Start i? (> "+(curveNumSides*.75) + ")"));
  let endi = parseFloat(prompt("End i? (< "+ curveNumSides + ")"));
  let convex = parseInt(prompt("Enter 1 for concave. -1 for convex."));
  let bigStart = parseFloat(prompt("Start position? Enter 1.5 or 0.5."));
  let edgeTheory = Math.sin(Math.PI/curveNumSides)*curveRadius*2;
  let edgeLen =  parseFloat(prompt("Edge length? (In theory is " + edgeTheory + ".)"));

  for (let i = starti; i<endi;i++) {
    let newAngle = i/curveNumSides*2*Math.PI;
    let bigPtX = (Math.cos(newAngle)*curveRadius); //0
    let bigPtY = (Math.sin(newAngle)*curveRadius+curveY); //1
    let arcCentX = bigPtX-(curveY-bigPtY)*bigPtY/bigPtX; //4
    let arcCentY = 0; // 5
    let arcRad = Math.sqrt((arcCentX-bigPtX)**2 + (arcCentY-bigPtY)**2); //6
    let lilPtX = arcCentX+convex*arcRad;  //2
    let lilPtY = 0; //3
    let arcAng1 = Math.atan2(bigPtY-arcCentY,bigPtX-arcCentX); //7
    let arcAng2 = Math.atan2(lilPtY-arcCentY,lilPtX-arcCentX); //8
    let arcDist = (-arcAng2+arcAng1)*arcRad; //9 (switch order as needed if convex or concave?)
    let arcNumRows = arcDist/Math.sqrt(3)/edgeLen; //10
    let arcRoundRows = Math.round(arcNumRows); //11
    let arcRowParity = arcRoundRows%2; // 12
    let bigIndex = i-starti+bigStart; //13
    let bigParity = bigIndex%2; //14
    let bothParity = (bigParity+arcRowParity)%2; //15
    let lilIndex = convex*(lilPtX-(-569.92+400.46))/(569.92*2/571); //16
    let pickLilIndex = Math.round((lilIndex+1-bothParity)/2)*2-1+bothParity; //17
    let lilParity = pickLilIndex%2; //18
    blah.push([bigPtX,bigPtY,lilPtX,lilPtY,arcCentX,arcCentY,arcRad,arcAng1,arcAng2,arcDist,arcNumRows,            arcRoundRows,arcRowParity,bigIndex,bigParity,bothParity,lilIndex,pickLilIndex,lilParity,1,0,0,0,0]);

  }

//goSaveFill(blah);
//blah = nextBlah;
//alert(blah);

  for (let i = 0;i<blah.length-1;i++) {
    if (blah[i+1][17]<blah[i][17]) {
      let switching = blah[i][17];
//      blah[i][17] = blah[i+1][17];
//      blah[i+1][17] = switching;
    }
  }

  for (let i = 0;i<blah.length-1;i++) {
   // [19] usually stays 1. If 0, big increases. if 2, lil increases.
    blah[i][19]=blah[i+1][17]-blah[i][17]; // 19 grow
    if (i<2) {blah[i][19]=1}

//   if (blah[i][19]===0) {blah[i-1][20]=1} // 20 Big (unused)
//    if (blah[i][19]===2) {blah[i-1][21]=1} // 21 Lil (unused)
  }
  let myMult = (Math.sqrt(5)+1)/2-1;
  let multiplier = 1;
  for (let i = 0;i<blah.length-1;i++) {
//    if (blah[i][20]+blah[i][21]>0) {
    let gridLine = [];
    blah[i].push(blah[i][7]-blah[i][8]); // 24 arcAngTot
    blah[i].push(blah[i][24]/blah[i][10]); // 25 angPerRow
    if (blah[i][14]===1.5) {blah[i].push(-0.5)}
      else {blah[i].push(0.5)} // 26 startGridCoord
    blah[i].push(-blah[i][26]*blah[i][25]); // 27 startAdd
    blah[i].push(blah[i][27]+blah[i][7]); // 28 gridStart
    if (blah[i][18]===1.5) {blah[i].push(-0.5*blah[i][25])}
      else {blah[i].push(0.5*blah[i][25])} // 29 endAdd
    blah[i].push(blah[i][29]+blah[i][8]); // 30 gridEnd
    blah[i].push(blah[i][30]-blah[i][28]); // 31 gridAngTot
    blah[i].push((blah[i][18]+blah[i][14]-2+blah[i][11])/2); // 32 gridRows
  
    if (blah[i][19] === 0) {
      blah[i][22]= multiplier*myMult-Math.floor(multiplier*myMult); //22 growDecimal
      blah[i][23]=Math.floor((blah[i][32]-1)*blah[i][22])+1; //23 7gon place
      blah[i][32] += 0.5; // fix 32 grid rows when growing
      multiplier++;
    }

    if (blah[i][19] ===2) {
      blah[i][22]= multiplier*myMult-Math.floor(multiplier*myMult); //22 growDecimal
      blah[i][23]=Math.floor((blah[i][32]-1)*blah[i][22])+1; //23 7gon place
  //    blah[i][32] += 0.5  - (blah[i][26]+0.5)/2; // fix 32 grid rows when growing
      multiplier++;
    }

    if (blah[i][19] ===2) {
      blah[i][32] += 0.5;
    }

    if (blah[i][19] ===2) {
      blah[i][32] -= (blah[i][26]+0.5)/2;
    }

    if (blah[i][19] === 2 && blah[i][18] === 0.5) {
      blah[i][32] += .5 ; // fix 32 grid rows when growing
    }

    if (blah[i][19] === 2 && blah[i][18] === 0.5 && blah[i][26] === -.5) {
      blah[i][32] -= 1 ; // fix 32 grid rows when growing
    }



    blah[i].push(blah[i][31]/blah[i][32]); // 33 angPerGrid
    blah[i].push((blah[i][17]-blah[i][16])/blah[i][32]); // 34 fixRadPerGrid

    if (blah[i][19] === 2 && blah[i][18] === 1.5) {
//      blah[i][32] += .5 ; // fix 32 grid rows when growing
    }

    if (blah[i][19] === 2 && blah[i][18] === 0.5) {
      blah[i][32] += .5 ; // fix 32 grid rows when growing
    }



    if (i>0 && blah[i-1][19]===0) {
      blah[i][32]= Math.floor((blah[i-1][23]*2+blah[i-1][26]-blah[i][26])/2);
    }

//if (i===blah.length-2) {blah[i][32]*=2; blah[i][33]*=.5; blah[i][34]*=.5;}

    for (let j = 0; j<= blah[i][32]; j++) {
      let nextGrid = [];
      nextGrid.push(blah[i][13]);
      nextGrid.push(blah[i][26]+2*j);
      nextGrid.push(Math.cos(blah[i][28]+j*blah[i][33])*(blah[i][6]+j*edgeLen*blah[i][34])+blah[i][4]);
      nextGrid.push(Math.sin(blah[i][28]+j*blah[i][33])*(blah[i][6]+j*edgeLen*blah[i][34])+blah[i][5]);
      pointList.push([nextGrid[2],nextGrid[3],1]);
      let hepta = 1;
//if (i===blah.length-2) {hepta = 0;}
      if (blah[i][19] === 0) { 
        if (blah[i][23]*2+blah[i][26] === nextGrid[1]) {
          hepta = blah[i][19]; 
//if (i===blah.length-2) {hepta = 0;}
          j -= 0.5;
        }
      }
      if (blah[i][19] === 2) { 
        if (blah[i][23]*2+blah[i][26] === nextGrid[1]) {
          hepta = blah[i][19]; 
//if (i===blah.length-2) {hepta = 0;}
 //         blah[i][6] += edgeLen;
          for (let k = j+.5; k<= blah[i][32]; k++) {
            nextGrid.push(hepta);
            gridLine.push(nextGrid);
            nextGrid = [blah[i][13]];
            nextGrid.push(blah[i][26]+2*k);
            nextGrid.push(Math.cos(blah[i][28]+k*blah[i][33])*(blah[i][6]+k*edgeLen*blah[i][34])+blah[i][4]);
            nextGrid.push(Math.sin(blah[i][28]+k*blah[i][33])*(blah[i][6]+k*edgeLen*blah[i][34])+blah[i][5]);
           pointList.push([nextGrid[2],nextGrid[3],1]);
            hepta = 1;
//if (i===blah.length-2) {hepta = 0;}
          } // end k loop
          nextGrid.push(hepta);
          gridLine.push(nextGrid);
          gridList.push(gridLine);
          gridLine = []; 
          blah[i][6] += edgeLen;
          continue;
    //      j -= 0.5;
        }
      }
      nextGrid.push(hepta);
      gridLine.push(nextGrid);
    } // end j loop
    gridList.push(gridLine);
  } // end i loop


//  goSaveFill(gridList);
//  goSaveFill(blah);

  makeDiamond(gridList,convex);
//alert("done");
  newMerge();
  draw();
} // end arcLine()


function findNewPts(i, inv2CentY, inv2Rad, bigCent2Y, midLineY, edgeLen) {

  let yAdder = -220;
  let newAngle = i/2024*2*Math.PI;
  let bigPtX = (Math.cos(newAngle)*322.13)*edgeLen; //0
  let bigPtY = (Math.sin(newAngle)*322.13+yAdder)*edgeLen; //1

  let bigPtDist = Math.sqrt((bigPtY-inv2CentY)**2 + bigPtX*bigPtX); // dist
  let bigPtDist2 = inv2Rad*inv2Rad/bigPtDist; // newDist
  let bigPt2X = bigPtX/bigPtDist*bigPtDist2; // K(x)
  let bigPt2Y = (bigPtY-inv2CentY)/bigPtDist*bigPtDist2+inv2CentY; // K(y)
  let arcCent2X = bigPt2X+(bigPt2Y-bigCent2Y)/bigPt2X*(bigPt2Y-midLineY); // CentX
//  let arcCent2Y = midLineY; // CentY

  let lilPt2X = bigPt2X; // K(x')
  let lilPt2Y = 2*midLineY-bigPt2Y; // K(y')
  let lilPtDist2 = Math.sqrt((lilPt2Y-inv2CentY)**2 + lilPt2X * lilPt2X); // dist
  let lilPtDist = inv2Rad*inv2Rad/lilPtDist2; // newDist
  let lilPtX = lilPt2X/lilPtDist2*lilPtDist; // new x //2
  let lilPtY = (lilPt2Y-inv2CentY)/lilPtDist2*lilPtDist+inv2CentY; // new y //3
//alert([lilPtX, lilPtY]);

  let altPt2X = arcCent2X+Math.sqrt((bigPt2Y-midLineY)**2 + (bigPt2X-arcCent2X)**2); // Px
  let altPt2Y = midLineY; // Py
  let altPtDist2 = Math.sqrt((altPt2Y-inv2CentY)**2 + altPt2X*altPt2X); // dist
  let altPtDist = inv2Rad*inv2Rad/altPtDist2; // newDist
  let altPtX = altPt2X/altPtDist2*altPtDist; // new x
  let altPtY = (altPt2Y-inv2CentY)/altPtDist2*altPtDist+inv2CentY; // new y

  let arcCentPt = findCirCent(bigPtX,bigPtY,lilPtX,lilPtY,altPtX,altPtY); // 4 & 5
//alert([bigPtX, bigPtY, altPtX, altPtY, lilPtX, lilPtY, arcCentPt[0],arcCentPt[1]]);
  let arcRad = Math.sqrt( (arcCentPt[0]-bigPtX)**2 + (arcCentPt[1]-bigPtY)**2 ); //6
  let arcAng1 = Math.atan2(bigPtY-arcCentPt[1],bigPtX-arcCentPt[0]); //7
  let arcAng2 = Math.atan2(lilPtY-arcCentPt[1],lilPtX-arcCentPt[0]); //8
  let arcDist = (arcAng2-arcAng1)*arcRad; //9
  let arcNumRows = arcDist/Math.sqrt(3)/edgeLen; //10
  let arcRoundRows = Math.round(arcNumRows); //11
  let arcRowParity = arcRoundRows%2; // 12
  let bigIndex = 479-i; //13
  let bigParity = bigIndex%2; //14
  let bothParity = (bigParity+arcRowParity)%2; //15
  let lilIndex = 285.1773744650518-Math.acos(lilPtX/2/199.36)/2/Math.PI*1248; //16
  let pickLilIndex = Math.round((lilIndex+1-bothParity)/2)*2-1+bothParity; //17
  let lilParity = pickLilIndex%2; //18

//alert([arcRowParity,iParity,bothParity,lilIndex,pickLilIndex]);

//  return([bigPtX,bigPtY,lilPtX,lilPtY,altPtX,altPtY,arcCentPt[0],arcCentPt[1]]);
  return([bigPtX,bigPtY,lilPtX,lilPtY,arcCentPt[0],arcCentPt[1],arcRad,arcAng1,arcAng2,arcDist,arcNumRows,      arcRoundRows,arcRowParity,bigIndex,bigParity,bothParity,lilIndex,pickLilIndex,lilParity,1,0,0,0,0]);
} // end findNewPts()


function goSaveFill(blah) {
  asOutput = "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34\r\n";
  asOutput = asOutput.concat("hiPtX, hiPtY, loPtX, loPtY, arcCentX, arcCentY, arcRad, arcAng1, arcAng2, arcDist, arcNumRows, arcRoundRows, arcRowParity, hiIndex, hiParity, bothParity, loIndex, pickLoIndex, loParity, grow, hi, lo, growDecimal, 7gonPlace, arcAngTot, angPerRow, startGridCoord, startAdd, gridStart, endAdd, gridEnd, gridAngTot, gridRows, angPerGrid, fixRadPerGrid\r\n");
  blah.forEach(function(ptListing) {
      asOutput = asOutput.concat(JSON.stringify(ptListing)+"\r\n");
  });

  let thisFile = "filling";
  txtToFile(asOutput,thisFile,"txt");
}

function goLoadFill() {
  var c = document.getElementById("myCanvas");
  var context = c.getContext("2d");

  const file = document.getElementById("loadFill").files[0];
  const reader = new FileReader();

  reader.addEventListener("load", function () {
    var lines = reader.result.split(/\r\n|\n/);
    init();
    var curLen = lines.length-1;
    nextBlah = [];
    for (i = 1;i<curLen;i++) {
      var coords = lines[i].split(",");
      newBlah.push(parseFloat(coords[0]));
    }
  },false);

  if (file) {
    reader.readAsText(file);
  }
} // end goLoadFill()



function findCirCent(ax,ay,bx,by,cx,cy) {
// find circle center from three points on circle
  let thisX = ((by-cy)*(ax*ax-bx*bx)/(ay-by)/2+(cy*cy-by*by)/2+(cx*cx-bx*bx)/2+(by-cy)*(ay+by)/2)/
          ((cx-bx)+(cy-by)*(bx-ax)/(ay-by));
  let thisY = (thisX - (ax+bx)/2)*(bx-ax)/(ay-by)+(ay+by)/2;
  return([thisX,thisY]);
}

function do2024() {
let xMult = 2;
let yMult = 2;
let yAdder = -220;
sized = 12;
yOffset = 180;
xOffset = -10;
  var c = document.getElementById("myCanvas");
  var context = c.getContext("2d");
  c.height = (window.innerHeight-135)*sized;
  c.width = (window.innerWidth-195)*sized;

  Ax = 20000;
  By = 20000;
  let newPoly = [];
  for (let i = 253; i<507;i++) {
    let newAngle = i/2024*2*Math.PI;
    let newX = (Math.cos(newAngle)*322.13)*xMult;
    let newY = (Math.sin(newAngle)*322.13+yAdder)*yMult;
    pointList.push([newX,newY,-1]); // -1 since locked
    newPoly.push([i-253,[0,0]]);
  }
  polyList.push(newPoly);

  newPoly = [];
  for (let i = 936; i<1171;i++) {
    let newAngle = i/1248*2*Math.PI;
    let newX = (Math.cos(newAngle)*199.36)*xMult;
    let newY = (Math.sin(newAngle)*199.36 + 523.23+yAdder)*yMult;
    pointList.push([newX,newY,-1]); // -1 since locked
    newPoly.push([i-936+253+1,[0,0]]);
  }
  polyList.push(newPoly);

  newPoly = [];
  for (let i = 546; i<781;i++) {
    let newAngle = i/1248*2*Math.PI;
    let newX = (Math.cos(newAngle)*199.36 + 369.98)*xMult;
    let newY = (Math.sin(newAngle)*199.36 + 369.98+yAdder)*yMult;
    pointList.push([newX,newY,-1]); // -1 since locked
    newPoly.push([i-546+253+234+2,[0,0]]);
  }
  polyList.push(newPoly);

} // end do2024


function noTranslates() {
  newPtList = [];
  newPolyList = [];
  polyList.forEach(function(nextPoly) {
    var rawPoly = polyAddRaw(nextPoly);
    newPolyList.push(rawPoly);
    rawPoly.forEach(function(rawPt) {
      if (JSON.stringify(rawPt[1]) != "[0,0]") {
        var alreadyPt = newPtList.indexOf(rawPt);
        if (alreadyPt < 0) {newPtList.push(rawPt)}
      }
    });
  });
  var oldPtLen = pointList.length;
  newPtList.forEach(function(nextPt) {
    var isLocked = pointList[nextPt[0]][2];
    pointList.push([nextPt[2][0],nextPt[2][1],isLocked]);
  });
  polyList = [];
  newPolyList.forEach(function(rawPoly) {
    var betterPoly = [];
    rawPoly.forEach(function(rawPt) {
      if (JSON.stringify(rawPt[1]) != "[0,0]") 
        {
          var indexPt = newPtList.indexOf(rawPt);
          betterPoly.push([indexPt+oldPtLen,[0,0]]);
        } else {
          betterPoly.push([rawPt[0],[rawPt[1][0],rawPt[1][1]]]);
        }
    });
    polyList.push(betterPoly);
  });
} // end noTranslates()

function rotOrig() {
  let myAngle = parseFloat(prompt("How many degrees to rotate?"));
  noTranslates();
  pointList.forEach(function(nextPt) {
    let x = nextPt[0];
    let y = nextPt[1];
    let ang = myAngle*Math.PI/180; 
    nextPt[0]= Math.cos(ang)*x+Math.sin(ang)*y;
    nextPt[1]= -Math.sin(ang)*x+Math.cos(ang)*y;
  });
  draw();
}

function rot180() {
  let myX = 2*parseFloat(prompt("What is the X coordinate?"));
  let myY = 2*parseFloat(prompt("What is the Y coordinate?"));
  pointList.forEach(function(nextPt) {
    nextPt[0]= myX-nextPt[0];
    nextPt[1]= myY-nextPt[1];
  });
  polyList.forEach(function(nextPoly) {
    nextPoly.forEach(function(nextPt) {
      nextPt[1][0] *= -1;
      nextPt[1][1] *= -1;
    });
  });
  draw();
}

function reflY() {
  noTranslates();
  pointList.forEach(function(nextPt) {
    nextPt[0]= -nextPt[0];
  });
  polyList.forEach(function(nextPoly) {
    nextPoly.reverse();
  });
  draw();
}

function trans() {
  let myX = 2*parseFloat(prompt("What is the X translate?"));
  let myY = 2*parseFloat(prompt("What is the Y translate?"));
  pointList.forEach(function(nextPt) {
    nextPt[0] += myX;
    nextPt[1] += myY;
  });
  draw();
}

function isEven(num) {
  let isEven = (num/2 === Math.floor(num/2));
  return(isEven);
}

function setZoom() {
  sized = parseFloat(document.getElementById("zoom").value);
  draw();
}

function setXOffset() {
  xOffset = parseFloat(document.getElementById("xOffset").value);
  draw();
}

function setYOffset() {
  yOffset = parseFloat(document.getElementById("yOffset").value);
  draw();
}

function oct6363() {
  let octRad = parseFloat(prompt("What is the distance: center to midpoint?"));
  let numSeg = parseFloat(prompt("How many segments?"));
  let numLayer = parseInt(prompt("How many layers?"));
  let halfEdge = octRad * Math.tan(22.5*Math.PI/180);
  let segSize = 2*halfEdge/numSeg;
  let triSize = segSize*.8;
  for (let i = 0;i <= numSeg;i++) {
    pointList.push([-halfEdge+i*segSize, octRad, -1]);
  } // end i loop

  for (let i = 0;i < numSeg;i++) {
    for (let j = 0;j<numLayer;j++) {
      let baseX = -halfEdge+i*segSize;
      let baseY = octRad + j*2*triSize;
      if (isEven(i+j)) {
        let newPoly = [];
        newPoly.push([baseX,baseY,1]);
        newPoly.push([baseX+segSize,baseY,1]);
        newPoly.push([baseX+1.5*segSize,baseY+triSize,1]);
        newPoly.push([baseX+segSize,baseY+2*triSize,1]);
        newPoly.push([baseX,baseY+2*triSize,1]);
        newPoly.push([baseX-0.5*segSize,baseY+triSize,1]);
        addPoly(newPoly);
      } else {
        let newPoly = [];
        newPoly.push([baseX,baseY,1]);
        newPoly.push([baseX+segSize,baseY,1]);
        newPoly.push([baseX+0.5*segSize,baseY+triSize,1]);
        addPoly(newPoly);
        newPoly= [];
        newPoly.push([baseX+0.5*segSize,baseY+triSize,1]);
        newPoly.push([baseX+segSize,baseY+2*triSize,1]);
        newPoly.push([baseX,baseY+2*triSize,1]);
        addPoly(newPoly);
      }     
    }
  }
  dropDup();
  draw();
} // end oct6363()

function oct884() {
  Ax = 20000;
  By = 20000;
  let oct2Rad = parseFloat(prompt("What is the distance: center to bottom midpoint?"));
  let sqDiam = 2*oct2Rad;
  let nFlat = parseInt(prompt("How many octagons along the bottom?"));
  let exactTilt = nFlat/(Math.sqrt(2)+2)*(Math.sqrt(2)+1);
  let nTilt = parseInt(prompt("How many octagons diagonally? (In theory we have " + exactTilt + " octagons.)"));
  let bigSq = nFlat+2*nTilt-4;
  let myOct = sqDiam/bigSq;
  let octEdge = myOct/(1+Math.sqrt(2));
  let oct1 = octEdge/Math.sqrt(2);
  let oct2 = oct1 + octEdge;
  let octBase = (bigSq/2+1)*myOct;
  let octRad = Math.sqrt(octEdge*octEdge/4+myOct*myOct/4);
  let octAngle = Math.PI/8;
  for (let i = 0; i<nTilt;i++) {
    let cornerX = -octBase + i*myOct;
    for (let j = 0;j<nTilt-i;j++) {
      let cornerY = octBase - j*myOct;
      addRegPoly(4,cornerX,cornerY,oct1,0,-1);
      addRegPoly(8,cornerX+myOct/2,cornerY-myOct/2,octRad,octAngle,-1);
    } // end j loop
  } // end i loop
  for (let i = 1; i<nTilt;i++) {
    let j = nTilt-i-1;
    let cornerX = -octBase + i*myOct;
    let cornerY = octBase - j*myOct;
    addRegPoly(4,cornerX,cornerY-myOct,oct1,0,-1);
    let point1 = [cornerX,cornerY-myOct-oct1,-1];
    let point2 = [cornerX,cornerY-myOct-oct2,-1];
    let point3 = [cornerX+0.5*oct2,cornerY-myOct-0.5*oct2,-1];
    let point4 = [cornerX+oct2,cornerY-myOct,-1];
    let point5 = [cornerX+oct1,cornerY-myOct,-1];
    addPoly([point3,point5,point1]);
    addPoly([point3,point4,point5]);
    addPoly([point3,point1,point2]);
  }
  cornerY = octBase;
  for (let i = nTilt; i<nFlat+nTilt-2;i++) {
    let cornerX = -octBase + i*myOct;
    addRegPoly(4,cornerX,cornerY,oct1,0,-1);
    addRegPoly(8,cornerX+myOct/2,cornerY-myOct/2,octRad,octAngle,-1);
  }
  addRegPoly(4,-octBase+(nFlat+nTilt-2)*myOct,cornerY,oct1,0,-1);
  dropDup();
} // end oct884()

function getMode() {
var getMode = document.querySelector('input[name="mode"]:checked');   
if(getMode != null) {   
          alert("Selected radio button values is: " + getMode.value);  
  }
}

function goLeft() {
//  if (xOffset < w-50) {xOffset += 50;}
xOffset += 50;
  draw();
}

function goRight() {
//  if (xOffset >= 50) {xOffset -= 50;}
xOffset -= 50;
  draw();
}

function goUp() {
//  if (yOffset < h-10) {yOffset += 10;}
yOffset += 50;
  draw();
}

function goDown() {
//  if (yOffset>=10) {yOffset -= 10;}
yOffset -= 50;
  draw();
}

function goGrow() {
  sized *= 1.2;
  var c = document.getElementById("myCanvas");
  var context = c.getContext("2d");
  c.height = (window.innerHeight-135)*sized;
  c.width = (window.innerWidth-195)*sized;
  draw();
}

function goShrink() {
  sized /= 1.2;
  var c = document.getElementById("myCanvas");
  var context = c.getContext("2d");
  c.height = (window.innerHeight-135)*sized;
  c.width = (window.innerWidth-195)*sized;
  draw();
}

function goDraw() {
  mode = 0;
}

function goErase() {
  mode = 1;
  curPoly = [];
}

function goLock() {
  mode = 2;
}

function goExplode() {
  mode = 3;
}

function goMove() {
  mode = 4;
}

function goHex() {
  mode = 5;
}

function goPentL() {
  mode = 6;
}

function goPentR() {
  mode = 7;
}

function goHept() {
  mode = 8;
}

function goPentTop() {
  mode = 9;
}

function goReg() {
  makeRegular();
  draw();
}

function goReg2() {
  makeRegular2();
  draw();
}

function mapPt(rawPt, mapping) {
  var X = rawPt[0]+mapping[0]*Ax + mapping[1]*Bx;
  var Y = rawPt[1]+mapping[0]*Ay + mapping[1]*By;
  return  [X,Y] ;
}

function invMapPt(rawPt, mapping) {
  var X = rawPt[0]-mapping[0]*Ax - mapping[1]*Bx;
  var Y = rawPt[1]-mapping[0]*Ay - mapping[1]*By;
  return  [X,Y] ;
}

function avePts(ptList) {
  var xSum=0;
  var ySum=0;
  ptList.forEach(function(pt) {
    xSum+= pt[0];
    ySum+= pt[1];
  });
  xSum /= ptList.length;
  ySum /= ptList.length;
  return [xSum, ySum];
}

function avePolar(polyRawPolar,centPt) {
// input polygon and center, average the polar coordinates to find best fit regular polygon, 
// output vote where to move pointList, (have the polygon given clockwise.)
  var rNew = 0;
  var tBase = 0;
  var vertNum = 0;
  var numVert = polyRawPolar.length;
  var startT = polyRawPolar[0][3][1];
  var lastT = 0;
  polyRawPolar.forEach(function(ptMapRawPolar) {
    ptMapRawPolar[3][1] -= startT;
    if (ptMapRawPolar[3][1] < lastT) {
      ptMapRawPolar[3][1] += 2*Math.PI;
    };
   });
  polyRawPolar.forEach(function(ptMapRawPolar) {
    rNew += ptMapRawPolar[3][0];
    var addBaseT = ptMapRawPolar[3][1] - vertNum*2*Math.PI/numVert;
    addBaseT %= (2*Math.PI);
    addBaseT += (2*Math.PI);
    addBaseT %= (2*Math.PI);
    if (addBaseT>Math.PI) {addBaseT -= (2*Math.PI)};
    tBase += addBaseT;
    vertNum += 1;
  });
  tBase /= numVert;
  tBase += startT;
  rNew /= numVert;
  var PtVoteList = [];
  var maxDist = Number.MAX_VALUE;
  var bestCount = 0;
  for (counter = -2;counter<3;counter++) {
    var sumDist = 0;
    vertNum = 0;
    polyRawPolar.forEach(function(ptMapRawPolar) {
      var tNew = tBase + (vertNum+counter)*2*Math.PI/numVert;
      var newX = centPt[0] + rNew*Math.cos(tNew);
      var newY = centPt[1] + rNew*Math.sin(tNew);
      var thisDist = Math.sqrt((newX-ptMapRawPolar[2][0])**2+(newY-ptMapRawPolar[2][1])**2);
      sumDist += thisDist;
      vertNum += 1;
    });
    if (sumDist<maxDist) {maxDist = sumDist; bestCount=counter;};
  } // end counter
  vertNum = 0;
  polyRawPolar.forEach(function(ptMapRawPolar) {
    var tNew = tBase + (vertNum+bestCount)*2*Math.PI/numVert;
    var newX = centPt[0] + rNew*Math.cos(tNew);
    var newY = centPt[1] + rNew*Math.sin(tNew);
    var newPt = invMapPt([newX,newY], ptMapRawPolar[1]);
    PtVoteList.push([ptMapRawPolar[0],newPt]);
    vertNum += 1;
  });
  return (PtVoteList);
} // end avePolar

function avePolar2(polyRawPolar,centPt, bestLen) {
// input polygon, center and best edge length, average the polar coordinates to find best fit regular polygon, 
// output vote where to move pointList, (have the polygons given clockwise.)
//  var rNew = 0;
  var tBase = 0;
  var vertNum = 0;
  var numVert = polyRawPolar.length;
//alert(bestLen);
  var rNew = bestLen/2/Math.sin(Math.PI/numVert);

  polyRawPolar.forEach(function(ptMapRawPolar) {
    vertNum += 1;
 //   rNew += ptMapRawPolar[3][0];
    var addBaseT = ptMapRawPolar[3][1] + vertNum*2*Math.PI/numVert;
    addBaseT %= (2*Math.PI);
    addBaseT += (2*Math.PI);
    addBaseT %= (2*Math.PI);
    if (addBaseT>Math.PI) {addBaseT -= (2*Math.PI)};
    tBase += addBaseT;
  });
  tBase /= numVert;
//  rNew /= numVert;
  var PtVoteList = [];
  var maxDist = rNew*numVert*2;
  var bestCount = 10;
  for (counter = -2;counter<3;counter++) {
    var sumDist = 0;
    vertNum = 0;
    polyRawPolar.forEach(function(ptMapRawPolar) {
      vertNum += 1;
      var tNew = tBase - (vertNum+counter)*2*Math.PI/numVert;
      var newX = centPt[0] + rNew*Math.cos(tNew);
      var newY = centPt[1] + rNew*Math.sin(tNew);
      var thisDist = Math.sqrt((newX-ptMapRawPolar[2][0])**2+(newY-ptMapRawPolar[2][1])**2);
      sumDist += thisDist;
    });
    if (sumDist<maxDist) {maxDist = sumDist; bestCount=counter;};
  } // end counter
  vertNum = 0;
  polyRawPolar.forEach(function(ptMapRawPolar) {
    vertNum += 1;
    var tNew = tBase - (vertNum+bestCount)*2*Math.PI/numVert;
    var newX = centPt[0] + rNew*Math.cos(tNew);
    var newY = centPt[1] + rNew*Math.sin(tNew);
    var newPt = invMapPt([newX,newY], ptMapRawPolar[1]); 
    PtVoteList.push([ptMapRawPolar[0],newPt]);
  });
  return (PtVoteList);
} // end avePolar2()

function rect2Polar(rect) {
  var x = rect[0];
  var y = rect[1];
  var radius = Math.sqrt(x*x+y*y);
  var theta;
  if (x === 0) {
    if (y < 0) { theta = 3*Math.PI/2; }
      else { theta = Math.PI/2;}
    } 
    else { theta = Math.atan(y/x);}
  if (x < 0) {theta += Math.PI;}
  if (theta < 0) {theta +=2*Math.PI;}
  return [radius, theta];
}

function addPolar(polyRaw, centPt) {
  var polyRawPolar = [];
  polyRaw.forEach(function(ptMapRaw) {
    var vecX = ptMapRaw[2][0]-centPt[0];
    var vecY = ptMapRaw[2][1]-centPt[1];
    var vecPolar = rect2Polar([vecX, vecY]);
    polyRawPolar.push([ptMapRaw[0],ptMapRaw[1],ptMapRaw[2],vecPolar]);
  });
  return polyRawPolar;
}

function polyRaw2Cent(polyRaw) {
  var rawPtList = [];
  polyRaw.forEach(function(ptMapRaw) {
    rawPtList.push(ptMapRaw[2]);
  });
  var centPt = avePts(rawPtList);
  return centPt ;
}

function polyAddRaw(poly) {
  var polyRaw = [];
  poly.forEach(function(ptMap) {
    var rawPt = mapPt(pointList[ptMap[0]],ptMap[1]);
    polyRaw.push([ptMap[0],ptMap[1],rawPt]);
  });
  return polyRaw;
}

function makeRegular() {
// this will try to make the polygons regular
  var PtVoteList = [];
  polyList.forEach(function(poly) {
    var polyRaw = polyAddRaw(poly);
    var centPt = polyRaw2Cent(polyRaw);
    var polyRawPolar = addPolar(polyRaw, centPt);
    // sort by descending angle so all polygons have same orientation
    // polyRawPolar.sort((A,B)=> B[3][1]-A[3][1]);
    PtVoteList = PtVoteList.concat(avePolar(polyRawPolar,centPt));
  });
  // sort point list by index
  PtVoteList.sort((A,B) => A[0]-B[0]);
  var curPt = 0;
  var votesByPt = [];
  var avePtVote=[];
  // average all votes for where to move the point
  PtVoteList.forEach(function(ptVote) {
    if (curPt === ptVote[0]) {votesByPt.push(ptVote[1]);}
    else { 
      avePtVote.push([curPt,avePts(votesByPt)]);
      curPt = ptVote[0];
      votesByPt = [ptVote[1]];
      };
  });
  avePtVote.push([curPt,avePts(votesByPt)]);
  for (i = 0;i<avePtVote.length;i++) {
    if (pointList[avePtVote[i][0]][2] === 1) { // only move unlocked points
      pointList[avePtVote[i][0]] = [avePtVote[i][1][0],avePtVote[i][1][1],1]; 
    }
  }
} // end makeRegular


function makeRegular2() {
// this will try to make the polygons regular. It aims at all edges the same length.
  var bestLen = avEdgeLen();
  var PtVoteList = [];
  polyList.forEach(function(poly) {
    var polyRaw = polyAddRaw(poly);
    var centPt = polyRaw2Cent(polyRaw);
    var polyRawPolar = addPolar(polyRaw, centPt);
    // sort by descending angle so all polygons have same orientation
    polyRawPolar.sort((A,B)=> B[3][1]-A[3][1]);
    PtVoteList = PtVoteList.concat(avePolar2(polyRawPolar,centPt,bestLen));
  });
  // sort point list by index
  PtVoteList.sort((A,B) => A[0]-B[0]);
  var curPt = 0;
  var votesByPt = [];
  var avePtVote=[];
  // average all votes for where to move the point
  PtVoteList.forEach(function(ptVote) {
    if (curPt === ptVote[0]) {votesByPt.push(ptVote[1]);}
    else { 
      avePtVote.push([curPt,avePts(votesByPt)]);
      curPt = ptVote[0];
      votesByPt = [ptVote[1]];
      };
  });
  avePtVote.push([curPt,avePts(votesByPt)]);

  for (i = 0;i<avePtVote.length;i++) {
    if (pointList[avePtVote[i][0]][2] === 1) { // only move unlocked points
      pointList[avePtVote[i][0]] = [avePtVote[i][1][0],avePtVote[i][1][1],1]; 
    }
  }
} // end makeRegular2

function avEdgeLen() {
// find average edge length
  var edgeLens = [];
  polyList.forEach(function(poly) {
    var lastPtMap = poly[poly.length-1];
    var lastRawPt = mapPt(pointList[lastPtMap[0]],lastPtMap[1]);
    poly.forEach(function(ptMap) {
      var rawPt = mapPt(pointList[ptMap[0]],ptMap[1]);
      var length = Math.sqrt((lastRawPt[0]-rawPt[0])**2+(lastRawPt[1]-rawPt[1])**2);
      edgeLens.push(length);
      lastPtMap = ptMap;
      lastRawPt = rawPt;
    });   
  });
  return(edgeLens.reduce((A,B) => A+B, 0) / edgeLens.length);
}

function minEdgeLen() {
// find minimum edge length
  let minLen = Ax+Ay+Bx+By;
  polyList.forEach(function(poly) {
    var lastPtMap = poly[poly.length-1];
    var lastRawPt = mapPt(pointList[lastPtMap[0]],lastPtMap[1]);
    poly.forEach(function(ptMap) {
      var rawPt = mapPt(pointList[ptMap[0]],ptMap[1]);
      var length = Math.sqrt((lastRawPt[0]-rawPt[0])**2+(lastRawPt[1]-rawPt[1])**2);
      if (length < minLen) {minLen = length}
      lastPtMap = ptMap;
      lastRawPt = rawPt;
    });   
  });
  return(minLen);
}

function composeMaps(map1, map2) {
// compose two mappings. First map1() then map2()
  return([map1[0]+map2[0],map1[1]+map2[1]]);
}

function invMap(map) {
// returns the inverse of a mapping.
  return([-map[0],-map[1]]);
}

function dragMergePts() {
// merges two points when you drag one atop the other.
  mergePts(ptMap1,ptMap2);
  ptMap2 = -1;
  dropUnused();
}

function mergePts(keepPtMap, mergePtMap) {
// this replaces mergePtMap with keepPtMap in polyList. Doesn't drop unused.
  let oldPt = keepPtMap[0];
  let oldMap = keepPtMap[1];
  let newPt = mergePtMap[0];
  let newMap = mergePtMap[1];
  let jointMap = composeMaps(invMap(oldMap),newMap);
  polyList.forEach(function(myPoly) {
    myPoly.forEach(function(myPtMap) {
      if (myPtMap[0] === oldPt) {
        myPtMap[0]=newPt;
        myPtMap[1]=composeMaps(jointMap,myPtMap[1]);
      }
    });
  });
}

function txtToFile(content, filename, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], {type: "text/plain", endings: "native"});
  
  a.href= URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href);
};

function goSave() {
  asOutput = "vectors:\r\n";
  asOutput = asOutput.concat(""+Ax+","+Ay+"\r\n");
  asOutput = asOutput.concat(""+Bx+","+By+"\r\n");
  asOutput = asOutput.concat("points:"+"\r\n");
  pointList.forEach(function(point) {
    asOutput = asOutput.concat(""+point[0]+","+point[1]+","+point[2]+"\r\n");
  });
  polyList.forEach(function(poly) {
    asOutput = asOutput.concat("poly:"+"\r\n");
    poly.forEach(function(ptMap) {
      asOutput = asOutput.concat(""+ptMap[0]+","+ptMap[1][0]+","+ptMap[1][1]+"\r\n");
    });
  });
  asOutput = asOutput.concat("end"+"\r\n");
  let thisFile = document.getElementById("myFile").value;
  txtToFile(asOutput,thisFile,"txt");
}

function svgToFile(content, filename, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], {type: "image/svg+xml", endings: "native"});
  
  a.href= URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href);
};

function goSvg() {
  var asOutput = '<svg height="500" width="600">\r\n';
  polyList.forEach(function(poly) {
    asOutput = asOutput.concat('<polygon points="\r\n'); 
    poly.forEach(function(ptMap) {
      var sPoint = "" + (pointList[ptMap[0]][0]+ptMap[1][0]*Ax+ptMap[1][1]*Bx) 
                 + "," + (pointList[ptMap[0]][1]+ptMap[1][0]*Ay+ptMap[1][1]*By);
      asOutput = asOutput.concat(sPoint,"\r\n");
    });
    asOutput = asOutput.concat('" style="fill:white;stroke:black;stroke-width:1" />\r\n'); 
  });

  asOutput = asOutput.concat('</svg>');
  let thisFile = document.getElementById("myFile").value;
  svgToFile(asOutput,thisFile,"svg");
}

function findPoint(point) {
// find point close to current point, or -1 if none.
  let newPt = newCoords(point,[Ax,Ay],[Bx,By]);
  let i = Math.round(newPt[0]);
  let j = Math.round(newPt[1]);
  newPt[0] = point[0]-i*Ax-j*Bx;
  newPt[1] = point[1]-i*Ay-j*By;
  for (pt = 0;pt<pointList.length;pt++) {
    let newPt2 = newCoords(pointList[pt],[Ax,Ay],[Bx,By]);
    let i2 = Math.round(newPt2[0]);
    let j2 = Math.round(newPt2[1]);
    newPt2[0] = pointList[pt][0]-i2*Ax-j2*Bx;
    newPt2[1] = pointList[pt][1]-i2*Ay-j2*By;
    if (Math.abs(newPt[0]-newPt2[0])<=boxSize/sized 
      && Math.abs(newPt[1]-newPt2[1])<=boxSize/sized)
    {return [pt,[i-i2,j-j2]];}
  }
  return([-1]);
}

function findNewPoint(point) {
// find point close to current point, or -1 if none. BUT exclude point ptMap1
  let newPt = newCoords(point,[Ax,Ay],[Bx,By]);
  let i = Math.round(newPt[0]);
  let j = Math.round(newPt[1]);
  newPt[0] = point[0]-i*Ax-j*Bx;
  newPt[1] = point[1]-i*Ay-j*By;
  for (pt = 0;pt<pointList.length;pt++) {
    if (pt != ptMap1[0]) {
      let newPt2 = newCoords(pointList[pt],[Ax,Ay],[Bx,By]);
      let i2 = Math.round(newPt2[0]);
      let j2 = Math.round(newPt2[1]);
      newPt2[0] = pointList[pt][0]-i2*Ax-j2*Bx;
      newPt2[1] = pointList[pt][1]-i2*Ay-j2*By;
      if (Math.abs(newPt[0]-newPt2[0])<=boxSize/sized 
        && Math.abs(newPt[1]-newPt2[1])<=boxSize/sized)
      {return [pt,[i-i2,j-j2]];}
    }
  }
  return([-1]);
}

function newCoords(point,vect1,vect2) {
// return point in (vect1,vect2) coord. system
  let denom = vect1[0]*vect2[1]-vect1[1]*vect2[0];
  let newX = point[0]*vect2[1]-point[1]*vect2[0];
  let newY = vect1[0]*point[1]-vect1[1]*point[0];
  return([newX/denom,newY/denom]);
}

function mouseMoved(event) {
  var c = document.getElementById("myCanvas");
  var cRect = c.getBoundingClientRect();        
  var canvasX = Math.round(event.clientX - cRect.left);  
  var canvasY = Math.round(event.clientY - cRect.top);
  posi = [canvasX/sized+xOffset,canvasY/sized+yOffset,1];
  let pointName = JSON.stringify(findPoint(posi));
  if (pointName === "[-1]") {
    document.getElementById("coords").value ="("+(canvasX/sized+xOffset)+"," + (canvasY/sized+yOffset)+")";
  } else {
    let nowPtMap = JSON.parse(pointName);
    let nowPtX = Math.round((pointList[nowPtMap[0]][0]+nowPtMap[1][0]*Ax+nowPtMap[1][1]*Bx)*100)/100;
    let nowPtY = Math.round((pointList[nowPtMap[0]][1]+nowPtMap[1][0]*Ay+nowPtMap[1][1]*By)*100)/100;
    document.getElementById("coords").value=JSON.stringify(pointName)+" raw:"+nowPtX+","+nowPtY;
  }

//move points
  if (posi1 != 0 && mode===4) {
    ptMap2 = findNewPoint(posi);
//document.getElementById("coords").value = JSON.stringify(ptMap2);


    pointList[ptMap1[0]]=[oldPoint[0]-posi1[0]+posi[0],
                          oldPoint[1]-posi1[1]+posi[1],1];
    draw();
  }
//move vectors
  if (posi1 != 0 && mode>10) {
    if (mode ===11) {
      baseX = oldPoint[0]-posi1[0]+posi[0];
      baseY = oldPoint[1]-posi1[1]+posi[1];
    }
    if (mode ===12) {
      Ax = oldPoint[0]-posi1[0]+posi[0]-baseX;
      Ay = oldPoint[1]-posi1[1]+posi[1]-baseY;
    }
    if (mode ===13) {
      Bx = oldPoint[0]-posi1[0]+posi[0]-baseX;
      By = oldPoint[1]-posi1[1]+posi[1]-baseY;
    }
    draw();
  }
}

function mouseClicked(event) {
  var c = document.getElementById("myCanvas");
  var cRect = c.getBoundingClientRect();        
  var canvasX = Math.round(event.clientX - cRect.left);  
  var canvasY = Math.round(event.clientY - cRect.top);
  posi = [canvasX/sized+xOffset,canvasY/sized+yOffset,1]; 
  var ptMap= findPoint(posi);
  if (mode ===0) {drawPoint(ptMap);}
  if (mode ===1) {erasePoint(ptMap);}
  if (mode ===2) {lockPoint(ptMap);}
  if (mode ===3) {bombPoint(ptMap);}
  if (mode ===5) {hexPoint(ptMap);}
  if (mode ===6) {pentLPoint(ptMap);}
  if (mode ===7) {pentRPoint(ptMap);}
  if (mode ===8) {heptPoint(ptMap);}
  if (mode ===9) {pentTopPoint(ptMap);}
  draw();
}

function mousePressed(event) {
  if (posi1 === 0 && mode===4) {
    // move point
    var c = document.getElementById("myCanvas");
    var cRect = c.getBoundingClientRect();        
    var canvasX = Math.round(event.clientX - cRect.left);  
    var canvasY = Math.round(event.clientY - cRect.top);
    posi1 = [canvasX/sized+xOffset,canvasY/sized+yOffset];
    ptMap1= findPoint(posi1);
    if (ptMap1[0]<0) { 
      // not on point
      mode = onVector();
      if (mode===4) {posi1=0;}
    }
    else { 
      if (pointList[ptMap1[0]][2] === 1) {
        // unlocked
        oldPoint = pointList[ptMap1[0]]; 
      } else {
        // locked
        posi1 = 0;
      }
    }
  }
}

function mouseReleased(event) {
  if (ptMap2 != -1) {
    dragMergePts();
  }
  if (posi1 != 0 && mode===4) {
    posi1 = 0;
  }
  if (posi1 != 0 && mode>10) {
    mode=4;
    posi1 = 0;
  }
  draw();
}

function onVector() {
  var onVec = 4;
  if (Math.abs(posi1[0]-baseX)<=boxSize/sized 
         && Math.abs(posi1[1]-baseY)<=boxSize/sized )
          {onVec = 11; oldPoint = posi1;};
  if (Math.abs(posi1[0]-baseX-Ax)<=boxSize/sized 
         && Math.abs(posi1[1]-baseY-Ay)<=boxSize/sized )
          {onVec = 12;oldPoint = posi1;};
  if (Math.abs(posi1[0]-baseX-Bx)<=boxSize/sized 
         && Math.abs(posi1[1]-baseY-By)<=boxSize/sized )
          {onVec = 13;oldPoint = posi1;};
  return(onVec);
}

function erasePoint(ptMap) {
  if (ptMap[0]>=0) {
// remove point
    var pointless = ptMap[0];
    var newPointList = [];
    for (i=0;i<pointless;i++) {
      newPointList[i]=pointList[i];
     }
    for (i=pointless+1;i<pointList.length;i++) {
      newPointList[i-1]=pointList[i];
    }
   pointList = newPointList;

// remove polys that had that point
    var newPolyList = [];
    polyList.forEach(function(poly) {
      var keepPoly = 1;
      poly.forEach(function(ptMap) {
        if (ptMap[0] === pointless) {keepPoly = 0;}
        if (ptMap[0] > pointless) {ptMap[0]--;}
      });
      if (keepPoly === 1) {newPolyList.push(poly)}
    });
    polyList = newPolyList;
  }
}

function drawPoint(ptMap) {
//add new point
  if (ptMap[0]<0) { 
    ptMap= [pointList.length,[0,0]]; // crashes if you add lock...
    pointList.push(posi); 
  }
//if we return to polygon starting point
  if (JSON.stringify(ptMap) === JSON.stringify(curPoly[0])) {
    // make curPoly clockwise
    var rawPoly = polyAddRaw(curPoly);
    var areaSum = 0;
    for (i=0;i<curPoly.length-1;i++) {
      var nextAdder = (rawPoly[i+1][2][0]-rawPoly[i][2][0])*(rawPoly[i+1][2][1]+rawPoly[i][2][1]);
      areaSum +=nextAdder;
    }
    areaSum += (rawPoly[0][2][0]-rawPoly[rawPoly.length-1][2][0])*
       (rawPoly[0][2][1]+rawPoly[rawPoly.length-1][2][1]);
    if (areaSum>0) {curPoly.reverse()}

    polyList.push(curPoly);
    curPoly = [];
    }
//add point to current polygon
  else {
    curPoly.push(ptMap); 
    }

}

function hexPoint(ptMap) {
//add new point
  if (ptMap[0]<0) { 
    ptMap= [pointList.length,[0,0]]; // crashes if you add lock...?
    pointList.push(posi); 
  }   
  curPoly.push(ptMap); 
//if this is third point. complete shapes.
  if (curPoly.length===3) {
    var rawPt0 = mapPt(pointList[curPoly[0][0]],curPoly[0][1]);
    var rawPt1 = mapPt(pointList[curPoly[1][0]],curPoly[1][1]);
    var rawPt2 = mapPt(pointList[curPoly[2][0]],curPoly[2][1]);
    let mid0 = findPoint([(rawPt0[0]+rawPt1[0])/2,(rawPt0[1]+rawPt1[1])/2]);
    if (mid0<0) {
      pointList.push([(rawPt0[0]+rawPt1[0])/2,(rawPt0[1]+rawPt1[1])/2,1]);
      mid0= [pointList.length-1,[0,0]]; // crashes if you add lock...?
    }
    let mid1 = findPoint([(rawPt1[0]+rawPt2[0])/2,(rawPt1[1]+rawPt2[1])/2]);
    if (mid1<0) {
      pointList.push([(rawPt1[0]+rawPt2[0])/2,(rawPt1[1]+rawPt2[1])/2,1]);
      mid1= [pointList.length-1,[0,0]]; // crashes if you add lock...?
    }
    let myMid = [(rawPt0[0]+rawPt2[0])/2,(rawPt0[1]+rawPt2[1])/2];
    let midXDiff = rawPt0[0]-myMid[0];
    let midYDiff = rawPt0[1]-myMid[1];
    let vert3 = [myMid[0]+0.577*midYDiff,myMid[1]-0.577*midXDiff];
    let mid2 = findPoint([(rawPt2[0]+vert3[0])/2,(rawPt2[1]+vert3[1])/2]);
    if (mid2<0) {
      pointList.push([(rawPt2[0]+vert3[0])/2,(rawPt2[1]+vert3[1])/2,1]);
      mid2= [pointList.length-1,[0,0]]; // crashes if you add lock...?
    }
    let mid3 = findPoint([(rawPt0[0]+vert3[0])/2,(rawPt0[1]+vert3[1])/2]);
    if (mid3<0) {
      pointList.push([(rawPt0[0]+vert3[0])/2,(rawPt0[1]+vert3[1])/2,1]);
      mid3= [pointList.length-1,[0,0]]; // crashes if you add lock...?
    }
    pointList.push([myMid[0]+0.577*midYDiff,myMid[1]-0.577*midXDiff,1]);
    vert3= [pointList.length-1,[0,0]]; // crashes if you add lock...?
    let newPoly = [];
    newPoly.push(curPoly[0]);
    newPoly.push(mid0);
    newPoly.push(mid3);
    polyList.push(JSON.parse(JSON.stringify(newPoly)));
    newPoly = [];
    newPoly.push(mid0);
    newPoly.push(curPoly[1]);
    newPoly.push(mid1);
    newPoly.push(mid2);
    newPoly.push(vert3);
    newPoly.push(mid3);
    polyList.push(JSON.parse(JSON.stringify(newPoly)));
    newPoly = [];
    newPoly.push(mid1);
    newPoly.push(curPoly[2]);
    newPoly.push(mid2);
    polyList.push(JSON.parse(JSON.stringify(newPoly)));
    curPoly = [];
  }
} // end hexPoint()


function heptPoint(ptMap) {
//add new point
  if (ptMap[0]<0) { 
    ptMap= [pointList.length,[0,0]]; // crashes if you add lock...?
    pointList.push(posi); 
  }   
  curPoly.push(ptMap); 
//if this is third point. complete shapes.
  if (curPoly.length===3) {
    var rawPt0 = mapPt(pointList[curPoly[0][0]],curPoly[0][1]);
    var rawPt1 = mapPt(pointList[curPoly[1][0]],curPoly[1][1]);
    var rawPt2 = mapPt(pointList[curPoly[2][0]],curPoly[2][1]);
    let mid0 = findPoint([(rawPt0[0]+rawPt1[0])/2,(rawPt0[1]+rawPt1[1])/2]);
    if (mid0<0) {
      pointList.push([(rawPt0[0]+rawPt1[0])/2,(rawPt0[1]+rawPt1[1])/2,1]);
      mid0= [pointList.length-1,[0,0]]; // crashes if you add lock...?
    }
    let mid1 = findPoint([(rawPt1[0]+rawPt2[0])/2,(rawPt1[1]+rawPt2[1])/2]);
    if (mid1<0) {
      pointList.push([(rawPt1[0]+rawPt2[0])/2,(rawPt1[1]+rawPt2[1])/2,1]);
      mid1= [pointList.length-1,[0,0]]; // crashes if you add lock...?
    }
    let myMid = [(rawPt0[0]+rawPt2[0])/2,(rawPt0[1]+rawPt2[1])/2];
    let midXDiff = rawPt0[0]-myMid[0];
    let midYDiff = rawPt0[1]-myMid[1];
    let vertTop = [myMid[0]+0.6*midYDiff,myMid[1]-0.6*midXDiff];
    let vert3 = [vertTop[0]*.8+rawPt2[0]*.2,vertTop[1]*.8+rawPt2[1]*.2];
    let vert4 = [vertTop[0]*.8+rawPt0[0]*.2,vertTop[1]*.8+rawPt0[1]*.2];
    let mid2 = findPoint([(rawPt2[0]+vert3[0])/2,(rawPt2[1]+vert3[1])/2]);
    if (mid2<0) {
      pointList.push([(rawPt2[0]+vert3[0])/2,(rawPt2[1]+vert3[1])/2,1]);
      mid2= [pointList.length-1,[0,0]]; // crashes if you add lock...?
    }
    let mid3 = findPoint([(rawPt0[0]+vert4[0])/2,(rawPt0[1]+vert4[1])/2]);
    if (mid3<0) {
      pointList.push([(rawPt0[0]+vert4[0])/2,(rawPt0[1]+vert4[1])/2,1]);
      mid3= [pointList.length-1,[0,0]]; // crashes if you add lock...?
    }
    pointList.push([vertTop[0]*.8+rawPt2[0]*.2,vertTop[1]*.8+rawPt2[1]*.2,1]);
    vert3= [pointList.length-1,[0,0]]; // crashes if you add lock...?
    pointList.push([vertTop[0]*.8+rawPt0[0]*.2,vertTop[1]*.8+rawPt0[1]*.2,1]);
    vert4= [pointList.length-1,[0,0]]; // crashes if you add lock...?
    let newPoly = [];
    newPoly.push(curPoly[0]);
    newPoly.push(mid0);
    newPoly.push(mid3);
    polyList.push(JSON.parse(JSON.stringify(newPoly)));
    newPoly = [];
    newPoly.push(mid0);
    newPoly.push(curPoly[1]);
    newPoly.push(mid1);
    newPoly.push(mid2);
    newPoly.push(vert3);
    newPoly.push(vert4);
    newPoly.push(mid3);
    polyList.push(JSON.parse(JSON.stringify(newPoly)));
    newPoly = [];
    newPoly.push(mid1);
    newPoly.push(curPoly[2]);
    newPoly.push(mid2);
    polyList.push(JSON.parse(JSON.stringify(newPoly)));
    curPoly = [];
  }
} // end heptPoint()

function pentTopPoint(ptMap) {
//add new point
  if (ptMap[0]<0) { 
    ptMap= [pointList.length,[0,0]]; // crashes if you add lock...?
    pointList.push(posi); 
  }   
  curPoly.push(ptMap); 
//if this is third point. complete shapes.
  if (curPoly.length===3) {
    var rawPt0 = mapPt(pointList[curPoly[0][0]],curPoly[0][1]);
    var rawPt1 = mapPt(pointList[curPoly[1][0]],curPoly[1][1]);
    var rawPt2 = mapPt(pointList[curPoly[2][0]],curPoly[2][1]);
    let mid0 = findPoint([(rawPt0[0]+rawPt1[0])/2,(rawPt0[1]+rawPt1[1])/2]);
    if (mid0<0) {
      pointList.push([(rawPt0[0]+rawPt1[0])/2,(rawPt0[1]+rawPt1[1])/2,1]);
      mid0= [pointList.length-1,[0,0]]; // crashes if you add lock...?
    }
    let mid1 = findPoint([(rawPt1[0]+rawPt2[0])/2,(rawPt1[1]+rawPt2[1])/2]);
    if (mid1<0) {
      pointList.push([(rawPt1[0]+rawPt2[0])/2,(rawPt1[1]+rawPt2[1])/2,1]);
      mid1= [pointList.length-1,[0,0]]; // crashes if you add lock...?
    }

    pointList.push([(rawPt0[0]+2*rawPt2[0])/3,(rawPt0[1]+2*rawPt2[1])/3,1]);
    let top1 = [pointList.length-1,[0,0]]; // crashes if you add lock...?

    pointList.push([(2*rawPt0[0]+rawPt2[0])/3,(2*rawPt0[1]+rawPt2[1])/3,1]);
    let top2 = [pointList.length-1,[0,0]]; // crashes if you add lock...?

    let newPoly = [];
    newPoly.push(curPoly[0]);
    newPoly.push(mid0);
    newPoly.push(top2);
    polyList.push(JSON.parse(JSON.stringify(newPoly)));
    newPoly = [];
    newPoly.push(mid0);
    newPoly.push(curPoly[1]);
    newPoly.push(mid1);
    newPoly.push(top1);
    newPoly.push(top2);
    polyList.push(JSON.parse(JSON.stringify(newPoly)));
    newPoly = [];
    newPoly.push(mid1);
    newPoly.push(curPoly[2]);
    newPoly.push(top1);
    polyList.push(JSON.parse(JSON.stringify(newPoly)));
    curPoly = [];
  }
} // end pentTopPoint()

function lockPoint(ptMap) {
  if (ptMap[0] >-1) {
    pointList[ptMap[0]][2] *= -1;
  }
}

function bombPoint(ptMap) {
  polyList.forEach(function(myPoly) {
    myPoly.forEach(function(myPtMap) {
      if (myPtMap[0] === ptMap[0]) {
        myPtMap[0] = pointList.length;
        pointList.push(pointList[ptMap[0]]);
      } // end if
    }); // end myPoly loop
  }); // end polyList loop
  document.getElementById("move").checked = true;
  mode = 4;
  dropUnused();
}

function loadMyTiling() {
  var c = document.getElementById("myCanvas");
  var context = c.getContext("2d");

  const file = document.getElementById("loadTiling").files[0];
  const reader = new FileReader();

  reader.addEventListener("load", function () {
    var lines = reader.result.split(/\r\n|\n/);
    init();
    var curLen = lines.length-1;
    var setPoly = 0;
    for (i = 1;i<curLen;i++) {
      if (lines[i] === "points:") { setPoly = 1; continue;}
      if (lines[i] === "poly:") { setPoly = 2; curPoly = []; continue;}
      if (lines[i] === "end") { draw(); break;}
      var coords = lines[i].split(",");
      if (i===1) {Ax = parseFloat(coords[0]);Ay=parseFloat(coords[1])}
      if (i===2) {Bx = parseFloat(coords[0]);By=parseFloat(coords[1])}

      if (setPoly === 1) {
        if (coords.length === 2) {
          pointList.push([parseFloat(coords[0]),parseFloat(coords[1]),1]);
        }  else {
          pointList.push([parseFloat(coords[0]),parseFloat(coords[1]),parseFloat(coords[2])]);
        } 
      }
      if (setPoly === 2) {
        curPoly.push( [parseInt(coords[0]),[parseInt(coords[1]),parseInt(coords[2])]] );
        if (lines[i+1] === "poly:") {polyList.push(curPoly);curPoly = [];};
        if (lines[i+1] === "end") {polyList.push(curPoly);curPoly = [];};
      }
    }
  },false);

  if (file) {
    reader.readAsText(file);
  }
} // end loadMyTiling()

function mergeMyTiling() {
  var c = document.getElementById("myCanvas");
  var context = c.getContext("2d");

  const file = document.getElementById("mergeTiling").files[0];
  const reader = new FileReader();

  reader.addEventListener("load", function () {
    var lines = reader.result.split(/\r\n|\n/);
 //   init();
    var curLen = lines.length-1;
    var setPoly = 0;
    for (i = 1;i<curLen;i++) {
      if (lines[i] === "points:") { setPoly = 1; continue;}
      if (lines[i] === "poly:") { setPoly = 2; curPoly = []; continue;}
      if (lines[i] === "end") { draw(); break;}
      var coords = lines[i].split(",");
      if (i===1) {newAx = parseFloat(coords[0]);newAy=parseFloat(coords[1])}
      if (i===2) {newBx = parseFloat(coords[0]);newBy=parseFloat(coords[1])}

      if (setPoly === 1) {
        if (coords.length === 2) {
          newPointList.push([parseFloat(coords[0]),parseFloat(coords[1]),1]);
        }  else {
          newPointList.push([parseFloat(coords[0]),parseFloat(coords[1]),parseFloat(coords[2])]);
        } 
      }
      if (setPoly === 2) {
        curPoly.push( [parseInt(coords[0]),[parseInt(coords[1]),parseInt(coords[2])]] );
        if (lines[i+1] === "poly:") {newPolyList.push(curPoly);curPoly = [];};
        if (lines[i+1] === "end") {newPolyList.push(curPoly);curPoly = [];};
      }
    }
    if (newAx === Ax && newAy === Ay && newBx === Bx && newBy === By) {
      let oldPtLen = pointList.length;
      let oldPolyLen = polyList.length;
      mergeAdd(oldPtLen);
 //     mergeDropDup(oldPtLen,oldPolyLen);
      newMerge();
      newPointList = [];
      newPolyList = [];
      draw();
    } else {
      alert("We can only merge if vectors match.");
      newPointList = [];
      newPolyList = [];
    }
  },false);

  if (file) {
    reader.readAsText(file);
  }
} // end mergeMyTiling()

function mergeAdd(oldPtLen) {
  pointList = pointList.concat(newPointList);
  newPolyList.forEach(function(myNewPoly) {
    myNewPoly.forEach(function(myPoint) {
      myPoint[0] += oldPtLen;
    });
  });
  polyList = polyList.concat(newPolyList);
}

function mergeDropDup(oldPtLen,oldPolyLen) {
  let joinDist = minEdgeLen()/4;
  let vectDenom = Ax*By-Ay*Bx;
  for (let i = 0;i<oldPtLen;i++) {
    for (let j = oldPtLen;j<pointList.length;j++) {
      let xDiff = pointList[i][0]-pointList[j][0];
      let yDiff = pointList[i][1]-pointList[j][1];
      let Acoord = (xDiff*By-yDiff*Bx)/vectDenom;
      let Bcoord = (Ax*yDiff-Ay*xDiff)/vectDenom;
      let roundA = Math.round(Acoord);
      let roundB = Math.round(Bcoord);
      let absXDiff = Math.abs(xDiff - roundA*Ax-roundB*Bx);
      let absYDiff = Math.abs(yDiff - roundA*Ay-roundB*By); 
//alert([i,j,absXDiff+absYDiff,joinDist]);
      if (absXDiff+absYDiff<joinDist) {
//alert(JSON.stringify([pointList[i],pointList[j],roundA,roundB]));
        for (let k = oldPolyLen;k<polyList.length;k++) {
          polyList[k].forEach(function(nextPt) {
            if (nextPt[0] === j) {
              nextPt[0] = i;
              nextPt[1][0] = nextPt[1][0]-roundA;
              nextPt[1][1] = nextPt[1][1]-roundB;
            } // end if 
          }); // end polyList loop
        } // end k loop
      } // end if
    } // end j loop
  } // end i loop
  dropUnused();
 // alert(JSON.stringify([pointList,polyList]));
}

function newMerge() {
// this will merge all points.
  let joinDist = minEdgeLen()/3;
  let vectDenom = Ax*By-Ay*Bx;
  for (let i = 0;i<pointList.length;i++) {
    for (let j = i+1;j<pointList.length;j++) {
      let xDiff = pointList[i][0]-pointList[j][0];
      let yDiff = pointList[i][1]-pointList[j][1];
      let Acoord = (xDiff*By-yDiff*Bx)/vectDenom;
      let Bcoord = (Ax*yDiff-Ay*xDiff)/vectDenom;
      let roundA = Math.round(Acoord);
      let roundB = Math.round(Bcoord);
      let absXDiff = Math.abs(xDiff - roundA*Ax-roundB*Bx);
      let absYDiff = Math.abs(yDiff - roundA*Ay-roundB*By); 
//alert([i,j,absXDiff+absYDiff,joinDist]);
      if (absXDiff+absYDiff<joinDist) {
//alert(JSON.stringify([pointList[i],pointList[j],roundA,roundB]));
        for (let k = 0;k<polyList.length;k++) {
          polyList[k].forEach(function(nextPt) {
            if (nextPt[0] === j) {
              nextPt[0] = i;
              nextPt[1][0] = nextPt[1][0]-roundA;
              nextPt[1][1] = nextPt[1][1]-roundB;
            } // end if 
          }); // end polyList loop
        } // end k loop
      } // end if
    } // end j loop
  } // end i loop
  dropUnused(); // keep locked points
//  dropUnused2(); // drop all lone points
} // end newMerge()

function dropDup() {
  let joinDist = minEdgeLen()/3;
  let vectDenom = Ax*By-Ay*Bx;
  for (let i = 0;i<pointList.length-1;i++) {
    for (let j = i+1;j<pointList.length;j++) {
      let xDiff = pointList[i][0]-pointList[j][0];
      let yDiff = pointList[i][1]-pointList[j][1];
      let Acoord = (xDiff*By-yDiff*Bx)/vectDenom;
      let Bcoord = (Ax*yDiff-Ay*xDiff)/vectDenom;
      let roundA = Math.round(Acoord);
      let roundB = Math.round(Bcoord);
      let absXDiff = Math.abs(xDiff - roundA*Ax-roundB*Bx);
      let absYDiff = Math.abs(yDiff - roundA*Ay-roundB*By); 
//alert([i,j,absXDiff+absYDiff,joinDist]);
      if (absXDiff+absYDiff<joinDist) {
//alert(JSON.stringify([pointList[i],pointList[j],roundA,roundB]));
        for (let k = 0;k<polyList.length;k++) {
          polyList[k].forEach(function(nextPt) {
            if (nextPt[0] === j) {
              nextPt[0] = i;
              nextPt[1][0] = nextPt[1][0]-roundA;
              nextPt[1][1] = nextPt[1][1]-roundB;
            } // end if 
          }); // end polyList loop
        } // end k loop
      } // end if
    } // end j loop
  } // end i loop
  dropUnused();
 // alert(JSON.stringify([pointList,polyList]));
}

function newCoords2(point,vect1,vect2) {
// return point in (vect1,vect2) coord. system
  let denom = vect1[0]*vect2[1]-vect1[1]*vect2[0];
  let newX = point[0]*vect2[1]-point[1]*vect2[0];
  let newY = vect1[0]*point[1]-vect1[1]*point[0];
  return([newX/denom,newY/denom]);


      let i2 = Math.round(newPt2[0]);
      let j2 = Math.round(newPt2[1]);
      newPt2[0] = pointList[pt][0]-i2*Ax-j2*Bx;
      newPt2[1] = pointList[pt][1]-i2*Ay-j2*By;
}

function mergeFindPt(point) {
// find point close to current point, or -1 if none. BUT exclude point ptMap1
  let newPt = newCoords(point,[Ax,Ay],[Bx,By]);
//  let i = Math.round(newPt[0]);
//  let j = Math.round(newPt[1]);
//  newPt[0] = point[0]-i*Ax-j*Bx;
//  newPt[1] = point[1]-i*Ay-j*By;
  for (pt = 0;pt<pointList.length;pt++) {
    if (pt != ptMap1[0]) {
      let newPt2 = newCoords(pointList[pt],[Ax,Ay],[Bx,By]);
//      let i2 = Math.round(newPt2[0]);
//      let j2 = Math.round(newPt2[1]);
//      newPt2[0] = pointList[pt][0]-i2*Ax-j2*Bx;
//      newPt2[1] = pointList[pt][1]-i2*Ay-j2*By;
      if (Math.abs(newPt[0]-newPt2[0])<=boxSize/sized 
        && Math.abs(newPt[1]-newPt2[1])<=boxSize/sized)
      {return [pt,[i-i2,j-j2]];}
    }
  }
  return([-1]);
}

function loadMyImage() {
  init();
  var c = document.getElementById("myCanvas");
  var context = c.getContext("2d");

  img = new Image();
  const file = document.getElementById("loadImage").files[0];
  const reader = new FileReader();
  init();

  reader.addEventListener("load", function () {
    img.onload = function() {
      img_width = img.width;
      img_height = img.height;
      context.canvas.width = img.width+100;
      context.canvas.height = img.height+100;
      context.drawImage(img, 50, 50);
      draw();
    };
    img.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

function dropUnused() {
// drop unused points
  let usedPts = [];
  for (let i = 0; i<pointList.length; i++) {
    usedPts.push(-1);
    if (pointList[i][2] === -1) {usedPts[i] = 1} // Don't drop locked points
  }
  polyList.forEach(function(myPoly) {
    myPoly.forEach(function(myPtMap) {
      usedPts[myPtMap[0]] = 1;
    });
  });
  let newPtList = [];
  for (let i = 0; i<usedPts.length; i++) {
    if (usedPts[i]>-1) {
      usedPts[i] = newPtList.length;
      newPtList.push(pointList[i]);
    }
  }
  polyList.forEach(function(myPoly) {
    myPoly.forEach(function(myPtMap) {
      myPtMap[0] = usedPts[myPtMap[0]];
    });
  });
  pointList = JSON.parse(JSON.stringify(newPtList));
  draw();
}

function unlockAll() {
  pointList.forEach(function(nextPt) {
    nextPt[2] = 1;
  });
 draw();
}

function lockAll() {
  pointList.forEach(function(nextPt) {
    nextPt[2] = -1;
  });
 draw();
}

function dropUnused2() {
// drop unused points
  let usedPts = [];
  for (let i = 0; i<pointList.length; i++) {
    usedPts.push(-1);
//    if (pointList[i][2] === -1) {usedPts[i] = 1} // Don't drop locked points
  }
  polyList.forEach(function(myPoly) {
    myPoly.forEach(function(myPtMap) {
      usedPts[myPtMap[0]] = 1;
    });
  });
  let newPtList = [];
  for (let i = 0; i<usedPts.length; i++) {
    if (usedPts[i]>-1) {
      usedPts[i] = newPtList.length;
      newPtList.push(pointList[i]);
    }
  }
  polyList.forEach(function(myPoly) {
    myPoly.forEach(function(myPtMap) {
      myPtMap[0] = usedPts[myPtMap[0]];
    });
  });
  pointList = JSON.parse(JSON.stringify(newPtList));
  draw();
}


function draw() {
document.getElementById("zoom").value = sized;
document.getElementById("xOffset").value = xOffset;
document.getElementById("yOffset").value = yOffset;
  var c = document.getElementById("myCanvas");
  var context = c.getContext("2d");
  context.rect(0,0,c.width,c.height);
  context.fillStyle = "white";
  context.fill();
  var cRect = c.getBoundingClientRect();        
  var canvasX = Math.round(event.clientX - cRect.left);  
  var canvasY = Math.round(event.clientY - cRect.top);

// draw image
  if (img) {
    w=img.width;
    h=img.height;
    var minX = -xOffset*sized;
    var minY = -yOffset*sized;
//    context.drawImage(img,minX,minY,w*sized,h*sized);
context.scale(sized,sized);
      context.drawImage(img, 50, 50);
context.scale(1/sized,1/sized);
  }

// draw vectors
  context.lineWidth = 2;
  context.strokeStyle ="green";
  var oldX = (baseX-xOffset)*sized-boxSize;
  var oldY = (baseY-yOffset)*sized-boxSize;
  context.rect(oldX,oldY,boxSize*2+1,boxSize*2+1);
  context.stroke();
  context.rect(oldX+Ax*sized,oldY+Ay*sized,boxSize*2+1,boxSize*2+1);
  context.stroke();
  context.rect(oldX+Bx*sized,oldY+By*sized,boxSize*2+1,boxSize*2+1);
  context.stroke();
  
  context.beginPath();
  context.moveTo(oldX+boxSize+Ax*sized,oldY+boxSize+Ay*sized);
  context.lineTo(oldX+boxSize,oldY+boxSize);
  context.stroke();
  context.lineTo(oldX+boxSize+Bx*sized,oldY+boxSize+By*sized);
  context.stroke();

// draw points
  context.lineWidth = 2;
  context.strokeStyle ="red";
  pointList.forEach(function(point) {
    var oldX = (point[0]-xOffset)*sized-boxSize;
    var oldY = (point[1]-yOffset)*sized-boxSize;
    for (i = -1;i<2;i++) {
      for (j = -1; j<2;j++) {
        context.beginPath();
        context.strokeStyle ="rgb(255,90,90)";
        if (i===0 && j===0) {context.strokeStyle ="red";}
        if (point[2] === -1) {context.strokeStyle ="black";}
        context.rect(oldX+i*Ax*sized+j*Bx*sized,oldY+i*Ay*sized+j*By*sized,boxSize*2+1,boxSize*2+1);
        context.stroke();
        context.closePath();
      }
    }
  });

// blue outline if a moved point overlaps another
  if (ptMap2 != -1) { // we overlap a point
    var otherPt = pointList[ptMap2[0]];
    var oldX = (otherPt[0]-xOffset)*sized-boxSize-1;
    var oldY = (otherPt[1]-yOffset)*sized-boxSize-1;
    var i = ptMap2[1][0];
    var j = ptMap2[1][1];
    context.beginPath();
    context.strokeStyle ="blue";
    context.rect(oldX+i*Ax*sized+j*Bx*sized-1,oldY+i*Ay*sized+j*By*sized-1,boxSize*2+3,boxSize*2+3);
    context.stroke();
    context.closePath();
  }

// draw polygons
  context.lineWidth = 1;
  context.strokeStyle ="red";
  context.fillStyle = "rgba(175,0,240,0.5)";
  polyList.forEach(function(poly) {
    for (i=-1;i<2;i++) {
      for (j=-1;j<2;j++) {
        context.beginPath();
        context.strokeStyle ="rgb(255,50,50)";
        context.fillStyle = "rgba(175,0,240,0.4)";
        if (i===0 && j===0) {
          context.strokeStyle ="rgb(255,0,0)";
          context.fillStyle = "rgba(175,0,240,0.7)";
        }
        var ptMap1 = poly[0];
        context.moveTo(
         (pointList[ptMap1[0]][0]+(ptMap1[1][0]+i)*Ax+(ptMap1[1][1]+j)*Bx-xOffset)*sized,
         (pointList[ptMap1[0]][1]+(ptMap1[1][0]+i)*Ay+(ptMap1[1][1]+j)*By-yOffset)*sized
        );
        poly.forEach(function(ptMap) {
          context.lineTo(
           (pointList[ptMap[0]][0]+(ptMap[1][0]+i)*Ax+(ptMap[1][1]+j)*Bx-xOffset)*sized,
           (pointList[ptMap[0]][1]+(ptMap[1][0]+i)*Ay+(ptMap[1][1]+j)*By-yOffset)*sized
          );	
        });
        context.closePath();
        context.fill();
        context.stroke();
      }
    }
  });

// draw lines of current polygon
// I don't know why this section really wants to be last...
  context.beginPath();
  context.strokeStyle ="red";
  context.lineWidth = 3;
  for (pt = 1;pt<=curPoly.length;pt++)  {

    context.moveTo(
      (pointList[curPoly[pt-1][0]][0]+curPoly[pt-1][1][0]*Ax+
		curPoly[pt-1][1][1]*Bx-xOffset)*sized,
      (pointList[curPoly[pt-1][0]][1]+curPoly[pt-1][1][0]*Ay+
		curPoly[pt-1][1][1]*By-yOffset)*sized);
    context.lineTo(
      (pointList[curPoly[pt][0]][0]+curPoly[pt][1][0]*Ax+
		curPoly[pt][1][1]*Bx-xOffset)*sized,
      (pointList[curPoly[pt][0]][1]+curPoly[pt][1][0]*Ay+
		curPoly[pt][1][1]*By-yOffset)*sized);
    context.stroke();
  };
}
