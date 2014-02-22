function loadMap(data, options) {
    $.get("images/euskadi.svg", {}, function(img) {
	console.log('about to use the svg');
	$("#svgmap").html(img);
	//$("#bilbao").css("fill","#ff3333");
	
	var rowInds = data.getSortedRows([{column: 1}]);
	for (var i = 0; i < rowInds.length; i++) {
	  createTooltip(data, rowInds[i]);
	}
	
	var show_id = "#";
	if(options.resolution=="municipality") {
	  show_id += "poblaciones";
	} else if(options.resolution=="comarcas") {
	  show_id += "comarcas";
	} else if(options.resolution=="provinces") {
	  show_id += "provincias";
	}
	
	$(show_id).css("display","block");
	//$(show_id).css("visibility","visible");
	if(options.labels) {
	  $(show_id+"_labels").css("display","block");
	  //$(show_id+"_labels").css("visibility","visible"); // or "hidden"
	}
    },"text");
}

function createTooltip(data, rowNumber) {
    var t = data.getValue(rowNumber, 0);
    var idreg = "#" + t.toLowerCase();
    createTooltipText( t.toLowerCase(), data, rowNumber );
    
    $(idreg).attr("title", t); // Needed for tooltip
    $(idreg).tooltip({
	content:  function() {
		      var currentId = $(this).attr("id");
		      return $("#" + currentId+"_content").html();
		  },
	track: true
    });
}

function createTooltipText(forId, data, rowNumber) {
    if( $("#tooltipContents").length<=0 ) { // not exist
	$("#svgmap").append("<div id=\"tooltipContents\" style=\"display:none\"></div>");
    }
    $("#tooltipContents").append("<div id=\"" + forId + "_content\">" + getTooltipText(data, rowNumber) + "</div>");
}

function getTooltipText(data, rowNumber) {
    var t = data.getValue(rowNumber, 0);
    var ret = "<b>" + t + "</b>";
    
    
    for (var i=1; i<data.getNumberOfColumns(); i++) {
      var label = data.getColumnLabel(i);
      var v = data.getValue(rowNumber, i);
      ret += "<br/>" + label + ": " + v;
    }
    return ret;
}