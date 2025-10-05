import { AxiosResponse } from "axios";
import { axiosInstance } from "../api/api";
import { Chats, CreateGroupArgs, Message } from "../types/types";

export const getUserChats = async () => {
  try {
    const response = (await axiosInstance.get(
      "/chat/user-chats"
    )) as AxiosResponse<{
      success: boolean;
      chats: Chats[];
    }>;

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const sendMessage = async (
  chatId: string,

  tempId: string,
  content?: string,
  file?: string,
  fileType?: string,
  fileName?: string,
  fileSize?: number
) => {
  console.log("payload", {
    chatId,
    tempId,
    content,
  });
  try {
    const response = (await axiosInstance.post(`/chat/message/${chatId}`, {
      ...(content && { content }),
      tempId,
      ...(file && { file }),
      ...(fileType && { fileType }),
      ...(fileName && { fileName }),
      ...(fileSize && { fileSize }),
    })) as AxiosResponse<{ success: boolean; message: string }>;

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const sendGroupMessage = async (
  chatId: string,

  tempId: string,
  content?: string,
  file?: string,
  fileType?: string,
  fileName?: string,
  fileSize?: number
) => {
  try {
    const response = (await axiosInstance.post(`/chat/group/${chatId}`, {
      ...(content && { content }),
      tempId,
      ...(file && { file }),
      ...(fileType && { fileType }),
      ...(fileName && { fileName }),
      ...(fileSize && { fileSize }),
    })) as AxiosResponse<{ success: boolean; message: string }>;

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getMessages = async (chatId: string) => {
  try {
    const response = (await axiosInstance.get(
      `/chat/message/${chatId}`
    )) as AxiosResponse<{ success: boolean; messages: Message[] }>;

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createGroupChat = async (
  url: string,
  { arg }: { arg: CreateGroupArgs }
) => {
  try {
    const response = await axiosInstance.post(url, arg);

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const removeUser = async (url: string, { arg }: { arg: string }) => {
  try {
    const response = (await axiosInstance.post(url, {
      memberId: arg,
    })) as AxiosResponse<{
      success: boolean;
      message: string;
    }>;

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateGroupDetails = async (
  url: string,
  { arg }: { arg: { groupName: string; bio: string } }
) => {
  try {
    const response = (await axiosInstance.put(url, arg)) as AxiosResponse<{
      success: boolean;
      message: string;
    }>;

    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const addGroupMembers = async (
  url: string,
  { arg }: { arg: { participants: string[] } }
) => {
  try {
    const response = (await axiosInstance.post(url, arg)) as AxiosResponse<{
      success: boolean;
      message: string;
    }>;
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const starMessage = async (
  url: string,
  { arg }: { arg: { messageId: string } }
) => {
  try {
    const response = await axiosInstance.post(url, arg);

    return response;
  } catch (error) {
    console.error("Error starring message:", error);
    throw error;
  }
};

export const getStarredMessages = async (chatId: string) => {
  try {
    const response = (await axiosInstance.get(
      `/chat/starred-messages/${chatId}`
    )) as AxiosResponse<{
      success: boolean;
      message: string;
      data: Message[];
    }>;

    return response.data;
  } catch (error) {
    console.error("Error fetching starred messages:", error);
    throw error;
  }
};

export const getChatFiles = async (chatId: string) => {
  try {
    const response = (await axiosInstance.get(
      `/chat/chat-files/${chatId}`
    )) as AxiosResponse<{
      success: boolean;
      message: string;
      data: Message[];
    }>;

    return response.data;
  } catch (error) {
    console.error("Error fetching chat files:", error);
    throw error;
  }
};
