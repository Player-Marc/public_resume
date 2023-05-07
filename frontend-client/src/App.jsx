import { BrowserRouter } from "react-router-dom";

import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas } from "./components";
import Field from "./components/Field";

import "reflect-metadata"

import io from 'socket.io-client'


const App = () => {


  const mapImage = new Image();
  mapImage.src = "/snowy-sheet.png";

  const santaImage = new Image();
  santaImage.src = "/santa.png";

  const canvasEl = document.getElementById("canvas");
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;
  const canvas = canvasEl.getContext("2d");


  let groundMap = [[]];
  let decalMap = [[]];

  let players = [];
  let snowballs = [];

  const TILE_SIZE = 32;
  const SNOWBALL_RADIUS = 5;

  // const socket = io.connect("http://localhost:3000");
  const socket = io.connect("https://tresum.onrender.com");

  socket.on("map", (loadedMap) => {
    groundMap = loadedMap.ground;
    decalMap = loadedMap.decal;
  });

  // when "players" event is emitted
  socket.on("players", (serverPlayers) => {
    players = serverPlayers;
  });

  socket.on("snowballs", (serverSnowballs) => {
    snowballs = serverSnowballs;
  });

  const inputs = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  // first listener for movement
  window.addEventListener("keydown", (e) => {
    if (e.key === "w") {
      inputs["up"] = true;
    } else if (e.key === "s") {
      inputs["down"] = true;
    } else if (e.key === "d") {
      inputs["right"] = true;
    } else if (e.key === "a") {
      inputs["left"] = true;
    }

    // if any of this is pressed, then play audio
    // if (["a", "s", "w", "d"].includes(e.key) && walkSnow.paused) {
    //   // walkSnow.play();
    // }

    socket.emit("inputs", inputs);
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "w") {
      inputs["up"] = false;
    } else if (e.key === "s") {
      inputs["down"] = false;
    } else if (e.key === "d") {
      inputs["right"] = false;
    } else if (e.key === "a") {
      inputs["left"] = false;
    }

    // if any of this 
    // if (["a", "s", "w", "d"].includes(e.key)) {
    //   walkSnow.pause();
    //   walkSnow.currentTime = 0;
    // }

    socket.emit("inputs", inputs);
  });

  // projectile on click
  // (e) is the location of mouse click
  window.addEventListener("click", (e) => {

    console.log("Mouse Click");

    const angle = Math.atan2(
      e.clientY - canvasEl.height / 2,
      e.clientX - canvasEl.width / 2
    );
    socket.emit("snowball", angle);

    const movement = false;
    socket.emit("burstMove", angle);

  });

  // draw objects and map every frame
  function loop() {

    ////<<<// Map display code (((

    // canvas.clearRect(0, 0, canvasEl.width, canvasEl.height);

    // let cameraX = 0;
    // let cameraY = 0;

    // const TILES_IN_ROW = 8;

    // // draw ground 
    // for (let row = 0; row < groundMap.length; row++) {
    //   for (let col = 0; col < groundMap[0].length; col++) {
    //     let { id } = groundMap[row][col];
    //     const imageRow = parseInt(id / TILES_IN_ROW);
    //     const imageCol = id % TILES_IN_ROW;
    //     canvas.drawImage(
    //       mapImage,

    //       imageCol * TILE_SIZE,
    //       imageRow * TILE_SIZE,
    //       TILE_SIZE,
    //       TILE_SIZE,

    //       // subtracting here to center at player
    //       col * TILE_SIZE - cameraX,
    //       row * TILE_SIZE - cameraY,
    //       TILE_SIZE,
    //       TILE_SIZE
    //     );
    //   }
    // }

    // // draw decals
    // for (let row = 0; row < decalMap.length; row++) {
    //   for (let col = 0; col < decalMap[0].length; col++) {

    //     // if row or col is empy or undefined, 
    //     // then set id as undefined
    //     let { id } = decalMap[row][col] ?? { id: undefined };
    //     const imageRow = parseInt(id / TILES_IN_ROW);
    //     const imageCol = id % TILES_IN_ROW;

    //     canvas.drawImage(
    //       mapImage,
    //       imageCol * TILE_SIZE,
    //       imageRow * TILE_SIZE,
    //       TILE_SIZE,
    //       TILE_SIZE,
    //       col * TILE_SIZE - cameraX,
    //       row * TILE_SIZE - cameraY,
    //       TILE_SIZE,
    //       TILE_SIZE
    //     );
    //   }
    // }

    // ////>>>// Map code )))


    // ////<<<// Player, snowball, and movement code (((

    // // find player that is matching your socket.id
    // const myPlayer = players.find((player) => player.id === socket.id);

    // //< code to help center camera to your player
    // if (myPlayer) {
    //   // parsing to int to prevent map tearing
    //   cameraX = parseInt(myPlayer.x - canvasEl.width / 2);
    //   cameraY = parseInt(myPlayer.y - canvasEl.height / 2);
    // }
    // //>

    // for (const player of players) {

    //   // draw player
    //   // subtracting camera here to center camera to player
    //   canvas.drawImage(santaImage, player.x - cameraX, player.y - cameraY);

    // }

    // // draw snowball
    // for (const snowball of snowballs) {
    //   canvas.fillStyle = "#FFFFFF";
    //   canvas.beginPath();
    //   canvas.arc(
    //     snowball.x - cameraX,
    //     snowball.y - cameraY,
    //     SNOWBALL_RADIUS,
    //     0,
    //     2 * Math.PI
    //   );
    //   canvas.fill();
    // }

    ////>>>// Player, snowball, and movement code )))

    canvas.clearRect(0, 0, canvasEl.width, canvasEl.height);

    // find player that is matching your socket.id
    const myPlayer = players.find((player) => player.id === socket.id);

    //< code to help center camera to your player
    let cameraX = 0;
    let cameraY = 0;
    if (myPlayer) {
      // parsing to int to prevent map tearing
      cameraX = parseInt(myPlayer.x - canvasEl.width / 2);
      cameraY = parseInt(myPlayer.y - canvasEl.height / 2);
    }
    //>

    const TILES_IN_ROW = 8;

    // draw ground 
    for (let row = 0; row < groundMap.length; row++) {
      for (let col = 0; col < groundMap[0].length; col++) {
        let { id } = groundMap[row][col];
        const imageRow = parseInt(id / TILES_IN_ROW);
        const imageCol = id % TILES_IN_ROW;
        canvas.drawImage(
          mapImage,

          imageCol * TILE_SIZE,
          imageRow * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,

          // subtracting here to center at player
          col * TILE_SIZE - cameraX,
          row * TILE_SIZE - cameraY,
          TILE_SIZE,
          TILE_SIZE
        );
      }
    }

    // draw decals
    for (let row = 0; row < decalMap.length; row++) {
      for (let col = 0; col < decalMap[0].length; col++) {

        // if row or col is empy or undefined, 
        // then set id as undefined
        let { id } = decalMap[row][col] ?? { id: undefined };
        const imageRow = parseInt(id / TILES_IN_ROW);
        const imageCol = id % TILES_IN_ROW;

        canvas.drawImage(
          mapImage,
          imageCol * TILE_SIZE,
          imageRow * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
          col * TILE_SIZE - cameraX,
          row * TILE_SIZE - cameraY,
          TILE_SIZE,
          TILE_SIZE
        );
      }
    }

    for (const player of players) {

      // draw player
      // subtracting camera here to center camera to player
      canvas.drawImage(santaImage, player.x - cameraX, player.y - cameraY);

    }

    // draw snowball
    for (const snowball of snowballs) {
      canvas.fillStyle = "#FFFFFF";
      canvas.beginPath();
      canvas.arc(
        snowball.x - cameraX,
        snowball.y - cameraY,
        SNOWBALL_RADIUS,
        0,
        2 * Math.PI
      );
      canvas.fill();
    }


    window.requestAnimationFrame(loop);
  }

  window.requestAnimationFrame(loop);


  return (
    <BrowserRouter>
      <canvas id="canvas"></canvas>
      <div className='relative z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
          <Field />
          <Hero />
        </div>
        <About />
        <Experience />
        <Tech />
        <Works />
        <Feedbacks />
        <div className='relative z-0'>
          <Contact />
          <StarsCanvas />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App


