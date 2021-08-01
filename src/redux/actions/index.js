import {
  getFirestoreCollection,
  getFirestoreDoc,
  getSavedCategory,
} from "../../firebase/firestore";

export const GET_MEME = "GET_MEME";
export const GET_MEME_MESSAGES = "GET_MEME_MESSAGES";

export const GET_TEMPLATE = "GET_TEMPLATE";
export const GET_TEMPLATE_MORE = "GET_TEMPLATE_MORE";

export const GET_USERS = "GET_USERS";
export const UPDATE_USER = "UPDATE_USER";
export const GET_USERS_SAVED = "GET_USERS_SAVED";
export const GET_USERS_CREATED = "GET_USERS_CREATED";

export const GET_DEVICE = "GET_DEVICE";
export const GET_AUTH_SAVED = "GET_AUTH_SAVED";
export const GET_ONE_AUTH_SAVED = "GET_ONE_AUTH_SAVED";
export const DELETE_ONE_AUTH_SAVED = "DELETE_ONE_AUTH_SAVED";
export const DELETE_ONE_AUTH_SAVED_COUNT = "DELETE_ONE_AUTH_SAVED_COUNT";
export const ADD_ONE_AUTH_SAVED_COUNT = "ADD_ONE_AUTH_SAVED_COUNT";
export const LOGOUT_AUTH_SAVED = "LOGOUT_AUTH_SAVED";
export const ADD_ONE_VISIT_COUNT = "ADD_ONE_VISIT_COUNT";

export const GET_SELECTED_MEME = "GET_SELECTED_MEME";
export const GET_SELECTED_TEMPLATE = "GET_SELECTED_TEMPLATE";
export const GET_AUTH = "GET_AUTH";
export const UPDATE_AUTH = "UPDATE_AUTH";
export const DELETE_ONE_AUTH_SAVED_CATEGORY = "DELETE_ONE_AUTH_SAVED_CATEGORY";
export const GET_MEMES_ORDER = "GET_MEMES_ORDER";

export const ADD_MEMES_ORDER_MORE = "ADD_MEMES_ORDER_MORE";
export const GET_MEMES_ORDER_MORE = "GET_MEMES_ORDER_MORE";
export const GET_AUTH_CREATE = "GET_AUTH_CREATE";

export const DELETE_ONE_AUTH_CREATE = "DELETE_ONE_AUTH_CREATE";
export const GET_ONE_AUTH_CREATE = "GET_ONE_AUTH_CREATE";
export const DELETE_ONE_AUTH_CREATE_CATEGORY =
  "DELETE_ONE_AUTH_CREATE_CATEGORY";

export const getMemeAction = (data) => {
  return {
    type: GET_MEME,
    payload: { ...data },
  };
};

export const getMemeMessagesAction = (memeId, data) => {
  return {
    type: GET_MEME_MESSAGES,
    payload: data,
    memeId: memeId,
  };
};

export const getTemplateAction = (data, templateId) => {
  if (!templateId) {
    //all
    return {
      type: GET_TEMPLATE,
      payload: { ...data, selectedTemplate: null },
    };
  } else {
    return {
      type: GET_TEMPLATE,
      payload: { ...data, selectedTemplate: data[templateId] },
    };
  }
};
export const getTemplateMoreAction = (data, templateId) => {
  return {
    type: GET_TEMPLATE_MORE,
    payload: data,
  };
};

export const getSelectedTemplateAction = (templateData) => {
  return {
    type: GET_SELECTED_TEMPLATE,
    payload: templateData,
  };
};
export const getUsersAction = (userId, collection, data) => {
  switch (collection) {
    case "saved_category":
      return { type: GET_USERS_SAVED, payload: data, userId: userId };
    case "created_theme":
      return { type: GET_USERS_CREATED, payload: data, userId: userId };
    default:
      return async (dispatch) => {
        const response = await getFirestoreDoc("users", userId);
        dispatch({ type: GET_USERS, payload: response, userId: userId });
      };
  }
};
export const updateUsersAction = (userId, data) => {
  return { type: UPDATE_USER, payload: data, userId: userId };
};
export const getAuthAction = (data) => {
  return { type: GET_AUTH, payload: data };
};
export const updateAuthAction = (data) => {
  return { type: UPDATE_AUTH, payload: data };
};

export const getAuthSavedAction = (userId) => {
  //remember change
  return async (dispatch) => {
    const { arrayData } = await getSavedCategory(
      "users",
      userId,
      "saved_category"
    );

    dispatch({ type: GET_AUTH_SAVED, payload: arrayData });
  };
};
export const getAuthCreateAction = (userId) => {
  //remember change
  return async (dispatch) => {
    const { arrayData } = await getSavedCategory(
      "users",
      userId,
      "created_theme"
    );

    dispatch({ type: GET_AUTH_CREATE, payload: arrayData });
  };
};

export const getOneSavedAction = (memeId, action, category) => {
  switch (action) {
    case "delete":
      return {
        type: DELETE_ONE_AUTH_SAVED,
        payload: memeId,
      };
    default:
      return { type: GET_ONE_AUTH_SAVED, payload: memeId, category: category };
  }
};

export const deleteOneSavedByCategoryAction = (memeId, category) => {
  return {
    type: DELETE_ONE_AUTH_SAVED_CATEGORY,
    memeId: memeId,
    category: category,
  };
};

export const getOneCreateAction = (memeId, action, category) => {
  switch (action) {
    case "delete":
      return {
        type: DELETE_ONE_AUTH_CREATE,
        memeId: memeId,
      };
    default:
      return { type: GET_ONE_AUTH_CREATE, memeId: memeId, category: category };
  }
};

export const deleteOneCreateByCategoryAction = (memeId, category) => {
  return {
    type: DELETE_ONE_AUTH_CREATE_CATEGORY,
    memeId: memeId,
    category: category,
  };
};
export const getOneSavedCountAction = (currentNumber, memeId, action) => {
  switch (action) {
    case "delete":
      return {
        type: DELETE_ONE_AUTH_SAVED_COUNT,
        payload: currentNumber,
        memeId: memeId,
      };
    default:
      return {
        type: ADD_ONE_AUTH_SAVED_COUNT,
        payload: currentNumber,
        memeId: memeId,
      };
  }
};

export const getOneVisitedCountAction = (currentNumber, memeId) => {
  return {
    type: ADD_ONE_VISIT_COUNT,
    payload: currentNumber,
    memeId: memeId,
  };
};
export const logoutAuthSavedAction = () => {
  return { type: LOGOUT_AUTH_SAVED };
};
export const getDeviceAction = (data) => {
  return { type: GET_DEVICE, payload: data };
};

export const getMemesOrderAction = (
  data,
  selectTheme,
  selectOrder,
  lastDoc
) => {
  return {
    type: GET_MEMES_ORDER,
    payload: data,
    orderby: selectOrder,
    theme: selectTheme,
    lastDoc: lastDoc,
  };
};
export const getMemesOrderMoreAction = (
  data,
  selectTheme,
  selectOrder,
  lastDoc
) => {
  return {
    type: GET_MEMES_ORDER_MORE,
    payload: data,
    orderby: selectOrder,
    theme: selectTheme,
    lastDoc: lastDoc,
  };
};

export const addMemesOrderMoreAction = (data) => {
  return {
    type: ADD_MEMES_ORDER_MORE,
    payload: data,
  };
};
