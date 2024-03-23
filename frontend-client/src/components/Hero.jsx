import React from 'react'

import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";

import { ComputersCanvas } from './canvas';

import {
  personBG,
  personBG2
} from "../assets"

const Hero = () => {

  /// cant get it to set height (setting height sets its position, not the size)
  const fadeInAnimationVariants = {
    initial: {
      opacity: 0,
      scaleY: 0.1,
    },
    animate: {
      opacity: 1,
      scaleY: 1,
    },
    margin: {
      margin: ""
    }
  }



  return (
    <>

      <motion.div className="flex w-screen h-60vh relative"
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ margin: "-10% 0% -10% 0%" }}>

      <div className='w-screen absolute overflow-hidden'>
        <img
          src={personBG2}
          alt='web-development'
          // -scale-x-100 <- reverse image (custom css)
          className='min-w-[1800px] bg-cover bg-center flex justify-center'
        />
        </div>

        {/* scroll snapping */}
        {/* <div className='h-[100%] overflow-y-scroll snap-mandatory snap-y '>

          <div className='h-[100%] snap-start'>

            dqwdqwdwqd

          </div>
          <div className='h-[100%] snap-start'>

            dqwdqwdwqd

          </div>
          <div className='h-[100%] snap-start'>

            dqwdqwdwqd

          </div>

        </div> */}


        {/* declare own width to prevent text moving when window resizing */}
        <div className='m-16 -mt-[40px] w-[600px] z-20 '>

          <motion.div className={`${styles.sectionPersonText} ml-16 z-20 relative `} variants={textVariant()}>
            PERSON
          </motion.div>


          <motion.div
            variants={fadeIn("", "", 0.1, 1)}
            className='bg-slate-800/90 mt-4 text-secondary text-[22px] max-w-3xl leading-[30px] relative p-12 font-desc'
          >
            Software developer with front-end and
            back-end experience alongside designing,
            problem solving, communication skills, and
            the ability to work well independently or with
            a team under pressure or loosely. I am open,
            teachable and have the willingness to learn
            different technologies including the required
            attention to details for developing beautiful
            functional systems / applications.
          </motion.div>

        </div>

        {/* flex justify-center items-center justify-self-center justify-items-center */}


        <div className='text-[60px] absolute mt-[20vh] right-0 w-[45%] flex items-start'>

          {/* bg-gradient-to-b from-orange-300 */}
          <div className='w-[600px] h-[600px] border-2 border-black-200 dotted-pattern-fade'>

            <div className={` flex justify-center font-desc ${styles.sectionHeadText}`}>character</div>


          </div>

          <div className='absolute w-[600px] h-[600px] pt-[100px] flex justify-between'>

            <div className={`w-[150px] h-[450px] border-[1px] diamond-pattern`}>
              <div className='h-full rotate-180'>
                <div className=' border-x-2 border-t-2 border-black'>
                  <div className='rotate-90 mt-[80px] -ml-[70px]'>
                    CREATIVE

                  </div></div></div></div>

            <div className={`w-[150px] h-[450px] border-[1px] diamond-pattern`}>
              <div className='h-full rotate-180'>
                <div className=' border-x-2 border-t-2 border-black'>
                  <div className='rotate-90 mt-[80px] -ml-[70px] whitespace-nowrap'>
                    TEAM-PLAYER

                  </div></div></div></div>

            <div className={`w-[150px] h-[450px] border-[1px] diamond-pattern`}>
              <div className='h-full rotate-180'>
                <div className=' border-x-2 border-t-2 border-black'>
                  <div className='rotate-90 mt-[80px] -ml-[70px]'>
                    BUILDER

                  </div></div></div></div>

          </div>

        </div>

      </motion.div>

    </>
  )
}

// removing from sectionWrapper since image used needs to start at the edge of the screens
// export default SectionWrapper(Hero, "hero");
export default SectionWrapper(Hero, "gagsdgasdg");