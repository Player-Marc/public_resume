var id = 0;
let snowballCount = 0;

class Snowball {



  constructor() {
    this.timePassed = 0;
  }

  update(snowballs, players, delta) {
    
    
    for (const snowball of this.alive(snowballs)) {
      

      // projectile travel
      snowball.x += Math.cos(snowball.angle) * snowball.speed;
      snowball.y += Math.sin(snowball.angle) * snowball.speed;
      snowball.timeLeft -= delta;

      for (const player of players) {

        // to prevent player being destroyed by own snowball
        if (player.id === snowball.playerId) continue;

        const distance = Math.sqrt(
          (player.x + player.size / 2 - snowball.x) ** 2 +
          (player.y + player.size / 2 - snowball.y) ** 2
        );

        // if snowball collided with a player, 
        if (distance <= player.size / 2) {
          // then reset that player to center
          // player.x = 0;
          // player.y = 0;
          player.health -= snowball.playerDamage;
          player.isHit = true;

          // give exp to who owns the snowball
          let playerDamager = players.filter((player) => player.id === snowball.playerId);
          playerDamager.exp += Math.max( (player.score - playerDamager.score) - (player.level - playerDamager.level) ,0);

          if(player.health < 1){
            // playerDamager.destroyedPlayers.push(player.id);
          }

          snowball.timeLeft = -1;
          break;
        }
      }
    }
  }

  shoot(origin, snowballs, angle, skills) {

    if(origin.health < 1) return;

    for (const skill of skills) {

      if (skill.playerId === origin.id
        && skill.releaseOnClick === true) {

        skill.releaseOnClick = false;
        skill.angle = angle;

        console.log("Skill Released");

      } else {

        if (origin.snowballStats.rateCooldown > origin.snowballStats.rate ) {

          origin.snowballStats.rateCooldown = 0;
          snowballCount++;
          snowballs.push({
            id: origin.id + snowballCount,
            health: 1,
            type: origin.type,
            hit: false,
            angle: angle,
            x: origin.x,
            y: origin.y,
            timeLeft: 2000,
            playerId: origin.id,
            speed: origin.snowballStats.speed,
            size: 5,
            damage: 3,
            playerDamage: 1
          });
        }
      }
    }
  }

  alive(snowballs) {
    // filter and destroy snowballs that have no more time left
    return snowballs = snowballs.filter((snowball) => snowball.timeLeft > 0 && snowball.hit === false);
  }


  ///////////
  /// OLD ///
  ///////////

  OLD_shoot(players, snowballs, skills, clicksMap) {

    for (const player of players) {

      const click = clicksMap[player.id];

      for (const skill of skills) {

        if (skill.playerId === player.id
          && click.clickAngle !== false
          && skill.releaseOnClick === true) {

          skill.releaseOnClick = false;
          skill.angle = click.clickAngle;
          click.activatedSkill = skill.number;
          click.clickAngle = false;
          clicksMap[player.id].activatedSkill = false;

          console.log("Skill Released");

        }
      }

      player.snowballStats.ready++;

      if (player.snowballStats.ready >= player.snowballStats.cooldown) {

        player.snowballStats.ready = 0;

        if (click.clickAngle !== false) {

          console.log("SNOWBALL THROW");
          snowballs.push({
            angle: click.clickAngle,
            x: player.x,
            y: player.y,
            timeLeft: 1000,
            playerId: player.id,
            speed: player.snowballStats.speed,
            size: 5,
            damage: 3
          });
        }

        // setting clickAngle to false to reset click so player needs to click again
        // disabling this enables autofire
        click.clickAngle = false;

      }
    }
  }

}

module.exports = Snowball;