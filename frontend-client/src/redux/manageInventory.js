import { createSlice } from "@reduxjs/toolkit";

export const inventorySlice = createSlice({ 
    name: 'inventory',
    initialState: {
        items: [],
        filteredItems: [],
        value: 0
    },
    reducers: { 
        increment: (state) => {
            state.value += 1
        },
        addToInventory: (state, action) => {
            state.items.push(action.payload)
        },
        filterInventory: (state, action) => {
            state.filteredItems = state.items.filter(item => item.title.toLowerCase().includes(action.payload.toLowerCase()))
        }
    }

});

export const { addToInventory } = inventorySlice.actions;

export default inventorySlice.reducer;