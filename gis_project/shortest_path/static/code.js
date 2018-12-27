selected_points = []


// map initialization
function initmap(){

	// set up map, take id from div
	map = new L.Map('map');

	// osm map image link
	var osm_url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

	// osm map attribtion: Make sure to give credit to tile providers
	var attribution_osm = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

	// specify: map url, min/max zoom and contributors
	var osm = new L.TileLayer(osm_url, {minZoom: 2, maxZoom: 20, attribution: attribution_osm});

	//set coordinates for map display
	map.setView(new L.LatLng(45.815399, 15.966568), 13);

	map.addLayer(osm);

	$.ajaxSetup({
        headers: { "X-CSRFToken": getCookie("csrftoken") }
    });

    // add mouse listener
	map.on('click', onMapClick);


  populateMap()
}





// Custom icon class without iconUrl
var customIcon = L.Icon.extend({
  options: {
    shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [38, 95],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
  }
});

// Function for getting new default icon
function getDefaultIcon() {
  return new customIcon({
    iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png'
  });
}

// Function for getting new highlight icon
function getHighlightIcon() {
  return new customIcon({
    iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-red.png'
  });
}


function onMarkerClick(event){

	// if highlighted: remove highlight and remove from list
	if(selected_markers.includes(this)){
    var divIcon = L.divIcon({html:this.options.title, className: 'leaflet-div-icon2'});
		this.setIcon(divIcon);
		var index = selected_markers.indexOf(this);
		selected_markers.splice(index, 1);

    
	}

	// else display highlight, and remember in list
	else{
    var divIcon = L.divIcon({html:this.options.title, className: 'leaflet-div-icon1'});
		this.setIcon(divIcon);
		selected_markers.push(this);

	}

	// print selected points in textbox
	var marker_latlng = [];
	var marker_len = selected_markers.length;

	selected_points = []

	for(i = 0; i < marker_len; ++i){
		marker_latlng.push(selected_markers[i].getLatLng().toString());

		selected_points.push([selected_markers[i].options.title, selected_markers[i].getLatLng().lat, selected_markers[i].getLatLng().lng]);
	}
	document.getElementById('selected_points_box').value = marker_latlng;
}

// left mouse click listener
function onMapClick(event){

  //ask for name
  var name = prompt("Please enter name of point:", "name");
  
  // create marker
  var divIcon = L.divIcon({html:name, className: 'leaflet-div-icon2'});
  var marker = new L.marker(event.latlng, {icon:divIcon, title:name});

	// add left click listener for marker
	marker.on("click", onMarkerClick);

	point_data = {
	    'name': name, // spremi varijablu "name"
	    'coordinate_x': event.latlng.lat,
	    'coordinate_y': event.latlng.lng
	};

    $.ajax({
       type: 'POST',
       dataType : "json",
       data: point_data,
       url: 'http://localhost:8000/points/create',
       success: function(res){
               console.log(res);
               },
       error: function(error) {
           console.log(error);
       }
   });

   // remember marker in list
	database_markers.push(marker);
	
	// set content
	marker.bindPopup("Position " + event.latlng.toString());

	// diplay on map
	map.addLayer(marker);
}



function populateMap() {
    $.ajax({
       type: 'GET',
       url: 'http://localhost:8000/points/list',
       success: function(data){
            $.each(data, function(index, value) {
                if(value['fields']) {
                    _name = value['fields']['name'];
                    _lat = value['fields']['coordinate_x'];
                    _lng = value['fields']['coordinate_y'];

                    var latlng = {lat: _lat, lng: _lng};
                    // umjesto "name" u html:"name" staviti pravo ime
                    var divIcon = L.divIcon({html:_name, className: 'leaflet-div-icon2'});
                    // umjesto "name" u title:"name" staviti pravo ime
                    var marker = new L.marker(latlng, {icon:divIcon, title:_name});
                    marker.on("click", onMarkerClick);
                    database_markers.push(marker);

                    map.addLayer(marker);
                }
            });
       },
       error: function(error) {
           console.log(error);
       }
   });
}

function show_selected_markers(){
	n_markers = selected_markers.length
	for(i = 0; i < n_markers; ++i){
		map.addLayer(selected_markers[i])
	}
}

function hide_selected_markers(){
	n_markers = selected_markers.length
	for(i = 0; i < n_markers; ++i){
		map.removeLayer(selected_markers[i])
	}
}

//function read_markers_from_database() {
//
//	// TODO: read positions from database
//
//	// toy example
//
//	// list of marker positions
//	db_markers = [[45.788475, 15.969486],
//				   [45.814444, 15.964165],
//				   [45.799127, 15.94099],
//				   [45.832627, 16.019611]];
//
//	// create markers
//	n_db_markers = db_markers.length;
//	for(i = 0; i < n_db_markers; ++i){
//
//		// create marker
//		var marker = new L.marker([db_markers[i][0], db_markers[i][1]], {icon:getDefaultIcon()});
//
//		// add left click listener for marker
//		marker.on("click", onMarkerClick);
//
//		// print info
//		//marker.bindPopup("Position " + db_markers[i].toString());
//
//		// remember marker in list
//		database_markers.push(marker);
//
//		// add to map
//		map.addLayer(marker);
//
//
//
//	}
//}

function show_database_markers(){
	n_markers = database_markers.length
	for(i = 0; i < n_markers; ++i){
		map.addLayer(database_markers[i])
	}
}

function hide_database_markers(){
	n_markers = database_markers.length
	for(i = 0; i < n_markers; ++i){
		map.removeLayer(database_markers[i])
	}
}

function calculate_distance() {

    received_points = [];

    $.ajax({
       type: 'GET',
       url: 'http://localhost:8000/paths/shortest_for_points',
       data: {'point_list': JSON.stringify(selected_points) },
       dataType: 'json',
       success: function(data){


            var returnedData = JSON.parse(data.response_data);

            draw_line(returnedData);

            console.log(returnedData);

            // TODO : ovdje su tocke polylajna pa ih nacrtaj na karti

//            for(var i = 0; i < data.response_data.length; i++) {
//                _lat = data.response_data[i][0]
//                _lng = data.response_data[i][1]
//
//                console.log(_lat, _lng);
//
//                received_points.push([_lat, _lng]);
//            }
//
////            for point in data.received_data
////            $.each(data.received_data, function(index, value) {
////            console.log(data);
////                if(value['fields']) {
////                    _lat = value['fields']['coordinate_x'];
////                    _lng = value['fields']['coordinate_y'];
////
////                    received_points.push([_lat, _lng]);
////                }
////            });
//
//            draw_line(received_points);
       },
       error: function(error) {
           console.log(error);
       }
   });

	// DUMMY: pretpostavljam da sam dobio listu tocaka najkraceg puta.
  // TODO: izracunati najkraci put pomocu oznacenih tocaka i vratiti ga kao listu tocaka.

//   PRIMJER: kako izgledaju dva najkraca puta:
//  var shortest_path_1 = [[45.826287, 15.918159], [45.830354, 15.974808], [45.798289, 16.009827], [45.789193, 16.025105]];
//  var shortest_path_2 = [[45.801281, 15.935326], [45.79817, 15.964165], [45.795537, 15.996094], [45.799366, 16.005707]];

  // iscrtavam prvi path
//  draw_line(shortest_path_1);
//  draw_line(shortest_path_2);
}

function draw_line(paths_list){

  console.log(paths_list);

  //before drawing hide all previous polylines 
  remove_polylines();
  polylines_dists = [];
  polylines_from_to = [];

  var n_paths = paths_list.length;
  for(i = 0; i < n_paths; i++) {
    var n_points = paths_list[i].path_list.length;
    
    var distance = paths_list[i].distance; // vrati i imena parova za koje si racunao
    polylines_dists.push(distance); // remember distances in list
    polylines_from_to.push(paths_list[i].point_1_name + " <---> " + paths_list[i].point_2_name); // remember distances in list

    points_for_polyline = [];
    for(j = 0; j < n_points; j++) {
        point_i = paths_list[i].path_list[j];
        points_for_polyline.push([point_i[1], point_i[0]]);
    }

    polyline = new L.Polyline(points_for_polyline, {
            color: 'red',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
        });

    polyline.addTo(map);

    // remember polyline in list so it could be removed later
    polylines.push(polyline);

    
  }

  // empty old table
  empty_table();

  // draw table of distances
  draw_table();


}

function draw_table(){
  var table = document.getElementById("dist_table");

  var n_polylines = polylines.length;

  for (i = 0; i < n_polylines; ++i){
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = polylines_dists[i].toString();
    var label = polylines_from_to[i]; // napisao pravo ime parove za koje smo racunali distance
    cell2.innerHTML = label;
  }
}

function empty_table(){
  var table = document.getElementById("dist_table");
  var n_rows = table.rows.length;
  for (var i = 1; i < n_rows; i++){
    table.deleteRow(1);
  }
}

function remove_polylines(){

  var n_polylines = polylines.length;
  for(i = 0; i < n_polylines; ++i){
    map.removeLayer(polylines[i]);
  }
  
}

function show_polylines(){

  var n_polylines = polylines.length;
  for(i = 0; i < n_polylines; ++i){
    polylines[i].addTo(map);
  }
  
}


function getCookie(c_name)
{
    if (document.cookie.length > 0)
    {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1)
        {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
 }