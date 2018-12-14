
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
		this.setIcon(getDefaultIcon());
		var index = selected_markers.indexOf(this);
		selected_markers.splice(index, 1);
	}

	// else display highlight, and remember in list
	else{
		this.setIcon(getHighlightIcon());
		selected_markers.push(this);
	}

	// print selected points in textbox
	var marker_latlng = [];
	var marker_len = selected_markers.length;

	for(i = 0; i < marker_len; ++i){
		marker_latlng.push(selected_markers[i].getLatLng().toString());
	}
	document.getElementById('selected_points_box').value = marker_latlng;

}

// left mouse click listener
function onMapClick(event){

	// create marker
	var marker = new L.marker(event.latlng, {icon:getDefaultIcon()});

	// add left click listener for marker
	marker.on("click", onMarkerClick);

	point_data = {
	    'name': 'from map',
	    'coordinate_x': event.latlng.lat,
	    'coordinate_y': event.latlng.lng
	}

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
                console.log(value)
                if(value['fields']) {
                    _lat = value['fields']['coordinate_x']
                    _lng = value['fields']['coordinate_y']

                    var latlng = {lat: _lat, lng: _lng};

                    var marker = new L.marker(latlng, {icon:getDefaultIcon()});
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

function calculate_distance(){

	// DUMMY: pretpostavljam da sam dobio listu tocaka najkraceg puta.
  // TODO: izracunati najkraci put pomocu oznacenih tocaka i vratiti ga kao listu tocaka.

  // PRIMJER: kako izgledaju dva najkraca puta:
  var shortest_path_1 = [[45.826287, 15.918159], [45.830354, 15.974808], [45.798289, 16.009827], [45.789193, 16.025105]];
  var shortest_path_2 = [[45.801281, 15.935326], [45.79817, 15.964165], [45.795537, 15.996094], [45.799366, 16.005707]];

  // iscrtavam prvi path
  draw_line(shortest_path_1);
  draw_line(shortest_path_2);
}

function draw_line(point_list){

  var n_points = point_list.length;
  var points_for_polyline = [];
  for(i = 0; i < n_points; ++i){
    point_i = point_list[i];
    points_for_polyline.push(point_i);
  }

  polyline = new L.Polyline(points_for_polyline, {
    color: 'red',
    weight: 3,
    opacity: 0.5,
    smoothFactor: 1
  });

  //save polyline to list
  polylines.push(polyline);

  polyline.addTo(map);

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