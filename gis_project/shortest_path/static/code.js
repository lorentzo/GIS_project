
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

}

// right click

// left mouse click listener
function onMapClick(event){

	// create marker
	var marker = new L.marker(event.latlng);

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

	inserted_points.push(event.latlng);
	inserted_markers.push(marker)

	printInsertedPoints();
	
	// set content
	marker.bindPopup("Position " + event.latlng.toString());

	// diplay on map
	map.addLayer(marker);

}

function show_markers(){
	n_markers = inserted_markers.length
	for(i = 0; i < n_markers; ++i){
		map.addLayer(inserted_markers[i])
	}
}

function hide_markers(){
	n_markers = inserted_markers.length
	for(i = 0; i < n_markers; ++i){
		map.removeLayer(inserted_markers[i])
	}
}

function printInsertedPoints(){
	
	var text = document.getElementById("inserted_points_box").value = inserted_points;
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