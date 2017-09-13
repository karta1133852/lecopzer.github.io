/*  each cell information */
var cell = [];

var elementNum = 136;
var i,j;
/*  cell's id, format is : E1-123 */
var cellOnfocus="0";

/*  record all the class we added */
var classList = [];
/*  課程的節數  */
var classCount = 0;
/*  how much class user added */
var classAddCount = 0;
/*  credit now added  */
var localCredit = 0;
/*  total credits */
var credit = 0;
/*  Html class tag, NOT class name  */
var className;
var content = "";
var lastLoadFile = "";

var NAV_BACKGROUND_COLOR = "#E6EBEE";
var NAV_ONFOCUS_COLOR = "#85D6FF";

/* Let remove item from 'id' or 'class' directly possible */
Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
  for(var k = 0, len = this.length; i < len; i++) {
    if(this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
}

/*  remove whitespace from both sides of a string,    */
/*  and replace 2+ whitespace with single whitespace  */
function mytrim(x) {
  x = x.replace(/^\s+|\s+$/gm, '');
  return x.replace(/\s\s+/gm, ' ');
}
function trimAll(x) {
  return x.replace(/\s+/gm, '');
}

function creditUpdate() {
  document.getElementById("credit").innerHTML = "學分：" + credit;
}

function checkClassInList(maj,num) {
  var s = maj + "-" + num;
  for(i = 0; i < classList.length; i++) {
    if(classList[i].num == s) {
      return 1;
    }
  }
  return 0;
}

function checkConflictAll() {
  if (document.getElementById("conflictShow").checked == true) {
    for (var count = 8; count < elementNum; count++) {
      checkConflict(count);
    }
  }
  else {
    for (var count = 8; count < elementNum; count++) {
      document.getElementById("td"+count).style.backgroundColor = "";
    }
  }
}


function checkConflict(index) {
  if (document.getElementById("conflictShow").checked == true) {
    if (document.getElementById("td"+index).children.length > 1) {
      document.getElementById("td"+index).style.backgroundColor = "#FF9999";
    }
    else {
      document.getElementById("td"+index).style.backgroundColor = "";
    }
  }
  else {
      document.getElementById("td"+index).style.backgroundColor = "";
  }
}

function checkMaj(maj) {
  var type =["A2","A3","A4","A5","A6","AA","AH","AN","A1","A7","A8","A9","AG",
    "B1","B2","B3","B5","K1","K2","K3","K4","K5","K7",
  "C1","C2","C3","C4","L1","L2","L3","L4","L7","LA","VF",
  "F8","E0","E1","E3","E4","E5","E6","E8","E9","N1","N3","N4","N5","N6","N8",
  "F0","F1","F4","F5","F6","F9","P1","P4","P5","P6","P8","N0","NA","NB","NC","Q4",
  "N9","H1","H2","H3","H4","H5",
  "R1","R2","R3","R4","R5","R0","R6","R7","R8","R9","RA","RB","RD","RZ",
  "I2","I3","I5","I6","I7","I8","T2","T3","T6","T7",
  "S1","S2","S3","S4","S5","S6","S7","S8","S9","SA","SB",
  "T1","T4","T8","T9","TA","TB","TC","D2","D4","D5","D8",
  "U2","U6","U5","U7","U1","U3","D2","D4","D5","D8",
  "U2","U6","U5","U7","U1","U3","E2","N2","F7","P7","ND","P9",
  "Q1","Q3","Q5","Q6","Q7","V6","V8","V9","VA","VB","VC","VD","VE","VG","VH","VJ","VK","VL",
  "E7","N7","F2","P2","F3","P3","PA","PB","C5","C6","L5","L6","L8","Z0","Z1","Z2","Z3"];

  for(i=0; i<type.length; i++){
    if(maj==type[i]){
      return 1;
    }
  }
  return 0;
}

function addClass() {
  var maj; 
  var num;
  switch (arguments.length) {
    case 1:
      maj = arguments[0].elements.namedItem("major").value.toUpperCase();
      num = arguments[0].elements.namedItem("num").value;
      break;
    case 2:
      maj = arguments[0].toUpperCase();
      num = arguments[1];
      break;
    default:
      return;
  }

  if(checkClassInList(maj,num)) {
    alert("重複加入");
    return;
  }

  if((result = findAndPrintClass(maj,num))==-1)return;

  classAddCount++;

  /*  print class in the class list */
  var num = result.getElementsByTagName("num")[0].childNodes[0].nodeValue.trim();
  var name = result.getElementsByTagName("name")[0].childNodes[0].nodeValue.trim()
  var _time = result.getElementsByTagName("time")[0].childNodes[0].nodeValue.trim();
  document.getElementById("classList").innerHTML += "<div id='p" + num + "' onclick='listClick(this)'" +
  " onmouseenter='listMouseEnter(this)'>"+
  num + "  " + name + "<span style='float:right;'>" + _time + "</span></div>"
  + "<a id='a" + num + "' style='float:right;margin:13px 13px 0 0;color:red;'"+
  " onclick='iconDelClick(this)' class='material-icons'>clear</a>";
  
  /*  num = 編號, count = 該課的總節數, credit = 該課的學分, 
   *  id = class的名稱(HTML的tag,不是課程名稱)  
   *  content = see pushClassContent()
   */
  classList.push({
    num: num,
    count: classCount,
    credit: localCredit,
    id: className,
    content: content,
  }); 
  creditUpdate();
  registerListInfo(document.getElementById("p" + num));
  /*  clean global variables  */
  className = "";
  localCredit = 0;
  classCount = 0; 
}

function reverseListClick(x) {
  listClick(document.getElementById("p" + x.attributes["id"].value));
}

function registerInfo(id) { 
  document.getElementById("cellInfo").innerHTML = "";
  var k = findOnfocusInList(id);
  document.getElementById("cellInfo").innerHTML += classList[k].content;
}

function registerListInfo(id) { 
  document.getElementById("classListDetail").innerHTML = "";
  var k = findOnfocusInList(id.attributes["id"].value.slice(1));
  document.getElementById("classListDetail").innerHTML += classList[k].content;
}

function printClassDiv(num,name,index) {
  document.getElementById("td"+index).innerHTML += "<div id='" + num + "' name='" + num +"' "
  +"class='cell' onclick='reverseListClick(this)' title=''>" + num + "<br>" + name + "</div>";

  checkConflict(index);
} 

function pushClassName(num) {
  className = num;
}

/*  check the Tag whether exist or not  */
function checkTag(x) {
  if(x[0].childNodes.length) {
    return x[0].childNodes[0].nodeValue;
  }
return "";
}

function pushClassContent(result) {
  var name = checkTag(result.getElementsByTagName("name"));
  var _class = checkTag(result.getElementsByTagName("class"));
  var teacher = checkTag(result.getElementsByTagName("teacher"));
  var group = checkTag(result.getElementsByTagName("group"));
  var score = checkTag(result.getElementsByTagName("score"));
  var must = checkTag(result.getElementsByTagName("must"));
  var time = checkTag(result.getElementsByTagName("time"));
  var type = checkTag(result.getElementsByTagName("type"));
  var place = checkTag(result.getElementsByTagName("place"));
  var note = checkTag(result.getElementsByTagName("note"));
  content = "名稱：" + trimAll(name) + "<br>" +
        "班別：" + trimAll(_class) + "<br>" +
         "老師：" + trimAll(teacher) + "<br>" +
         "組別：" + trimAll(group) + "<br>" +
         "學分：" + trimAll(score) + "<br>" +
         "選必修：" + trimAll(must) + "<br>" +
         "時間：" + trimAll(time) + "<br>" +
         "類別：" + trimAll(type) + "<br>" +
         "地點：" + trimAll(place) + "<br>" +
         "註備：" + trimAll(note) + "<br>";
}

function getClassContent(result) {
  var name = checkTag(result.getElementsByTagName("name"));
  var _class = checkTag(result.getElementsByTagName("class"));
  var teacher = checkTag(result.getElementsByTagName("teacher"));
  var group = checkTag(result.getElementsByTagName("group"));
  var score = checkTag(result.getElementsByTagName("score"));
  var must = checkTag(result.getElementsByTagName("must"));
  var time = checkTag(result.getElementsByTagName("time"));
  var type = checkTag(result.getElementsByTagName("type"));
  var place = checkTag(result.getElementsByTagName("place"));
  var note = checkTag(result.getElementsByTagName("note"));
  var _content = "名稱：" + trimAll(name) + "<br>" +
        "班別：" + trimAll(_class) + "<br>" +
         "老師：" + trimAll(teacher) + "<br>" +
         "組別：" + trimAll(group) + "<br>" +
         "學分：" + trimAll(score) + "<br>" +
         "選必修：" + trimAll(must) + "<br>" +
         "時間：" + trimAll(time) + "<br>" +
         "類別：" + trimAll(type) + "<br>" +
         "地點：" + trimAll(place) + "<br>" +
         "註備：" + trimAll(note) + "<br>";
  return _content;
}

/*  print class when 只有一堂 */
function printClassSingle(_class, _classTime, result) {
  for(j = 0; j < 1; j++) {
    switch(_classTime[j]) {
      case "A":
        _classTime[j] = 10; 
        break;
      case "B":
        _classTime[j] = 11; 
        break;
      case "C":
        _classTime[j] = 12; 
        break;
      case "D":
        _classTime[j] = 13; 
        break;
      case "E":
        _classTime[j] = 14; 
        break;
    }
  }/* for */
  var timeBegin = parseInt(_classTime[0]);
  /*  skip N  */
  if(timeBegin > 4) {
      timeBegin++;
  }
  /*  case such as N~D, N is the first class  */
  if(_classTime[0]=="N") {
    _classTime[0] = 5;
    timeBegin = 5;    
  }
  /*  print */
  var index = parseInt(_class) + (8 * timeBegin + 8);
  var num = result.getElementsByTagName("num")[0].childNodes[0].nodeValue.trim();
  var name = result.getElementsByTagName("name")[0].childNodes[0].nodeValue.trim()
  printClassDiv(num,name,index);
  pushClassName(num);
  classCount++;
}

function printClassMulti(_class, _classTime, result) {
  for(j = 0; j < 2; j++) {
    switch(_classTime[j]) {
      case "A":
        _classTime[j] = 10; 
        break;
      case "B":
        _classTime[j] = 11; 
        break;
      case "C":
        _classTime[j] = 12; 
        break;
      case "D":
        _classTime[j] = 13; 
        break;
      case "E":
        _classTime[j] = 14; 
        break;
    }
  }/* for */
  var timeBegin = parseInt(_classTime[0]);
  /*  skip N  */
  if(timeBegin > 4) {
      timeBegin++;
  }
  /*  case 1~8, 8 will be considered as 7th class because of Nth  */
  if(_classTime[1] > 4 && timeBegin < 5) {
    _classTime[1]++;
  }
  /*  case such as N~D, N is the first class  */
  if(_classTime[1]=="N") {
    _classTime[1] = 5;
  }
  if(_classTime[0]=="N") {
    _classTime[0] = 4;
    timeBegin = 5;    
  }
  /*  print */
  for(j=0; j< (_classTime[1] - _classTime[0] + 1); j++,timeBegin++) {
    var index = parseInt(_class) + (8 * timeBegin + 8);
    var num = result.getElementsByTagName("num")[0].childNodes[0].nodeValue.trim();
    var name = result.getElementsByTagName("name")[0].childNodes[0].nodeValue.trim()
    printClassDiv(num,name,index);
    pushClassName(num);
    classCount++;
  }/* for */
}

function printClass(result,count) {
  /*  學分  */
  localCredit = parseInt(trimAll( checkTag( result.getElementsByTagName("score"))));
  credit += localCredit;
  /*  Format of time : [1]1~2, [2]3~5 ... */  
  var time = checkTag(result.getElementsByTagName("time"));
  if(time.trim() == ""){
    return;
  }
  var ctime = time.split(",");
  var k;
  count = count > 2 ? 2 : 1;
  for(k=0;k < count; k++) {
    /*  sub-class */
    if(k==1) {
      time = result.getElementsByTagName("time1")[0].childNodes[0].nodeValue.trim();
      ctime = time.split(",");
    }
    /*  handle time string  */
    for(i=0; i < ctime.length; i++) {
      /*  trim whitespace in class time */
      ctime[i] = ctime[i].trim();
      /*  [2] --> _class = 2  */
      var _class = ctime[i][1];
  
      /*  3~5 -> _classTime[0]=3, _classTime[1]=5 */
      var _classTime = (ctime[i].slice(3,6)).split("~");

      if(_classTime.length > 1) {
        printClassMulti(_class, _classTime, result);  
      }/* if  */
      else{
        printClassSingle(_class, _classTime, result); 
      }
    }/* for */
  }/* for */
}

function loadXml(dname) {
  if(window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
  }
  else {
    xhttp = new ActiveXObject("Microsoft.XMLHttp");
  }
  xhttp.open("GET", dname, false);
  /*
  try  {
    xhttp.responseType = "msxml-document"
  }catch(err){}
  */
  xhttp.send();
  return xhttp;
}


function findAndPrintClass(maj,num) {
  if(!checkMaj(maj)) {
    alert("系號 not found.");
    return -1;
  }
  var sem = document.getElementById("semesterSelect").value;
  var x = loadXml(sem + "/" + maj + ".xml");
  path = "/content/" + maj + "[@id='"+ num + "']";
  var xml = x.responseXML;
  /*  For IE  */
  if(window.ActiveXObject || xhttp.responseType=="msxml-document") {
    xml.setProperty("SelectionLanguage","XPath");
    xml.selectNodes(path);
    alert("尚不支援IE");
    return -1;
/*
    for(i=0;nodes.length;i++){
      document.write(nodes[i].childNodes[0].nodeValue);
      document.write("<br>");
    }
*/
  }
  /*  for others  */
  else if(document.implementation && document.implementation.createDocument) {
    var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
    var result = nodes.iterateNext();
    if(result) {
      /*  'count' used for counting sub-class 
      * 1 = No sub class
      * others = count - 1 sub class  */
      var count = 1;
      for(count=1;result;count++) {
        path = "/content/"+ maj +"[@id='"+ num + "']/group" + count;
        nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
        result = nodes.iterateNext();
      }

      path = "/content/"+ maj +"[@id='"+ num + "']";
      nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
      result = nodes.iterateNext();
      pushClassContent(result);
      printClass(result,count);

    }else{
      alert("序號 not found");
      return -1;
    }
  }
  return result;
}

/*  TODO:
 *  Cell used for customizing each class-cell's style.
 *  Not implemented yet.                
 */
function initCell() {
  for(i = 0; i < elementNum; i++){
    cell.push({
      color: "",
      content: "",
    });
  }
}

function disableWeekend() {
  for(i = 0; i<elementNum; i++){
    if(i >= 6 && ((i - 7) % 8 == 0 || (i - 6) % 8 == 0)){
      document.getElementById("td"+i).style.display = "none";
    }
  }
}

function enableWeekend() {
  for(i = 0; i < elementNum; i++){
    if(i >= 6 && ((i - 7) % 8 == 0 || (i - 6) % 8 == 0)){
      document.getElementById("td"+i).style.display = "";
    }
  }
}

function disable_BCDE() {
  for(i = 8*13 - 1; i < elementNum; i++){
      document.getElementById("td" + i).style.display = "none";
  }
}

function showWeekend() {
  var x = document.getElementById("weekendShow");
  if(x.checked == true) {
    enableWeekend();
  }
  else{
    disableWeekend();
  }
}

function setClassTimeCss() {
  for(i = 0; i < elementNum; i++) {
    if(i % 8 == 0){
      document.getElementById("td" + i).style.width = "4%";
      document.getElementById("td" + i).style.fontWeight = "bold";
      document.getElementById("td" + i).style.fontFamily = "Times New Roman";
//      document.getElementById("td" + i).style.backgroundColor = NAV_BACKGROUND_COLOR;
    }
    else{
      document.getElementById("td" + i).style.width = "12%";
    }
  }
  document.getElementById("main").style.tableLayout = "fixed";

  for(i = 0; i < 8; i++) {
    document.getElementById("td" + i).style.fontWeight = "bold";
  }
  for(i = 48; i <= 55; i++) {
      document.getElementById("td" + i).style.backgroundColor = "rgb(255,235,238)";
  
  }

}

function init() {
  text = "";
  for(i = 0; i < elementNum; i++) {
    if(i % 8 == 0 && i != 0) {
      text += "</tr><tr><td id='td" + i + "'></td>";
    }
    else if(i==0){
      text += "<tr><td id='td" + i + "'></td>";
    }
    else{
      text += "<td id='td" + i + "'></td>";
    }
  }
  text += "</tr>"
  document.getElementById("main").innerHTML = text;
  
  var arr = ["0", "1", "2", "3", "4", "N", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E"];
  var arr2 = ["", "一", "二", "三", "四", "五", "六", "日"]
  for(i = 0; i < 8; i++) {
    document.getElementById("td" + i).innerHTML = arr2[i];
    document.getElementById("td" + i).style.backgroundColor = NAV_BACKGROUND_COLOR;
  }
  for(i = 8; i <= 8*16; i += 8){
    document.getElementById("td" + i).innerHTML = arr[i/8-1];
  }
  disableWeekend();
//  disable_BCDE();
  initCell(); 
  setClassTimeCss();
}

function cellFocusStyle(k) {
  var element = document.getElementsByName(classList[k].id);
  for(var m = 0; m < element.length; m++) {
    element[m].style.backgroundColor = NAV_ONFOCUS_COLOR;
    element[m].style.boxShadow = "3px 5px 5px grey" ;
    element[m].style.borderRadius = "10px" ;
    element[m].style.border = "1px solid #AAAAAA" ;
  }
}

function cellFocusStyleClean(k) {
  var element = document.getElementsByName(classList[k].id);
  for(var m = 0; m < element.length; m++){
    element[m].style.backgroundColor = "";
    element[m].style.boxShadow = "";
    element[m].style.border = "" ;
    element[m].style.borderRadius = "" ;
  }
}

function cellFocusNoSelected(p) {
  var index = p.attributes["id"].value.slice(1);
  var k = findOnfocusInList(index);
  cellFocusStyle(k);
}

function cellFocusSelected(p) {
  var index = p.attributes["id"].value.slice(1);
  if(cellOnfocus != index) {
    var k = findOnfocusInList(cellOnfocus);
    /*  clear old focus style */
    cellFocusStyleClean(k);

    /*  add style to new focus item in cells  */
    k = findOnfocusInList(index);
    cellFocusStyle(k);
  }
  else {
    var k = findOnfocusInList(cellOnfocus);
    cellFocusStyleClean(k);
  }
}

function listMouseEnter(p) {
  registerListInfo(p);

}

function listClick(p) {
  if(cellOnfocus!="0") {
    document.getElementById("p"+cellOnfocus).className = "";  
    cellFocusSelected(p);
    if(cellOnfocus != p.attributes["id"].value.slice(1)) {
      p.className = "classListClick"
      cellOnfocus = p.attributes["id"].value.slice(1);
    }
    else{
      cellOnfocus = "0"; 
    }
  }
  else{
    p.className = "classListClick"
    cellFocusNoSelected(p);
    cellOnfocus = p.attributes["id"].value.slice(1);
  }
}

function findOnfocusInList(x) {
    var k = 0;
    while(classList[k].num != x) k++;
    return k;
}


function iconDel() {
  document.getElementById("a" + cellOnfocus).remove();    
}

function iconDelClick(p) {
  cellOnfocus = p.attributes["id"].value.slice(1);
  delClick();
}

function delClick() {
  if(cellOnfocus != "0") {
    iconDel();
    document.getElementById("p" + cellOnfocus).remove();    
    var k = findOnfocusInList(cellOnfocus);

    /*  remove() only remove the first elelment with id we get,   */    
    /*  so we have to record classCount to avoid error.     */
    for(i = 0; i < classList[k].count; i++){
      var indexForCheck = 0;
      /*
       *  document.getElementById(cellOnfocus) = E1-123
       *  document.getElementById(cellOnfocus).parentNode.attributes['id'] = td23
       *  document.getElementById(cellOnfocus).parentNode.attributes['id'].value.slice(2) = 23
       */
      indexForCheck = document.getElementById(cellOnfocus).parentNode.attributes['id'].value.slice(2);
      document.getElementById(cellOnfocus).remove();    
      checkConflict(indexForCheck);
    }
    cellFocusStyleClean(k);
    credit -= classList[k].credit;
    creditUpdate();

    classList.splice(k,1);
    classAddCount--;

    cellOnfocus = "0"; 
  } 
}

function floatAdd() {
  document.getElementById("navAddFloat").style.display = "";  
}

function floatAddReset() {
  document.getElementById("navAddFloat").style.display = "none";  
}

function closeSearchPanel() {
  document.getElementById("navSearchPanel").html = ""; 
  document.getElementById("navSearchPanel").style.display = "none"; 
}

function searchIconAddClick(x) {
  var num = x.attributes["id"].value.slice(2);
  addClass(num.substring(0,2), num.substring(3,6));
}

function saveTextAsFile()
{
  var textToWrite = "";
  if(classAddCount < 1) {
    return;
  }

  for(i = 0; i < classAddCount; i++){
    textToWrite += classList[i].num + "\n";
  }

  var textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
  var fileNameToSaveAs = "Data";

  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked
    // without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  }
  else {
    // Firefox requires the link to be added to the DOM
    // before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();
}

function destroyClickedElement(event) {
  document.body.removeChild(event.target);
}

function loadFileAsText() {
  var fileToLoad = document.getElementById("fileToLoad").files[0];
  /*  avoid loading same file repeatedly  */
  if(lastLoadFile == fileToLoad) {
    return;
  }

  var fileReader = new FileReader();
  fileReader.onload = function(fileLoadedEvent) 
  {
    lastLoadFile = fileToLoad;
    var textFromFileLoaded = fileLoadedEvent.target.result;
    var i = 0;
    /*  check the file contents is valid or not */
    if(!checkMaj(textFromFileLoaded.substring(i, i + 2))) {
      alert("檔案錯誤");
      return;
    }
    /*  E1-123\n  7 words per data  */
    for(i = 0; i < textFromFileLoaded.length; i += 7) {
      addClass(textFromFileLoaded.substring(i, i + 2), textFromFileLoaded.substring(i + 3, i + 6));
    }
  };
  fileReader.readAsText(fileToLoad, "UTF-8");
}



