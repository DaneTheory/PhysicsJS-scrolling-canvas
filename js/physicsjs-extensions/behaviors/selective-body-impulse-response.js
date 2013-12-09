(function (root, factory) {
    var deps = ['physicsjs'];
    if (typeof exports === 'object') {
        // Node. 
        var mods = deps.map(require);
        module.exports = factory.call(root, mods[0]);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(deps, function (p) { return factory.call(root, p); });
    } else {
        // Browser globals (root is window). Dependency management is up to you.
        root.Physics = factory.call(root, root.Physics);
    }
}(this, function (Physics) {
    'use strict';

    Physics.behavior('selective-body-impulse-response', 'body-impulse-response', function (parent) {

        var PUBSUB_COLLISION = 'collisions:detected';

        var playerQuery = Physics.query({
            tags: ['player']
        });

        var monsterQuery = Physics.query({
            tags: ['monster']
        });

        var collectibleQuery = Physics.query({
            name: ['circle']
            , tags: ['collectible', 'gold']
        });

        return {

            connect: function (world) {

                world.subscribe(PUBSUB_COLLISION, this.respond, this);

                // Hydrate the query collections
                playerQuery.applyTo(world);
                monsterQuery.applyTo(world);
                collectibleQuery.applyTo(world);
            },

            respond: function (data) {
                var l = data.collisions.length
                    , i
                    , collision
                    , playerCollidedObjectToTest;

                // Iterate through all collisions and handle any requiring custom processing, then
                // pass the remaining collisions to the base respond function for processing
                i = l;
                while (i--) {
                    collision = data.collisions[i];

                    // Check if a player body has collided with anything, including itself
                    playerCollidedObjectToTest = null;
                    if (playerQuery.contains(collision.bodyA)) {
                        playerCollidedObjectToTest = collision.bodyB;
                    } else if (playerQuery.contains(collision.bodyB)) {
                        playerCollidedObjectToTest = collision.bodyA;
                    }

                    // If a player body has struck something...
                    if (playerCollidedObjectToTest !== null) {
                        if (playerQuery.contains(playerCollidedObjectToTest)) {
                            // Player has struck itself, ignore.
                            data.collisions.splice(i, 1);
                        } else if (monsterQuery.contains(playerCollidedObjectToTest)) {
                            data.collisions.splice(i, 1); // Possibly we should preserve this collision and let the player bounce off the monster briefly before dying

                            // TODO: Raise event
                            document.getElementById('message').innerHTML = 'Ouch! Lost a life';
                        } else if (collectibleQuery.contains(playerCollidedObjectToTest)) {
                            data.collisions.splice(i, 1);

                            // TODO: Remove item from world, raise event
                            document.getElementById('message').innerHTML = 'Yay! Collected an item';
                        }
                    }
                }

                // Pass any remaining standard collisions to the base impulse response
                return parent.respond(data);
            }
        };
    });

    return Physics;
})); // UMD 