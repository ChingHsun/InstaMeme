import { nanoid } from "nanoid";
import firebase from "./firebase-config.js";
export const storage = firebase.storage();

export const addFile = async (file, path) => {
  try {
    const fileId = nanoid();
    const fileRef = storage.ref().child(`${path}/${fileId}`);
    //const miniFile = await miniImg("500", "300", file);
    //await fileRef.putString(file, "data_url");
    await fileRef.put(file);

    const fileUrl = await fileRef.getDownloadURL();
    return { fileUrl, fileId };
  } catch (err) {
    return err;
  }
};

export const addDataUrl = async (dataUrl, path) => {
  try {
    const fileId = nanoid();
    const fileRef = storage.ref().child(`${path}/${fileId}`);
    await fileRef.putString(dataUrl, "data_url");
    const fileUrl = await fileRef.getDownloadURL();
    return { fileUrl, fileId };
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const deleteStorage = async (path, fileId) => {
  const desertRef = storage.ref().child(`${path}/${fileId}`);

  // Delete the file
  desertRef
    .delete()
    .then(() => {
      console.log("File deleted successfully");
      // File deleted successfully
    })
    .catch((error) => {
      console.log("Uh-oh, an error occurred!");

      // Uh-oh, an error occurred!
    });
};
