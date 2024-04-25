import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";

import { socket } from "../SocketReceiver"

import { SelectorBuffs } from "./SelectorBuffs";
import { SelectorSkills } from "./SelectorSkills";

import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";

var leveledUp = true;

const Navbar = () => {

  const [active, setActive] = useState("");
  const [skillProgress, setSkillProgress] = useState("");
  const [buffProgress, setBuffProgress] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dialogue, setDialogue] = useState("hide");
  const [playerHealthDisplay, setPlayerHealthDisplay] = useState(["w", "w"]);
  let [skillsRemaining, setSkillsRemaining] = useState(0);
  let [buffsRemaining, setBuffsRemaining] = useState(0);


  const refMainSection = useRef(null);
  const { scrollY } = useScroll({
    target: refMainSection,
    // offset: ['start end', '75vw end']
  })
  const clipProgress = useTransform(scrollY, [1, 0], [100, 0]);
  const clip = useMotionTemplate`inset(0 ${clipProgress}% 0 0)`;




  // old alternative of useScroll of framer motion
  // use { scrollYProgress } or { scrollY } instead to reduce state refresh
  useEffect(() => {
    const handleScroll = () => {

      const scrollTop = window.scrollY;
      // console.log("scroll: " + scrollTop);

      if (scrollTop > 100) {
        setScrolled(true);
        // setProgress("sm:w-32");

      } else {
        setScrolled(false);
        // setProgress("sm:w-20");

      }
    };


    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // socket name should be unique (reciever), but the same on the other side (sender). 
  socket.off("setUpgradePoints");
  socket.on("setUpgradePoints", (upgradesAvailable) => {

    if (upgradesAvailable[0].playerId !== socket.id) return;

    console.log("Upgrades Recieved");

    if (upgradesAvailable[0].type === "skill") {
      setSkillsRemaining(++skillsRemaining)
      console.log(skillsRemaining);

    }

    if (upgradesAvailable[0].type === "buff") {
      setBuffsRemaining(++buffsRemaining)
      console.log(buffsRemaining);

    }

  });

  socket.on("deductUpgradePointBuffDisplay", (player) => {
    if (player.id !== socket.id) return;
    setBuffsRemaining(--buffsRemaining)
  });

  socket.on("deductUpgradePointSkillDisplay", (player) => {
    if (player.id !== socket.id) return;
    setSkillsRemaining(--skillsRemaining)
  });

  socket.off("skillProgress");
  socket.on("skillProgress", (progressGained, nextLevelUp) => {

    if (progressGained.player !== socket.id) return;

    if (progressGained.value >= nextLevelUp) {

      leveledUp = true;
      setSkillProgress("sm:w-full p-8");
      return;
    }

    if (progressGained.value >= nextLevelUp / 2) {
      setSkillProgress("sm:w-2/3");
      return;
    }

    if (progressGained.value >= nextLevelUp / 3) {
      setSkillProgress("sm:w-1/3");
      return;
    }

    if (progressGained.value >= 0) {
      // console.log("Reset")

      if (leveledUp === true) {
        setTimeout(() => {
          if (progressGained.value >= 0) setSkillProgress("sm:w-[10%]")
        }, 1000);
      }

      leveledUp = false;
      return;
    }

  });


  socket.off("buffProgress");
  socket.on("buffProgress", (progressGained) => {

    if (progressGained.player !== socket.id) return;

    if (progressGained.percent >= 4.5) {
      setBuffProgress("sm:w-[15%]");
      return;
    }

    if (progressGained.percent >= 2.4) {
      setBuffProgress("sm:w-[30%]");
      return;
    }

    if (progressGained.percent >= 1.7) {
      setBuffProgress("sm:w-[50%]");
      return;
    }

    if (progressGained.percent >= 1.35) {
      setBuffProgress("sm:w-[65%]");
      return;
    }

    if (progressGained.percent >= 1.05) {
      setBuffProgress("sm:w-[82%]");
      return;
    }

    if (progressGained.percent >= 0.9) {
      setBuffProgress("sm:w-[100%]");
      return;
    }

  });


  socket.off("playerHealth");
  socket.on("playerHealth", (playerId, playerHealth, playerState) => {

    if (playerId !== socket.id) return;

    if (playerState === "damaged") console.log("Player DAMAGAFED!");
    if (playerState === "recharged") console.log("Player RECHARGED!");

    let playerHealthArray = [];
    for (var i = 0; i < playerHealth; i++) {
      playerHealthArray.push("Normal");
    }

    setPlayerHealthDisplay(playerHealthArray);

  });


  return (
    <>
      <nav
        className={` mx-2 w-screen flex items-center justify-center sm:pb-2.5 lg:pb-5 pt-3 fixed bottom-0 z-20  ${scrolled ? " backdrop-blur-sm" : "bg-transparent"
          }`}
      >
        <div className='mx-[8px] w-full flex justify-between items-center max-w-7xl whitespace-nowrap '>

          <div className="flex flex-row pr-6 sm:justify-start lg:justify-center">

            {/* name */}
            <Link
              to='/'
              className='flex items-center gap-2'

              onClick={() => {
                setDialogue("hide");
                setActive("");
                window.scrollTo(0, 0);
              }}>

              {/* <img src={logo} alt='logo' className='w-9 h-9 object-contain' /> */}
              <motion.p className={`duration-300 lg:mb-[2px] text-sm lg:text-[1.2rem] font-bold cursor-pointer flex ${scrolled ? "text-[#444444]" : "text-white"}`} style={{ clipPath: clip }} ref={refMainSection}>
                Marc &nbsp;
                <span className='sm:block hidden'> | Knight </span>
              </motion.p>
            </Link>



            {/* health */}
            <div className={` sm:mt-[20px] lg:-mt-[44px] flex sm:flex-col lg:flex-row gap-6 sm:fixed top-0 lg:absolute`}>

              {playerHealthDisplay.map((index) => (

                <div className={` duration-1000 rotate-45 h-[40px] w-[40px] ${scrolled ? "" : "bg-white"}`}></div>
              ))}


            </div>

          </div>

          {/* Progress Bars */}
          <ul className='w-full list-none hidden sm:flex flex-row sm:gap-2 lg:gap-4 justify-evenly items-end'>

            {/* ".map" lists all content of the object */}
            {navLinks.map((nav) => (

              <li
                key={nav.id}
                className={`w-full ${scrolled ? "text-[#444444]" : "text-secondary"} ${active === nav.title ? "text-white" : ""} 
                
              hover:text-white lg:text-[18px] font-medium cursor-pointer `}

                onClick={() => setActive(nav.title)}
              >

                <div className="group/notif flex flex-row justify-end items-center">

                  <a className="pr-3 sm:text-[12px] lg:text-[1.2rem] " href={`#${nav.id}`}>{nav.title}</a>

                  <ProgressBar id={nav.id} title={nav.title} skillProgress={skillProgress} buffProgress={buffProgress} scrolled={scrolled} />

                  <div className={`sm:h-[1rem] lg:h-[1.5rem] sm:w-[1.5rem] lg:w-[2rem] border-y border 
                  ${scrolled ? "border-black" : "border-white"} `} />

                  {/* upgrade bar number indicator */}
                  <div className=" relative flex justify-end items-center "
                    onClick={() => {

                      setDialogue(nav.id);
                      console.log("showing panel: " + nav.id + " : " + dialogue);

                    }}
                  >

                    <div className={` fixed sm:h-[1rem] lg:h-[1.5rem] sm:w-[1.5rem] lg:w-[2rem] border-y border-r 
                     flex justify-center items-center duration-300 
                    group-hover/notif:rotate-45 group-hover/notif:h-[2.5rem] group-hover/notif:w-[2.5rem] 
                    group-hover/notif:bg-white group-hover/notif:border overflow-hidden
                    ${nav.id === "buffs" ? "group-hover/notif:border-white " : ""} 
                    ${nav.id === "skills" ? "group-hover/notif:border-white" : ""} 
                    ${scrolled ? "border-black" : "border-white"}
                  `}>

                      <LevelUpNotifEffect id={nav.id} />

                      {/* display notification number of unused upgrade points */}

                      <div className={`absolute flex items-center justify-center font-desc bg-[#777777] w-full h-full 
                      group-hover/notif:w-[6rem] group-hover/notif:h-[6rem]
                      group-hover/notif:text-[1.8rem] group-hover/notif:-rotate-45 duration-300
                      ${nav.id === "buffs" && buffsRemaining > 0 ? "group-hover/notif:text-white group-hover/notif:w-[0px] group-hover/notif:h-[0px] group-hover/notif:font-bold text-white" : ""} 
                      ${nav.id === "skills" && skillsRemaining > 0 ? "group-hover/notif:text-white group-hover/notif:w-[0px] group-hover/notif:h-[0px] group-hover/notif:font-bold text-white" : ""} 
                      ${scrolled ? "bg-black" : ""}
                    `}>
                        {nav.id === "buffs" ? buffsRemaining : ""}
                        {nav.id === "skills" ? skillsRemaining : ""}
                      </div>

                    </div>
                  </div>

                  <div className={`relative ml-[7px] text-center overflow-hidden duration-300
                    group-hover/notif:border-[0px] group-hover/notif:w-0 group-hover/notif:bg-white 
                    ${nav.id === "buffs" && buffsRemaining > 0 ?
                        "sm:h-[1rem] lg:h-[1.5rem] sm:w-[3rem] -left-2 bg-[#777777] border-y border-r" : ""} 
                    ${nav.id === "skills" && skillsRemaining > 0 ?
                        "sm:h-[1rem] lg:h-[1.5rem] sm:w-[3rem] -left-2 bg-[#777777] border-y border-r" : ""} 
                    ${scrolled ? "border-black" : "border-white"}
                    `}>


                    <div className={`absolute -left-8 top-14 sm:w-[6rem] sm:h-[6rem] flex justify-start items-start rotate-45 duration-700
                      ${buffsRemaining > 0 ? "sm:top-0 " : ""}
                      ${skillsRemaining > 0 ? "sm:top-0 " : ""}
                      `}>
                          <LevelUpNotifEffect id={nav.id} />
                    </div>


                  </div>

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

      <SelectorSkills display={dialogue} setDisplay={setDialogue} />
      <SelectorBuffs display={dialogue} setDisplay={setDialogue} />

      {/* 'About' sockets wont recieve anything since its not there */}
      {/* { dialogue === "show" && <About display={dialogue} setDisplay={setDialogue}/>} */}

      {/* <About initialDisplay={setDialogue} /> */}

    </>
  );
};


const ProgressBar = ({ index, id, buffProgress, skillProgress, scrolled }) => (

  <div className={`w-full  sm:h-[1rem] lg:h-[1.5rem] rounded-tl-lg duration-700
                flex items-center overflow-hidden ${scrolled ? "border border-black" : "bg-white border border-white"}`}>


    <div className="w-full h-full flex items-center animate-wobble ">

      <div className={`animate-wiggle bg-[#000000] h-full py-6 flex items-center overflow-hidden duration-300
                  ${id === "buffs" ? buffProgress : ""} 
                  ${id === "skills" ? skillProgress : ""} 
                  `} >

        <div className="animate-elevate flex flex-col h-full w-full  ">

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillFast w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        ${id === "skills" ? "animate-particleFillSlow w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        `}>

            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed -top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#FFFFFF]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#FFFFFF]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed -bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillSlow w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        ${id === "skills" ? "animate-particleFillNormal w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        `}>

            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed -top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#FFFFFF]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#FFFFFF]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed -bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillNormal w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        ${id === "skills" ? "animate-particleFillFast w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed -top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#FFFFFF]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#FFFFFF]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed -bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillFast w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        ${id === "skills" ? "animate-particleFillSlow w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed -top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#FFFFFF]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#FFFFFF]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed -bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillSlow w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        ${id === "skills" ? "animate-particleFillNormal w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed -top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#FFFFFF]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#FFFFFF]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed -bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillNormal w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        ${id === "skills" ? "animate-particleFillFast w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed -top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#FFFFFF]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#FFFFFF]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed -bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillFast w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        ${id === "skills" ? "animate-particleFillSlow w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed -top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#FFFFFF]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#FFFFFF]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed -bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillSlow w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        ${id === "skills" ? "animate-particleFillNormal w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed -top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#FFFFFF]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#FFFFFF]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed -bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillNormal w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        ${id === "skills" ? "animate-particleFillFast w-2 h-2 rounded-full bg-[#FFFFFF]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed -top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#FFFFFF]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#FFFFFF]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed -bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>


        </div>

        <div className="fixed blur-sm flex flex-col h-full w-full gap-1">

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillFast w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                        ${id === "skills" ? "animate-particleFillSlow w-2 h-2 rounded-full bg-[#e59900]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#ffaa00]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillSlow w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                        ${id === "skills" ? "animate-particleFillNormal w-2 h-2 rounded-full bg-[#e59900]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#ffaa00]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillNormal w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                        ${id === "skills" ? "animate-particleFillFast w-2 h-2 rounded-full bg-[#e59900]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#ffaa00]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillFast w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                        ${id === "skills" ? "animate-particleFillSlow w-2 h-2 rounded-full bg-[#e59900]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#ffaa00]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillSlow w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                        ${id === "skills" ? "animate-particleFillNormal w-2 h-2 rounded-full bg-[#e59900]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#ffaa00]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillNormal w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                        ${id === "skills" ? "animate-particleFillFast w-2 h-2 rounded-full bg-[#e59900]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#ffaa00]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillFast w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                        ${id === "skills" ? "animate-particleFillSlow w-2 h-2 rounded-full bg-[#e59900]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#ffaa00]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillSlow w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                        ${id === "skills" ? "animate-particleFillNormal w-2 h-2 rounded-full bg-[#e59900]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#ffaa00]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

          <div className={` 
                        ${id === "buffs" ? "animate-particleFillNormal w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                        ${id === "skills" ? "animate-particleFillFast w-2 h-2 rounded-full bg-[#e59900]" : ""} 
                        `}>
            <div className={` 
                          ${id === "buffs" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleBlue rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "animate-wobble fixed top-[12px] w-2 h-2 shadow-particleRed rounded-full bg-[#ffaa00]" : ""} 
                          `}></div>
            <div className={` 
                          ${id === "buffs" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#5963ea]" : ""} 
                          ${id === "skills" ? "fixed bottom-[12px] w-2 h-2 rounded-full bg-[#cc8800]" : ""} 
                          `}></div>
          </div>

        </div>

      </div>
    </div>
  </div>

);

const LevelUpNotifEffect = ({ id }) => (
  <div className={`absolute animate-upgradeUp w-[6rem] h-[6rem] 
    ${id === "buffs" ? "bg-blue-500 " : ""} 
    ${id === "skills" ? "bg-orange-400" : ""} 
  `}>

    <div className={`
    ${id === "buffs" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-indigo-700" : ""} 
    ${id === "skills" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-orange-700" : ""} 
  `} />
    <div className={`
    ${id === "buffs" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-indigo-700 -top-0 ml-2 mt-2" : ""} 
    ${id === "skills" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-orange-700 -top-0 ml-2 mt-2" : ""} 
  `} />
    <div className={`
    ${id === "buffs" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-indigo-700 -top-0 ml-4 mt-4" : ""} 
    ${id === "skills" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-orange-700 -top-0 ml-4 mt-4" : ""} 
  `} />
    <div className={`
    ${id === "buffs" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-indigo-700 -top-0 ml-6 mt-6" : ""} 
    ${id === "skills" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-orange-700 -top-0 ml-6 mt-6" : ""} 
  `} />
    <div className={`
    ${id === "buffs" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-indigo-700 -top-0 ml-8 mt-8" : ""} 
    ${id === "skills" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-orange-700 -top-0 ml-8 mt-8" : ""} 
  `} />
    <div className={`
    ${id === "buffs" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-indigo-700 -top-0 ml-10 mt-10" : ""} 
    ${id === "skills" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-orange-700 -top-0 ml-10 mt-10" : ""} 
  `} />
    <div className={`
    ${id === "buffs" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-indigo-700 -top-0 ml-12 mt-12" : ""} 
    ${id === "skills" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-orange-700 -top-0 ml-12 mt-12" : ""} 
  `} />
    <div className={`
    ${id === "buffs" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-indigo-700 -top-0 ml-14 mt-14" : ""} 
    ${id === "skills" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-orange-700 -top-0 ml-14 mt-14" : ""} 
  `} />
    <div className={`
    ${id === "buffs" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-indigo-700 -top-0 ml-16 mt-16" : ""} 
    ${id === "skills" ? "absolute w-10 h-10 border-t-[6px] border-l-[6px] border-orange-700 -top-0 ml-16 mt-16" : ""} 
  `} />

  </div>
);

export default Navbar;
