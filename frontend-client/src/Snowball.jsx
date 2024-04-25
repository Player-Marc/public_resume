import * as THREE from "three";

import Camera from "./Camera";

const camera = new Camera();
const SNOWBALL_RADIUS = 5;

export default class Snowball {

  constructor() {
    // this.canvas = canvas;
  }

  draw(snowballs, myPlayer, loadedSnowballs, loadedPlayers) {

    // if(snowballs.length > 0){
    //   console.log("Snowballs Existing . . .")
    // }

    // draw snowball
    for (const snowball of snowballs) {

      for (const loadedSnowball of loadedSnowballs) {

        if (loadedSnowball.modelId === snowball.id) {

          loadedSnowball.position.x = snowball.x;
          loadedSnowball.position.z = snowball.y;

        }

      }

      for (const loadedPlayer of loadedPlayers) {

        if (snowball.playerId === loadedPlayer.playerId) {
          if (loadedPlayer.playerShip) {
            loadedPlayer.playerShip.rotation.y = -snowball.angle;
          }
        }
      }

      // this.canvas.fillStyle = "#FFFFFF";
      // this.canvas.beginPath();
      // this.canvas.arc(
      //   snowball.x - camera.centerX(myPlayer),
      //   snowball.y - camera.centerY(myPlayer),
      //   snowball.size,
      //   0,
      //   2 * Math.PI
      // );
      // this.canvas.fill();
    }
  }

}