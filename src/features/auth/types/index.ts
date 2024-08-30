interface IUserInfo {
  userId: string;
  email: string;
  color: string;
  displayName: string;
  profileImg: string;
}
export interface IAuthState {
  token: string;
  userId: string;
  email: string;
  user: IUserInfo | null;
  isLoading: boolean;
  showAlert: boolean;
  alertText: string;
  alertType: "error" | "success" | "warning" | "info";
}

export interface IRegister {
  email: string | undefined;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export type AddUserFunc = (token: string, user: IUserInfo) => void;
