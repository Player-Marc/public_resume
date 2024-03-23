import React, { useEffect, useState } from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";

import { socket } from "../SocketReceiver"


import {
  mobile,
} from "../assets";


let upgradesRemainingSkills = [];


export const SelectorSkills = (show) => {

  const [expandSkill, setExpandSkill] = useState("");
  const [toggle, setToggle] = useState(false);

  const [upgradeDeckSkills, setUpgradeDeckSkills] = useState([]);
  const [upgradeSelectionSkills, setUpgradeSelectionSkills] = useState([]);


  useEffect(() => {

    if (upgradeDeckSkills.length > 0 && show.display === "skills") {

      console.log("showing upgrade selection panel for skills");

      show.setDisplay("hide");
      setUpgradeSelectionSkills(upgradeDeckSkills[0]);
      setToggle("skills");

    } else if (show.display === "skills") {

      show.setDisplay("hide");

    }

  }, [show.display]);


  // turning off any existing setUpgrade first as,
  // useState refreshes About everytime you set something,
  // if not off first then there will be multiple listeners
  socket.off("setUpgradeSkills");
  socket.on("setUpgradeSkills", (upgradesAvailable) => {

    if (upgradesAvailable[0].playerId !== socket.id) return;

    // console.log("[] Second Upgrade Recieved: " + upgradesAvailable[1].title);

    if (upgradesAvailable[0].type === "skill") {

      upgradesRemainingSkills.push(upgradesAvailable);
      setUpgradeDeckSkills(upgradesRemainingSkills);
    }

  });

  // slowing down / delaying after some uses,
  // try changing into useEffect just like in NavBar scroll
  // applied socket.off to sockets so that the old one is removed when refreshed 

  // window.removeEventListener("keydown", (e)=>{})
  // window.addEventListener("keydown", (e) => {

  //   if (e.key === "0") {
  //     if (e.repeat) return;

  //     setToggle(!toggle);
  //   }

  // });
  // window.removeEventListener("keydown", (e)=>{} )

  useEffect(() => {
    const handleScroll = (e) => {
      if (e.key === "0") {
        if (e.repeat) return;

        // weird, it only works when this console.log is present
        console.log("PANEL SWITCH");
        setToggle(!toggle);
      }
    };

    window.addEventListener("keydown", handleScroll);

    return () => window.removeEventListener("keydown", handleScroll);
  }, []);




  return (

    <div className={`${toggle ? "w-screen" : "hidden"} `}>

      <div className={`${toggle === "skills" ? "fixed inset-0 w-screen flex justify-center items-center my-[100px] -top-[40px]" : "hidden"} `}>

        <div className='w-full backdrop-blur-sm bg-[#B6FFE4]/60  
            border-4 border-double border-black 
            outline outline-offset-4 outline-[#B6FFE4] 
            justify-center items-center
            mx-[300px] px-[1px] py-[1px] min-h-[560px] 
            flex'
        >

          {/* how to make it so that it rotates when cursor is on the dialogue box */}
          <div className="absolute grid grid-cols-2 grid-rows-2 inset-0 ">
            <div className="border-t-4 border-l-4 border-black max-w-[40px] max-h-[40px] p-4"></div>
            <div className="border-r-4 border-black max-w-[40px] max-h-[40px] justify-self-end p-4"></div>
            <div className="border-l-4 border-black max-w-[40px] max-h-[40px] self-end p-4"></div>
            <div className="border-r-4 border-black max-w-[40px] max-h-[40px] justify-self-end self-end p-4"></div>
          </div>


          {/* ?place-content-between doesnt work as intended
          <div className="absolute grid grid-cols-2 grid-rows-2 place-content-between h-full w-full">
            <div className="">1</div>
            <div className="">2</div>
            <div className="">3</div>
            <div className="">4</div>
          </div> */}

          {/* <GridBackground /> */}

          <div className="flex justify-center items-center flex-col mt-4">

            <div className="flex flex-row mx-8 gap-4 ">

              <div className="flex flex-col leading-[60px] mr-8">

                <motion.div variants={textVariant()}>
                  <h2 className={styles.sectionPanelText}>Choose a skill</h2>
                </motion.div>

                <motion.p
                  variants={fadeIn("", "", 0.1, 1)}
                  className={`  ${styles.sectionSubText} lg:mt-4 sm:mt-2 text-[#222222] text-[27px] max-w-3xl leading-[30px] font-desc mr-8`}
                >
                  You have enough points to unlock a new technical skill
                </motion.p>


              </div>
              <div className="flex justify-end gap-2">
                <div className="p-4 bg-[#222222]"></div>
                <div className="p-4 bg-[#777777]"></div>
                <div className="p-4 bg-[#222222]"></div>
                <div className="p-4 bg-[#777777]"></div>
                <div className="p-4 bg-[#777777]"></div>
                <div className="lg:p-4 bg-[#222222]"></div></div>

            </div>

            {/* skill modules */}
            <div className="mx-4 mt-4 lg:mt-8 flex flex-row gap-10 items-center justify-center">
              {upgradeSelectionSkills.map((upgrade, index) => (

                <div
                  onClick={() => {

                    setExpandSkill(upgrade.title);

                  }}>

                  <ServiceCard
                    show={show}
                    setToggle={setToggle}
                    showDetails={expandSkill}
                    setExpandSkill={setExpandSkill}
                    upgradeDeckSkills={upgradeDeckSkills}
                    setUpgradeDeckSkills={setUpgradeDeckSkills}
                    upgradeSelectionSkills={upgradeSelectionSkills}
                    setUpgradeSelectionSkills={setUpgradeSelectionSkills}
                    key={upgrade.title} index={index}
                    {...upgrade}

                  />

                </div>

              ))}
            </div>

            <div className="flex flex-row  w-full mt-4">
              <div className="bg-[#222222] w-full h-2 mx-12"></div>
            </div>

          </div>
        </div>
      </div>
    </div>

  );

}





const ServiceCard = ({
  show,
  showDetails,
  setToggle,
  upgradeDeckSkills,
  setExpandSkill,
  setUpgradeDeckSkills,
  upgradeSelectionSkills,
  setUpgradeSelectionSkills,
  index, title, type, details
}) => (

  <Tilt className='xs:w-[243px] w-full border-[2px] border-[#555555]'>

    {/* black box upper right */}
    <div className="flex justify-end">
      <div className={`${showDetails === title ?
        "" :
        "fixed bg-[#222222] p-4"
        } `}>

      </div>
    </div>

    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className={`${showDetails === title ?
        "bg-black/80 w-full p-[1px] rounded-[20px] shadow-card border-b-4 border-[#111111] duration-700" :
        "w-full p-[1px] rounded-[20px] shadow-card border-b-4 border-[#B6FFE40]"}`}
    >

      {/* Bar Code design
      
      <div className="fixed inset-0 flex justify-end gap-1">

        <div className={`${showDetails === title ?
          "" :
          "bg-[#999999] px-2 py-4 mt-[94px] mb-[92px]"
          } `} />

        <div className={`${showDetails === title ?
          "" :
          "bg-[#999999] px-2 py-4 mt-[94px] mb-[92px]"
          } `} />

        <div className={`${showDetails === title ?
          "" :
          "bg-[#333333] px-2 py-4 mt-[94px] mb-[92px]"
          } `} />

        <div className={`${showDetails === title ?
          "" :
          "bg-[#999999] px-2 py-4 mt-[90px] mt-[94px] mb-[92px] mr-[40px]"
          } `} />

      </div> */}


      <div className={`${showDetails === title ?
        "bg-gradient-to-b from-orange-500 hover:from-black-500 p-[2px] rounded-[20px]" :
        "bg-gradient-to-b from-orange-500 p-[2px]"} `}>


        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className={`${showDetails === title ?
            "leading-none animate-progressReset animate-pulse bg-[#222222] text-[#B6FFE4] hover:text-[#FFAA00] border-4 border-double border-[#666666] rounded-[20px] lg:py-5 px-12 min-w-[234px] lg:min-h-[130px] flex justify-evenly items-center transition ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-[#ffffff] duration-300" :
            "leading-none bg-[#B6FFE4] text-black border-[2px] border-[#777777] border-dotted px-12 min-w-[234px] lg:min-h-[130px] flex justify-evenly items-center transition duration-700"
            } `}>


          <h3 className={`${showDetails === title ?
            'text-[27px] font-desc font-bold text-center' :
            'animate-pulse text-[1.4rem] lg:text-[27px] font-desc font-bold text-center'
            } `}>
            {title}
          </h3>

          <img
            src={mobile}
            alt='web-development'
            className='w-16 h-16 object-contain'
          />


          {/* <div className={`${showDetails === title ?
            "" :
            "fixed hover:rotate-45 flex p-24 hover:border-2 border-[#B6FFE4]/50 hover:border-[#444444] duration-300"
            } `}>

          </div> */}

        </div>

      </div>


      <div className="text-white text-[0.8rem] lg:text-[0.9rem] text-center">

        <h3 className={`${showDetails === title ?
          "mt-2 mx-3 lg:m-5" :
          "hidden"
          } `}>
          {details}
        </h3>

        <div className="flex justify-center items-center ">

          <div className={`${showDetails === title ?
            "" :
            "bg-[#777777] px-[6px] py-[18px] mr-[3.5px]"
            } `} />

          <div className={`${showDetails === title ?
            "" :
            "bg-[#222222] px-[8px] py-[18px] mr-[3.5px]"
            } `} />

          <div className={`${showDetails === title ?
            "" :
            "bg-[#222222] px-[6px] py-[18px] mr-[3.5px]"
            } `} />

          <div className={`${showDetails === title ?
            "" :
            "bg-[#222222] px-[4px] py-[18px] mr-[3.5px]"
            } `} />

          <div className={`${showDetails === title ?
            "" :
            "bg-[#777777] px-[8px] py-[18px] mr-[3.5px]"
            } `} />

          <div className={`${showDetails === title ?
            "" :
            "bg-[#222222] px-[4px] py-[18px] mr-[3.5px]"
            } `} />


          <button

            className={`${showDetails === title ?
              "text-[#888888] my-2 lg:my-5 py-1 lg:py-2 px-10 shadow-button transition ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 hover:text-white duration-300" :
              "text-black my-2 lg:my-5 py-2 px-10 shadow-button transition ease-in-out hover:scale-110 hover:-translate-x-2 hover:bg-indigo-500 duration-300"
              } `}

            onClick={() => {

              console.log("Chosen Upgrade: " + title);
              window.scrollTo(0, 0);

              upgradeSelectionSkills.splice(index, 1)

              if (type === "skill") {

                /// change title to become an index instead and make backend know which skill was picked based on index
                socket.emit("slotSkill", title, upgradeSelectionSkills);
              }


              upgradesRemainingSkills.splice(0, 1);
              setUpgradeDeckSkills(upgradesRemainingSkills);


              socket.emit("deductUpgradePoint", type);


              if (upgradeDeckSkills.length > 0) {
                setExpandSkill(title);
                setUpgradeSelectionSkills(upgradeDeckSkills[0]);



              } else {
                show.setDisplay("hide");
                setToggle(false);
              }
            }}
          >
            Choose
          </button>

        </div>

      </div>


    </motion.div>

  </Tilt>
);




export default SelectorSkills;