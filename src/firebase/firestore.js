import firebase from "./firebase-config.js";
import { addDataUrl, addFile, deleteStorage } from "./storage.js";
import _ from "lodash";
export const db = firebase.firestore();
export const timestamp = firebase.firestore.Timestamp;
export const FieldValue = firebase.firestore.FieldValue;
//read
export const getFirestoreDoc = async (
  collection,
  docName,
  collection2,
  docName2
) => {
  let ref = db.collection(collection).doc(docName);
  if (collection2)
    ref = db
      .collection(collection)
      .doc(docName)
      .collection(collection2)
      .doc(docName2);
  return ref.get().then((doc) => {
    return {
      [doc.id]: {
        ...doc.data(),
        [`${collection.slice(0, -1)}_id`]: doc.id,
      },
    };
  });
};

export const getFirestoreByBatch = async (
  collection,
  orderby,
  direction,
  number,
  docName,
  collection2
) => {
  let ref = db.collection(collection);
  if (collection2)
    ref = db.collection(collection).doc(docName).collection(collection2);
  return await ref
    .orderBy(orderby, direction)
    .limit(number)
    .get()
    .then((querySnapshot) => {
      let arrayData = [];
      let objectData = {};
      querySnapshot.docs.map((doc) => {
        const singleDoc = collection.slice(0, -1);
        arrayData = [
          ...arrayData,
          { ...doc.data(), [`${singleDoc}_id`]: doc.id, doc: doc },
        ];
        objectData = {
          ...objectData,
          [doc.id]: { ...doc.data(), [`${singleDoc}_id`]: doc.id },
        };
      });
      return { arrayData: arrayData, objectData: objectData };
    });
};

export const getFirestoreCollection = (collection, docName, collection2) => {
  let ref = db.collection(collection);
  if (collection2)
    ref = db.collection(collection).doc(docName).collection(collection2);
  return ref.get().then((querySnapshot) => {
    let data = {};
    querySnapshot.docs.map((doc) => {
      data = { ...data, [doc.id]: doc.data() };
    });
    return data;
  });
};
export const getMemes = async (orderBy, sort, number, theme, lastKey) => {
  try {
    let ref = db.collection("memes").orderBy(orderBy, sort).limit(number);
    if (lastKey) {
      theme === "所有"
        ? (ref = ref.startAfter(lastKey))
        : (ref = ref
            .where("themes", "array-contains", theme)
            .startAfter(lastKey));
    } else {
      if (theme !== "所有") ref = ref.where("themes", "array-contains", theme);
    }
    const { lastDoc, orderedMemeId, memeData } = await ref
      .get()
      .then(async (querySnapshot) => {
        const usersInfo = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            return db
              .collection("users")
              .doc(doc.data().user_id)
              .get()
              .then((doc) => {
                const { created_time, introduction, displayName, image } =
                  doc.data();
                return { user_name: displayName, user_image: image };
              });
          })
        );
        let memeData = {};
        let lastDoc = null;
        let orderedMemeId = await querySnapshot.docs.map((doc, index) => {
          memeData = {
            ...memeData,
            [doc.id]: {
              meme_id: doc.id,
              ...doc.data(),
              ...usersInfo[index],
            },
          };
          lastDoc = doc;
          return doc.id;
        });
        return { lastDoc, orderedMemeId, memeData };
      });
    return { lastDoc, orderedMemeId, memeData };
  } catch (err) {
    console.log("getMeme", err);
    return { orderedMemeId: [], memeData: {}, lastDoc: null };
  }
};

export const getMeme = async (memeId) => {
  try {
    return db
      .collection("memes")
      .doc(memeId)
      .get()
      .then((doc) => {
        if (doc.data()) {
          const memeData = { ...doc.data(), meme_id: doc.id };
          const memeId = doc.id;
          return db
            .collection("users")
            .doc(doc.data().user_id)
            .get()
            .then((doc) => {
              const { created_time, introduction, displayName, image } =
                doc.data();

              return {
                [memeId]: {
                  ...memeData,
                  user_name: displayName,
                  user_image: image,
                },
              };
            });
        }
      });
  } catch (err) {
    return err;
  }
};

export const getTemplates = async (orderBy, sort, number, lastKey) => {
  let ref = db.collection("templates").orderBy(orderBy, sort).limit(number);
  if (lastKey) ref = ref.startAfter(lastKey);

  return ref.get().then((querySnapshot) => {
    let arrayData = [];
    let lastDoc = null;
    let objectData = {};
    querySnapshot.docs.map((doc) => {
      arrayData = [
        ...arrayData,
        { ...doc.data(), [`template_id`]: doc.id, doc: doc },
      ];
      objectData = {
        ...objectData,
        [doc.id]: { ...doc.data(), [`template_id`]: doc.id },
      };
      lastDoc = doc;
    });
    return { arrayData, objectData, lastDoc };
  });
};
export const queryString = async (string, lastKey) => {
  let ref = db.collection("memes");
  [...string].forEach((node) => {
    ref = ref.where(`query_string.${node}`, "==", true);
  });
  if (lastKey) ref = ref.startAfter(lastKey);
  const { arrayData, lastDoc, objectData, memesId } = await ref
    .get()
    .then((querySnapshot) => {
      let arrayData = [];
      let memesId = [];

      let lastDoc = null;
      let objectData = {};
      querySnapshot.docs.map((doc) => {
        objectData = {
          ...objectData,
          [doc.id]: { ...doc.data(), meme_id: doc.id },
        };
        memesId = [...memesId, doc.id];
        arrayData = [
          ...arrayData,
          { ...doc.data(), meme_id: doc.id, doc: doc },
        ];
        lastDoc = doc;
      });
      return { arrayData, lastDoc, objectData, memesId };
    });
  return { arrayData, lastDoc, objectData, memesId };
};
export const queryTemplate = async (string, lastKey) => {
  let ref = db.collection("templates");
  [...string].forEach((node) => {
    ref = ref.where(`query_string.${node}`, "==", true);
  });
  if (lastKey) ref = ref.startAfter(lastKey);
  const { arrayData, lastDoc } = await ref.get().then((querySnapshot) => {
    let arrayData = [];
    let lastDoc = null;
    querySnapshot.docs.map((doc) => {
      arrayData = [...arrayData, { ...doc.data(), meme_id: doc.id, doc: doc }];
      lastDoc = doc;
    });
    return { arrayData, lastDoc };
  });
  return { arrayData, lastDoc };
};
export const getLikedMessage = async (
  collection,
  document,
  collection2,
  document2
) => {
  return db
    .collection(collection)
    .doc(document)
    .collection(collection2)
    .doc(document2)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = Object.keys(doc.data());
        return data;
      } else {
        return [];
      }
    });
};
export const getMessage = async (memeId, qty, orderby, sort, lastKey) => {
  let ref = null;
  lastKey
    ? (ref = db
        .collection("memes")
        .doc(memeId)
        .collection("messages")
        .orderBy(orderby, sort)
        .limit(qty)
        .startAfter(lastKey))
    : (ref = db
        .collection("memes")
        .doc(memeId)
        .collection("messages")
        .orderBy(orderby, sort)
        .limit(qty));
  return ref.get().then((querySnapshot) => {
    let arrayData = [];
    let lastDoc;
    querySnapshot.docs.map(async (doc) => {
      arrayData = [
        ...arrayData,
        { ...doc.data(), message_id: doc.id, doc: doc },
      ];
      lastDoc = doc;
    });
    return { arrayData, lastDoc };
  });
};

export const getCategory = async (uid) => {
  return db
    .collection("users")
    .doc(uid)
    .collection("saved_category")
    .orderBy("created_time", "desc")
    .get()
    .then((querySnapshot) => {
      let data = [];
      querySnapshot.docs.map((doc) => {
        if (doc.id !== "所有") {
          data = [...data, doc.id];
        }
      });

      return data;
    });
};
export const getSavedCategory = async (collection, docId, collection2) => {
  return await db
    .collection(collection)
    .doc(docId)
    .collection(collection2)
    .orderBy("created_time", "desc")
    .get()
    .then((querySnapshot) => {
      let arrayData = [];
      //let objectData = {};
      querySnapshot.docs.map((doc) => {
        const { created_time, memes } = doc.data();
        arrayData = [...arrayData, { docId: doc.id, memes: memes }];
        // objectData = {
        //   ...objectData,
        //   [doc.id]: { ...data },
        // };
      });
      return { arrayData };
    });
};

export const getSavedMemes = async (
  collection,
  docName,
  collection2,
  docName2
) => {
  let ref = db
    .collection(collection)
    .doc(docName)
    .collection(collection2)
    .doc(docName2);

  return ref.get().then((doc) => {
    if (doc.exists) {
      const { created_time, ...data } = doc.data();
      const memes = Object.values(data);

      const memesSortByTime = memes.sort(
        (a, b) => a.created_time - b.created_time
      );
      return memesSortByTime;
    }
  });
};

export const getMemesByTheme = async (theme, lastKey) => {
  if (lastKey) {
    return db
      .collection("memes")
      .orderBy("created_time", "desc")
      .where("themes", "array-contains", theme)
      .limit(12)
      .startAfter(lastKey)
      .get()
      .then((querySnapshot) => {
        let data = [];
        let lastDoc = null;
        querySnapshot.docs.map((doc) => {
          data = [...data, { ...doc.data(), meme_id: doc.id }];
          lastDoc = doc;
        });
        return { data, lastDoc };
      });
  } else {
    return db
      .collection("memes")
      .orderBy("created_time", "desc")
      .where("themes", "array-contains", theme)
      .limit(12)
      .get()
      .then((querySnapshot) => {
        let data = [];
        let lastDoc;
        querySnapshot.forEach((doc) => {
          data = [...data, { ...doc.data(), meme_id: doc.id }];
          lastDoc = doc;
        });
        return { data, lastDoc };
      });
  }
};
//write
export const addFirestoreData = async (
  data,
  collection,
  docName,
  collection2,
  docName2
) => {
  try {
    let write;
    if (docName2) {
      write = await db
        .collection(collection)
        .doc(docName)
        .collection(collection2)
        .doc(docName2)
        .set(data, { merge: true });
    } else if (collection2) {
      write = await db
        .collection(collection)
        .doc(docName)
        .collection(collection2)
        .add(data);
    } else if (docName) {
      write = await db
        .collection(collection)
        .doc(docName)
        .set(data, { merge: true });
    } else {
      write = await db.collection(collection).add(data);
    }
    return write;
  } catch (err) {
    console.log("Document error written!", err);
  }
};

export const deleteFirestoreField = (
  collection,
  docName,
  collection2,
  docName2,
  fieldName
) => {
  let ref = db.collection(collection).doc(docName);
  if (collection2)
    ref = db
      .collection(collection)
      .doc(docName)
      .collection(collection2)
      .doc(docName2);
  return ref
    .update({
      [fieldName]: firebase.firestore.FieldValue.delete(),
    })
    .then(() => {
      console.log("Field successfully delete!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};
export const deleteSavedByCategory = (
  collection,
  docName,
  collection2,
  docName2,
  memeId
) => {
  let ref = db
    .collection(collection)
    .doc(docName)
    .collection(collection2)
    .doc(docName2);
  return ref
    .update({
      memes: firebase.firestore.FieldValue.arrayRemove(memeId),
    })
    .then(() => {
      console.log("Field successfully delete!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};
export const addImgInFirestore = async (data, collection) => {
  const { fileUrl, fileId } = await addFile(data.image, collection);
  const response = await addFirestoreData(
    { ...data, image: fileUrl, image_id: fileId },
    collection
  );
  return response;
};
export const addMemes = async (data) => {
  const { fileUrl, fileId } = await addFile(data.image, "memes");
  const response = await addFirestoreData(
    { ...data, image: fileUrl, image_id: fileId },
    "themes",
    "所有",
    "memes"
  );
  return response;
};
export const updateSave = async (
  data,
  collection,
  docName,
  collection2,
  docName2
) => {
  try {
    let write;
    if (docName2) {
      write = await db
        .collection(collection)
        .doc(docName)
        .collection(collection2)
        .doc(docName2)
        .set(data, { merge: true });
    } else if (collection2) {
      write = await db
        .collection(collection)
        .doc(docName)
        .collection(collection2)
        .add(data);
    } else if (docName) {
      write = await db
        .collection(collection)
        .doc(docName)
        .set(data, { merge: true });
    } else {
      write = await db.collection(collection).add(data);
    }
    return write;
  } catch (err) {
    console.log("Document error written!", err);
  }
};
export const addCanvasInFirestore = async (data, collection) => {
  const { fileUrl, fileId } = await addDataUrl(data.image, collection);
  const response = await addFirestoreData(
    { ...data, image: fileUrl, image_id: fileId },
    collection
  );
  return { memeId: response.id, memeImage: fileUrl, imageId: fileId };
};

export const updateProfile = async (data, userId) => {
  try {
    let userData = data;
    let authData = {
      displayName: data.displayName,
    };
    if (data.image) {
      if (data.image_id) await deleteStorage("users", data.image_id);

      const { fileUrl, fileId } = await addDataUrl(data.image, "users");
      userData = { ...data, image: fileUrl, image_id: fileId };
      authData = {
        displayName: data.displayName,
        photoURL: fileUrl,
      };
    }
    await addFirestoreData(userData, "users", userId);
    var user = firebase.auth().currentUser;
    await user.updateProfile(authData);
    return { authData, userData };
  } catch (err) {
    console.log("updateProfile err", err);
  }
};

export const deleteCategory = async (userId, selectCategory) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("saved_category")
    .doc(selectCategory)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
};
export const deleteMeme = async (memeId, theme, imageId) => {
  if (theme !== "所有") {
    return db
      .collection("memes")
      .doc(memeId)
      .update({
        themes: firebase.firestore.FieldValue.arrayRemove(theme),
      })
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  } else {
    return db
      .collection("memes")
      .doc(memeId)
      .delete()
      .then(() => {
        deleteStorage("memes", imageId);
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }
};
export const deleteSaved = async (collection, docName, collection2, memeId) => {
  await db
    .collection(collection)
    .doc(docName)
    .collection(collection2)
    .where("memes", "array-contains", memeId)
    .get()
    .then((querySnapshot) => {
      let batch = db.batch();
      querySnapshot.docs.forEach((doc) => {
        const docRef = db
          .collection(collection)
          .doc(docName)
          .collection(collection2)
          .doc(doc.id);
        batch.update(docRef, {
          memes: firebase.firestore.FieldValue.arrayRemove(memeId),
        });
      });
      batch.commit().then(() => {
        console.log(`updated all documents inside `);
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
};

export const updateAccCount = (
  collection,
  docName,
  field,
  operation,
  collection2,
  docName2
) => {
  let docRef;
  if (!collection2) {
    docRef = db.collection(collection).doc(docName);
  } else {
    docRef = db
      .collection(collection)
      .doc(docName)
      .collection(collection2)
      .doc(docName2);
  }
  const increment = firebase.firestore.FieldValue.increment(1);
  const decrement = firebase.firestore.FieldValue.increment(-1);

  if (operation === "+") {
    docRef.update({ [field]: increment });
  } else {
    docRef.update({ [field]: decrement });
  }
};

export const onDeleteCategory = async (authId, category) => {
  return db
    .collection("users")
    .doc(authId)
    .collection("saved_category")
    .doc(category)
    .delete();
};

export const deleteNotExsit = async (authId, category, meme) => {
  return db
    .collection("users")
    .doc(authId)
    .collection("saved_category")
    .doc(category)
    .update({
      memes: firebase.firestore.FieldValue.arrayRemove(meme),
    });
};
