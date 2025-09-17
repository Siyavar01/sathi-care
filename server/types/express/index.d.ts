import { IUser } from '../../models/userModel.js';

declare global {
  namespace Express {
    export interface User extends IUser {}
  }
}