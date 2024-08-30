import { createSlice } from "@reduxjs/toolkit";
import { IMember, ITask } from "../../page/Board/types";

interface IColumn {
  id: string;
  column_name: string;
}

interface IBoard {
  id?: string;
  board_name?: string;
  key?: string;
  board: {
    board_id: string;
    board_name: string;
    description: string;
    key: string;
    user: {
      displayName: string;
    };
    columns: IColumn[];
  };
}

interface IBoardState {
  boards: IBoard[];
  boardMembers: [];
  selectedBoard: string;
  isLoading: boolean;
  createBoardVisible: boolean;
  editBoardVisible: boolean;
  deleteBoardVisible: boolean;
  selectedBoardInfo: null | IBoard;
  selectedBoardMembers: IMember[];
  tasks: ITask[];
}

const initialState: IBoardState = {
  boards: [],
  boardMembers: [],
  selectedBoard: "",
  isLoading: false,
  createBoardVisible: false,
  editBoardVisible: false,
  deleteBoardVisible: false,
  selectedBoardInfo: null,
  selectedBoardMembers: [],
  tasks: [],
};

const BoardSlice = createSlice({
  name: "board",
  initialState: initialState,
  reducers: {
    setBoards: (state, action) => {
      return {
        ...state,
        boards: action.payload,
      };
    },
    setIsLoading: (state, action) => {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
    setSelectedBoard: (state, action) => {
      return {
        ...state,
        selectedBoard: action.payload,
      };
    },
    setSelectedBoardMembers: (state, action) => {
      return {
        ...state,
        selectedBoardMembers: action.payload,
      };
    },
    setCreateVisible: (state, action) => {
      return {
        ...state,
        createBoardVisible: action.payload,
      };
    },
    setEditVisible: (state, action) => {
      return {
        ...state,
        editBoardVisible: action.payload,
      };
    },
    setDeleteVisible: (state, action) => {
      return {
        ...state,
        deleteBoardVisible: action.payload,
      };
    },
    setSelectedBoardInfo: (state, action) => {
      return {
        ...state,
        selectedBoardInfo: action.payload,
      };
    },
    setTasks: (state, action) => {
      return {
        ...state,
        tasks: action.payload,
      };
    },
    pushTask: (state, action) => {
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    },
  },
});

export const {
  setBoards,
  setSelectedBoard,
  setCreateVisible,
  setEditVisible,
  setDeleteVisible,
  setIsLoading,
  setSelectedBoardInfo,
  setTasks,
  pushTask,
  setSelectedBoardMembers,
} = BoardSlice.actions;

export default BoardSlice.reducer;
