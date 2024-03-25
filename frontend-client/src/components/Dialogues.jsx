import { useState } from "react";

const dialogueText = (page) => {

    if (page === 1) return <>
        Welcome to the Sea of Curriculum Vitae.
        <br />You can move by pressing W, A, S, D, keys
        or dragging the button with my Face on it.
    </>

    if (page === 2) return <>
        This bar displays your health and your Upgrades progress-bar. Your health is located on the left side of this bar
        while your Upgrades progress-bar just below.
    </>

    if (page === 3) return <>
        If one of these bars fills up, you can select the Number on that progress-bar to select which upgrades you would like to equip.
        <br />Click the number on the end of the Exp Upgrades bar, and then select one buff.
    </>

    if (page === 4) return <>
        Now let's try shooting. Click on the screen to shoot.
    </>

    if (page === 5) return <>
        Congrats! You have completed the basics.
        <br />Note: You might see White Pillars while you explore. Damaging them grants you points on your Tech Bar.
    </>
}



const Dialogues = () => {

    const [pageNum, setPageNum] = useState(1);

    if(pageNum > 5) return <></>

    return <>
        <div className="fixed left-0 top-0 w-full h-full flex justify-center ">

            <div className={`absolute bg-white ${pageNum == 1 ? 'mt-40 h-[12rem] w-[24rem]' : 'bottom-0 mb-40 h-[8rem] w-[32rem]'}  `}>

                <h1 className="text-blue-600">
                    {dialogueText(pageNum)}
                </h1>

                <button className="bg-sky-600 absolute top-0 right-0 w-8 h-8"
                    onClick={() => {
                        setPageNum(prev => prev + 1)
                    }}></button>
            </div>
        </div>
    </>

}

export default Dialogues;