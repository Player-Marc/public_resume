import Camera from "./Camera";

const camera = new Camera();
const mapImage = new Image();
mapImage.src = "/snowy-sheet.png";

const TILE_SIZE = 32;
const TILES_IN_ROW = 8;

export default class Map {

  constructor(canvas) {
    this.canvas = canvas;
  }

  drawGround(groundMap, myPlayer) {

    // draw ground 
    for (let row = 0; row < groundMap.length; row++) {
      for (let col = 0; col < groundMap[0].length; col++) {
        let { id } = groundMap[row][col];
        const imageRow = parseInt(id / TILES_IN_ROW);
        const imageCol = id % TILES_IN_ROW;
        this.canvas.drawImage(
          mapImage,

          imageCol * TILE_SIZE,
          imageRow * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,

          // subtracting here to center at player
          col * TILE_SIZE - camera.centerX(myPlayer),
          row * TILE_SIZE - camera.centerY(myPlayer),
          TILE_SIZE,
          TILE_SIZE
        );
      }
    }
  }


  drawDecals(decalMap, myPlayer) {

    // draw decals
    for (let row = 0; row < decalMap.length; row++) {
      for (let col = 0; col < decalMap[0].length; col++) {

        // if row or col is empy or undefined, 
        // then set id as undefined
        let { id } = decalMap[row][col] ?? { id: undefined };
        const imageRow = parseInt(id / TILES_IN_ROW);
        const imageCol = id % TILES_IN_ROW;

        this.canvas.drawImage(
          mapImage,
          imageCol * TILE_SIZE,
          imageRow * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
          col * TILE_SIZE - camera.centerX(myPlayer),
          row * TILE_SIZE - camera.centerY(myPlayer),
          TILE_SIZE,
          TILE_SIZE
        );
      }
    }

  }

}