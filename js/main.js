(function () {
    "use strict";

    document.addEventListener('DOMContentLoaded', function () {
        setup();
    }, false);

    // Returns a random integer between min and max
    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function setup() {
        Physics(function (world) {

            var renderer = Physics.renderer('tracking-canvas', {
                el: 'viewport',
                width: 600,
                height: 600,
                bounds: { x1: 0, y1: 0, x2: 1000, y2: 2000 }
            });
            world.add(renderer);

            var game = new Bop.Game(world);
            renderer.focusedBody = game.player;
            //renderer.focusedBodyVisible = false;
            //renderer.ceaseScrollingAtBounds = false;
            //renderer.focusedBodyTrackRotation = true;


            // Add walls

            var wallStyle = { fillStyle: Bop.bodyUtil.getBricksPatternCanvas(renderer) };

            var ceiling = Bop.bodyUtil.createPolygon({
                x: 500, y: 5, vertices: [
                        { x: -490, y: -5 },
                        { x: 490, y: -5 },
                        { x: 490, y: 5 },
                        { x: -490, y: 5 }
                ],
                mass: 0.2
                , fixed: true
            }, wallStyle, ['wall'], renderer);
            world.add(ceiling);

            var floor = Bop.bodyUtil.createPolygon({
                x: 500, y: 1995, vertices: [
                        { x: -490, y: -5 },
                        { x: 490, y: -5 },
                        { x: 490, y: 5 },
                        { x: -490, y: 5 }
                ],
                mass: 0.2
                , fixed: true
            }, wallStyle, ['wall'], renderer);
            world.add(floor);

            var leftWall = Bop.bodyUtil.createPolygon({
                x: 5, y: 1000, vertices: [
                        { x: -5, y: -1000 },
                        { x: 5, y: -1000 },
                        { x: 5, y: 1000 },
                        { x: -5, y: 1000 }
                ],
                mass: 0.2
                , fixed: true
            }, wallStyle, ['wall'], renderer);
            world.add(leftWall);

            var rightWall = Bop.bodyUtil.createPolygon({
                x: 995, y: 1000, vertices: [
                        { x: -5, y: -1000 },
                        { x: 5, y: -1000 },
                        { x: 5, y: 1000 },
                        { x: -5, y: 1000 }
                ],
                mass: 0.2
                , fixed: true
            }, wallStyle, ['wall'], renderer);
            world.add(rightWall);


            // Add monsters

            for (var i = 0; i < 10; i++) {
                var monster = Bop.bodyUtil.createCircle({ x: randomNumber(50, 950), y: randomNumber(50, 1950), radius: randomNumber(10, 40), mass: randomNumber(1, 10) / 10 }
                    , { fillStyle: 'rgb(0,255,0)' }
                    , ['monster']
                    , renderer);
                world.add(monster);
            }


            // Add collectible items after 2 seconds
            window.setTimeout(function () {
                for (var i = 0; i < 10; i++) {
                    var collectible = Bop.bodyUtil.createPolygon({
                        x: randomNumber(50, 950), y: randomNumber(50, 1950), vertices: [
                                { x: -20, y: -20 },
                                { x: 20, y: -20 },
                                { x: 20, y: 20 },
                                { x: -20, y: 20 }
                        ],
                        mass: 0.2
                    }, { fillStyle: 'rgb(255,128,0)' }, ['collectible', 'gold'], renderer);
                    world.add(collectible);
                }
            }, 2000);


            // Add behaviors

            //world.add(Physics.behavior('constant-acceleration'));
            world.add(Physics.behavior('body-collision-detection'));
            world.add(Physics.behavior('selective-body-impulse-response'));
            world.add(Physics.behavior('sweep-prune'));
            world.add(Physics.behavior('rigid-constraint-manager'));

            world.add(Physics.integrator('verlet', { drag: 0.003 }));


            // Start it all off

            Physics.util.ticker.subscribe(function (time, dt) {
                world.step(time);
            });

            world.render();

            Physics.util.ticker.start();

            world.subscribe('step', function () {
                world.render();
            });


            // Update renderer when window resizes or changes orientation
            window.addEventListener('resize', function (e) {
                renderer.refresh();
            });


            // Add keyboard handlers

            document.addEventListener('keydown', function (e) {
                var keyDownID = window.event ? event.keyCode : (e.keyCode !== 0 ? e.keyCode : e.which);
                switch (keyDownID) {
                    case 37:
                        game.addForceLeft();
                        break;

                    case 39:
                        game.addForceRight();
                        break;

                    case 38:
                        game.addForceUp();
                        break;

                    case 40:
                        game.addForceDown();
                        break;

                    case 90:
                        game.turnLeft();
                        break;

                    case 88:
                        game.turnRight();
                        break;
                }
            });

            document.addEventListener('keyup', function (e) {
                var keyDownID = window.event ? event.keyCode : (e.keyCode !== 0 ? e.keyCode : e.which);
                switch (keyDownID) {
                    case 37:
                    case 39:
                    case 38:
                    case 40:
                        game.endForce();
                        break;

                    case 90:
                    case 88:
                        game.endTurn();
                        break;
                }
            });
        });
    }
})();