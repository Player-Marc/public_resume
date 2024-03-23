const Snowball = require("./SnowballController");
const snowball = new Snowball();

var spawnRate = 8000;
var spawnTimer = 0;

class Enemy {

    constructor() {


    }

    spawn(enemies, delta, players) {

        let spawnLimit = 12;
        let spawnArea = 150;
        let spawnLocation = [];

        spawnTimer += delta

        if (enemies.length > spawnLimit) return;

        if (spawnTimer > spawnRate) {

            spawnTimer = 0;

            this.spawnChecker(players, spawnArea, spawnLocation);

            console.log("[[[ Number of enemies: " + enemies.length + " ]]]");

            enemies.push({
                id: Math.random() * 999 + Math.random() * 999,
                type: "enemy",
                activated: false,
                health: 20,
                dead: false,
                perishing: 3000,
                shield: 0,
                aggroRange: 150,
                exp: 0,
                yieldDestroyEXP: 3,
                yieldHitEXP: 1,
                yieldChargeDmg: 5,
                yieldchargeDebuff: 5,
                class: ["Ghoul", "Mystic"],
                attack: 10,
                speed: 0,
                size: 15,
                rune: ["Sigma", "Alpha"],
                affinity: ["Wind"],
                aggroRadius: 5,
                x: spawnLocation.x,
                y: spawnLocation.y,
                snowballStats: {
                    ready: 0,
                    rate: 900,
                    rateCooldown: 0,
                    speed: 1.5
                }

            });

        }

    }


    spawnChecker(players, spawnArea, spawnLocation) {

        let playerIsNear = true;
        let playerInsideArea = false;

        while (playerIsNear === true) {

            spawnLocation.x = Math.random() * 400;
            spawnLocation.y = Math.random() * 400;

            for (const player of players) {
                console.log("[[[ checking distance ]]]")

                let playerDistance = Math.sqrt(
                    (player.x + player.size / 2 - spawnLocation.x) ** 2 +
                    (player.y + player.size / 2 - spawnLocation.y) ** 2
                );


                if (playerDistance < spawnArea) {

                    console.log("[[[ player is near. relocating enemy spawn location ]]]")
                    playerInsideArea = true;
                    break;

                } else {
                    playerInsideArea = false;
                    console.log("[[[ player is far ]]]")
                }
            }

            playerIsNear = false;
            if (playerInsideArea === true) {
                playerIsNear = true;
            }
        }

        return spawnLocation;


        //// tried the code below first before but it didnt work:
        //// content inside for loop is not being read if its inside while loop
        //// all network objects not spawning (enemies, players, snowballs)

        // let playerIsNear = true;
        // let spawnLocation = [];
        // let spawnArea = 150;

        // while(playerIsNear && players !== undefined && players !== null){
        //     spawnLocation.x = Math.random() * 400;
        //     spawnLocation.y = Math.random() * 400;

        //     for (const player of players) {


        //         /// calculate distance of player to spawn location
        //         // const playerDistance = Math.sqrt(
        //         //     (player.x + player.size / 2 - spawnLocation.x) ** 2 +
        //         //     (player.y + player.size / 2 - spawnLocation.y) ** 2
        //         // );

        //         const playerDistance = 200;

        //         if (playerDistance < spawnArea) {

        //             console.log("[[[ relocating enemy spawn location ]]]")
        //             playerIsNear = true;
        //             break;

        //         } else {
        //             playerIsNear = false;
        //             console.log("[[[ enemy spawned ]]]")
        //         }


        //     }
        // }

        //// solution -> for loop will only work if while loop condition will be accomplished outside the for loop
        //// (while loop can, and should end even if for loop doesnt run)

    }

    act(enemies, players, snowballs, skills, delta) {

        for (const enemy of enemies) {

            enemy.snowballStats.rateCooldown += delta;

            for (const player of players) {

                const distance = Math.sqrt(
                    (player.x + player.size / 2 - enemy.x) ** 2 +
                    (player.y + player.size / 2 - enemy.y) ** 2
                );


                // enemy chases or shoots you if you are within his aggro range
                if (distance <= enemy.aggroRange) {



                    const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);

                    // move
                    enemy.x += Math.cos(angle) * enemy.speed;
                    enemy.y += Math.sin(angle) * enemy.speed;
                    // enemy.timeLeft -= delta;

                    // shoot
                    if (enemy.dead === false && enemy.activated) snowball.shoot(enemy, snowballs, angle, skills);


                }
            }
        }

    }



    hit(enemies, snowballs, players) {

        enemies.forEach((enemy, index) => {

            snowballs.forEach((snowball, snowballIndex) => {

                if (snowball.type === "enemy") return;

                if (this.isColliding(snowball, enemy)) {

                    const player = players.find((player) => player.id === snowball.playerId);



                    enemy.activated = true;
                    enemy.health -= snowball.damage;
                    if (enemy.health < 0 && !enemy.dead) {
                        enemy.dead = true;

                        setTimeout(() => {


                            if (player !== undefined) {

                                player.exp += enemy.yieldDestroyEXP;
                                player.score++;

                                console.log("Destroyed a Shard: Player EXP Gain: " + enemy.yieldDestroyEXP);
                            }


                            // enemies.splice(index, 1);
                            snowballs.splice(snowballIndex, 1);

                        }, 0)

                    }
                    console.log(enemy.health)
                    setTimeout(() => {
                        console.log("Damaged a Shard: Player EXP Gain: " + enemy.yieldHitEXP);
                        player.exp += enemy.yieldHitEXP;
                        snowballs.splice(snowballIndex, 1);
                    }, 0)

                }
            })

        })
    }

    alive(enemies, delta) {

        enemies.forEach((enemy, index) => {

            if (!enemy.dead) return;

            enemy.perishing -= delta;

            if (enemy.perishing > -1800) return;

            enemies.splice(index, 1);

            console.log("[[[ removing enemy ]]]");

        });

        // double assurance
        // return enemies.filter((enemy) => enemy.dead === false);
        return enemies;
    }


    isColliding(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.size &&
            rect1.x + rect1.size > rect2.x &&
            rect1.y < rect2.y + rect2.size &&
            rect1.size + rect1.y > rect2.y
        );
    }

    ///////////
    /// OLD ///
    ///////////

    OLD_alive() {

        for (const enemy of enemies) {

            enemy.dead = false;

            for (const snowball of snowballs) {

                if (this.isColliding(enemy, snowball) && enemy.dead === false) {



                    console.log("Enemy Index: " + enemies.indexOf(enemy));

                    // console.log(snowballs.indexOf(snowball));
                    enemy.health = enemy.health - snowball.damage;
                    console.log("Enemy Health: " + enemy.health);

                    setTimeout(() => {
                        snowballs.splice(snowballs.indexOf(snowball), 1);
                    }, 0)

                    // remove dead enemies and give exp to player
                    if (enemy.health < 0) {
                        enemy.dead = true;
                        const player = players.find((player) => player.id === snowball.playerId);
                        player.exp++;



                        console.log("Player EXP Gain: " + player.exp);

                        setTimeout(() => {
                            enemies.splice(enemies.indexOf(enemy), 1);
                            snowballs.splice(snowballs.indexOf(snowball), 1);
                        }, 0)

                    }



                }


            }

        }
    }


}


module.exports = Enemy;