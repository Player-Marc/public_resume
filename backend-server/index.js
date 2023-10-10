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
const loadMap = require("./mapLoader");
const PlayerMovement = require("./PlayerController");
const Snowball = require("./SnowballController");
const Buff = require("./BuffController");
const Skill = require("./SkillController");
const SocketReceivers = require("./SocketReceivers");
const Enemy = require("./Enemy");
const SkillDeckSystem = require("./SkillDeckSystem");
const skillsLibrary = require("./SkillsLibrary");
const buffsLibrary = require("./BuffsLibrary");

//< startup code for express
// app.use(express.static("public"));
// httpServer.listen(PORT);
const app = express();
const httpServer = createServer(app);

app.use(cors());
httpServer.listen(3000);

const io = new Server(httpServer,
  {
    cors: {
      // origin: 'https://explore-quest.netlify.app',
      origin: "http://localhost:5173",
      methods: ['GET', 'POST']
    }
  });

// const PORT = process.env.PORT || 3000;



// 30 times per second / refresh rate
const TICK_RATE = 69;


let burstMovement = false;

let players = [];
let snowballs = [];
let skills = [];
let enemies = [];
const inputsMap = {};
const clicksMap = {};
let ground2D, decal2D;


const playerMovement = new PlayerMovement();
const snowball = new Snowball();
const buff = new Buff();
const socketReceivers = new SocketReceivers();
const skill = new Skill();
const enemy = new Enemy();
const skillDeckSystem = new SkillDeckSystem();

const enemiesNumber = 8;



async function main() {

  console.log("starting server");

  ({ ground2D, decal2D } = await loadMap());

  

  // User connects
  io.on("connect", (socket) => {

    // socket.id represents unique player
    console.log("user connected", socket.id);


    /// when copying arrays without reference use this [... ]
    var playerStartingDeckBuff = [...buffsLibrary.available];
    var playerStartingDeckSkill = [...skillsLibrary.skillsAvailable];
    
    
    // initialize inputs (player movement)
    inputsMap[socket.id] = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    clicksMap[socket.id] = {
      clickAngle: false,
      activatedSkill: false

    }

    skills.push({
      id: "BASE",
      playerId: socket.id,
      duration: 40,
      remainingDuration: 40,
      tackleSpeed: 7,
      cooldown: 250,
      releaseOnClick: true,
      angle: 0,
      disableShoot: true,
      finished: true
    });


    // player spawn
    players.push({
      id: socket.id,
      loaded: false,
      type: "player",
      x: Math.floor(Math.random() * 400),
      y: Math.floor(Math.random() * 400),
      score: 0,
      health: 2,
      healthRecharge: 2,
      isHit: false,
      size: 5,
      speed: 1,
      level: 1,
      exp: 0,
      color: "blue",
      activeLimit: 4,
      buffsDeck: playerStartingDeckBuff,
      buffRate: 3500,
      buffRateCooldown: 0,
      snowballStats: {
        ready: 0,
        rate: 500,
        rateCooldown: 0,
        speed: 2
      },
      shieldCharge: {
        timer: 0,
        duration: 1200,
        movement: 0.4,
      },
      contest: {
        leader: "",
        inviters: [],
        members: []
      },
      skillsActive: [],
      skillsDeck: [],
      skillsSelection: playerStartingDeckSkill
    });

    for (var i = 0; i < enemiesNumber; i++) {
      enemies.push({
        id: socket.id + i,
        type: "enemy",
        activated: false,
        health: 20,
        perishing: 3000,
        dead: false,
        shield: 0,
        aggroRange: 150,
        exp: 0,
        yieldDestroyEXP: 3,
        yieldHitEXP: 5,
        yieldChargeDmg: 5,
        yieldchargeDebuff: 5,
        class: ["Ghoul", "Mystic"],
        attack: 10,
        speed: 0,
        size: 15,
        rune: ["Sigma", "Alpha"],
        affinity: ["Wind"],
        aggroRadius: 5,
        x: Math.floor(Math.random() * 400),
        y: Math.floor(Math.random() * 400),
        snowballStats: {
          ready: 0,
          rate: 900,
          rateCooldown: 0,
          speed: 1.5
        }

      });
    }

    buff.applyStartingBuffs(players);

    // socket.emit("map", {
    //   ground: ground2D,
    //   decal: decal2D,
    // });

    socketReceivers.listen(socket, players, inputsMap,
      buff, skills, clicksMap, snowballs, io);

  });

  // calculate how much time has passed
  let lastUpdate = Date.now();

  // animate
  setInterval(() => {
    const now = Date.now();
    const delta = now - lastUpdate;

    tick(delta, burstMovement);

    lastUpdate = now;
  }, 1000 / TICK_RATE);

}


// for every tick, 
// we check all players input,
// and if a snowball collides with a player
function tick(delta) {

  //// snowball.OLD_shoot(players, snowballs, skills, clicksMap);
  //// skill.OLD_activated(players, clicksMap, skills);

  skill.inProgress(players, skills);

  playerMovement.update(players, inputsMap, decal2D, io, delta);

  snowball.update(snowballs, players, delta);

  enemy.spawn(enemies, delta, players);

  enemy.act(enemies, players, snowballs, skills, delta);

  enemy.hit(enemies, snowballs, players)

  /// (public) index.js will listen:
  /// send the "players" , "snowballs", etc. frontend/client updates

  io.emit("upgradesCooldown", skills)

  io.emit("players", players);

  io.emit("snowballs", snowball.alive(snowballs));

  io.emit("enemies", enemy.alive(enemies, delta));


}



main();

