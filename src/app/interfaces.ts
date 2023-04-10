import { AlertColor } from "@mui/material";

export interface SnackBarState {
  message: any;
  severity: AlertColor;
  open: boolean;
}

export interface USER {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface POST {
  id: number;
  title: string;
  content: string;
  comments: COMMENT[];
  user: USER;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface COMMENT {
  id?: number;
  content?: string;
  user: USER;
}
