class ContestController {

    startContest(players) {

        setTimeout(() => {
            
            for (const player of players) {

                console.log(" >>> Starting Contest. Reseting player [[[ " + player + " ]]] <<<");
                
                player.x = Math.floor(Math.random() * 400);
                player.y = Math.floor(Math.random() * 400);
    
                player.health = 2;
    
                player.exp = 0;
                player.level = 1;
    
                player.skillsActive = [];
                player.skillsDeck = [];
            }


          }, 3000);

        
    }
}

module.exports = ContestController;