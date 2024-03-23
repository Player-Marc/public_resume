
let cameraX = 0;
let cameraY = 0;
const canvasEl = document.getElementById("canvas");

export default class Camera {
    constructor() {

    }

    centerX(myPlayer) {
        // if this player is matching your socket.id
        if (myPlayer) {
            // parsing to int to prevent map tearing
            cameraX = parseInt(myPlayer.x - canvasEl.width / 2);
        }
        return cameraX;
        //>
    }

    centerY(myPlayer) {
        // if this player is matching your socket.id
        if (myPlayer) {
            // parsing to int to prevent map tearing
            cameraY = parseInt(myPlayer.y - canvasEl.height / 2);
        }
        return cameraY;
        //>
    }
    
}