let groundMap = [[]];
let decalMap = [[]];
let snowballs = [];
let enemies = [];
let players = []
let playerEntity = [];

let hasUser = true;
let snowballModelSpawned = true;
let enemyModelSpawned = true;


import * as THREE from "three";

import io from 'socket.io-client'


// Render
const socket = io.connect("https://tresum.onrender.com");

// FL0
// const socket = io.connect("https://gympie-wombat-xerc.1.sg-1.fl0.io");

// Local
// const socket = io.connect("http://localhost:3000");

export default class SocketReceiver {


    getSocket() {
        return socket;
    }

    constructor() {
        console.log("Initialized SocketReceivers . . .")
    }

    assignGroundMap() {
        socket.on("map", (loadedMap) => {
            groundMap = loadedMap.ground;
        });
        return groundMap;
    }

    assignDecalMap() {
        socket.on("map", (loadedMap) => {
            decalMap = loadedMap.decal;
        });
        return decalMap;
    }

    assignPlayers(scene, loadedPlayers) {

        socket.off("players");

        // when "players" event is emitted
        socket.on("players", (serverPlayers) => {

            players = serverPlayers;

            for (const player of players) {

                hasUser = false;

                for (const loadedPlayer of loadedPlayers) {

                    if (player.id === loadedPlayer.playerId) {
                        // console.log("Already assigned: " + loadedPlayer.playerId);
                        hasUser = true;
                        break;
                    }
                }

                if (!hasUser) {

                    const geometry = new THREE.BoxGeometry(6, 3, 6)
                    const material = new THREE.MeshPhongMaterial({ color: 0x6f00ff })
                    const cube = new THREE.Mesh(geometry, material)
                    cube.castShadow = true;
                    cube.playerId = player.id;
                    cube.shipEnabled = false;

                    console.log("Added new player: " + cube.playerId)

                    loadedPlayers.push(cube);
                    scene.add(cube);

                    hasUser = true;
                }
            }
        });
        return players;
    }

    assignSnowballs(scene, loadedSnowballs) {

        socket.off("projectiles");

        socket.on("projectiles", (serverSnowballs) => {

            snowballs = serverSnowballs;

            for (const snowball of snowballs) {


                snowballModelSpawned = false;


                let snowballCube = "";

                for (const loadedSnowball of loadedSnowballs) {

                    if (snowball.id === loadedSnowball.modelId) {
                        snowballModelSpawned = true;


                        if (snowball.hit === true) {

                            console.log("expired")
                            scene.remove(loadedSnowball);

                        }

                        break;
                    }
                }

                if (!snowballModelSpawned) {


                    snowballModelSpawned = true;

                    if (snowball.type === "player") {
                        snowballCube = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 0), new THREE.MeshPhongMaterial({ color: 0x555555 }))
                    } else if (snowball.type === "enemy") {
                        snowballCube = new THREE.Mesh(new THREE.IcosahedronGeometry(4, 0), new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 }))
                    } else {
                        snowballCube = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 0), new THREE.MeshPhongMaterial({ color: 0xeeaeda }))
                    }


                    snowballCube.modelId = snowball.id;
                    snowballCube.name = snowball.id;

                    loadedSnowballs.push(snowballCube);


                    scene.add(snowballCube);

                    //// ways to remove model
                    // snowballCube.geometry.dispose();
                    // snowballCube.material.dispose();

                    // snowballCube.remove(snowball);
                    // snowballCube.parent.remove(snowball);

                    // scene.remove(snowballCube);



                }
            }


            ////> create modelCleanup function


            let missing = "";

            for (const loadedSnowball of loadedSnowballs) {

                for (const snowball of snowballs) {

                    if (loadedSnowball.modelId === snowball.id){
                        missing = false;
                        break;

                    } else {
                        missing = loadedSnowball.modelId;
                    }

                }

                if (missing !== false && missing !== "") {

                    // console.log("[[[ removing expired object ]]]");

                    var selectedObject = scene.getObjectByName(missing);

                    //// not working, find how to reference an instantiated object and delete it
                    // selectedObject.geometry.dispose();
                    // selectedObject.material.dispose();

                    // selectedObject.remove(loadedSnowball);
                    // selectedObject.parent.remove(loadedSnowball);


                    scene.remove(selectedObject);
                }
            }




        });

        return snowballs;
    }

    assignEnemies(scene, loadedEnemies) {

        socket.off("enemies");

        socket.on("enemies", (serverEnemies) => {
            enemies = serverEnemies;

            var enemyCube;
            enemyCube = new THREE.Mesh(new THREE.BoxGeometry(17, 26, 17), new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }))


            let enemyDeath = new THREE.Mesh(new THREE.BoxGeometry(30, 24, 30), new THREE.MeshPhongMaterial({ color: 0x222222 * Math.random(), transparent: true, opacity: 0.3 }))
            enemyDeath.rotation.y = Math.PI / 4;

            


            for (const enemy of enemies) {

                enemyModelSpawned = false;

                for (const loadedEnemy of loadedEnemies) {

                    if (enemy.id === loadedEnemy.modelId) {
                        enemyModelSpawned = true;

                        if (enemy.dead === true && loadedEnemy.dead !== true) {

                            loadedEnemy.dead = true;


                            enemyDeath.modelId = enemy.id;
                            enemyDeath.burst = true;


                            loadedEnemies.push(enemyDeath);
                            scene.add(enemyDeath);

                        }

                        break;
                    }
                }

                if (!enemyModelSpawned) {

                    enemyModelSpawned = true;

                    console.log("[[[ ENEMY SPAWNED ]]]")

                    enemyCube.modelId = enemy.id;
                    enemyDeath.modelId = enemy.id;
                    enemyCube.shardEnabled = false;

                    

                    loadedEnemies.push(enemyCube);
                    scene.add(enemyCube);

                }

                /// add code here to change enemy color when it dies
                /// or spawn another object instead

            }
        });

        return enemies;
    }

    myPlayer() {
        return players.find((player) => player.id === socket.id);
    }

}

export { socket };