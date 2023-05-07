//// initial boilerplate code for socket.io servers

// const express = require("express");

// const app = express();
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   }
// });

////

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer,
  {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

// const PORT = process.env.PORT || 3000;

const loadMap = require("./mapLoader");

const SPEED = 5;
// 30 times per second / refresh rate
const TICK_RATE = 69;
const SNOWBALL_SPEED = 11;
const PLAYER_SIZE = 32;
const TILE_SIZE = 32;

let burstMovement = false;
let burstMovementCounter = 25;

let players = [];
let snowballs = [];
let playerMovements = [];
const inputsMap = {};
let ground2D, decal2D;

//< startup code for express
// app.use(express.static("public"));
// httpServer.listen(PORT);

app.use(cors());
httpServer.listen(3000);

//>

function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.h + rect1.y > rect2.y
  );
}

function isCollidingWithMap(player) {
  for (let row = 0; row < decal2D.length; row++) {
    for (let col = 0; col < decal2D[0].length; col++) {
      const tile = decal2D[row][col];

      if (
        tile &&
        isColliding(
          {
            x: player.x,
            y: player.y,
            w: 32,
            h: 32,
          },
          {
            x: col * TILE_SIZE,
            y: row * TILE_SIZE,
            w: TILE_SIZE,
            h: TILE_SIZE,
          }
        )
      ) {
        return true;
      }
    }
  }
  return false;
}

// for every tick, 
// we check all players input,
// and if a snowball collides with a player
function tick(delta, burstMovement) {
  for (const player of players) {
    const inputs = inputsMap[player.id];
    const previousY = player.y;
    const previousX = player.x;

    if (inputs.up) {
      player.y -= SPEED;
    } else if (inputs.down) {
      player.y += SPEED;
    }

    // stop player if colliding
    if (isCollidingWithMap(player)) {
      player.y = previousY;
    }

    if (inputs.left) {
      player.x -= SPEED;
    } else if (inputs.right) {
      player.x += SPEED;
    }

    // stop player if colliding
    if (isCollidingWithMap(player)) {
      player.x = previousX;
    }



    // propelling player
    if (burstMovement === true) {
      burstMovementCounter -= 1;

      // player.x += SPEED;
      // player.y += SPEED;

      let testMove = 0;
      for (const playerMovement of playerMovements) {
        console.log("Angle: " + playerMovement.angle);

        testMove = playerMovement.angle;

      }

      player.x += Math.cos(testMove) * SPEED;
      player.y += Math.sin(testMove) * SPEED;


      console.log("Player X: " + player.x);
      console.log("Player Y: " + player.y);


      // if(burstMovementCounter <= 0) { 
      //   burstMovementCounter = 5;
      //   burstMovement = "false";
      // } else {
      //   player.x += SPEED;
      //   player.y += SPEED;
      //   burstMovement = "false";
      //   burstMovementCounter = burstMovementCounter - 1;
    }



  }

  for (const snowball of snowballs) {

    // projectile travel
    snowball.x += Math.cos(snowball.angle) * SNOWBALL_SPEED;
    snowball.y += Math.sin(snowball.angle) * SNOWBALL_SPEED;
    snowball.timeLeft -= delta;

    for (const player of players) {

      // to prevent player being destroyed by own snowball
      if (player.id === snowball.playerId) continue;
      const distance = Math.sqrt(
        (player.x + PLAYER_SIZE / 2 - snowball.x) ** 2 +
        (player.y + PLAYER_SIZE / 2 - snowball.y) ** 2
      );

      // if snowball collided with a player, 
      // then reset that player to center
      if (distance <= PLAYER_SIZE / 2) {
        player.x = 0;
        player.y = 0;
        snowball.timeLeft = -1;
        break;
      }
    }
  }

  // filter and destroy snowballs that have no more time left
  snowballs = snowballs.filter((snowball) => snowball.timeLeft > 0);

  // send the "players" and "snowballs" update
  // (public) index.js will listen
  io.emit("players", players);
  io.emit("snowballs", snowballs);
}

async function main() {

  console.log("starting server");

  ({ ground2D, decal2D } = await loadMap());

  // //// User connects

  io.on("connect", (socket) => {

    // socket.id represents unique player
    console.log("user connected", socket.id);

    // initialize inputs (player movement)
    inputsMap[socket.id] = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    players.push({
      id: socket.id,
      x: 800,
      y: 800,
    });

    socket.emit("map", {
      ground: ground2D,
      decal: decal2D,
    });

    //// Player Movement
    socket.on("inputs", (inputs) => {
      inputsMap[socket.id] = inputs;
    });

    socket.on("mute", (isMuted) => {
      const player = players.find((player) => player.id === socket.id);
      player.isMuted = isMuted;
    });

    // used for Agora Proximity
    socket.on("voiceId", (voiceId) => {
      const player = players.find((player) => player.id === socket.id);
      player.voiceId = voiceId;
    });

    // waiting/listening for snowball emit
    socket.on("snowball", (angle) => {

      // find player who owns that click, to use its location
      const player = players.find((player) => player.id === socket.id);

      snowballs.push({
        angle,
        x: player.x,
        y: player.y,
        timeLeft: 1000,
        playerId: socket.id,
      });
    });

    socket.on("burstMove", (angle) => {

      // console.log("Burst Move!");
      burstMovement = true;

      playerMovements.push({
        angle,
      });
    })

    socket.on("disconnect", () => {
      players = players.filter((player) => player.id !== socket.id);
    });
  });



  // // calculate how much time has passed
  let lastUpdate = Date.now();
  setInterval(() => {
    const now = Date.now();
    const delta = now - lastUpdate;
    tick(delta, burstMovement);

    // stop burst movement
    if (burstMovementCounter <= 0) {
      burstMovement = false;
      burstMovementCounter = 25;
    }

    lastUpdate = now;
  }, 1000 / TICK_RATE);
}

main();

