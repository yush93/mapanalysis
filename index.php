<html>
<head>
    <title>Analysis</title>
    <link rel="stylesheet" href="application/main/css/materialize.min.css">
    <link rel="stylesheet" href="application/main/css/main.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
    <link rel="stylesheet" href="external/ol/css/ol.css">

    <script type="text/javascript" src="external/ol/js/ol.js"></script>

    <script type="text/javascript" src="application/main/js/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="application/main/js/materialize.min.js"></script>
    <script type="text/javascript" src="external/jsts/js/jsts.min.js"></script>

    <style>
        .ol-popup {
            position: absolute;
            -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
            filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
            padding: 5px;
            border-radius: 10px;
            bottom: 12px;
            left: 50%;
            transform: translate(-50%);
            min-width: 100px;
            text-align: center;
        }

        .ol-popup:after, .ol-popup:before {
            top: 100%;
            border: solid transparent;
            content: " ";
            height: 0;
            width: 0;
            position: absolute;
            pointer-events: none;
        }

        /*Arrow above pointer*/
        .ol-popup:after {
            border-top-color: teal;
            border-width: 10px;
            left: 50%;
            margin-left: -10px;
        }

        .ol-popup:before {
            border-top-color: teal;
            border-width: 11px;
            left: 50%;
            margin-left: -11px;
        }

        .ol-popup-closer {
            text-decoration: none;
            position: absolute;
            top: 2px;
            right: 8px;
        }

        .ol-popup-closer:after {
            content: "✖";
        }
    </style>
</head>
<body>
<?php
include "includes/tools.html";
?>

<div id="div_map">


    <div id="popup" class="ol-popup">
        <div class="card-panel blue-grey white-text" style="margin: 0;">
            <div id="popup-content"></div>
        </div>

    </div>
    <div id="selected">
        <ul class="collapsible" data-collapsible="accordion">
            <li>
                <div class="collapsible-header active teal white-text"><i class="material-icons white-text">layers</i>Layers
                </div>
                <div class="collapsible-body" style="background-color: rgba(255, 255, 255, 0.8); padding: 5px">
                    <ul class="pre-scrollable" style="padding-left: 5px; padding-right: 5px" id="layer_items">
                    </ul>
                </div>
            </li>
            <li>
                <div class="collapsible-header blue-grey white-text"><i class="material-icons white-text">layers</i>Selected
                    Feature(s)
                </div>
                <div class="collapsible-body" style="background-color: rgba(255, 255, 255, 0.8); padding: 5px">
                    <ul class="pre-scrollable" style="padding-left: 5px; padding-right: 5px" id="selectedVal">
                    </ul>
                    <div id="optBox" class="input-field">
                        <select id="opt">
                            <option value="" selected>Select Type</option>
                            <option value="1">shp</option>
                            <option value="2">kml</option>
                            <option value="3">GeoJSON</option>
                        </select>
                        <label for="opt">Select to Download</label>
                    </div>
                </div>
            </li>

        </ul>
    </div>
    <div class="row" style="z-index: 999; position: fixed">
        <div class="card-panel grey darken-4 col m2 right-align"
             style="padding: 10px; margin: 0; position: fixed; z-index: 999; bottom: 0; right: 0;">
            <p id="coordinates" class="white-text"></p>
        </div>
    </div>
</div>
<script>
    $(document).ready(function () {
        //Material Design Initialization
        $('#opt').material_select();




        for (var i = 0; i < layer_array.length; i++) {
            var lid = layer_array[i].get('name').toLowerCase().split(' ').join('');
            var displayName = layer_array[i].get('name');
            var vab = "<li style='margin-bottom: 5px;'><input class='checks' type='checkbox' value='" + i + "' id='" + lid + "'> " +
                "<label class='black-text' for='" + lid + "'>" + displayName + "</label></li>";
            $('#layer_items').append(vab);
        }

        $('.checks').change(function () {
            var i = $(this).val();
            if ($(this).prop('checked')) {
                map.addLayer(layer_array[i]);
//                dragBox.setActive(true);
                map.addOverlay(overlay);
            } else {
//                dragBox.setActive(false);
                map.removeLayer(layer_array[i]);
//                selectedFeatures.clear();
                map.removeOverlay(overlay);
            }


        });

        //To cancel the current selection action
        $(document).keydown(function (e) {
            if (e.keyCode == 27) {
                if (draw.getActive() == true) {
                    draw.setActive(false);
                }
                draw.setActive(true);
            }
        });

        $('#opt').change(function () {
            var optVal = $(this).val();
            var totalFeatures = larArr.length;
            var dataArr = [];
            for (var i = 0; i < totalFeatures; i++) {
                dataArr.push(larArr[i].getId());
            }
            var data = dataArr.toString();
            switch (optVal) {
                case "1":
                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:9090/geoserver/wfs',
                        data: {
                            service: 'wfs',
                            version: '2.0.0',
                            request: 'GetFeature',
                            typeNames: 'learning_Workspace:Districts',
                            featureId: data,
                            outputFormat: 'shape-zip'
                        }
                    });
                    break;
                case "2":
                    $.ajax({
                        type: 'GET',
                        url: 'http://localhost:9090/geoserver/wfs',
                        data: {
                            service: 'wfs',
                            version: '2.0.0',
                            request: 'GetFeature',
                            typeNames: 'learning_Workspace:Districts',
                            featureId: data,
                            outputFormat: 'kml'
                        },
                        success: function (response) {
                            var s = new XMLSerializer();
                            var xmlString = s.serializeToString(response);
                            var parser = new DOMParser();
                            var xmlDoc = parser.parseFromString(xmlString,"text/xml");

                            var x = xmlDoc.getElementsByTagName("Schema")[0];
                            var name = x.getAttribute("name").split("_")[0];
                            var data = "text/xml;charset=utf-8," + encodeURIComponent(xmlString);
                            var a = document.createElement('a');
                            a.href = 'data:' + data;
                            a.download = name + '.kml';
                            a.click();
                        },
                        error: function (data) {
                            alert('error');
                        }
                    });
                    break;
                case "3":
                    $.ajax({
                        type: 'GET',
                        url: 'http://localhost:9090/geoserver/wfs',
                        data: {
                            service: 'wfs',
                            version: '2.0.0',
                            request: 'GetFeature',
                            typeNames: 'learning_Workspace:Districts',
                            featureId: data,
                            outputFormat: 'application/json'
                        },
                        success: function (response) {
                            var json = JSON.stringify(response);
                            var names = JSON.parse(json)['features'][0]['id'];
                            var name = names.split(".")[0];
                            var data = "text/json;charset=utf-8," + encodeURIComponent(json);
                            var a = document.createElement('a');
                            a.href = 'data:' + data;
                            a.download = name + '.json';
                            a.click();
                        },
                        error: function (data) {
                            alert('error');
                        }
                    });
                    break;
            }
        });
    });
    //    $('.button-collapse').sideNav();


</script>

<script type="text/javascript" src="application/maplayers/js/maplayers.js"></script>
<script type="text/javascript" src="application/main/js/main.js"></script>
<script type="text/javascript" src="application/drawingtools/js/drawingtools.js"></script>
</body>
</html>