import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";

import { socket } from "../SocketReceiver"

const UpgradesBar = () => {
  const [active, setActive] = useState("ULTRA");
  const [skillProgress, setSkillProgress] = useState("");
  const [buffProgress, setBuffProgress] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dialogue, setDialogue] = useState("hide");
  let [skillsRemaining, setSkillsRemaining] = useState(0);
  let [buffsRemaining, setBuffsRemaining] = useState(0);
  const [skillsOnCooldown, setSkillsOnCooldown] = useState([]);

  const [activeUpgrades, setActiveUpgrades] = useState([]);
  

  /// trying out function as a object for display cooldown
  const skillOnCooldown = () => { if(skillsOnCooldown.find(skill => (skill.id === nav && socket.id === skill.playerId && skill.cooldown > 0))) {
    return { exists: true, cooldown: skillsOnCooldown.find(skill => (skill.id === nav && socket.id === skill.playerId && skill.cooldown > 0)) } }};


  socket.off("upgradesCooldown");
  socket.on("upgradesCooldown", (serverSkills) => {

    setSkillsOnCooldown(serverSkills);

  });



  socket.off("playersActiveUpgrades");
  socket.on("playersActiveUpgrades", (player) => {

    if (player.id !== socket.id) return;

    setActiveUpgrades(player.skillsActive);

    // console.log("added: " + activeUpgrades[0]);
  });



  return (
    <>
      <nav
        className={` h-full fixed right-0 bottom-0 z-20 ${scrolled ? "bg-primary" : "bg-transparent"
          }`}
      >
        <div className='h-full flex items-center justify-center flex-col'>
        
          <ul className='gap-y-[1rem] lg:gap-y-[160px] list-none hidden sm:flex flex-col'>

            {/* ".map" lists all content of the object */}
            {activeUpgrades.map((nav, index) => (

              <li
                key={nav.id}
                className={` text-desc 
              hover:text-[#d3ab55] text-[0.7rem] lg:text-[15px] font-medium cursor-pointer `}

                onClick={() => {

                  socket.emit("useSkill", index);

                  setActive(nav.title)

                }}
              >

                <div className=" mx-2 lg:-mx-12 h-[3rem] lg:w-[200px] border-[1px] bg-[#77777746] lg:-rotate-90 group/notif flex flex-col lg:flex-row justify-center items-center lg:p-4  gap-2">

                  {/* thought of a progress bar but css code doesnt reflect properly unless each value gets declared
                    ex. "sm:w-[" + cooldown + "%]" will not work but "sm:w-[82%]" will. Maybe because of Tailwind.
                    Workaround was done in navbar progress bars  */}
                  {/* <div className={` absolute w-full h-full bg-white z-0 `}></div> */}
                  {/* another workaround is declare animation in css file (index.css, tailwind config file, etc... ) instead of tailwind  */}

                  <a className="z-10" > {nav} </a>

                  <a className={` `} > { skillsOnCooldown.find(skill => (skill.id === nav && socket.id === skill.playerId && skill.cooldown > 0)) ? skillsOnCooldown.find(skill => (skill.id === nav && socket.id === skill.playerId && skill.cooldown > 0)).cooldown : "[READY]" } </a>

                </div>

              </li>

            ))}
          </ul>

          {/* when display is small such as mobile devices, show hamburger menu  */}
          <div className='sm:hidden flex flex-1 justify-end items-center'>
            <img
              src={toggle ? close : menu}
              alt='menu'
              className='w-[28px] h-[28px] object-contain'
              onClick={() => setToggle(!toggle)}
            />

            <div
              className={`${!toggle ? "hidden" : "flex"
                } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
            >
              <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
                {navLinks.map((nav) => (
                  <li
                    key={nav.id}
                    className={`font-poppins font-medium cursor-pointer text-[16px] ${active === nav.title ? "text-white" : "text-secondary"
                      }`}
                    onClick={() => {
                      setToggle(!toggle);
                      setActive(nav.title);
                    }}
                  >
                    <a href={`#${nav.id}`}>{nav.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>


      </nav>


    </>
  );
};

export default UpgradesBar;









const oldFunctionDisplayCooldown = () => {



  
  const [upgradeIdSlot1, setUpgradeIdSlot1] = useState("");
  const [upgradeIdSlot2, setUpgradeIdSlot2] = useState("");
  const [upgradeIdSlot3, setUpgradeIdSlot3] = useState("");
  const [upgradeIdSlot4, setUpgradeIdSlot4] = useState("");

  const [displayCooldownSlot1, setDisplayCooldownSlot1] = useState(0);
  const [displayCooldownSlot2, setDisplayCooldownSlot2] = useState(0);
  const [displayCooldownSlot3, setDisplayCooldownSlot3] = useState(0);
  const [displayCooldownSlot4, setDisplayCooldownSlot4] = useState(0);



  socket.off("upgradesCooldown");
  socket.on("upgradesCooldown", (serverSkills) => {



    /// old code for cooldown
    // for (const skillCooldown of serverSkills) {

    //   if (skillCooldown.playerId !== socket.id || skillCooldown.cooldown < 0) return;

    //   if (activeUpgrades[0] === skillCooldown.id) {

    //     var cooldown = Math.ceil(skillCooldown.cooldown / 10);

    //     setUpgradeIdSlot1(skillCooldown.id);
    //     setDisplayCooldownSlot1(cooldown);
    //   }

    //   if (activeUpgrades[1] === skillCooldown.id) {

    //     var cooldown = Math.ceil(skillCooldown.cooldown / 10);

    //     setUpgradeIdSlot2(skillCooldown.id);
    //     setDisplayCooldownSlot2(cooldown);
    //   }

    //   if (activeUpgrades[2] === skillCooldown.id) {

    //     var cooldown = Math.ceil(skillCooldown.cooldown / 10);

    //     setUpgradeIdSlot3(skillCooldown.id);
    //     setDisplayCooldownSlot3(cooldown);
    //   }

    //   if (activeUpgrades[3] === skillCooldown.id) {

    //     var cooldown = Math.ceil(skillCooldown.cooldown / 10);

    //     setUpgradeIdSlot4(skillCooldown.id);
    //     setDisplayCooldownSlot4(cooldown);

    //   }
    // }
  });




}