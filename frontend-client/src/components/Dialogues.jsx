import { useSelector, useDispatch } from 'react-redux';
import { setDialogueStep } from '../redux/manageDialogues.js';

const dialogueText = (step) => {

    if (step === 1) return <>
        Welcome to the Sea of Curriculum Vitae.
        <br />You can move by pressing W, A, S, D, keys
        or dragging the button with my Face on it.
    </>

    if (step === 2) return <>
        This bar displays your health and your Upgrades progress-bar. Your health is located on the left side of this bar (2 white diamonds)
        while your Upgrades progress-bar just below.
    </>

    if (step === 3) return <>
        If one of these bars fills up, you can select the Number on that progress-bar to select which upgrades you would like to equip.
        <br />Click the number on the end of the Exp Upgrades bar, and then select one buff.
    </>

    if (step === 4) return <>
        Now let's try shooting. Click on the screen to shoot.
    </>

    if (step === 5) return <>
        Congrats! You have completed the basics.
        <br />Note: You might see White Pillars while you explore. Damaging them grants you points on your Tech Bar.
    </>
}



const Dialogues = () => {

    const dispatch = useDispatch();
    const { dialogueStep, popupPanelsActive } = useSelector(state => state.dialogues);

    let nextEnabled = true;

    const touchHandler = () => {
        dispatch(setDialogueStep(dialogueStep + 1))
        window.removeEventListener('click', touchHandler)
    }


    if( dialogueStep === 3 || dialogueStep === 4 ) {
        nextEnabled = false
    }

    if(dialogueStep === 4 && !popupPanelsActive ) {
        window.removeEventListener('click', touchHandler)
        setTimeout(() => {
            window.addEventListener('click', touchHandler)
        }, 1000)
        
    }

    if(dialogueStep > 5) return <></>

    return <>
        <div className={`fixed left-0 top-0 w-full h-full flex justify-center z-10 ${dialogueStep === 4 ? 'pointer-events-none' : ''} `}>

            <div className={`absolute bg-white p-6 ${dialogueStep == 1 ? 'mt-40 h-[12rem] w-[24rem]' : 'bottom-0 mb-40 h-[12rem] w-[32rem]'}  `}>

                <h1 className="text-blue-600">
                    {dialogueText(dialogueStep)}
                </h1>

                <button className={` ${ nextEnabled ? 'bg-sky-600 absolute bottom-0 right-0 w-20 h-10 m-4 p-2 text-center justify-center' : 'hidden' }`}
                    onClick={() => {
                        dispatch(setDialogueStep(dialogueStep + 1))
                    }}>{dialogueStep != 5 ? 'Next' : 'Close'}</button>
            </div>
        </div>
    </>

}

export default Dialogues;