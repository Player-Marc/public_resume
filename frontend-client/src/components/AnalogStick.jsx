import React, { useEffect, useState, useRef } from "react";

import { socket } from "../SocketReceiver"
import { motion, useMotionValue, useSpring } from "framer-motion";



const AnalogStick = () => {

  const refAnalogStick = useRef(null);
  const refTouchArea = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [pressed, setPressed] = useState(false);

  const analogStick = refAnalogStick.current;

  let analogStickDimensions = refAnalogStick.current;

  const inputs = {
    up: false,
    down: false,
    left: false,
    right: false,
    clickAngle: false
  };

  const spring = {
    stiffness: 150,
    damping: 15,
    mass: 0.1
  }

  /// position as is, no easing, not smooth
  // const mousePosition = {
  //   x: useMotionValue(0),
  //   y: useMotionValue(0),
  // }

  // smoother movement than code above
  const mousePosition = {
    x: useSpring(0, spring),
    y: useSpring(0, spring),
  }

  const { x, y } = mousePosition;

  mousePosition.x.set(window.innerWidth * 0.1);
  mousePosition.y.set(window.innerHeight - (window.innerHeight * 0.36));


  useEffect(() => {

    /// getting an elements dimensions using id just like below
    /// or using useRef instead
    analogStickDimensions = document.getElementById('analogStick');
    console.log(analogStickDimensions.getBoundingClientRect().width)
    console.log(analogStickDimensions.getBoundingClientRect().height)

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > window.innerHeight * 0.4) {
        setScrolled(true);
        setPressed(false);

      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    addEventListener("resize", (event) => {

      // mousePosition.x.set(defaultAnalogPosX);
      // mousePosition.y.set(defaultAnalogPosY);

      /// can't work because analogStick.clientWidth is null
      // mousePosition.x.set(window.innerWidth * 0.08 + analogStick.clientWidth / 2);
      // mousePosition.y.set(window.innerHeight - (window.innerHeight * 0.12 + analogStick.clientHeight * 1.6));

      mousePosition.x.set(window.innerWidth * 0.1);
      mousePosition.y.set(window.innerHeight - (window.innerHeight * 0.36));
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      removeEventListener("resize", (event));
    }

  }, []);


  const mouseMove = (e) => {

    if (!pressed) return;

    if (scrolled) {

      return;

    };

    // let smallDevice = 1;
    // if(smallDevice==true) smallDevice = 2
    // else smallDevice = 1;

    const { clientX, clientY } = e;
    // deduct half the size of the analog stick to center mouse to it
    let targetX = clientX - (analogStickDimensions.getBoundingClientRect().width / 2)
    let targetY = clientY - (analogStickDimensions.getBoundingClientRect().height / 2)

    mousePosition.x.set(targetX);
    mousePosition.y.set(targetY);


    // deduct where the default position of the joystick is
    targetX = targetX - (window.innerWidth * 0.1);
    targetY = targetY - (window.innerHeight - (window.innerHeight * 0.36));

    // console.log("Moving Joystick: \n<x> " + targetX +
    // "\n<y> " + targetY);

    /// another way of identifying mouse position
    // let margin = 180;
    // let moveX = (clientX - (analogStick.clientWidth / 2) - margin);
    // let moveY = (clientY - window.innerHeight + (analogStick.clientHeight / 2) + margin);


    let magX = Math.round(targetX / Math.sqrt((targetX * targetX) + (targetY * targetY)));
    let magY = Math.round(targetY / Math.sqrt((targetX * targetX) + (targetY * targetY)));


    // console.log("Analog Stick Direction: " + magX + " " + magY );

    if (magY === -1) {
      inputs["up"] = true;
      inputs["down"] = false;
    } else if (magY === 1) {
      inputs["down"] = true;
      inputs["up"] = false;
    } else if (magX === 1) {
      inputs["right"] = true;
      inputs["left"] = false;
    } else if (magX === -1) {
      inputs["left"] = true;
      inputs["right"] = false;
    }

    if (magX === 0) {
      inputs["left"] = false;
      inputs["right"] = false;
    }

    if (magY === 0) {
      inputs["up"] = false;
      inputs["down"] = false;
    }

    socket.emit("inputs", inputs);


  }



  const touchMove = (e) => {

    if (!pressed) return;

    if (scrolled) {

      return;

    };

    const { clientX, clientY } = e.touches[0];
    // deduct half the size of the analog stick to center mouse to it
    let targetX = clientX - (analogStickDimensions.getBoundingClientRect().width / 2)
    let targetY = clientY - (analogStickDimensions.getBoundingClientRect().height / 2)

    mousePosition.x.set(targetX);
    mousePosition.y.set(targetY);


    // deduct where the default position of the joystick is (the center of the circle)
    targetX = targetX - (window.innerWidth * 0.1);
    targetY = targetY - (window.innerHeight - (window.innerHeight * 0.36));

    // console.log("Moving Joystick: \n<x> " + targetX +
    // "\n<y> " + targetY);

    /// another way of identifying mouse position
    // let margin = 180;
    // let moveX = (clientX - (analogStick.clientWidth / 2) - margin);
    // let moveY = (clientY - window.innerHeight + (analogStick.clientHeight / 2) + margin);


    let magX = Math.round(targetX / Math.sqrt((targetX * targetX) + (targetY * targetY)));
    let magY = Math.round(targetY / Math.sqrt((targetX * targetX) + (targetY * targetY)));


    // console.log("Analog Stick Direction: " + magX + " " + magY );

    if (magY === -1) {
      inputs["up"] = true;
      inputs["down"] = false;
    } else if (magY === 1) {
      inputs["down"] = true;
      inputs["up"] = false;
    } else if (magX === 1) {
      inputs["right"] = true;
      inputs["left"] = false;
    } else if (magX === -1) {
      inputs["left"] = true;
      inputs["right"] = false;
    }

    if (magX === 0) {
      inputs["left"] = false;
      inputs["right"] = false;
    }

    if (magY === 0) {
      inputs["up"] = false;
      inputs["down"] = false;
    }

    socket.emit("inputs", inputs);


  }

  const mouseDown = (e) => {
    console.log("Pressed Analog Stick");

    setPressed(true);
  }

  const mouseLeave = (e) => {
    console.log("Analog Stick Released");
    // setPressed(false);
    //   mousePosition.x.set(window.innerWidth / 8);
    // mousePosition.y.set(window.innerHeight / 1.5);
  }

  const mouseUp = (e) => {
    console.log("Analog Stick Released");
    setPressed(false);

    mousePosition.x.set(window.innerWidth * 0.1);
    mousePosition.y.set(window.innerHeight - (window.innerHeight * 0.36));

    inputs["up"] = false;
    inputs["down"] = false;
    inputs["left"] = false;
    inputs["right"] = false;

    socket.emit("inputs", inputs);

  }



  /// did not work so used useEffect resize instead
  // const resize = (e) => {
  //   console.log("Resizeing");
  //   // setPressed(false);
  //     mousePosition.x.set(window.innerWidth / 8);
  //   mousePosition.y.set(window.innerHeight / 1.5);
  // }




  return (
    <>

      <div className={` bg-black relative`}>

        {/* <div className={` duration-500  border-2 border-white fixed h-[270px] w-[270px] triangle-cut 
        ${scrolled ? "-left-24 -bottom-24 bg-[#111111] " : "bg-[#888888] left-8 bottom-8 "}
        ${pressed ? "" : "diamond-pattern-minimal "}
        `}></div> */}


        {/* shield buttons */}
        {/* <div className={`duration-500 flex flex-col fixed items-center justify-center h-full top-0  clickthrough
        ${pressed ? "-left-28" : "left-0 "}
        ${scrolled ? " -left-36 " : "  "}
        `}>

          <div className={`flex items-center justify-center border-r-4 rounded-r-full h-36 w-36 border-[#99999931]`}>

            <button className={` border-[1px] rounded-full h-32 w-20 border-[#412394a8]`}></button>

          </div>
          <div className={`flex items-center justify-center border-r-4 rounded-r-full h-36 w-36 border-[#99999931]`}>

            <button className={` border-[1px] rounded-full h-32 w-20 border-[#df8f27b9]`}></button>

          </div>
          <div className={`flex items-center justify-center border-r-4 rounded-r-full h-36 w-36 border-[#99999931]`}>

            <button className={` border-[1px] rounded-full h-32 w-20 border-[#77807cb9]`}></button>

          </div>


        </div> */}

        {/* style to put inside 'pressed' to show circle outline behind the analog stick */}
        {/* -> fixed sm:left-[6%] sm:bottom-[11%] lg:left-[6.5%] lg:bottom-[19%]  */}

        <div onTouchMove={touchMove} onMouseMove={mouseMove} onTouchEnd={mouseUp} onMouseUp={mouseUp} onTouchCancel={mouseLeave} onMouseLeave={mouseLeave} className={`z-40 duration-300 
        ${scrolled ? "duration-700  bg-white h-[150px] relative w-[100vw] rounded-none" : " "}
        ${pressed ? "rounded-full  border-2 border-dashed fixed h-[300px] w-[300px] -left-[40px] -bottom-[40px] lg:h-[48rem] lg:w-[48rem] lg:-left-[150px] lg:-bottom-[80px]"
            : "fixed sm:left-[6%] rounded-full border-dashed sm:w-[8rem] sm:h-[8rem] lg:w-[16rem] lg:h-[16rem] border-2"}
        `}>

          {/* <div className={` ${scrolled ? "bg-primary" : "fixed h-full flex items-end left-0 bottom-0 clickthrough"}`}
                ref={refTouchArea}> */}

          {/* <button className={`duration-700 ${scrolled ? "fixed bg-[#666666] m-[180px]" : "inset-0 fixed top-[50%] right-0 bg-[#666666] w-[150px] h-[150px] m-[180px]"}`}  ></button> */}

          <motion.button onTouchStart={mouseDown} onMouseDown={mouseDown} style={{ x, y }} className={`${scrolled ? "hidden" : "inset-0 fixed  bg-white sm:w-[4rem] sm:h-[4rem] lg:w-[8rem] lg:h-[8rem] analogStick"}`} ref={refAnalogStick}>
            <motion.div id="analogStick" className="bg-white sm:w-[4rem] sm:h-[4rem] lg:w-[8rem] lg:h-[8rem] rotate-45"></motion.div>
          </motion.button>
          {/* </div> */}

        </div>


      </div>


    </>
  );
};

export default AnalogStick;









const oldFunctions = () => {

  /// old analogstick follow cursor 
  /// now changed into html tags instead of eventListener
  // useEffect(() => {

  //   const touchArea = refTouchArea.current;
  //   const analogStick = refAnalogStick.current;
  //   let pressed = false;


  //   analogStick.addEventListener('mousedown', e => {
  //     pressed = true;
  //   })

  //   window.addEventListener('mouseup', e => {
  //     if (pressed) {

  //       pressed = false;
  //       analogStick.style.transform = ``;
  //       inputs["up"] = false;
  //       inputs["down"] = false;
  //       inputs["left"] = false;
  //       inputs["right"] = false;

  //       socket.emit("inputs", inputs);

  //     }
  //   });

  //   // analogStick.addEventListener('mouseleave', e => {
  //   //   // pressed = false;
  //   // });


  //   window.addEventListener('mousemove', e => {

  //     if (pressed) {

  //       let x = e.clientX;
  //       let y = e.clientY;

  //       let margin = 180;

  //       let initialX = (analogStick.clientWidth / 2) + margin;
  //       let initialY = window.innerHeight - (analogStick.clientHeight / 2) - margin;

  //       let moveX = (x - (analogStick.clientWidth / 2) - margin);
  //       let moveY = (y - window.innerHeight + (analogStick.clientHeight / 2) + margin);

  //       let calcX = moveX - initialX;
  //       let calcY = moveY - initialY;

  //       analogStick.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;

  //       let magX = Math.round(moveX / Math.sqrt((moveX * moveX) + (moveY * moveY)));
  //       let magY = Math.round(moveY / Math.sqrt((moveX * moveX) + (moveY * moveY)));

  //       // console.log("mag X: " + magX + "\nmag Y: " + magY)

  //       if (magY === -1) {
  //         inputs["up"] = true;
  //         inputs["down"] = false;
  //       } else if (magY === 1) {
  //         inputs["down"] = true;
  //         inputs["up"] = false;
  //       } else if (magX === 1) {
  //         inputs["right"] = true;
  //         inputs["left"] = false;
  //       } else if (magX === -1) {
  //         inputs["left"] = true;
  //         inputs["right"] = false;
  //       }

  //       if (magX === 0) {
  //         inputs["left"] = false;
  //         inputs["right"] = false;
  //       }

  //       if (magY === 0) {
  //         inputs["up"] = false;
  //         inputs["down"] = false;
  //       }

  //       socket.emit("inputs", inputs);

  //     }
  //   })


  //   return () => {
  //     analogStick.removeEventListener('mousedown', []);
  //     window.removeEventListener('mousemove', []);
  //     window.removeEventListener('mouseup', []);
  //     analogStick.removeEventListener('mouseleave', []);
  //   };
  // }, []);



}