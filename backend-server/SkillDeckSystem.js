class SkillDeckSystem {

    addToActive(players, skill) {

        for (const player of players) {

            if (player.id === skill.playerId) continue;

            player.skillsActive.push(skill.number);

        }

    }

    addToDeck(player, skill) {



        if (player.skillsActive.length + 1 > player.activeLimit) {

            console.log("Active Full. Adding to deck...");

            player.skillsDeck.push(skill);

        } else {
            
            player.skillsActive.push(skill);

            console.log("Added to active skills: " + player.skillsActive[player.skillsActive.length - 1]);
        }
    }

}

module.exports = SkillDeckSystem;