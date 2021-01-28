import { AccountCredentials } from './accountCredentials.model';
import { Storage } from './storage.model';

export interface Account {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  credentials: AccountCredentials;
  storage: Storage[];
}
