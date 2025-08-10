import { useEffect } from "react";
import { io } from "socket.io-client";
export const socket = io();

export const useSocket = (phone, onMessageReceived, onReceiverOffline, onStatusUpdate, onReceiverAFK) => {
  useEffect(() => {
    socket.emit("register", phone);

    socket.on("receiveMessage", onMessageReceived);

    socket.on("receiverOffline", onReceiverOffline);

    socket.on("messageStatusUpdate", onStatusUpdate);
    
    socket.on("receiverAFKUpdate", onReceiverAFK);

    return () => {
      socket.off("receiveMessage", onMessageReceived);
      socket.off("receiverOffline", onReceiverOffline);
      socket.off("messageStatusUpdate", onStatusUpdate);
      socket.off("receiverAFKUpdate", onReceiverAFK);
    };
  }, [phone, onMessageReceived, onStatusUpdate]);
};