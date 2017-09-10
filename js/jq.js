$.fn.exists = function () {
      return this.length !== 0;
}

$(function() {
  $("#sliderSize").slider({
    range: "min",
    min: 50,
    max: 100,
    value: 75,
    slide: function(event, ui) {
      $("#main").css({ "left": (100 - ui.value) / 2 + "%",
               "width": ui.value + "%"});
      $("#tableSize").val(ui.value + "%");
    }
  });
  $("#tableSize").val( $("#sliderSize").slider("value") + "%");
});

$(function() {
//  $("#classList").sortable();
  $("#navAddFloat").draggable();
  $("#navSearchPanel").draggable();
  $("#tabs").tabs();
});


$(function () {
  $("header ul li:gt(2):lt(2) a").click(function(e) {
    $.ajaxSetup({
      cache: false,
    });
    $("#mainpage").load( $(this).attr("href"), function(){
    });
    return false;
  });
});



$(function() {
  $("#classQuery").tooltip({
    disabled: true,
    content: "希望有生之年可以完成他ㄏㄏ",
    items: "li",
    position: {
      my: "center top+30",
      at: "center down",
      using: function (position, feedback) {
        $(this).css(position);            
        $("<div>")
          .addClass( "arrow" )
          .addClass( feedback.vertical )
          .addClass( feedback.horizontal )
          .appendTo( this );
      }
    },
    show: {
      effect: "slideDown",
    }
  });

  $(document).on("click", "#classQuery", function(e) {
    e.preventDefault();
    $("#searchProgressbar").css("display", "none");
    $("#navSearchPanel").toggle("slide", null, 500, callbackNull);
  });

  function callbackNull() {
  };
  
  $(document).on({
    mouseenter: function() {
      registerInfo($(this).attr("id"));
    },
    mouseleave: function() {
      $("#cellInfo").fadeOut("fast");
      
    },  
    mousemove: function(e) {
      $("#cellInfo").show();
      $("#cellInfo").css({
        top: e.pageY,
        left: e.pageX
      });
      $("#cellInfo").animate({
        top: e.pageY,
        left: e.pageX 
      },
      {
        queue: false,
        duration: 200,
        easing: "linear",
      }
                  
                  );
    }
  }, ".cell");
});

$(function() {
  $(document).on("click", "#searchBtn", function(e) {
    e.preventDefault();
    if(!$('input[name="searchDayName"]:checked').exists()){
      showErrorDialog("至少選個一天ㄅ<br>87", "時間錯誤");
      return;
    }
    $('input[name="searchDayName"]:checked').each(function() {
      console.log(this.value);
    });
    var startClass = $("#searchClassStartSelect option:selected").val();
    var endClass = $("#searchClassEndSelect option:selected").val();
    var startClassNum = parseInt(startClass);
    var endClassNum = parseInt(endClass);
    if(!checkSearchClassNum(startClass, endClass)) return;
    var maj= $("#searchForm [name='maj']").val();
    if(!checkMaj(maj)) {
      showErrorDialog("87", "系號錯誤");
      return;
    }

    $("#searchResultList").html(""); 
    $("#searchProgressbar").css("display", "");
    var ret = false;
    var startClassFloat = parseFloat(startClass);
    var endClassFloat = parseFloat(endClass);
    startClassFloat = convertClassTimeSToN(startClass, startClassFloat);
    endClassFloat = convertClassTimeSToN(endClass, endClassFloat);
    $('input[name="searchDayName"]:checked').each(function() {
      ret |= searchMain(maj, this.value, startClassFloat, endClassFloat);
    });
    $("#searchProgressbar").css("display", "none");
    if(ret)
      showNormalDialog("找完了", "有找到喔^^");
    else
      showErrorDialog("QQ沒搜到", "ㄏ");
  });

  function checkSearchClassNum(s, e) {
    var startClassNum = parseFloat(s);
    var endClassNum = parseFloat(e);
    startClassNum = convertClassTimeSToN(s, startClassNum);
    endClassNum = convertClassTimeSToN(e, endClassNum);
//    console.log(startClassNum + " d " + endClassNum);
    if(endClassNum < startClassNum) {
      showErrorDialog("起始節次不可大於結束節次<br>87", "時間錯誤");
      return false;
    }
    return true;
  };

  function showErrorDialog(s, t) {
    $("#searchDialog").html(s);
    $("#searchDialog").dialog({
      show: {
        effect: "shake"
      },
      classes: {
        "ui-dialog-titlebar" : "ui-dialog-title-red",
        "ui-dialog-titlebar-close" : "ui-dialog-titlebar-close-align"
      },
      title: t,
      resizable: false
    });
  }

  function showNormalDialog(s, t) {
    $("#searchDialog").html(s);
    $("#searchDialog").dialog({
      show: {
        effect: "bounce"
      },
      classes: {
        "ui-dialog-titlebar" : "ui-dialog-title-normal",
        "ui-dialog-titlebar-close" : "ui-dialog-titlebar-close-align"
      },
      title: t,
      resizable: false
    });
  }

  function convertClassTimeSToN(str, num) {
    if(isNaN(num)) {
      switch(str) {
        case "N":
          return 4.5;
          break;
        case "A":
          return 10;
          break;
        case "B":
          return 11;
          break;
        case "C":
          return 12;
          break;  
        case "D":
          return 13;
          break;  
        case "E":
          return 14;
          break;  
      }
    }
    return num;
  }

  function searchMain(maj, d, s, e) {
//    var sem = document.getElementById("semesterSelect").value;
    var x = loadXml(/*sem +*/ "xml/" + maj + ".xml");
//    path = "/content/" + maj + "[@id='"+ num + "']";
    var path = "/content/" + maj + "/time" + "[@day=" + d +" and @s>=" + s + " and @e<=" + e + "]";
    var xml = x.responseXML;
    /*  For IE  */
    if(window.ActiveXObject || xhttp.responseType=="msxml-document") {
      xml.setProperty("SelectionLanguage","XPath");
      xml.selectNodes(path);
      alert("永遠不支援IE");
    }
      /*  for others  */
    else if(document.implementation && document.implementation.createDocument) {
      var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
      var result = nodes.iterateNext();
      if(result) {
        /*  'count' used for counting sub-class 
        * 1 = No sub class
        * others = count - 1 sub class  */
        /*
        var count = 1;
        for(count = 1; result; count++) {
          path = "/content/"+ maj +"[@id='"+ num + "']/group" + count;
          nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
          result = nodes.iterateNext();
        }

        path = "/content/"+ maj +"[@id='"+ num + "']";
        nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
        result = nodes.iterateNext();
        */

        for(; result; result = nodes.iterateNext()) {
          var p = result.parentNode;
          var num = p.getElementsByTagName("num")[0].childNodes[0].nodeValue.trim();
          var name = p.getElementsByTagName("name")[0].childNodes[0].nodeValue.trim()
          var _time = p.getElementsByTagName("time")[0].childNodes[0].nodeValue.trim();
          document.getElementById("searchResultList").innerHTML += "<div id='s" + num + "' onclick='searchListClick(this)'>" +
  /*  " onmouseenter='listMouseEnter(this)'>"+*/
          num + "  " + name + "<span style='float:right;'>" + _time + "</span></div>"
          + "<a id='sa" + num + "' style='float:right;margin:13px 13px 0 0;color:red;'"+
          " onclick='searchIconDelClick(this)' class='material-icons'>clear</a>";
        }
        return true;
      }
    }
    return false;
  }
});

$(function() {
   var progressbar = $("#searchProgressbar");
    progressbar.progressbar({
      value: false,
      change: function() {
     //   progressLabel.text( progressbar.progressbar( "value" ) + "%" );
      },
      complete: function() {
      //  progressLabel.text( "Complete!" );
      }
    });
});
