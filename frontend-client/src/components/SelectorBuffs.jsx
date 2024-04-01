import React, { useEffect, useState } from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";

import { socket } from "../SocketReceiver"

import { testBuffs } from "../constants";

import { useSelector, useDispatch } from 'react-redux';
import { setDialogueStep, setPopupPanelsActive } from '../redux/manageDialogues.js';


let upgradesRemainingBuffs = [];


export const SelectorBuffs = (show) => {

  const dispatch = useDispatch();

  const [expandSkill, setExpandSkill] = useState("");
  const [toggle, setToggle] = useState(false);

  const [upgradeDeckBuffs, setUpgradeDeckBuffs] = useState([]);
  const [upgradeSelectionBuffs, setUpgradeSelectionBuffs] = useState([]);

  const [buffDetails, setBuffDetails] = useState("stay");
  const [buffModuleActive, setBuffModuleActive] = useState("");


  useEffect(() => {

    if (upgradeDeckBuffs.length > 0 && show.display === "buffs") {

      dispatch(setPopupPanelsActive(true))

      console.log("showing upgrade selection panel for buffs");

      show.setDisplay("hide");
      setUpgradeSelectionBuffs(upgradeDeckBuffs[0]);
      setToggle("buffs");

    } else if (show.display === "buffs") {

      show.setDisplay("hide");

    }

  }, [show.display]);


  // turning off any existing setUpgrade first as,
  // useState refreshes About everytime you set something,
  // if not off first then there will be multiple listeners
  socket.off("setUpgradeBuffs");
  socket.on("setUpgradeBuffs", (upgradesAvailable) => {

    console.log("Upgrade for player: " + upgradesAvailable[0].playerId);

    if (upgradesAvailable[0].playerId !== socket.id) return;

    console.log("[] Second Upgrade Recieved: " + upgradesAvailable[1].title);

    if (upgradesAvailable[0].type === "buff") {

      upgradesRemainingBuffs.push(upgradesAvailable);
      setUpgradeDeckBuffs(upgradesRemainingBuffs);
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

      <div className={`z-40 ${toggle === "buffs" ? "fixed inset-0 flex justify-center items-center w-screen -top-[40px]" : "hidden"} `}>

        <div
          className=' backdrop-blur-sm bg-[#B6FFE4]/60  
            border-4 border-double border-black 
            outline outline-offset-4 outline-[#B6FFE4] 
            lg:mx-[300px] px-[1px] py-[1px] lg:min-h-[560px] 
            flex'
        >

          {/* how to make it so that it rotates when cursor is on the dialogue box */}
          {/* <div className="absolute grid grid-cols-2 grid-rows-2 inset-0 ">
            <div className="border-t-4 border-l-4 border-black max-w-[40px] max-h-[40px] p-4"></div>
            <div className="border-r-4 border-black max-w-[40px] max-h-[40px] justify-self-end p-4"></div>
            <div className="border-l-4 border-black max-w-[40px] max-h-[40px] self-end p-4"></div>
            <div className="border-r-4 border-black max-w-[40px] max-h-[40px] justify-self-end self-end p-4"></div>
          </div> */}


          {/* ?place-content-between doesnt work as intended
          <div className="absolute grid grid-cols-2 grid-rows-2 place-content-between h-full w-full">
            <div className="">1</div>
            <div className="">2</div>
            <div className="">3</div>
            <div className="">4</div>
          </div> */}

          {/* <GridBackground /> */}

          <div className="flex justify-center items-center flex-col">

            <div className="flex sm:flex-col lg:flex-row mx-8 mt-8">

              <div className="flex flex-col mr-6 ">

                <motion.div variants={textVariant()}>
                  <h2 className={styles.sectionPanelText}>Choose an experience buff</h2>
                </motion.div>

                <motion.p
                  variants={fadeIn("", "", 0.1, 1)}
                  className={` ${styles.sectionSubText} my-4 text-[#222222]  `}
                >
                  You have enough points to unlock a new buff
                </motion.p>


              </div>

              {/* bar designs */}
              {/* <div className="p-4 bg-[#222222]"></div>
              <div className="p-4 bg-[#777777]"></div>
              <div className="p-4 bg-[#222222]"></div>
              <div className="p-4 bg-[#777777]"></div>
              <div className="p-4 bg-[#777777]"></div>
              <div className="p-4 bg-[#222222]"></div> */}

              {/* category description selectors */}
              <div className={`${"-mt-[1px] flex justify-center gap-3"} `}>

                <button
                  className={`sm:h-[30px] sm:w-[150px] lg:h-[150px] lg:w-[30px] ${buffDetails === "LENGTH" ? "border-[#5c8ccc] border-2 bg-[#15298a]" : "text-[#22348b] bg-[#777777]"} `}
                  onClick={() => {

                    setBuffDetails("LENGTH");

                  }}
                >
                  <div className="-mx-6 lg:rotate-90 flex justify-center">LENGTH</div>
                </button>


                <button
                  className={`sm:h-[30px] sm:w-[150px] lg:h-[150px] lg:w-[30px] ${buffDetails === "EXPERIENCE" ? "border-[#5c8ccc] border-2 bg-[#15298a] " : "text-[#15298a] bg-[#777777]"} `}
                  onClick={() => {

                    setBuffDetails("EXPERIENCE");

                  }}
                >
                  <div className="-mx-6 lg:rotate-90 flex justify-center">EXPERIENCE</div>
                </button>



                <button
                  className={`sm:h-[30px] sm:w-[150px] lg:h-[150px] lg:w-[30px] ${buffDetails === "TECHNICAL" ? "border-[#5c8ccc] border-4 bg-[#15298a]" : "text-[#15298a] bg-[#777777]"} `}
                  onClick={() => {

                    setBuffDetails("TECHNICAL");

                  }}
                >
                  <div className="-mx-6 lg:rotate-90 flex justify-center">TECHNICAL</div>
                </button>


                <button
                  className={`sm:h-[30px] sm:w-[150px] lg:h-[150px] lg:w-[30px] ${buffDetails === "MECHANICS" ? "border-[#5c8ccc] border-4 bg-[#15298a]" : "text-[#15298a] bg-[#777777]"} `}
                  onClick={() => {

                    setBuffDetails("MECHANICS");

                  }}
                ><div className="-mx-6 lg:rotate-90 flex justify-center">MECHANICS</div>
                </button>

              </div>

            </div>

            {/* skill modules */}
            <div className="mx-4 mt-4 flex flex-wrap gap-10 justify-center">
              {upgradeSelectionBuffs.map((upgrade, index) => (

                <div
                  onClick={() => {

                    setBuffModuleActive(index);

                    setExpandSkill(upgrade.title);

                  }}>


                  <ServiceCard
                    upgradeSelectionBuffs={upgradeSelectionBuffs}
                    upgradeDeckBuffs={upgradeDeckBuffs}
                    setUpgradeDeckBuffs={setUpgradeDeckBuffs}
                    setUpgradeSelectionBuffs={setUpgradeSelectionBuffs}
                    buffModuleActive={buffModuleActive}
                    buffDetails={buffDetails}
                    show={show}
                    key={upgrade.title}
                    index={index}
                    setToggle={setToggle}
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
  setToggle,
  upgradeSelectionBuffs,
  setUpgradeSelectionBuffs,
  upgradeDeckBuffs,
  setUpgradeDeckBuffs,
  buffDetails,
  index,
  title,
  type,
  company,
  segments,
  details,
  showDetails
}) => {

  const dispatch = useDispatch();
  const { dialogueStep } = useSelector(state => state.dialogues);


  return <Tilt
    options={{
      max: 9,
      scale: 1.1,
      speed: 150,
    }}
    className='xs:w-[333px]  w-full border-[2px] border-[#5c7cff]'>

    {/* black box upper right */}
    {/* <div className="flex justify-end">
      <div className={`${showDetails === title ?
        "" :
        "fixed bg-[#222222] p-4"
        } `}>

      </div>
    </div> */}

    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className={`${showDetails === title ?
        "bg-black/80 w-full p-[1px] rounded-[20px] shadow-card border-b-4 border-[#2551e4] duration-700" :
        "w-full p-[1px] rounded-[20px] shadow-card border-b-4 border-[#0f2263]"}`}
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


      <div

        className={` ${showDetails === company ?
          "bg-gradient-to-b from-blue-500 hover:from-black-500 p-[2px] rounded-[20px]" :
          "bg-gradient-to-b from-[#0227bf]/60 p-[2px]"} `}>


        <div className={`${showDetails === company ?
          "leading-none animate-progressReset animate-pulse bg-[#222222] text-[#B6FFE4] hover:text-[#FFAA00] border-4 border-double border-[#666666] rounded-[20px] py-5 px-12 min-w-[234px] min-h-[130px] transition ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-[#ffffff] duration-300" :
          "leading-none bg-[#f1f3f2] text-[#15298a] border-b-[2px] border-[#777777] px-4 py-2 border-dotted transition duration-700"
          } `}>


          <h3 className='text-[1.1rem] font-desc font-bold'>{company}</h3>

        </div>

        <div>

          <p
            className=' text-[#f1f3f2] text-[0.9rem] flex justify-center'
            style={{ margin: 0 }}
          >
            {title}
          </p>
        </div>


        <div className={` first-letter:${showDetails === company ?
          "leading-none animate-progressReset animate-pulse bg-[#222222] text-[#B6FFE4] hover:text-[#FFAA00] border-4 border-double border-[#666666] rounded-[20px] py-5 px-12 min-w-[234px] min-h-[130px] transition ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-[#ffffff] duration-300" :
          "leading-none bg-[#f1f3f2] text-[#15298a] border-t-[2px] border-[#777777] border-dotted p-4 min-w-[234px] min-h-[80px] transition duration-700"
          } `}>

          <div className={`${buffDetails === "LENGTH" ? "list-disc ml-5 space-y-2" : "hidden"} `}>
            insert stay length here
          </div>

          <ul className={`${buffDetails === "EXPERIENCE" ? "list-disc ml-5 space-y-2" : "hidden"} 
          `}>
            {segments.map((point, index) => (
              <li
                key={`experience-point-${index}`}
                className='font-desc text-[15px] pl-1 tracking-wider'
              >
                {point}
              </li>
            ))}
          </ul>

          <div className={`${buffDetails === "TECHNICAL" ? "list-disc ml-5 space-y-2" : "hidden"} `}>
            insert tech skills learned here
          </div>

          <div className={`${buffDetails === "MECHANICS" ? "list-disc ml-5 space-y-2" : "hidden"} `}>
            insert game mechanics here
          </div>


        </div>

      </div>




      <div className="text-white text-[15px] text-center">

        <h3 className={`${showDetails === title ?
          "" :
          "hidden"
          } `}>
          {details}
        </h3>

        <div className="-mt-2 bg-gradient-to-b from-white flex justify-center items-center ">

          {/* <div className={`${showDetails === title ?
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
            } `} /> */}


          <button
            className={`text-[0.9rem] sm:h-[1.7rem] lg:h-[2rem] ${showDetails === title ?
              "rounded-t-lg text-[#888888] my-5 py-2 px-10 shadow-button transition ease-in-out hover:scale-x-110 hover:bg-indigo-500 hover:text-white duration-300" :
              "rounded-t-lg text-black py-1 px-10 shadow-button transition ease-in-out hover:scale-x-110  duration-300"
              } `}

            onClick={() => {

              console.log("Chosen Upgrade: " + company);
              window.scrollTo(0, 0);

              upgradeSelectionBuffs.splice(index, 1)

              if (type === "buff") {
                socket.emit("selectBuff", company, upgradeSelectionBuffs);
              }

              upgradesRemainingBuffs.splice(0, 1);
              setUpgradeDeckBuffs(upgradesRemainingBuffs);


              socket.emit("deductUpgradePoint", type);


              if (upgradeDeckBuffs.length > 0) {
                // setExpandSkill(title);
                setUpgradeSelectionBuffs(upgradeDeckBuffs[0]);

              } else {
                show.setDisplay("hide");
                setToggle(false);
                dispatch(setPopupPanelsActive(false));
              }


              // move to next dialogue if tutorial
              if (dialogueStep === 3) {
                dispatch(setDialogueStep(dialogueStep + 1));
              }

            }}
          >
            Choose
          </button>

        </div>

      </div>


    </motion.div>

  </Tilt>
};




export default SelectorBuffs;