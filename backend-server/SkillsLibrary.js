
const skillsAvailable = [
  {
    type: "skill",
    title: "Javascript",
    details: "Dash and Propel towards a target location",
    // icon: "web",
  }, {
    type: "skill",
    title: "Java",
    details: "Dash and Propel towards a target location",
    // icon: "web",
  }, {
    type: "skill",
    title: "Adobe Photoshop",
    details: "Dash and Propel towards a target location",
    // icon: "mobile",
  },
  {
    type: "skill",
    title: "React",
    details: "Dash and Propel towards a target location",
    // icon: "mobile",
  },
  {
    type: "skill",
    title: "HTML",
    details: "Dash and Propel towards a target location",
    // icon: "mobile",
  },
  {
    type: "skill",
    title: "CSS",
    details: "Dash and Propel towards a target location",
    // icon: "mobile",
  }];


const skillActivate = (activatedSkill, skills, skill, player) => {

  if (activatedSkill === "React") {

    console.log("Activated Skill: " + activatedSkill);

    if (skill.cooldown < 0) {
      skills.push({
        id: activatedSkill,
        playerId: player.id,
        duration: 25,
        remainingDuration: 25,
        tackleSpeed: 7,
        originalCooldown: 250,
        cooldown: 250,
        releaseOnClick: true,
        angle: skill.angle,
        disableShoot: true,
        finished: false
      });

      // remove old instance of activated skill
      skills.splice(skills.indexOf(skill), 1);
    }


  }

  if (activatedSkill === "Adobe Photoshop") {

    console.log("Activated Skill: " + activatedSkill);

    if (skill.cooldown < 0) {
      skills.push({
        id: activatedSkill,
        playerId: player.id,
        duration: 145,
        remainingDuration: 145,
        tackleSpeed: 2,
        originalCooldown: 10,
        cooldown: 10,
        releaseOnClick: true,
        angle: skill.angle,
        disableShoot: true,
        finished: false
      });

      skills.splice(skills.indexOf(skill), 1);

    }

  }
}

const skillInProgress = (skill, player) => {

  ////////////////////

  if (skill.id === "React") {

    if (skill.releaseOnClick === true) return;

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

  /////////////////

  if (skill.id === "Adobe Photoshop") {

    if (skill.releaseOnClick === true) return;

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

module.exports = { skillsAvailable, skillActivate, skillInProgress };