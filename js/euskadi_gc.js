function loadMap(data, options) {
    $.get("images/euskadi.svg", {}, function(img) {
	// Needed because the changes are not made effective when the "img" is directly changed.
        //  [ref] http://richardmiller.co.uk/2011/03/04/jquery-manipulating-ajax-response-before-inserting-into-the-dom/
	var modImg = $(img);
	
	// No matter which layers are visible in the current SVG version, we force all the optional layers to hide.
	// NOTE: We could simply declare this attribute for the "initially_hidden" class, but the inline "style" declarations would override its default behavior.
	// Since inkscape manages layers' visibility or invisibility with a "style" attribute, we make sure that the invisibility is applied afterwards.
	$(".initially_hidden", modImg).css("display", "none");
	
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
	var tooltipText = $("<div id=\"tooltipContents\" style=\"display:none\"></div>");
	for (var i = 0; i < rowInds.length; i++) {
	  createTooltip(modImg, tooltipText, data, rowInds[i]);
	  setBackgroundColors(modImg, data, rowInds[i], minColor, maxColor);
	}
	updateLegend(modImg, data, minColor, maxColor);
	
	var show_id = "#";
	if(options.resolution=="municipality") {
	  show_id += "poblaciones";
	} else if(options.resolution=="comarcas") {
	  show_id += "comarcas";
	} else if(options.resolution=="provinces") {
	  show_id += "provincias";
	}
	
	$(show_id, modImg).css("display","block");
	//$(show_id).css("visibility","visible");
	if(options.labels) {
	  $(show_id+"_labels", modImg).css("display","block"); // or (inkscape changes to this) inline
	  //$(show_id+"_labels").css("visibility","visible"); // or "hidden"
	}
	
	// We only insert the image after modifying it.
	// In practice, the user will hardly appreciate the difference between inserting the image before making the changes and this, but just in case...
	console.log("about to show the svg");
	$("#svgmap").html(modImg);
	// NOTE: "tooltipText" does not even need to be inserted in the DOM
	//          Actually, no extra DIVs are needed to show the tooltips.
	//          Anyway I've done this way (i.e. insert the messages shown in the tooltips in the DOM) because I find it more clear and debuggable for the web developer.
	$("#svgmap").append(tooltipText);
    },"text");
}

function getElementId(data, rowNumber) {
  return "#" + data.getValue(rowNumber, 0).trim().toLowerCase().replace(" ", "_");
}

function createTooltip(mapContext, ttTextContext, data, rowNumber) {
    var idreg = getElementId(data, rowNumber);
    createTooltipText( ttTextContext, idreg.substring(1), data, rowNumber );
    
    $(idreg, mapContext).attr("title", idreg.substring(1)); // Needed for tooltip
    $(idreg, mapContext).tooltip({
	content:  function() {
		      var currentId = $(this, mapContext).attr("id");
		      return $("#" + currentId+"_content", ttTextContext).html();
		  },
	track: true
    });
}

function createTooltipText(context, forId, data, rowNumber) {
    $(context).append("<div id=\"" + forId + "_content\">" + getTooltipText(data, rowNumber) + "</div>");
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

function setBackgroundColors(context, data, rowNumber, minColor, maxColor) {
    var col = "#" + getProportionalRGBs( data.getValue(rowNumber, 1), data.getColumnRange(1), minColor , maxColor );
    var idreg = getElementId(data, rowNumber);
    if ( $(idreg, context).is( "path" ) ) {
      $(idreg, context).css("fill", col); // e.g.: $("#bilbao").css("fill","#ff3333");
    } else { // it must be a group: if( $(idreg, context).is( "g" ))
      $(idreg, context).children("path").css("fill", col);
    }
}

function getProportionalRGBs(current, range, minColor, maxColor) {
    var r = getProportionalColor(current, range, minColor.substring(1,3), maxColor.substring(1,3));
    var g = getProportionalColor(current, range, minColor.substring(3,5), maxColor.substring(3,5));
    var b = getProportionalColor(current, range, minColor.substring(5,7), maxColor.substring(5,7));
    //console.log(r + g + b);
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
    return (decCol.toFixed(0)>=16)? hexResult: "0" + hexResult; // add a 0 to ensure that we use 2 chacters always
}

function updateLegend(context, data, minColor, maxColor) {
    // Customize colors
    $("#stop19", context).css("stop-color", minColor);
    $("#stop21", context).css("stop-color", maxColor);
    
    // Update values
    var range = data.getColumnRange(1);
    $("#mapMinValue", context).children().html(range.min);
    $("#mapMaxValue", context).children().html(range.max);
}