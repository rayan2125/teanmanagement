const { configureStore, combineReducers } = require("@reduxjs/toolkit");

import { persistStore, persistReducer } from 'redux-persist'

import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from "redux-persist";

import authRedux from './Reducers/auth.redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import teamRedux from './Reducers/teamsRedux';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['err'],
}
const reducer = combineReducers({
    auth: authRedux,
    member: teamRedux,
})

const persistReducers = persistReducer(persistConfig, reducer)

const store = configureStore({
    reducer: persistReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export default store