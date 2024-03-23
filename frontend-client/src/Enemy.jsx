import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
const loader = new GLTFLoader();

export default class Enemy {
  constructor() {
    // this.canvas = canvas;
  }

  // passing in myPlayer coordinates so that,
  // the design stays in position even if camera moves
  draw(enemies, myPlayer, loadedEnemies, scene) {

    for (const enemy of enemies) {

      for (const loadedEnemy of loadedEnemies) {

        if (loadedEnemy.modelId === enemy.id) {

          loadedEnemy.position.x = enemy.x;
          loadedEnemy.position.z = enemy.y;


          if (enemy.dead) {

            let posY = enemy.perishing / 3000 * 18;

            if (loadedEnemy.burst) {

              let burstScale = 1 - Math.abs(Math.max(enemy.perishing, 0) / 3000);

              loadedEnemy.scale.set(burstScale, burstScale, burstScale);


            } else {

              
              posY = Math.min(enemy.perishing, enemy.perishing * 1.4) / 3000 * 18;

            }

            loadedEnemy.position.y = posY;

          } else {

            loadedEnemy.position.y = 18;

          }


          if (loadedEnemy.shardEnabled === false) {
            loadedEnemy.shardEnabled = true;

            loader.load('./shard_enemy.glb', (shard) => {



              scene.add(shard.scene)
              shard.scene.scale.set(122, 122, 122);
              shard.scene.position.x = enemy.x;
              shard.scene.position.z = enemy.y;

              shard.scene.position.y = 16;

              shard.scene.rotation.y = Math.floor(Math.random() * 360);

              loadedEnemy.shard = shard.scene;

            })
          } else {

            if (loadedEnemy.shard) {
              loadedEnemy.shard.position.x = enemy.x;
              loadedEnemy.shard.position.z = enemy.y;

              if (enemy.dead) {
                let posY = Math.max((enemy.perishing / 3000 * 16), -4);
                loadedEnemy.shard.position.y = posY;

                // loadedEnemy.shard.material.transparent = true;
                // loadedEnemy.shard.material.opacity = 0.2; 

                loadedEnemy.traverse((node) => {
                  if (node.isMesh) {
                    node.material.transparent = true;
                    node.material.opacity = Math.max( Math.abs(Math.max(enemy.perishing, 0) / 3000), 0.3);
                  }
                });

                loadedEnemy.shard.traverse((node) => {
                  if (node.isMesh) {
                    node.material.transparent = true;
                    node.material.opacity = Math.max( Math.abs(Math.max(enemy.perishing, 0) / 3000), 0.3);
                  }
                });


              }

            }
          }




        }

      }

      // 2d Canvas Style
      // this.canvas.fillStyle = "#000000";
      // this.canvas.beginPath();
      // this.canvas.arc(
      //   enemy.x - camera.centerX(myPlayer),
      //   enemy.y - camera.centerY(myPlayer),
      //   enemy.size,
      //   0,
      //   2 * Math.PI
      // );
      // this.canvas.fill();



      /////




    }

  }

}