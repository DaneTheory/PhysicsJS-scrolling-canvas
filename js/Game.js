var Bop;
(function (Bop) {
    var Game = (function () {
        var deg = Math.PI / 180;
        var moveForce = 0.01;
        var turnFactor = 0.05;

        function Game(world) {
            var renderer = world.renderer();

            var player = Bop.bodyUtil.createPolygon({
                x: 200, y: 100, vertices: [
                        { x: 0, y: -15 },
                        { x: 10, y: 15 },
                        { x: -10, y: 15 }
                ],
                mass: 0.5
            }, { fillStyle: 'rgb(255,0,0)' }, ['player'], renderer);

            world.add(player);

            this.player = player;
        }

        Game.prototype.addForceLeft = function () {
            this.player.applyForce({ x: -moveForce, y: 0 });
        }

        Game.prototype.addForceRight = function () {
            this.player.applyForce({ x: moveForce, y: 0 });
        }

        Game.prototype.addForceUp = function () {
            this.player.applyForce({ x: 0, y: -moveForce });
        }

        Game.prototype.addForceDown = function () {
            this.player.applyForce({ x: 0, y: moveForce });
        }

        Game.prototype.endForce = function () {
            this.player.applyForce({ x: 0, y: 0 });
        }

        Game.prototype.turnLeft = function () {
            this.player.state.angular.vel = -(deg * turnFactor);
        }

        Game.prototype.turnRight = function () {
            this.player.state.angular.vel = deg * turnFactor;
        }

        Game.prototype.endTurn = function () {
            this.player.state.angular.vel = 0;
        }

        return Game;
    })();
    Bop.Game = Game;
})(Bop || (Bop = {}));
