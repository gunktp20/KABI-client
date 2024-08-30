import { createSlice } from "@reduxjs/toolkit";

interface IInvitation {
  id: string;
  status: string;
  createdAt: string;
  recipient: {
    user_id: string;
    email: string;
    displayName: string;
  };
  sender: {
    user_id: string;
    email: string;
    displayName: string;
  };
  board: {
    board_id: string;
    board_name: string;
    description: string;
    key: string;
  };
}
interface IAssignment {
  id: string;
  status: string;
  createdAt: string;
  recipient: {
    user_id: string;
    email: string;
    displayName: string;
  };
  sender: {
    user_id: string;
    email: string;
    displayName: string;
  };
  task_id: string;
  task: {
    board_id: string;
    description: string;
  };
}

interface INotificationState {
  notifications: IInvitation[];
  unreadNotifications: number;
  unreadInvitations: number;
  unreadAssignments: number;
  invitations: IInvitation[];
  assignments: IAssignment[];
}

const initialState: INotificationState = {
  notifications: [],
  unreadNotifications: 0,
  unreadInvitations: 0,
  unreadAssignments: 0,
  invitations: [],
  assignments: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {
    setAssignments: (state, action) => {
      return {
        ...state,
        assignments: action.payload,
      };
    },
    setInvitations: (state, action) => {
      return {
        ...state,
        invitations: action.payload,
      };
    },
    setUnreadNotifications: (state, action) => {
      return {
        ...state,
        unreadNotifications: action.payload,
      };
    },
    setUnreadInvitations: (state, action) => {
      return {
        ...state,
        unreadInvitations: action.payload,
      };
    },
    setUnreadAssignments: (state, action) => {
      return {
        ...state,
        unreadAssignments: action.payload,
      };
    },
    pushNewNotification: (state) => {
      return {
        ...state,
        unreadNotifications: state.unreadNotifications + 1,
      };
    },
    pushNewInvitation: (state) => {
      return {
        ...state,
        unreadInvitations: state.unreadInvitations + 1,
      };
    },
    pushNewAssignment: (state) => {
      return {
        ...state,
        unreadAssignments: state.unreadAssignments + 1,
      };
    },
    clearUnreadAssignments: (state) => {
      return {
        ...state,
        unreadNotifications: state.unreadNotifications - state.unreadAssignments,
      };
    },
    clearUnreadInvitations: (state) => {
      return {
        ...state,
        unreadNotifications: state.unreadNotifications - state.unreadInvitations,
      };
    },
  },
});

export const {
  setUnreadNotifications,
  setUnreadInvitations,
  setUnreadAssignments,
  pushNewNotification,
  pushNewAssignment,
  pushNewInvitation,
  setInvitations,
  setAssignments,
  clearUnreadInvitations,
  clearUnreadAssignments,
} = notificationSlice.actions;

export default notificationSlice.reducer;
