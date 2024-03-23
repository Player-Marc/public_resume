import React, { useEffect, useState, useRef } from "react";
import Tilt from "react-tilt";

import { styles } from "../styles";
import { techSkillsPrimary } from "../constants";
import { techSkillsOther } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";

import { gsap } from 'gsap';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
const loader = new GLTFLoader();

import { ComputersCanvas } from "./canvas";

import {
  mobile,
  techSkillPerson
} from "../assets";


const ServiceCard = ({ index, title, icon, details, showDetails }) => (

  <Tilt className='sticky xs:w-[243px] w-full border-[2px] border-[#555555]'>

    {/* black box upper right */}
    {/* <div className="flex justify-end">
      <div className={`${showDetails === title ?
        "" :
        "fixed bg-[#222222] p-4"
        } `}>

      </div>
    </div> */}

    <motion.div

      className={`${showDetails === title ?
        "bg-black/80 w-full p-[1px] rounded-[20px] shadow-card border-b-4 border-[#111111]  duration-700" :
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
            "leading-none animate-progressReset animate-pulse bg-[#222222] text-[#B6FFE4] hover:text-[#FFAA00] border-4 border-double border-[#666666] rounded-[20px] py-5 px-12 min-w-[234px] min-h-[130px] flex justify-evenly items-center transition ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-[#ffffff] duration-300" :
            "leading-none bg-[#B6FFE4] text-black border-x-[2px] border-t-[2px] border-[#777777] border-dotted px-12 min-w-[234px] min-h-[130px] flex justify-evenly items-center transition duration-700"
            } `}>


          <h3 className={`${showDetails === title ?
            'text-[27px] font-desc font-bold text-center' :
            'animate-pulse text-[27px] font-desc font-bold text-center'
            } `}>
            {title}
          </h3>

          <img
            src={mobile}
            alt='web-development'
            className='w-16 h-16 object-contain z-10'
          />


          {/* <div className={`${showDetails === title ?
            "" :
            "fixed hover:rotate-45 flex p-24 hover:border-2 border-[#B6FFE4]/50 hover:border-[#444444] duration-300"
            } `}>

          </div> */}

        </div>

      </div>


      <div className="text-white text-[15px] text-center">

        <h3 className={`${showDetails === title ?
          "m-5" :
          "hidden"
          } `}>
          {details}
        </h3>

      </div>


    </motion.div>

  </Tilt>
);

const Tech = () => {

  const [expandSkill, setExpandSkill] = useState("");
  const [textSkillType, setTextSkillType] = useState("");
  const [scrolled, setScrolled] = useState(false);


  const refMainSection = useRef(null);

  let { scrollYProgress } = useScroll({
    target: refMainSection,
    offset: ['start 50vh  ', 'start 30vh']
  })
  const clipProgress = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clip = useMotionTemplate`inset(0 0 ${clipProgress}% 0)`;


  let tlEnter = gsap.timeline({
    scrolled
  })

  tlEnter.to('.displacementTech', {
    attr: {
      r: (() => { if (scrolled) return 400; else return 200 })
    },
    duration: 2,
  })


  useEffect(() => {
    const handleScroll = () => {

      const scrollTop = window.scrollY;
      // console.log("scroll: " + scrollTop);

      if (scrollTop > 2500) {
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



  const fadeInAnimationPrimary = {
    initial: {
      opacity: 0,
      x: -100,
      scaleY: 0.2
    },
    animate: {
      opacity: 1,
      x: 0,
      scaleY: 1
    },
    margin: {
      margin: ""
    }
  }

  const fadeInAnimationOther = {
    initial: {
      opacity: 0,
      x: 100,
      scaleY: 0.2
    },
    animate: {
      opacity: 1,
      x: 0,
      scaleY: 1
    },
    margin: {
      margin: ""
    }
  }



  return (
    <>


      <div className="h-[20px] w-full bg-gradient-to-t from-[#C6DDCB] ">

        <div className="w-full h-full flex flex-row">

          <div className="basis-1/2 flex items-center justify-center">
            <div className=" bg-[#ffffff] w-[500px] h-full"></div>
          </div>

          <div className="basis-1/2 dotted-pattern-fade-reverse"></div>

        </div>


      </div>

      <div className={`duration-500 relative  flex flex-col bg-[#C6DDCB] overflow-hidden ${scrolled ? "h-[65vh]" : "h-[65vh]"}`}>



        <div className=" h-full flex flex-row ">
          <div className="basis-1/2 flex flex-col items-center mt-2 overflow-hidden relative">



            {/* <img
              src={roses}
              alt='web-development'
              className='h-[700px]'
            /> */}

            <div className="pt-[100px] bg-[#ffffff] w-[500px] h-[800px] flex items-center justify-center">

              {/* <ComputersCanvas /> */}

              <svg className="" viewBox="0 0 900 1000" fill="none" preserveAspectRatio="">

                <defs>
                  <filter id="displacementFilterTech">
                    <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" />
                  </filter>
                  <mask id="circleMaskTech">
                    <circle cx="450" cy="500" r="500" fill="white" class="displacementTech" />
                  </mask>


                </defs>


                {/* replacement placeholder for image */}
                <rect width="1728" height="1000" fill="#231750" mask="url(#circleMaskTech)" />


                {/* <image className="flex justify-end items-center" href={`${expBldg}`} width="100vh" height="100vh" mask="url(#circleMask)" /> */}

              </svg>

              <img
                src={techSkillPerson}
                alt='web-development'
                className='animate-wobble absolute h-[600px] min-w-[1000px]'
              />

            </div>


            {/* downward lines */}
            {/* <div className="absolute bg-[#1b1746] w-[4px] h-[2000px] top-[600px] mr-[264px]"></div>
            <div className="absolute bg-[#1b1746] w-[4px] h-[2000px] top-[600px] mr-[300px]"></div>
            <div className="absolute bg-[#1b1746] w-[4px] h-[2000px] top-[600px] mr-[337px]"></div> */}

          </div>

          <div className="flex items-start -ml-[20px] basis-1/2 overflow-hidden">

            {/* skills card modules section */}
            <div className="h-full basis-4/5 dotted-pattern">
              <div className='h-[66vh] border-y-2 border-white mt-32 px-8 flex pb-[300px] mb-[100px] justify-center flex-wrap gap-10 overflow-y-scroll overflow-x-hidden'>

                {techSkillsPrimary.map((upgrade, index) => (

                  <motion.div
                    className="border-2 h-[143px] xs:w-[243px] mt-[50px] mb-[10px]"
                    onClick={() => {

                      setExpandSkill(upgrade.title);

                    }}
                    onHoverStart={e => {
                      setTextSkillType("Primary")
                    }}>

                    <motion.div className="-mt-8 ml-8 "

                      variants={fadeInAnimationPrimary}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ margin: "-20% 0% -20% 0%" }}>

                      <ServiceCard key={upgrade.title} index={index} showDetails={expandSkill} {...upgrade} />

                    </motion.div>
                  </motion.div>

                ))}

                {techSkillsOther.map((upgrade, index) => (

                  <motion.div
                    className="border-2 h-[143px] xs:w-[243px] mt-[50px] mb-[50px]"
                    onClick={() => {

                      setExpandSkill(upgrade.title);

                    }}
                    onHoverStart={e => {
                      setTextSkillType("Other")
                    }}>
                    <motion.div className="mt-8 -ml-8 "

                      variants={fadeInAnimationOther}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ margin: "-20% 0% -20% 0%" }}>
                      <ServiceCard key={upgrade.title} index={index} showDetails={expandSkill} {...upgrade} />
                    </motion.div>
                  </motion.div>

                ))}
              </div>
            </div>

            <div className={`z-20 duration-1000 flex items-center justify-center h-[100vh] w-[90px] text-[46px] relative  ${textSkillType === "Primary" ? " border-2 border-white" : "border-none"}`}>
              <div className={`w-[100vh] flex items-center justify-start whitespace-nowrap absolute  rotate-90 `}>

                <div className={`bg-[#c27f33] absolute  w-[100vh] h-[80px]  ${textSkillType === "Primary" ? "" : "opacity-0"} `}></div>


                {/* Primary Skills side scrolling banner text */}
                <div className="absolute flex flex-row">


                  <div className={`duration-1000 diagonal-lines scroll   w-[1190px] h-[75px]  ${textSkillType === "Primary" ? "" : "opacity-0"}`}>
                    <p className={`font-pop text-[#c27f33] ${textSkillType === "Primary" ? "" : "text-[#C6DDCB] opacity-0"}  `}>| Primary Skills | Primary Skills | Primary Skills </p>
                  </div>
                  {/* duplicated to produce infinite marquee effect */}
                  <div className={`duration-1000 diagonal-lines scroll  w-[1190px] h-[75px]  ${textSkillType === "Primary" ? "" : "opacity-0"}`}>
                    <p className={`font-pop text-[#c27f33] ${textSkillType === "Primary" ? "" : "text-[#C6DDCB] opacity-0"}  `}>| Primary Skills | Primary Skills | Primary Skills </p>
                  </div>

                </div>

                {/* Other Skills side scrolling banner text */}
                <div className="absolute flex flex-row">

                  <div className={`duration-1000 diagonal-lines-black scroll  w-[1050px] h-[75px]  ${textSkillType === "Other" ? "" : "opacity-0"}`}>
                    <p className={`font-pop  text-[#C6DDCB] ${textSkillType === "Other" ? "" : "text-[#c27f33] opacity-0"}  `}>| Other Skills | Other Skills | Other Skills </p>
                  </div>
                  {/* duplicated to produce infinite marquee effect */}
                  <div className={`duration-1000 diagonal-lines-black scroll  w-[1050px] h-[75px]  ${textSkillType === "Other" ? "" : "opacity-0"}`}>
                    <p className={`font-pop  text-[#C6DDCB] ${textSkillType === "Other" ? "" : "text-[#c27f33] opacity-0"}  `}>| Other Skills | Other Skills | Other Skills </p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>



        <div className="flex w-full mt-[30px] absolute dotted-pattern-dark" width="1728" height="1000" fill="#231750" variants={textVariant()} mask="url(#circleMaskTech)">
          <div className={`basis-1/2 ml-[2px] flex justify-center items-center font-desc ${styles.sectionHeadText}`} >Technical Skills</div>
        </div>



      </div>

      <div className="h-[20px] w-full bg-gradient-to-b from-[#C6DDCB]">


        <div className="w-full h-full flex flex-row">

          <div className="basis-1/2"></div>

          <div className="basis-1/2 dotted-pattern-fade"></div>

        </div>

      </div>



    </>
  );
};

export default SectionWrapper(Tech, "asdfawefawef");
