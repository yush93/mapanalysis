var centerpos = [84.7, 27.2];

var minX = 80.05844110511946;
var minY = 26.34796713166333;
var maxX = 88.20152186778043;
var maxY = 30.447429596886728;

var newCenterPos = ol.proj.transform(centerpos, 'EPSG:4326', 'EPSG:900913');

var mapExtent = [minX, minY, maxX, maxY];


var map = new ol.Map({
    layers: [osmMap, drawVector, vectorDistricts, mySelectionsVector],
    target: 'div_map',
    interactions: ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false}),
	// interactions: ol.interaction.defaults().extend([
	// 	new ol.interaction.DragRotateAndZoom()
	// ]),

	controls: ol.control.defaults().extend([
		new ol.control.OverviewMap(),
        new ol.control.OverviewMap(),
        new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: 'EPSG:4326',
            target: 'coordinates'
        })
        // new ol.control.FullScreen()
        //new ol.control.ZoomSlider(),
        //new ol.control.ScaleLine()
	]),
	
    view: new ol.View({
        projection: 'EPSG:900913', //projection of online map
        displayProjection: 'EPSG:4326', //projection of our data
        zoom: 8,
        minZoom: 6,
        maxZoom: 19,
        extent: ol.proj.transformExtent(mapExtent, 'EPSG:4326', 'EPSG:900913'),
        center: newCenterPos
    })
});
