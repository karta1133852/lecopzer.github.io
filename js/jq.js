
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
//	$("#classList").sortable();
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
		content: "搶課囉",
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
