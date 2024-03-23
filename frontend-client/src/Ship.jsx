import Camera from "./Camera";

const camera = new Camera();
const santaImage = new Image();
santaImage.src = "/santa.png";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
const loader = new GLTFLoader();


export default class Ship {

    constructor() {
        // this.canvas = canvas;
    }

    draw(players, myPlayer, loadedPlayers, camera3d, scene, lightP, lightS) {

        //draw every ship on their respective location but the camera is on your character
        for (const player of players) {

            for (const loadedPlayer of loadedPlayers) {

                if (loadedPlayer.playerId === player.id) {

                    // console.log("Updating player . . . ")

                    loadedPlayer.position.x = player.x;
                    loadedPlayer.position.z = player.y;

                    // loadedPlayer.rotation.x += 0.005
                    // loadedPlayer.rotation.y += 0.005

                    lightP.position.set(player.x, 5, player.y);
                    lightS.position.set(player.x, 110, player.y);
                    lightS.target.position.set(player.x, 0, player.y);
                    
                    if(loadedPlayer.shipEnabled === false){
                        loadedPlayer.shipEnabled = true;

                        loader.load('./spaceship.glb', (spaceship) => {
                            scene.add(spaceship.scene)
                            spaceship.scene.scale.set(0.07,0.07,0.07);    
                            spaceship.scene.position.x = player.x;
                            spaceship.scene.position.z = player.y;

                            loadedPlayer.playerShip = spaceship.scene;
    
                          })
                    } else {

                        if(loadedPlayer.playerShip){
                            loadedPlayer.playerShip.position.x = player.x;
                            loadedPlayer.playerShip.position.z = player.y;
                        }
                    }
                }
            }

            if (player.id === myPlayer.id) {
                camera3d.position.x = player.x
                camera3d.position.z = player.y
            }


            // draw player
            // subtracting camera here to center camera to player
            // this.canvas.drawImage(santaImage,
            //     player.x - camera.centerX(myPlayer),
            //     player.y - camera.centerY(myPlayer));

            // this.canvas.strokeStyle = player.color;
            // this.canvas.strokeRect(player.x - camera.centerX(myPlayer), player.y - camera.centerY(myPlayer), 50, 50);

        }
    }

}