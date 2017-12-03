// $(document).ready(function () {
$('#selectedVal').hide();
$('#optBox').hide();

// var select = new ol.interaction.Select();
// map.addInteraction(select);
var larArr = [];
var draw = new ol.interaction.Draw({
    source: drawSource
});
var isInfo = false;
var clicked = false;
$('.tool').click(function () {
    clicked=true;
    var value;
    var geometryFunction;
    var toolType = $(this).prop('id');
    $(this).removeClass('pulse');
    // if (!drawingLayer.get('visible')) {
    map.removeInteraction(draw);
    switch (toolType) {
        case "0":
            value = 'LineString';
            var maxPoints = 2;
            geometryFunction = function (coordinates, geometry) {
                if (!geometry) {
                    geometry = new ol.geom.Polygon(null);
                }
                var start = coordinates[0];
                var end = coordinates[1];
                geometry.setCoordinates([
                    [start, [start[0], end[1]], end, [end[0], start[1]], start]
                ]);
                return geometry;
            };
            draw = new ol.interaction.Draw({
                source: drawSource,
                type: value,
                geometryFunction: geometryFunction,
                maxPoints: maxPoints,
                condition: ol.events.condition.platformModifierKeyOnly
            });
            map.addInteraction(draw);
            isInfo = false;
            toggle($(this), isInfo);
            break;
        case "1":
            value = 'Circle';
            geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
            draw = new ol.interaction.Draw({
                source: drawSource,
                type: value,
                geometryFunction: geometryFunction,
                condition: ol.events.condition.platformModifierKeyOnly
            });
            map.addInteraction(draw);
            isInfo = false;
            toggle($(this), isInfo);
            break;
        case "2":
            value = 'Circle';
            geometryFunction = ol.interaction.Draw.createRegularPolygon(100);
            draw = new ol.interaction.Draw({
                source: drawSource,
                type: value,
                geometryFunction: geometryFunction,
                condition: ol.events.condition.platformModifierKeyOnly
            });
            map.addInteraction(draw);
            isInfo = false;
            toggle($(this), isInfo);
            break;
        case "3":
            value = 'Polygon';
            draw = new ol.interaction.Draw({
                source: drawSource,
                type: /** @type {ol.geom.GeometryType} */ (value),
                condition: ol.events.condition.platformModifierKeyOnly

            });
            map.addInteraction(draw);
            isInfo = false;
            toggle($(this), isInfo);
            break;
        case "4":
            $(".tool").removeClass('pulse');
            clicked=false;
            mySelectionsSource.clear();
            larArr = [];
            $('#selectedVal').html('');
            $('#optBox').hide();
            break;
        case "5":
            isInfo = !isInfo;
            toggle($(this), isInfo);
            break;
    }
    // }

    if(clicked){
        $('#toolDrawer').addClass('pulse');
    } else {
        $('#toolDrawer').removeClass('pulse');
    }

    var list = function () {
        if (larArr.length > 0) {
            $('#optBox').show();
            $('#selectedVal').show();
            var txt = '';
            $.each(larArr, function (index, value) {
                txt = txt + '<li><input checked type="checkbox" id="'+ index +'"><label for="'+ index +'">' + value.get('DISTRICT') + '</label> </li>';
            });
            $('#selectedVal').html(txt);
        } else {
            $('#optBox').hide();
            $('#selectedVal').hide();
        }
    };

    draw.on('drawstart', function (p1) {
        larArr = [];
        mySelectionsSource.clear();
        $('#optBox').hide();
    });


    draw.on('drawend', function (e) {
        drawSource.clear();
        mySelectionsSource.clear();
        var extent = e.feature.getGeometry().getExtent();
        var geomA = e.feature.getGeometry();
        sourceDistricts.forEachFeatureInExtent(extent, function (feature) {
            if (polyIntersectsPoly(geomA, feature.getGeometry()) === true) {
                mySelectionsSource.addFeature(feature);
                larArr.push(feature);
                // alert(feature.getId());
            }
        });

        list();
        drawSource.clear();
        drawVector.setVisible(false);
    });


    function polyIntersectsPoly(polygeomA, polygeomB) {
        var geomA = new jsts.io.GeoJSONReader().read(new ol.format.GeoJSON().writeFeatureObject(
            new ol.Feature({
                geometry: polygeomA
            })
            )
        ).geometry;
        var geomB = new jsts.io.GeoJSONReader().read(new ol.format.GeoJSON().writeFeatureObject(
            new ol.Feature({
                geometry: polygeomB
            })
            )
        ).geometry;
        return geomA.intersects(geomB);
    }

});

var toggle = function (_this, isInfo) {
    $('.tool').removeClass('pulse');
    _this.addClass('pulse');

    if (_this.prop('id') === "5") {
        if (isInfo) {
            _this.addClass('pulse');
        } else {
            _this.removeClass('pulse');
        }
    } else {
    }

};
var content = $('#popup-content');
var container = document.getElementById('popup');

var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
}));

map.addOverlay(overlay);
map.on('pointermove', function (evt) {
    // map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? showOverlay(evt) : overlay.setPosition(undefined);
    if (map.hasFeatureAtPixel(evt.pixel)) {
        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature2) {
            return feature2
        });
        showOverlay(evt, feature);
    } else {
        overlay.setPosition(undefined);
    }
});

var showOverlay = function (evt, feature) {
    if (isInfo) {
        content.text(feature.get('DISTRICT'));
        overlay.setPosition(evt.coordinate);
    }
};


// for custom selection shapes

// });