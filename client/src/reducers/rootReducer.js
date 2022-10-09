import { GET_USERS_SUCCESS, JOIN_ROOM_SUCCESS, SET_USERID_SUCCESS, SET_USERNAME_SUCCESS, UPDATE_CHAT_LOG_SUCCESS} from '../actions';

const initState = {
    users: [],
    userIds: [],
    user: '',
    room: '',
    chats: {
        general: []
    },
    chat: []
}

const rootReducer = (state, action) => {
    if (typeof state === 'undefined') {
        return initState
    }

    switch(action.type){
        case JOIN_ROOM_SUCCESS:
            state.room = action.payload;

            break;

        case GET_USERS_SUCCESS:

            state = {
                ...state,
                users: [...action.users],
                userIds: {...action.userIds}
            }
            break;

        case SET_USERNAME_SUCCESS:
            let {user} = action;
            state.user = user;
            break;

        case SET_USERID_SUCCESS:
            let {id} = action;
            state.userIds = id ? {...state.userIds, [id]: state.user} : {...state.userIds}
            break;

        case UPDATE_CHAT_LOG_SUCCESS:
            if(state.room !== null){
                state = {
                    ...state,
                    chats: {
                        ...action.messages
                    }
                }
                break;
            }
    
    }

    return state
}

export default rootReducer;