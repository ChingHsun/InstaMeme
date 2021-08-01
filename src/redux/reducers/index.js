import { combineReducers } from "redux";
import {
  GET_MEME,
  GET_TEMPLATE,
  GET_USERS,
  GET_DEVICE,
  GET_AUTH_SAVED,
  GET_SELECTED_MEME,
  GET_SELECTED_TEMPLATE,
  GET_USERS_SAVED,
  GET_USERS_CREATED,
  GET_AUTH,
  GET_ONE_AUTH_SAVED,
  DELETE_ONE_AUTH_SAVED,
  ADD_ONE_AUTH_SAVED_COUNT,
  DELETE_ONE_AUTH_SAVED_COUNT,
  GET_MEME_MESSAGES,
  LOGOUT_AUTH_SAVED,
  UPDATE_AUTH,
  UPDATE_USER,
  GET_MEMES_ORDER,
  ADD_ONE_VISIT_COUNT,
  GET_TEMPLATE_MORE,
  GET_MEMES_ORDER_MORE,
  DELETE_ONE_AUTH_SAVED_CATEGORY,
  GET_AUTH_CREATE,
  GET_ONE_AUTH_CREATE,
  DELETE_ONE_AUTH_CREATE,
  DELETE_ONE_AUTH_CREATE_CATEGORY,
  ADD_MEMES_ORDER_MORE,
} from "../actions";

const memesReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_MEME:
      return { ...state, ...action.payload };
    case ADD_ONE_AUTH_SAVED_COUNT:
      return {
        ...state,
        [action.memeId]: {
          ...state[action.memeId],
          saved_count: action.payload + 1,
        },
      };
    case DELETE_ONE_AUTH_SAVED_COUNT:
      return {
        ...state,
        [action.memeId]: {
          ...state[action.memeId],
          saved_count: action.payload - 1,
        },
      };
    case GET_MEME_MESSAGES:
      return {
        ...state,
        [action.memeId]: {
          ...state[action.memeId],
          messages: { ...state[action.memeId]["messages"], ...action.payload },
        },
      };
    case ADD_ONE_VISIT_COUNT:
      return {
        ...state,
        [action.memeId]: {
          ...state[action.memeId],
          visited_count: action.payload + 1,
        },
      };
    case DELETE_ONE_AUTH_CREATE_CATEGORY:
      return {
        ...state,
        [action.memeId]: {
          ...state[action.memeId],
          themes: state[action.memeId].themes.filter(
            (theme) => theme !== action.category
          ),
        },
      };
    case DELETE_ONE_AUTH_CREATE:
      const { [action.memeId]: deleted, ...rest } = state;
      return rest;
    default:
      return state;
  }
};

const templatesReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_TEMPLATE:
      const { selectedTemplate, ...templates } = action.payload;
      return { ...state, ...templates };
    case GET_TEMPLATE_MORE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
const selectedTemplateReducer = (state = null, action) => {
  switch (action.type) {
    case GET_TEMPLATE:
      return action.payload.selectedTemplate;
    case GET_SELECTED_TEMPLATE:
      return action.payload;
    default:
      return state;
  }
};
const usersReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        [action.userId]: {
          ...state[action.userId],
          ...action.payload[action.userId],
        },
      };
    case GET_USERS_SAVED:
      return {
        ...state,
        [action.userId]: {
          ...state[action.userId],
          saved: [...action.payload],
        },
      };
    case GET_USERS_CREATED:
      return {
        ...state,
        [action.userId]: {
          ...state[action.userId],
          created: [...action.payload],
        },
      };
    case UPDATE_USER:
      return {
        ...state,
        [action.userId]: {
          ...state[action.userId],
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

const deviceReducer = (
  state = { isDesktop: true, isTablet: false, isMobile: false },
  action
) => {
  switch (action.type) {
    case GET_DEVICE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
const authReducer = (state = null, action) => {
  switch (action.type) {
    case GET_AUTH:
      return action.payload;
    case UPDATE_AUTH:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
const authSaveReducer = (state = [], action) => {
  switch (action.type) {
    case GET_AUTH_SAVED:
      return [...state, ...action.payload];
    case GET_ONE_AUTH_SAVED:
      return state.map((item) => {
        if (item.docId === action.category) {
          return { ...item, memes: [...item.memes, action.payload] };
        } else {
          return item;
        }
      });
    case DELETE_ONE_AUTH_SAVED:
      return state.map((item) => {
        if (item.memes.includes(action.payload)) {
          return {
            ...item,
            memes: item.memes.filter((memeId) => memeId !== action.payload),
          };
        } else {
          return item;
        }
      });
    case DELETE_ONE_AUTH_SAVED_CATEGORY:
      return state.map((item) => {
        if (item.docId === action.category) {
          return {
            ...item,
            memes: item.memes.filter((memeId) => memeId !== action.memeId),
          };
        } else {
          return item;
        }
      });
    case LOGOUT_AUTH_SAVED:
      return [];

    default:
      return state;
  }
};
const authCreateReducer = (state = [], action) => {
  switch (action.type) {
    case GET_AUTH_CREATE:
      return [...state, ...action.payload];
    case GET_ONE_AUTH_CREATE:
      return state.map((item) => {
        if (item.docId === action.category) {
          return { ...item, memes: [...item.memes, action.memeId] };
        } else {
          return item;
        }
      });
    case DELETE_ONE_AUTH_CREATE:
      return state.map((item) => {
        if (item.memes.includes(action.memeId)) {
          return {
            ...item,
            memes: item.memes.filter((memeId) => memeId !== action.memeId),
          };
        } else {
          return item;
        }
      });
    case DELETE_ONE_AUTH_CREATE_CATEGORY:
      return state.map((item) => {
        if (item.docId === action.category) {
          return {
            ...item,
            memes: item.memes.filter((memeId) => memeId !== action.memeId),
          };
        } else {
          return item;
        }
      });
    case LOGOUT_AUTH_SAVED:
      return [];

    default:
      return state;
  }
};
const memesOrderReducer = (
  state = { memes: [], orderby: null, theme: null },
  action
) => {
  switch (action.type) {
    case GET_MEMES_ORDER:
      return {
        memes: [...action.payload],
        orderby: action.orderby,
        theme: action.theme,
        lastDoc: action.lastDoc,
      };
    case GET_MEMES_ORDER_MORE:
      return {
        ...state,
        memes: [...state.memes, ...action.payload],
        lastDoc: action.lastDoc,
      };
    case ADD_MEMES_ORDER_MORE:
      return {
        ...state,
        memes: [action.payload, ...state.memes],
      };
    case DELETE_ONE_AUTH_CREATE:
      return {
        ...state,
        memes: state.memes.filter((meme) => meme !== action.memeId),
      };
    default:
      return state;
  }
};

export default combineReducers({
  device: deviceReducer,
  memes: memesReducer,
  templates: templatesReducer,
  users: usersReducer,
  authCreate: authCreateReducer,
  selectedTemplate: selectedTemplateReducer,
  auth: authReducer,
  memesOrder: memesOrderReducer,
  authSave: authSaveReducer,
});
