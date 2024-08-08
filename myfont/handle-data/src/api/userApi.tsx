// userService.ts

import http from "../utils/request";

interface RegisterUserData {
  username: string;
  password: string;
  introduction: string;
  gender: string;
  birthdate: string;
}
// 定义登录用户数据类型，根据实际情况调整
interface LoginUserData {
  username: string;
  password: string;
}
export async function registerUser(userData: RegisterUserData): Promise<void> {
  try {
    const response = await http.request({
      url: "/users/register", // 根据实际API调整
      method: "post", // 使用小写
      data: userData, // 直接传递userData对象
    });

    // 成功逻辑，例如跳转到登录页面或显示成功消息
    console.log("注册成功：", response.data);
  } catch (error) {
    // 错误处理逻辑
    console.error("注册失败：", error);
    throw error; // 抛出错误，允许调用者处理
  }
}

// 登录函数
export async function loginUser(userData: LoginUserData): Promise<void> {
  try {
    const response = await http.request({
      url: "/users/login", // 根据实际API调整
      method: "post", // 使用小写
      data: userData, // 直接传递 userData 对象
    });

    // 登录成功逻辑，例如保存token，跳转到主页或显示成功消息
    console.log("登录成功：", response.data);
    // 返回服务器响应
    return response.data;
    // 根据你的应用需求处理响应，比如保存认证令牌
    // localStorage.setItem('authToken', response.data.token); // 示例：保存认证令牌
  } catch (error) {
    // 错误处理逻辑
    console.error("登录失败：", error);
    throw error; // 抛出错误，允许调用者处理
  }
}

export async function updateUserPrivilege(userId, newPrivilege) {
  try {
    const response = await http.request({
      url: `/users/updateprivilege`, // 根据实际API调整，这里假设路径中需要用户ID
      method: "post", // 对于更新操作，常用的HTTP方法是PUT或PATCH
      data: {
        userId,
        newPrivilege,
      }, // 根据API要求构造数据，这里假设需要一个叫做is_admin的字段
    });

    // 成功逻辑，如输出成功信息或其他逻辑
    console.log("用户权限更新成功：", response.data);
  } catch (error) {
    // 错误处理逻辑
    console.error("用户权限更新失败：", error);
    throw error; // 抛出错误，允许调用者处理
  }
}

export async function deleteUser(userId) {
  try {
    const response = await http.request({
      url: `/users/delete`, // 根据实际API调整，这里假设路径中需要用户ID
      method: "post", // 对于更新操作，常用的HTTP方法是PUT或PATCH
      data: {
        userId,
      }, // 根据API要求构造数据，这里假设需要一个叫做is_admin的字段
    });

    // 成功逻辑，如输出成功信息或其他逻辑
    console.log("用户删除：", response.data);
  } catch (error) {
    // 错误处理逻辑
    console.error("用户删除失败：", error);
    throw error; // 抛出错误，允许调用者处理
  }
}
