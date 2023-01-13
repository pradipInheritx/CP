import React from "react";
import { ToastContent, ToastOptions } from "react-toastify/dist/types";

export enum ToastType {
  SUCCESS,
  ERROR,
  INFO,
}
export type NotificationContextProps = {
  showToast: (
    content: ToastContent,
    type?: ToastType,
    options?: ToastOptions | undefined
  ) => void;
  showModal: (
    content: ToastContent,
    options?: ToastOptions | undefined
  ) => void;
};

const NotificationContext = React.createContext({} as NotificationContextProps);

NotificationContext.displayName = "Notification";

export default NotificationContext;
