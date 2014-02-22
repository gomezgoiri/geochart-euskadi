function loadMap(options) {
    $.get("images/euskadi.svg", {}, function(data) {
	console.log('about to use the svg');
	$("#svgmap").html(data);
	$("#bilbao").css("fill","#ff3333");
	
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