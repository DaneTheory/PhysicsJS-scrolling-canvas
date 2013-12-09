var Bop;
(function (Bop) {
    "use strict";

    var bodyUtil = (function () {
        function getPatternCanvas() {
            var rand, opacity;
            var pattern = document.createElement('canvas');
            pattern.width = 64;
            pattern.height = 64;
            var pctx = pattern.getContext('2d');

            pctx.fillStyle = 'rgb(0,255,0)';

            pctx.fillRect(0, 0, 64, 64);
            for (var w = 0; w <= 64; w++) {
                for (var h = 0; h <= 64; h++) {
                    rand = Math.floor(Math.random() * 50);
                    while (rand < 20) {
                        rand = Math.floor(Math.random() * 50);
                    }
                    opacity = Math.random();
                    while (opacity < 0.5) {
                        opacity = Math.random();
                    }
                    pctx.fillStyle = 'rgba(' + rand + ',' + rand + ',' + rand + ',' + opacity + ')';
                    pctx.fillRect(w, h, 1, 1);
                }
            }

            return pattern;
        }

        function getBricksPatternCanvas(renderer) {
            var tile = document.createElement('canvas');
            var ctx = tile.getContext('2d');

            tile.width = 8;
            tile.height = 8;

            ctx.fillStyle = 'rgb(196,0,0)';
            ctx.fillRect(0, 0, 8, 8);

            ctx.fillStyle = 'rgb(196,196,196)';
            ctx.fillRect(0, 3, 8, 1);
            ctx.fillRect(0, 7, 8, 1);
            ctx.fillRect(0, 0, 1, 3);
            ctx.fillRect(4, 4, 1, 3);

            var pattern = renderer.ctx.createPattern(tile, "repeat");

            return pattern;
        }

        function createCircle(bodyParams, style, tags, renderer) {
            if (!bodyParams.restitution)
                bodyParams.restitution = 0.75;

            var circle = Physics.body('circle', bodyParams);
            circle.view = renderer.createView(circle.geometry, style);
            circle.tags = tags;

            return circle;
        }

        function createPolygon(bodyParams, style, tags, renderer) {
            if (!bodyParams.restitution)
                bodyParams.restitution = 0.75;

            var polygon = Physics.body('convex-polygon', bodyParams);
            polygon.view = renderer.createView(polygon.geometry, style);
            polygon.tags = tags;

            return polygon;
        }

        return {
            getPatternCanvas: getPatternCanvas,
            getBricksPatternCanvas: getBricksPatternCanvas,
            createCircle: createCircle,
            createPolygon: createPolygon
        };

    })();

    Bop.bodyUtil = bodyUtil;
})(Bop || (Bop = {}));
