"use client";

const { configureStore, combineReducers } = require("@reduxjs/toolkit");

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import users from "./reducers/users";
import hashtags from "./reducers/hashtags";
import likes from "./reducers/likes";
const reducers = combineReducers({ users, hashtags, likes });

const persistConfig = { key: "hackatweet", storage };

export const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
export const persistor = persistStore(store);
