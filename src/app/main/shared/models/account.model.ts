import { AccountCredentials } from './accountCredentials.model';

export interface Account {
  firstName: string;
  lastName: string;
  email: string;
  credentials: AccountCredentials;
}
