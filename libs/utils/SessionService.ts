import { v4 as uuid } from 'uuid';

export interface ISessionService {
  login(username: string, password: string): Promise<string>;
  logout(): Promise<void>;
}

export default class SessionService implements ISessionService {
  public async login(username: string, password: string) {
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'test') {
          resolve(uuid());
        }

        reject('Invalid credentials');
      }, 150);
    });
  }

  public async logout() {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 50);
    });
  }
}
