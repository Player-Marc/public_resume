import { motion } from "framer-motion";

import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";

const StarWrapper = (Component, idName) =>
  function HOC() {
    return (
      <motion.section
        variants={staggerContainer()}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.25 }}
        className={`${styles.padding} h-[120vh] relative z-0 backdrop-blur-sm bg-[#111111]/30 flex items-center`}
      >
        <span className='hash-span' id={idName}>
          &nbsp;
        </span>

        <div className="snap-start">

        
        <Component />
        </div>
      </motion.section>
    );
  };

export default StarWrapper;
