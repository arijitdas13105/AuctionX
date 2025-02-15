import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./Slices/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage

const persistConfig = {
    key: 'root',
    storage,
  }
  const persistedReducer = persistReducer(persistConfig, AuthReducer)
 
export const  store = configureStore({
    reducer: {
        // auth: AuthReducer
        auth: persistedReducer
    },
});

export const persistor=persistStore(store)
