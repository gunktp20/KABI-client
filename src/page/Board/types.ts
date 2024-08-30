export interface IColumn {
  id?: string;
  column_name: string;
  board_id?: string;
}

export type ITask = {
  id?: string;
  column_id: string;
  board_id?: string;
  description: string;
  assignee?: string;
  sequence?: number;
  user?: {
    displayName: string;
    email: string;
  };
};

export interface IBoard {
  id: string;
  board_name: string;
  description: string;
  key: string;
  user?: {
    displayName: string;
  };
  columns?: IColumn[];
}

export interface IMember {
  user_id: string;
  displayName: string;
  email: string;
}
