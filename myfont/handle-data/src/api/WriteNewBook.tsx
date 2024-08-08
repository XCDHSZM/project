import http from "../utils/request";
import firebase from "firebase/app"; //url
import "firebase/database";
// 保存数据到本地存储
const saveDataToLocalStorage = async (jsonData: any): Promise<any> => {
  try {
    // 获取 Firebase 实时数据库引用
    const database = firebase.database();
    // 使用 push() 方法将数据添加到数据库中
    database.ref("users").push(jsonData);

    console.log("Data uploaded to Firebase database successfully!");
  } catch (error) {
    console.error("Error uploading data to Firebase database:", error);
  }
};

export { saveDataToLocalStorage };
