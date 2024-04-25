import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { experiences, navLinks } from "../constants";
import { logo, menu, close } from "../assets";

import { socket } from "../SocketReceiver"


import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";

const ContestBar = () => {

    var inviter = "";
    var contestLeader = "";

    
    const [scrolled, setScrolled] = useState(false);
    const [playerList, setPlayerList] = useState([]);
    const [inviters, setInviters] = useState([]);
    const [leader, setLeader] = useState("");
    const [members, setMembers] = useState([]);
    const [contestPlayers, setContestPlayers] = useState([]);
    const [displayContestPanel, setDisplayContestPanel] = useState(false);

    // const refContest = useRef(null);
    // const { scrollYProgress } = useScroll({
    //   target: refContest,
    //   offset: ['start end', '75vw end']
    // })
    // const clipProgress = useTransform(scrollYProgress, [0, 1], [100, 0]);
    // const clip = useMotionTemplate`inset(0 ${clipProgress}% 0 0)`;


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

    socket.off("playerList");
    socket.on("playerList", (players) => {

        setPlayerList(players.filter((player) => (player.id !== socket.id)));

        inviter = players.find((player) => player.id === socket.id).contest.inviters;

        if (inviter !== null && inviter !== undefined && inviter !== "") {
            console.log("inviter exists");
            setInviters(inviter);
        }

        contestLeader = players.find((player) => player.contest.members.includes(socket.id));

        if (contestLeader !== null && contestLeader !== undefined && contestLeader !== "") {
            console.log("setting leader: " + contestLeader.id);
            setLeader(contestLeader.id);
            console.log("new leader: " + leader);
            setMembers(contestLeader.contest.members);
            console.log("members: " + members);
        } else {

            console.log("checking if you are the leader");
            contestLeader = players.find((player) => player.contest.leader === socket.id && player.id === socket.id);

            if (contestLeader === null || contestLeader === undefined || contestLeader === "") return;

            console.log("You are the leader");
            setLeader(socket.id);
            setMembers(contestLeader.contest.members);
            console.log("members: " + members);

        }

    });

    socket.off("contestCountdown")
    socket.on("contestCountdown", players => {

        for (const startingPlayer of players) {

            console.log(startingPlayer.id);

            if (startingPlayer.id !== socket.id) continue;

            setContestPlayers(players);



            console.log(">>>>> CONTEST IS STARTING <<<<<");

            setTimeout(() => {

                console.log("3");

            }, 1000);

            setTimeout(() => {

                console.log("2");

            }, 2000);

            setTimeout(() => {

                console.log("1");

            }, 3000);

            setDisplayContestPanel(false);

        }


    });


    return (
        <>

        <motion.div className={` z-20 `} >

            <nav className={`mr-4 duration-1000 flex items-end pb-5 pt-3 fixed  lg:bottom-0 sm:top-0  z-30 ${ scrolled ? "sm:-right-[50vw]": "right-0" }`}>

                <div className='w-full flex justify-end items-center mx-auto'>

                    {/* bar button */}
                    <div className="border-2 h-4 w-4 lg:h-[50px] lg:w-[50px]"
                        onClick={() => {

                            socket.emit("showPlayers", socket.id);
                            console.log("Contest Button Pressed");

                            setDisplayContestPanel(!displayContestPanel);

                        }}>
                    </div>
                </div>
            </nav>


            {/* Contest panel */}
            <div className={`duration-1000 fixed left-0 h-screen w-screen flex items-center justify-center ${!displayContestPanel || scrolled ? "-top-[100%]" : "top-0"}`}>

                <div className={` duration-500 flex flex-col items-center justify-center border-y-2  w-[60vw] gap-10 dotted-pattern-dark border-dotted overflow-hidden ${!displayContestPanel || scrolled ? "h-[0vh]" : "h-[60vh]"} `}>


                    {/* input name to join lobby */}
                    <section className={` flex flex-row gap-10 dotted-pattern px-4`}>

                        <form className="border-2 w-[200px] h-[40px]"></form>
                        <button>Register</button>
                        <button>Change Name</button>

                        <button className={` ${ leader === socket.id ? "" : "hidden"} `} 
                        onClick={() => {

                            socket.emit("startContest", leader);

                        }}>Start Contest</button>



                    </section>

                    <section>

                        {playerList.map((player) => (


                            /// improve code -> make const functions for checkers ex: const contestMember = members.find((member) => member === player.id) ? "border-2" : "hidden" 

                            <div className={` flex flex-row gap-10 border-b-2 mb-2`}>

                                <div>{player.id}</div>

                                <p className={` ${members.find((member) => member === player.id) ? "border-2" : "hidden"} `}>Member</p>

                                <p className={` ${leader === player.id ? "border-2" : "hidden"} `}>Leader</p>


                                <div className={` ${leader === player.id ? "hidden" : "gap-10 flex flex-row"} `}>

                                    <button className={` ${members.find((member) => member === player.id || member === socket.id) ? "hidden" : ""} `}
                                        onClick={() => {

                                            socket.emit("inviteToContest", player.id, socket.id);

                                        }}>Invite</button>

                                    <section className={` ${inviters.find((inviter) => (inviter === player.id)) ? "gap-10 flex flex-row" : "hidden"} `}>

                                        <p>Invited You</p>

                                        <div className={` ${members.find((member) => member === player.id) ? "hidden" : "gap-10"} `}>

                                            <button onClick={() => {

                                                socket.emit("acceptContest", player.id, socket.id);

                                            }}>Accept</button>


                                            <button onClick={() => {



                                            }}>Close</button>

                                        </div>
                                    </section>
                                </div>
                            </div>

                        ))}

                    </section>
                </div>
            </div>


            <nav className={`${styles.paddingX
                } w-full flex items-center pt-5 fixed top-0 z-20 ${contestPlayers.length > 0 ? "" : "hidden"}`}>

                {contestPlayers.map(displayContestPlayer => (
                    <div className="w-full flex items-center justify-center gap-5">
                        <div className="border-t-2"> {displayContestPlayer.id} :  </div>
                        <div className="pr-2 border-r-2"> {displayContestPlayer.score} </div>
                    </div>
                ))}

            </nav>
</motion.div>
        </>
    );
};

export default ContestBar;
