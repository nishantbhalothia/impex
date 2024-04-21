// 'use client';
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import sellerReducer from "./sellerReducer";
import productReducer from "./productReducer";

const rootReducer = combineReducers({
    user: userReducer,
    seller: sellerReducer,
    product: productReducer,
    // posts: postsReducer,
    // comments: commentsReducer,
    // likes: likesReducer,
    // follows: followsReducer,
    // notifications: notificationsReducer,
    // messages: messagesReducer,
    // chat: chatReducer,
    // search: searchReducer,
    // errors: errorsReducer,
    // loading: loadingReducer
    })

export default rootReducer;



// const rootReducer = combineReducers({
//     user: userReducer,
//     posts: postsReducer,
//     comments: commentsReducer,
//     likes: likesReducer,
//     follows: followsReducer,
//     notifications: notificationsReducer,
//     messages: messagesReducer,
//     chat: chatReducer,
//     search: searchReducer,
//     errors: errorsReducer,
//     loading: loadingReducer
//     })

// export default rootReducer;