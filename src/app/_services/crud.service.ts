import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes, uploadString } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class CrudService<T extends { id: string }> {

  db: any;
  storage: any;

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyC9VaWItCqzOpByJjDtQ17jrldU5GcXCvQ",
      authDomain: "ccma-crtv.firebaseapp.com",
      projectId: "ccma-crtv",
      storageBucket: "ccma-crtv.appspot.com",
      messagingSenderId: "748560914435",
      appId: "1:748560914435:web:c0eca6df896b0674fad636",
      measurementId: "G-BC9FTG6F1D"
    };
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.storage = getStorage(app);
  }

  convertToJSON(item: T): T {
    return JSON.parse(JSON.stringify(item));
  }

  getAll(table: string): Promise<Array<T>> {
    const items = new Array<T>();
    return new Promise((resolve, reject) => {
      const laCollection = collection(this.db, table);
      getDocs(laCollection).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const item = doc.data() as T;
          items.push(item);
        });
        resolve(items);
      });
    });
  }

  get(table: string, id: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const docRef = doc(this.db, table, id);
      getDoc(docRef).then((querySnapshot) => {
        const item = querySnapshot.data() as T;
        resolve(item);
      });
    });
  }

  create(table: string, item: T): Promise<T> {
    item = this.convertToJSON(item);
    return new Promise((resolve, reject) => {
      const laDoc = doc(this.db, table, item.id);
      setDoc(laDoc, item).then((docRef) => {
        resolve(item)
      });
    });
  }

  modify(table: string, id: string, item: T): Promise<T> {
    item = this.convertToJSON(item);
    return new Promise((resolve, reject) => {
      const laCollection = doc(this.db, table, id);
      updateDoc(laCollection, item).then(() => {
        resolve(item)
      });
    });
  }

  delete(table: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const laCollection = doc(this.db, table, id);
      deleteDoc(laCollection).then(() => {
        resolve();
      });
    });
  }

  saveFile(file: any): Promise<string> {
    const storageRef = ref(this.storage, 'images/' + new Date().getTime() + '.jpg');
    return new Promise((resolve, reject) => {
      uploadString(storageRef, file, 'data_url').then((snapshot) => {
        console.log('Uploaded a blob or file!');
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          resolve(downloadURL)
        });
      });
    });
  }

  deleteFile(lien: string) {
    return new Promise((resolve, reject) => {
      const httpsReference = ref(this.storage, lien);
      console.log(httpsReference);
      deleteObject(httpsReference).then(() => {
        resolve(true)
      }).catch((error) => {
        reject(error);
      });
    });
  }

}
