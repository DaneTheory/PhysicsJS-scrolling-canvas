Physics.renderer('tracking-canvas', 'canvas', function (base) {
    var Pi2 = Math.PI * 2
        , halfCanvasDimension
        , _world = null;

    return {
        canvasDimension: null,
        windowScale: 1,
        focusedBody: null,
        focusedBodyVisible: true,
        focusedBodyTrackRotation: false,
        bounds: null,
        ceaseScrollingAtBounds: true,

        connect: function (world) {

            _world = world;
        },

        init: function (options) {

            base.init.call(this, options);

            this.canvasDimension = Math.max(options.width, options.height);
            halfCanvasDimension = this.canvasDimension / 2;

            this.focusedBody = options.focusedBody;
            this.focusedBodyVisible = options.focusedBodyVisible || true;
            this.focusedBodyTrackRotation = options.focusedBodyTrackRotation || false;
            this.bounds = options.bounds;
            this.ceaseScrollingAtBounds = options.ceaseScrollingAtBounds || true;

            this.refresh();
        },

        // Recalculates the current window scale and re-renders. Should be called on window resize or change orientation
        refresh: function() {
            var canvas = this.el
                , windowWidth = window.innerWidth
                , windowHeight = window.innerHeight
                , shortestWindowDimension = Math.min(windowWidth, windowHeight);

            canvas.style.width = shortestWindowDimension + 'px';
            canvas.style.height = shortestWindowDimension + 'px';
            canvas.setAttribute('width', shortestWindowDimension);
            canvas.setAttribute('height', shortestWindowDimension);

            // Store window scale for rendering
            this.windowScale = shortestWindowDimension / this.canvasDimension;

            if (_world !== null) {
                _world.render();
            }
        },

        drawBody: function (body, view) {
            var ctx = this.ctx
                , pos = body.state.pos
                , offset = this.options.offset
                , aabb = body.aabb()
            ;

            ctx.save();
            ctx.translate(pos.get(0) + offset.get(0), pos.get(1) + offset.get(1));
            ctx.rotate(body.state.angular.pos);
            ctx.drawImage(view, -view.width / 2, -view.height / 2);
            ctx.restore();
        },

        drawCircle: function (x, y, r, styles, ctx) {

            ctx = ctx || this.ctx;

            ctx.beginPath();
            this.setStyle(styles, ctx);
            ctx.arc(x, y, r, 0, Pi2, false);
            ctx.closePath();

            if (styles.lineWidth > 0)
                ctx.stroke();

            ctx.fill();
        },

        drawPolygon: function (verts, styles, ctx) {

            var vert = verts[0]
                , x = vert.x === undefined ? vert.get(0) : vert.x
                , y = vert.y === undefined ? vert.get(1) : vert.y
                , l = verts.length
            ;

            ctx = ctx || this.ctx;
            ctx.beginPath();
            this.setStyle(styles, ctx);

            ctx.moveTo(x, y);

            for (var i = 1; i < l; ++i) {
                vert = verts[i];
                x = vert.x === undefined ? vert.get(0) : vert.x;
                y = vert.y === undefined ? vert.get(1) : vert.y;
                ctx.lineTo(x, y);
            }

            if (l > 2) {
                ctx.closePath();
            }

            if (styles.lineWidth > 0)
                ctx.stroke();

            ctx.fill();
        },

        render: function (bodies, meta) {
            var body
                , ctx = this.ctx
                , windowScale = this.windowScale
                , focusedBody = this.focusedBody
                , canvasDimension = this.canvasDimension
                , i
                , l = bodies.length
                , aabb
                , x, y, x1, y1, x2, y2, sx1, sy1, sx2, sy2
                , translateX = 0, translateY = 0;

            ctx.save();

            // Scale canvas proportionally to screen size
            ctx.scale(windowScale, windowScale);

            // Clear the canvas
            ctx.clearRect(0, 0, canvasDimension, canvasDimension);

            // If we are tracking a body...
            if (focusedBody) {
                x = focusedBody.state.pos._[0];
                y = focusedBody.state.pos._[1];

                translateX = -x + halfCanvasDimension;
                translateY = -y + halfCanvasDimension;

                // If we have specified to cease scrolling at bounds then allow the focused body itself to begin moving again
                if (this.ceaseScrollingAtBounds === true) {
                    if (x < this.bounds.x1 + halfCanvasDimension)
                        translateX = 0;
                    else if (x > this.bounds.x2 - halfCanvasDimension)
                        translateX = -this.bounds.x2 + canvasDimension;

                    var translateY = -y + halfCanvasDimension;
                    if (y < this.bounds.y1 + halfCanvasDimension)
                        translateY = 0;
                    else if (y > this.bounds.y2 - halfCanvasDimension)
                        translateY = -this.bounds.y2 + canvasDimension;
                }

                // Translate the canvas to focus on the body
                ctx.translate(translateX, translateY);

                // If we are rotating the world to reflect the focused body's angle...
                if (this.focusedBodyTrackRotation === true) {
                    if (focusedBody.state.angular.pos !== 0) {
                        ctx.translate(x, y);

                        //var radians = focusedBody.state.angular.pos * Math.PI / 180;
                        ctx.rotate(-focusedBody.state.angular.pos);

                        ctx.translate(-x, -y);
                    }
                }
            }


            // Only render bodies whose bounding box falls within the currently scrolled region

            sx1 = -translateX;
            sy1 = -translateY;
            sx2 = sx1 + canvasDimension;
            sy2 = sy1 + canvasDimension;

            for (i = 0; i < l; i++) {
                body = bodies[i];

                aabb = body.aabb();
                x1 = aabb.pos.x - aabb.x;
                y1 = aabb.pos.y - aabb.y;
                x2 = aabb.pos.x + aabb.x;
                y2 = aabb.pos.y + aabb.y;

                if (x1 <= sx2
                    && sx1 <= x2
                    && y1 <= sy2
                    && sy1 <= y2) {


                    // TODO: Use a Query to identify all focused item bodies 
                    if (!(body === focusedBody && !this.focusedBodyVisible)) {
                        this.drawBody(body, body.view);
                    }
                }
            }

            ctx.restore();
        }
    };
});