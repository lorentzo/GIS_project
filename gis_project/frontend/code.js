
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

	// left click listener for map
	map.on('click', onMapClick);

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

// left mouse click listener for map
function onMapClick(event){

	// create marker
	var marker = new L.marker(event.latlng, {icon:getDefaultIcon()});

	// add left click listener for marker
	marker.on("click", onMarkerClick);

	// print info
	marker.bindPopup("Position " + event.latlng.toString());
	
	// remember marker in list
	inserted_markers.push(marker);
	
	// add to map
	map.addLayer(marker);

}

function show_inserted_markers(){
	n_markers = inserted_markers.length
	for(i = 0; i < n_markers; ++i){
		map.addLayer(inserted_markers[i])
	}
}

function hide_inserted_markers(){
	n_markers = inserted_markers.length
	for(i = 0; i < n_markers; ++i){
		map.removeLayer(inserted_markers[i])
	}
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

function read_markers_from_database(){

	// TODO: read positions from database

	// toy example

	// list of marker positions
	db_markers = [[45.788475, 15.969486], 
				   [45.814444, 15.964165],
				   [45.799127, 15.94099],
				   [45.832627, 16.019611]];

	// create markers
	n_db_markers = db_markers.length;
	for(i = 0; i < n_db_markers; ++i){

		// create marker
		var marker = new L.marker([db_markers[i][0], db_markers[i][1]], {icon:getDefaultIcon()});

		// add left click listener for marker
		marker.on("click", onMarkerClick);

		// print info
		//marker.bindPopup("Position " + db_markers[i].toString());
	
		// remember marker in list
		database_markers.push(marker);

		// add to map
		map.addLayer(marker);



	}
}

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

	// TODO: calculate distance for selected points

}


