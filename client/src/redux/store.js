'use client';
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers/rootreducer'

const store = configureStore({
  reducer: rootReducer,
})

export default store