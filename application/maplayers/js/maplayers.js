var URL = "http://localhost:9090/geoserver/learning_Workspace/wms";

var osmMap = new ol.layer.Tile({
    name: 'Base Map',
    source: new ol.source.OSM(), //Calls function to load osmMap from openlayer
    visible: true,
    isBaseLayer: true
});

var style = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.1)'
    }),
    stroke: new ol.style.Stroke({
        color: '#319FD3',
        width: 1
    }),
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        fill: new ol.style.Fill({
            color: '#000'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3
        })
    })
});

var districtsURL = 'http://localhost:9090/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=learning_Workspace:Districts&outputFormat=json';

var sourceDistricts = new ol.source.Vector({
    url: districtsURL,
    // url: 'districts.json', // for local file
    format: new ol.format.GeoJSON()
    // crossOrigin: 'Anonymous'
});

// var sourceDistricts = new ol.source.Vector({
//     format: new ol.format.GeoJSON(),
//     url: function(extent){
//         return 'http://localhost:9090/geoserver/wfs?' +
//             'service=wfs&' +
//             'version=2.0.0&' +
//             'request=GetFeature&' +
//             'typeName=learning_Workspace:Districts&' +
//             'outputFormat=application/json&' +
//             'bbox=' + extent.join(',')+',EPSG:900913';
//     },
//     strategy: ol.loadingstrategy.bbox
//     // crossOrigin: 'Anonymous'
// });


var vectorDistricts = new ol.layer.Vector({
    source: sourceDistricts,
    name: "District Boundaries",
    style: function(feature) {
        style.getText().setText(feature.get('DISTRICT'));
        return style;
    },
    visible: false
});

var chitwanURL = 'http://localhost:9090/geoserver/wfs?request=GetFeature&service=WFS&version=2.0.0&typeName=learning_Workspace:ChitwanFew&outputFormat=json';
var sourceChitwan = new ol.source.Vector({
    url: chitwanURL,
    format: new ol.format.GeoJSON()
    // crossOrigin: 'Anonymous'
});

// var sourceChitwan = new ol.source.Vector({
//     format: new ol.format.GeoJSON(),
//     url: function(extent) {
//         return 'http://localhost:9090/geoserver/wfs?' +
//             'service=wfs&' +
//             'version=2.0.0&' +
//             'request=GetFeature&' +
//             'typeName=learning_Workspace:Chitwan&' +
//             'outputFormat=application/json&' +
//             'bbox=' + extent.join(',')+',EPSG:900913';
//     },
//     strategy: ol.loadingstrategy.bbox
// });

var vectorChitwan = new ol.layer.Vector({
    source: sourceChitwan,
    name: "Chitwan Arsenic Data",
    visible: false

});

var drawSource = new ol.source.Vector({wrapX: false});
var drawVector = new ol.layer.Vector({
    source: drawSource,
    name: 'Draw Layer'
});

var mySelectionsSource = new ol.source.Vector({wrapX: false});

var mySelectionsVector = new ol.layer.Vector({
    name: 'Selection Layer',
    source: mySelectionsSource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 0, 0, 0.5)'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(255, 0, 0, 1)',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            stroke: ol.style.Stroke({
                width: 2,
                color: 'rgba(255, 0, 0, 1)'
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 1)'
            })
        })
    })
});

var layer_array = [vectorDistricts, vectorChitwan];