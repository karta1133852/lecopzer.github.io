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
    

    showErrorDialog("快了快了", "測試中");
    
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

  function convertClassTimeSToN(str, num) {
    if(isNaN(num)) {
      switch(str) {
        case "N":
          return 4.5;
          break;
        case "A":
          return 9;
          break;
        case "B":
          return 10;
          break;
        case "C":
          return 11;
          break;  
        case "D":
          return 12;
          break;  
        case "E":
          return 13;
          break;  
      }
    }
    return num;
  }
});

