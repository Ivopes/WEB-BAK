import { UserCredentials } from './userCredentials.model';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  credentials: UserCredentials;
}
