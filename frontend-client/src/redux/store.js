import { configureStore } from "@reduxjs/toolkit";

import inventoryReducer from "./manageInventory.js";
import dialoguesReducer from "./manageDialogues.js";

export default configureStore({
    reducer: {
        inventory: inventoryReducer,
        dialogues: dialoguesReducer
    }
})