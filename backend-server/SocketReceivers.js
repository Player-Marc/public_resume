const Snowball = require("./SnowballController");
const snowball = new Snowball();

const Skill = require("./SkillController");
const skill = new Skill();

const ServerContest = require("./ContestController");
const serverContest = new ServerContest();

const SkillDeckSystem = require("./SkillDeckSystem");
const skillDeckSystem = new SkillDeckSystem();

const buffsLibrary = require("./BuffsLibrary");


class SocketReceivers {

    listen(socket, players,
        inputsMap, buff, skills, clicksMap, snowballs, io) {


        const player = this.findActionOwner(socket, players);

        //// Player Movement
        socket.on("inputs", (inputs) => {
            
            inputsMap[socket.id] = inputs;
            //console.log("fe");
        });

        socket.on("mute", (isMuted) => {
            player.isMuted = isMuted;
        });

        // used for Agora Proximity
        socket.on("voiceId", (voiceId) => {
            player.voiceId = voiceId;
        });

        // waiting/listening for snowball emit
        socket.on("projectile", (angle) => {

            snowball.shoot(player, snowballs, angle, skills)
            console.log("SHOT")

            ///// clicksMap[socket.id].clickAngle = angle;

        });

        socket.on("disconnect", () => {
            delete players[socket.id];
            players = players.filter((player) => player.id !== socket.id);

        });

        socket.on("selectBuff", (selectedBuff) => {

            buffsLibrary.apply(player, selectedBuff);

        });

        socket.on("useSkill", (selectedSkillSlot) => {

            skill.activate(player, selectedSkillSlot, skills);

            io.emit("playersActiveUpgrades", player);

            ////// clicksMap[socket.id].activatedSkill = selectedSkillSlot;
        });

        /// rework this socket: shouldnt receive unpickedSkills,
        /// backend should not be dependent on frontend to know which skills are unpicked
        socket.on("slotSkill", (slottedSkill, unpickedSkills) => {

            console.log("Unpicked Skills: " + unpickedSkills);

            for (const unpickedSkill of unpickedSkills) {
                player.skillsSelection.push(unpickedSkill);
            }

            skillDeckSystem.addToDeck(player, slottedSkill);

            io.emit("playersActiveUpgrades", player);

        });

        /// not used?
        socket.on("pickSkill", (selectedSkill) => {

            const list = []

            io.emit("skillsDialogue", list);

        });


        socket.on("deductUpgradePoint", (upgradeType) => {

            if (upgradeType === "buff") {
                io.emit("deductUpgradePointBuffDisplay", player);
            }

            if (upgradeType === "skill") {
                io.emit("deductUpgradePointSkillDisplay", player);
            }

        });



        socket.on("showPlayers", (leader) => {

            io.emit("playerList", players);

        });


        socket.on("inviteToContest", (invitedPlayer, inviter) => {

            players.find((player) => player.id === invitedPlayer).contest.inviters.push(inviter);

            io.emit("playerList", players);

        });


        socket.on("acceptContest", (inviter, invitedPlayer) => {


            players.find((player) => player.id === invitedPlayer).contest.leader = inviter;
            players.find((player) => player.id === inviter).contest.members.push(invitedPlayer);
            players.find((player) => player.id === inviter).contest.leader = inviter;

            let playerLeader = players.find((player) => player.id === invitedPlayer).contest.leader;

            console.log(playerLeader);
            console.log(players.find((player) => player.id === inviter).contest.members);


            io.emit("playerList", players);

        });


        socket.on("startContest", leader => {

            let contestPlayers = players.filter(player => player.contest.leader === leader);

            serverContest.startContest(contestPlayers);
            console.log("starting contest...")

            io.emit("contestCountdown", contestPlayers)


        });

    }

    findActionOwner(socket, players) {

        return players.find((player) => player.id === socket.id);

    }

}

module.exports = SocketReceivers;