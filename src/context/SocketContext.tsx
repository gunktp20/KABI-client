import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../app/hook";
import NewNotificationSnackBar from "../components/NewNotificationSnackBar";
import useAlert from "../hooks/useAlert";
import { pushNewAssignment, pushNewInvitation, pushNewNotification } from "../features/notification/notification.slice";

interface SocketContextType {
    socket: Socket | null;
    setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
    children: ReactNode;
}


export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { token, user } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()
    const { showAlert, alertText, displayAlert } = useAlert();

    useEffect(() => {
        if (token) {
            const newSocket = io(import.meta.env.VITE_API_DOMAIN);
            const userInfo = {
                id: user?.userId,
                displayName: user?.displayName,
                email: user?.email,
            };
            newSocket.emit("addNewUser", userInfo);
            setSocket(newSocket);

            newSocket?.on("InvitationCome", (invitationInfo) => {
                dispatch(pushNewNotification())
                dispatch(pushNewInvitation())
                displayAlert({ msg: invitationInfo?.content, type: "info" })
            })
            newSocket?.on("AssignmentCome", (assignmentInfo) => {
                dispatch(pushNewNotification())
                dispatch(pushNewAssignment())
                displayAlert({ msg: assignmentInfo?.content, type: "info" })
            })
        }

        return () => {
            socket?.disconnect();
        };
    }, [token]);

    return (
        <SocketContext.Provider value={{ socket, setSocket }}>
            <NewNotificationSnackBar showSnackBar={showAlert} snackBarText={alertText} />
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};