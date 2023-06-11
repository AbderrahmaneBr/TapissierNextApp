const base64ToUint8Array = (base64) => {
    const raw = atob(base64.replace(/^[^,]+,/, ''));
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; ++i) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  }
  

const compressImage = async (image, quality) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = async () => {
        const image = new Image();
        image.src = reader.result;
  
        // Wait for the image to load
        await new Promise((resolve) => {
          image.onload = resolve;
        });
  
        // Create a new canvas element and set its dimensions
        const canvas = document.createElement('canvas');
        canvas.width = 720; // set the desired width for the compressed image
        canvas.height = (image.height / image.width) * canvas.width; // maintain aspect ratio
  
        // Draw the original image onto the canvas at the desired size
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
  
        // Convert the canvas image data to a compressed format
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality / 100); // set the desired JPEG quality
  
        resolve(compressedDataUrl);
      };
    });
  };

import { db, storage } from '@/components/firebase'
  
const addData = async (collection, data) => {
  generateId(collection).then(generatedId => {
    try {
      let dataImit = {...data,
                      id: generatedId}
      db.collection(collection).add(dataImit);
      return true
    } catch (error) {
      // console.log(error)
      return false
    }
  })
  .catch(err=>{
    return false
  })
};

function capitalizeFirstLetter(string) {
  try {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } catch(err){
    return string
  }
}

// Update document based on ID field
const updateDocumentByID = async (collectionName, idField, idValue, updatedData) => {
  try {
    const querySnapshot = await db
      .collection(collectionName)
      .where(idField, '==', idValue)
      .get();

    querySnapshot.forEach((doc) => {
      doc.ref.update(updatedData);
    });

    return true
  } catch (error) {
    return false
  }
};

const deleteFileByUrl = async (fileUrl) => {
    const storageRef = storage.refFromURL(fileUrl);
    await storageRef.delete();
};

const deleteDocumentById = async (collectionName, idAttributeName, idValue) => {
  try {
    const querySnapshot = await db
      .collection(collectionName)
      .where(idAttributeName, '==', idValue)
      .get();

    querySnapshot.forEach(async (doc) => {
      await doc.ref.delete();
    });
    return true
  }
  catch (error) {
    return false
  }
};

import { v4 as uuidv4 } from 'uuid';

const generateId = async (collection) => {
  try {
    const collectionRef = db.collection(collection);
    let idExists = true;
    let id;

    while (idExists) {
      id = uuidv4(); // Generate a UUID
      const snapshot = await collectionRef.where('id', '==', id).get();
      idExists = !snapshot.empty;
    }

    return id;
  } catch (error) {
    console.error('Error generating ID:', error);
    // Handle error
  }
};

const getImageOf = (id) => {
  let arr = []
  db.collection('products')
  .where('id', '==', id)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((e) => {
      arr.push(e.data())
    })
  })
  .then(() => {
    // console.log(arr[0].img1)
    return arr[0].img1
  })
}

export { getImageOf, base64ToUint8Array, compressImage, addData, capitalizeFirstLetter, updateDocumentByID, deleteFileByUrl, deleteDocumentById, generateId }