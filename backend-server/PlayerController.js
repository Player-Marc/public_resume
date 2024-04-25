
const TILE_SIZE = 32;

let interval = false;

class PlayerMovement {

  constructor() {}

  update(players, inputsMap, decal2D, io, delta) {

    for (const player of players) {

      if(player.loaded === false){
        player.loaded = true;
        io.emit("playerHealth", player.id, player.health);

      }

      if(player.isHit){
        io.emit("playerHealth", player.id, player.health, "damaged");
        player.isHit = false;
        
      } 

      if(player.health < 1){

        // activate shield-charge state
        if(this.shieldCharge(player, delta)){
          io.emit("playerHealth", player.id, player.health, "recharged");
        }

      }

      player.snowballStats.rateCooldown += delta;

      this.movement(player, inputsMap, decal2D)

      this.upgrade(player, io, delta, players)

      if (interval === false) continue;
      interval = false;
    }
  }

  movement(player, inputsMap, decal2D) {

    const inputs = inputsMap[player.id];
    const previousY = player.y;
    const previousX = player.x;

    let speed = 1;

    if(player.health < 1){
      speed = player.shieldCharge.movement;
    } else {
      speed = player.speed;
    }

    if (inputs.up) {
      player.y -= speed;
    } else if (inputs.down) {
      player.y += speed;
    }

    // stop player if colliding
    if (this.isCollidingWithObject(player, decal2D)) {
      player.y = previousY;
    }

    if (inputs.left) {
      player.x -= speed;
    } else if (inputs.right) {
      player.x += speed;
    }

    // stop player if colliding
    if (this.isCollidingWithObject(player, decal2D)) {
      player.x = previousX;
    }

  }

  upgrade(player, io, delta, players) {

    let result = [];
    let expToLevelUp =  8 + (6 * player.level / 3.5);

    player.buffRateCooldown += delta;

    let buffProgress = {
      player: player.id,
      percent: player.buffRate / player.buffRateCooldown,
      value: player.buffRateCooldown
    };

    let skillProgress = {
      player: player.id,
      value: player.exp
    };
    
    if (player.exp >= expToLevelUp) {

      player.exp = 0;
      player.level++;

      console.log("Level Up");

      for (var i = 0; i < 2; i++) {

        if (player.skillsSelection.length === 0) continue;

        const skillInSelection = this.getRandomSkill(player.skillsSelection);

        skillInSelection.skill.playerId = player.id;

        result.push(skillInSelection.skill);

        player.skillsSelection.splice(skillInSelection.index, 1);
      }
    }

    // may improve code here (make it dynamic)
    if (player.buffRate < player.buffRateCooldown) {

      // console.log("[[[ Player: " + player.id + "]]] levels up buff");

      // reset buff rate if it exceeds buffRate
      player.buffRateCooldown = 0;


      if (player.buffsDeck.length === 0 && players.length > 1 && player.dede !== "test"){
        console.log("wdwdwdwd" + players.find(searchPlayer => player.id !== searchPlayer.id).buffsDeck)
        player.dede = "test"
      }



      if (player.buffsDeck.length === 0) return;

      // console.log("[[[ Player: " + player.id + "]]] will be sent a buff selection");
      

      const buffInSelection = this.getRandomSkill(player.buffsDeck);

      buffInSelection.skill.playerId = player.id;

      result.push(buffInSelection.skill);

      player.buffsDeck.splice(buffInSelection.index, 1);


      
      const buffInSelection2 = this.getRandomSkill(player.buffsDeck);

      buffInSelection2.skill.playerId = player.id;

      result.push(buffInSelection2.skill);

      player.buffsDeck.splice(buffInSelection2.index, 1);


      


      // to improve: add element tag
      // result.push(player.id);

      // console.log("New Skill for: " + player.id);
    }

     

    io.emit("skillProgress", skillProgress, expToLevelUp);
    io.emit("buffProgress", buffProgress);

    if (result.length > 0) {

      console.log("Sending upgrades to pick.");
      console.log("First upgrade module should be: " + result[0].title);

      io.emit("setUpgradeBuffs", result);
      io.emit("setUpgradeSkills", result);
      io.emit("setUpgradePoints", result);
    }

  }

  shieldCharge(player, delta) {

    if(player.shieldCharge.timer > player.shieldCharge.duration){

      player.shieldCharge.timer = 0;
      player.health = player.healthRecharge;
      
      return true;

    } else {

      // console.log("CHARGING!!!!!!");
      player.shieldCharge.timer += delta;

    }

    return false;
  }



  getRandomSkill(arr) {

    let skillsMap = {
      skill: 0,
      index: 0
    }

    // get random index value
    const randomIndex = Math.floor(Math.random() * arr.length);

    skillsMap.skill = arr[randomIndex];
    skillsMap.index = randomIndex;

    return skillsMap;
  }


  isCollidingWithObject(player, decal2D) {
    for (let row = 0; row < decal2D.length; row++) {
      for (let col = 0; col < decal2D[0].length; col++) {
        const tile = decal2D[row][col];

        if (
          tile &&
          this.isColliding(
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

  isColliding(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.w &&
      rect1.x + rect1.w > rect2.x &&
      rect1.y < rect2.y + rect2.h &&
      rect1.h + rect1.y > rect2.y
    );
  }

}

module.exports = PlayerMovement;