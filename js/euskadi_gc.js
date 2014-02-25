function loadMap(data, options) {
    $.get("images/euskadi.svg", {}, function(img) {
	console.log("about to show the svg");
	$("#svgmap").html(img);
	
	var minColor = "#efe6dc";
	var maxColor = "#109618";
	if ("colorAxis" in options && "colors" in options.colorAxis) {
	  console.log(options.colorAxis.colors)
	  if(options.colorAxis.colors instanceof Array && options.colorAxis.colors.length==2) {
	    minColor = options.colorAxis.colors[0];
	    maxColor = options.colorAxis.colors[1];
	  } else {
	    console.log("'colorAxis.colors' must be an array composed by two strings expressing hexadecimal colors (e.g. #cccccc).");
	  }
	}
	
	var rowInds = data.getSortedRows([{column: 1}]);
	for (var i = 0; i < rowInds.length; i++) {
	  createTooltip(data, rowInds[i]);
	  setBackgroundColors(data, rowInds[i], minColor, maxColor);
	}
	updateLegend(data, minColor, maxColor);
	
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

function getElementId(data, rowNumber) {
  return "#" + data.getValue(rowNumber, 0).toLowerCase();
}

function createTooltip(data, rowNumber) {
    var idreg = getElementId(data, rowNumber);
    createTooltipText( idreg.substring(1), data, rowNumber );
    
    $(idreg).attr("title", idreg.substring(1)); // Needed for tooltip
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
    var ret = "<b>" + data.getValue(rowNumber, 0) + "</b>";    
    for (var i=1; i<data.getNumberOfColumns(); i++) {
      var label = data.getColumnLabel(i);
      var v = data.getValue(rowNumber, i);
      ret += "<br/>" + label + ": " + v;
    }
    return ret;
}

function setBackgroundColors(data, rowNumber, minColor, maxColor) {
    var col = "#" + getProportionalRGBs( data.getValue(rowNumber, 1), data.getColumnRange(1), minColor , maxColor );
    var idreg = getElementId(data, rowNumber);
    $(idreg).css("fill", col); // e.g.: $("#bilbao").css("fill","#ff3333");
}

function getProportionalRGBs(current, range, minColor, maxColor) {
    var r = getProportionalColor(current, range, minColor.substring(1,3), maxColor.substring(1,3));
    var g = getProportionalColor(current, range, minColor.substring(3,5), maxColor.substring(3,5));
    var b = getProportionalColor(current, range, minColor.substring(5,7), maxColor.substring(5,7));
    console.log(r + g + b);
    console.log(r + " " + g + " " + b);
    return r + g + b;
}

function d2h(d) {
    return (+d).toString(16).toUpperCase();
}

function getProportionalColor(current, range, minColorSlide, maxColorSlide) {
    // avoid "#"s and convert to decimals
    var decMinCol = parseInt(minColorSlide, 16); 
    var decMaxCol = parseInt(maxColorSlide, 16);
    
    var decCol = ( (current-range.min) * (decMaxCol - decMinCol) / (range.max - range.min) ) + decMinCol;
    //JavaScript only has a Number type
    //If you want to format the number as a string with two digits after the decimal point use:
    var hexResult = d2h(decCol.toFixed(0)); // toFixed(0) => to string with no decimals
    return (decCol>16)? hexResult: "0" + hexResult; // add a 0 to ensure that we use 2 chacters always
}

function updateLegend(data, minColor, maxColor) {
    // Customize colors
    $("#stop19").css("stop-color", minColor);
    $("#stop21").css("stop-color", maxColor);
    
    // Update values
    var range = data.getColumnRange(1);
    $("#mapMinValue").children().html(range.min);
    $("#mapMaxValue").children().html(range.max);
}