import React, { useEffect, useState, useRef } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { gsap } from 'gsap';

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";



import {
  expBldg
} from "../assets";



const Experience = () => {

  const [scrolled, setScrolled] = useState(false);



  const refMainSection = useRef(null);

  /// can change into using scrollYProgress instead
  let tlEnter = gsap.timeline({
    scrolled
  })

  tlEnter.to('.displacement', {
    attr: {
      r: (() => { if (scrolled) return 1000; else return 200 })
    },
    duration: 1,
  })

  /// can change into using scrollYProgress instead
  useEffect(() => {
    const handleScroll = () => {

      const scrollTop = window.scrollY;
      // console.log("scroll: " + scrollTop);

      if (scrollTop > 3700) {
        setScrolled(true);

      } else {
        setScrolled(false);

      }
    };


    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <>

      <div
      >
        <div className="absolute h-[410vh] ">

          <div className="sticky h-[20vh] w-full left-0 top-0 z-10 backdrop-blur-sm bg-[#111111]/30"></div>

          <div className={`duration-500 sticky w-[100vw] left-0 top-[20%] bg-white overflow-hidden ${scrolled ? "h-[60vh]" : "h-[60vh]"} `} ref={refMainSection}>


            <div className=" absolute w-[200px]  h-full flex items-center justify-center dotted-pattern-light ml-[30px]">
              <motion.div className="text-[#df8447] text-[50px] rotate-90 whitespace-nowrap  ">
                Work Experience
              </motion.div>
            </div>

            <div className="w-full absolute flex justify-end items-start" >


                <img
                  src={expBldg}
                  alt='web-development'
                  className='ml-[100px] h-[850px] max-w-[1500px] absolute'
                />


                <svg className="absolute flex justify-end items-start ml-[300px] z-30" width="1528 " height="852" viewBox="0 0 1728 952" fill="none" preserveAspectRatio="xMidYMin slice">

                  <defs>
                    <filter id="displacementFilter">
                      <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" result="noise" />
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                    <mask id="circleMask">
                      <circle cx="1300" cy="800" r="100" fill="white" class="displacement" />
                    </mask>


                  </defs>


                  {/* replacement placeholder for image */}
                  {/* <rect width="1728" height="851.376" fill="#92E84E" mask="url(#circleMask)" /> */}


                  <image className="flex justify-end items-center" href={`${expBldg}`} width="100%" height="100%" mask="url(#circleMask)" />

                </svg>

              </div>


          </div>

          <div className="sticky h-[18vh] w-full left-0 top-[80%] z-10 backdrop-blur-sm bg-[#111111]/30"></div>

        </div>



          <div className="h-[95vh] w-[95vw] pt-[80vh]" >

            <div className="flex flex-row overflow-hidden">

              <div className="basis-1/2 flex flex-col items-start mt-2">


                {/* 
              <motion.div variants={textVariant()}>
                <p className={`${styles.sectionSubText} text-center`}>s
                  What I have done so far
                </p>
                <h2 className={`${styles.sectionHeadText} text-center`}>
                  Work Experience.
                </h2>
              </motion.div> */}



                <div className='ml-[200px] -mr-[346px] border-x-2' >
                  <VerticalTimeline className="line-colored absolute"

                    layout="1-column"
                  >
                    <div className="bg-[#1b1746] absolute h-full w-[4px] top-0"></div>
                    <div className="bg-[#1b1746] absolute h-full w-[4px] top-0 left-[36px]"></div>
                    {experiences.map((experience, index) => (
                      <ExperienceCard
                        key={`experience-${index}`}
                        experience={experience}
                      />
                    ))}

                  </VerticalTimeline>

                </div>


              </div>

              <div className="flex items-start basis-1/2">


                {/* <img
                src={expBldg}
                alt='web-development'
                className='h-[1700px] min-w-[1000px] z-30 mr-[40px] mt-6'
              /> */}


              </div>

            </div>

          </div>
      </div>

    </>
  );
};



const ExperienceCard = ({ experience }) => {
  const refMainSection = useRef(null);

  const mainSection = refMainSection.current;

  let { scrollYProgress } = useScroll({
    target: refMainSection,
    offset: ['start 20vh  ', 'end 15vh']
  })
  console.log(scrollYProgress);
  const clipProgress = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clip = useMotionTemplate`inset(0 0 ${clipProgress}% 0)`;


  ({ scrollYProgress } = useScroll({
    target: refMainSection,
    offset: ['end 80vh  ', 'start 85vh']
  }))

  const clipProgressB = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipB = useMotionTemplate`inset(${clipProgressB}% 0 0 0)`;


  const fadeInAnimationVariants = {
    initial: {
      opacity: 0,
      x: -100,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    margin: {
      margin: ""
    }
  }


  return (

    <VerticalTimelineElement
      className="w-[700px]"
      contentStyle={{
        background: "#1e102e00",
        color: "#1b1746",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className='flex justify-center items-center w-full h-full'>
          <img
            src={experience.icon}
            alt={experience.company}
            className='w-[60%] h-[60%] object-contain'
          />
        </div>
      }
    >

      {/* style={{ clipPath: clip }} */}
      <motion.div
        ref={refMainSection}
        className="diagonal-lines w-[700px] h-[400px]"
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ margin: "-40% 0% -40% 0%" }} >

        <motion.div className="diagonal-lines-dark h-[400px] w-[700px] absolute"
          style={{ clipPath: clip }}
        ></motion.div>

        <motion.div className="diagonal-lines-dark h-[400px] w-[700px] absolute"
          style={{ clipPath: clipB }}
        ></motion.div>

        <div>
          <h3 className='text-[#281a49] text-[24px] font-bold ml-4 pt-4'  >{experience.company}</h3>
          
        </div>

      <div className="bg-[#e3ebdc] pt-1 pb-12">
        <p className='text-secondary text-[16px] font-semibold pl-4'>
            {experience.title}
          </p>

        <ul className='mt-5 list-disc ml-5 space-y-2 '>
          {experience.segments.map((point, index) => (
            <li
              key={`experience-point-${index}`}
              className='text-[#28163d] text-[14px] pl-1 tracking-wider m-4'
            >
              {point}
            </li>
          ))}
        </ul>
        </div>
      </motion.div>

    </VerticalTimelineElement>
  );
};



export default Experience;
