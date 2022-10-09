import axios from 'axios';

export const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST"
export const JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS"
export const JOIN_ROOM_ERROR = "JOIN_ROOM_ERROR"

export function joinRoomRequest(){
    return {
        type: JOIN_ROOM_REQUEST
    }
}

export function joinRoomSuccess(payload){
    return {
        type: JOIN_ROOM_SUCCESS,
        payload
    }
}

export function joinRoomError(error){
    return {
        type: JOIN_ROOM_ERROR,
        error
    }
}

export function joinRoom(data) {
    const {room, userData} = data;
    return async function (dispatch) {
        dispatch(joinRoomRequest());
        try{
            dispatch(setUsername(userData));
            dispatch(joinRoomSuccess(room));
        }catch(error){
            dispatch(joinRoomError(error));
        }
    }
}

export const GET_USERS_SUCCESS = "GET_USERS_SUCCESS"
export const GET_USERS_ERROR = "GET_USERS_ERROR"
export const GET_USERS = "GET_USERS"

export function getUsersSuccess(data){
    const {users, userIds} = data;
    return {
        type: GET_USERS_SUCCESS,
        users,
        userIds
    }
}

export function getUsersError(error){
    return {
        type: GET_USERS_ERROR,
        error
    }
}

export function getUsers(){
    return async function (dispatch) {
        try{
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/users/`)
            dispatch(getUsersSuccess(response.data));
        }catch(error){
            dispatch(getUsersError(error));
        }
    }
}

export const SET_USERNAME_SUCCESS = "SET_USERNAME_SUCCESS"
export const SET_USERNAME_ERROR = "SET_USERNAME_ERROR"
export const SET_USERNAME = "SET_USERNAME"

export function setUsernameSuccess(userData){
    const {user, id} = userData;
    return {
        type: SET_USERNAME_SUCCESS,
        user,
        id
    }
}

export function setUsernameError(error){
    return {
        type: SET_USERNAME_ERROR,
        error
    }
}

export const SET_USERID_SUCCESS = "SET_USERID_SUCCESS"
export const SET_USERID_ERROR = "SET_USERID_ERROR"
export const SET_USERID = "SET_USERID"

export function setUseridSuccess(userData){
    const {user, id} = userData;
    return {
        type: SET_USERID_SUCCESS,
        user,
        id
    }
}

export function setUseridError(error){
    return {
        type: SET_USERID_ERROR,
        error
    }
}

export function setUsername(userData){
    return async function (dispatch) {
        try{
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/addUser/`, {userData})
            if (response.data.id) {
                dispatch(setUseridSuccess(response.data));
            } else {
                dispatch(setUsernameSuccess(response.data));
            }
        }catch(error){
            dispatch(setUsernameError(error));
        }
    }
}

export const UPDATE_CHAT_LOG = "UPDATE_CHAT_LOG"
export const UPDATE_CHAT_LOG_SUCCESS = "UPDATE_CHAT_LOG_SUCCESS"
export const UPDATE_CHAT_LOG_ERROR = "UPDATE_CHAT_LOG_ERROR"

export function updateChatLogSuccess(messages){
    return {
        type: UPDATE_CHAT_LOG_SUCCESS,
        messages
    }
}

export function updateChatLogError(error){
    return {
        type: UPDATE_CHAT_LOG_ERROR,
        error
    }
}

export function updateChatLog(){
    return async function (dispatch) {
        try{
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/messages/`)
            dispatch(updateChatLogSuccess(response.data));
        }catch(error){
            dispatch(updateChatLogError(error));
        }
    }
}
