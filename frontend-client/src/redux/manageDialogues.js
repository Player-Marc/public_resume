import { createSlice } from "@reduxjs/toolkit";

export const dialogueSlice = createSlice({ 
    name: 'dialogues',
    initialState: {
        dialogueStep: 1,
        popupPanelsActive: false,
        value: 0
    },
    reducers: { 
        increment: (state) => {
            state.value += 1
        },
        setDialogueStep: (state, action) => {
            state.dialogueStep = action.payload
        },
        setPopupPanelsActive: (state, action) => {
            state.popupPanelsActive = action.payload
        }
    }

});

export const { setDialogueStep, setPopupPanelsActive } = dialogueSlice.actions;

export default dialogueSlice.reducer;