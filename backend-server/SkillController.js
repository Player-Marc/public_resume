const skillsLibrary = require("./SkillsLibrary")

class Skill {

    activate(player, selectedSkillSlot, skills) {

        if(player.skillsActive[selectedSkillSlot] === undefined || player.skillsActive[selectedSkillSlot] === null) return;

        var activatedSkill = 0;
        activatedSkill = player.skillsActive[selectedSkillSlot];
        console.log("Activated Skill: " + activatedSkill);

        
        /// put activated skill to deck and remove from active
        player.skillsDeck.push(activatedSkill);
        player.skillsActive.splice(selectedSkillSlot, 1);

        // add card from deck to active
        player.skillsActive.push(player.skillsDeck[0]);

        // remove from top card from deck
        player.skillsDeck.splice(0, 1);


        selectedSkillSlot = false;


        for (const skill of skills) {

            if (skill.playerId !== player.id) continue;

            skillsLibrary.skillActivate(activatedSkill, skills, skill, player);

        }

    }


    inProgress(players, skills) {

        for (const player of players) {

            for (const skill of skills) {

                // if (skill.id === "BASE") continue;

                if (skill.playerId !== player.id) continue;

                if (skill.releaseOnClick === true) continue;

                skill.cooldown--;

                if (skill.cooldown < 0) {
                    // console.log("Removing skill")
                    // skills.splice(skills.indexOf(skill), 1);
                }

                if (skill.finished === true) {
                    // skills.splice(skills.indexOf(skill), 1);
                    continue;
                }

                skillsLibrary.skillInProgress(skill, player);

            }
        }
    }

    ///////////
    /// OLD ///
    ///////////

    skillAttributes() {

        duration
        tackleSpeed
        projectileSpeed
        projectileSize
        projectileHealth
        playerDamage
        mobDamage
        cooldown
        knockback
        knockbackBreak
        counter
        type
        affinity
        statusEffect
        crowdControl

    }

    OLD_activated(players, clicksMap, skills) {

        for (const player of players) {

            for (const skill of skills) {

                if (skill.playerId !== player.id) continue;

                skill.cooldown--;

                var activatedSkill = 0;
                if (clicksMap[player.id].activatedSkill === "1") {
                    activatedSkill = player.skillsActive[0];
                }

                // normal tackle skill
                if (activatedSkill === "1") {

                    clicksMap[player.id].activatedSkill = false;

                    if (skill.cooldown < 0) {
                        skills.push({
                            number: "1",
                            playerId: player.id,
                            duration: 25,
                            remainingDuration: 25,
                            tackleSpeed: 7,
                            cooldown: 250,
                            releaseOnClick: true,
                            angle: skill.angle,
                            disableShoot: true,
                            finished: false
                        });

                        skill.number = 0;
                    }
                }
            }
            //// alternative way:
            // skills.forEach((skill) => {
            //     if(skill.cooldown < 0){

            //     }
            // });
        }
    }

    OLD_inProgress(players, skills) {

        for (const player of players) {

            for (const skill of skills) {

                if (skill.playerId !== player.id || skill.finished === true) {

                    // console.log("skill finished")

                } else if (skill.number === "1") {

                    // console.log("use skill 1");

                    if (skill.releaseOnClick !== true) {

                        // console.log("release skill 1");

                        if (skill.remainingDuration > 0) {

                            // console.log("currently dashing");

                            player.x += Math.cos(skill.angle) * skill.tackleSpeed;
                            player.y += Math.sin(skill.angle) * skill.tackleSpeed;

                            // length/range is duration * speed
                            // totalDuration = player.shipStats.duration + skill.duration;

                            skill.remainingDuration--;

                        } else {

                            skill.disableShoot = false;
                            skill.finished = true;
                            // skill.number = 0;

                        }
                    }
                }
            }



        }
    }
}

module.exports = Skill;