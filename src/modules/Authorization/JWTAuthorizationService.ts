import { AuthorizationServiceInterface } from './AuthorizationServiceInterface';
import jwt from 'jsonwebtoken';
import { injectable } from 'inversify';

@injectable()
export class JWTAuthorizationService implements AuthorizationServiceInterface {
  private _secret: string;

  constructor() {
    this._secret = process.env.PRESENTATION_OWNER_TOKEN_SECRET;
  }

  sign(phrase: string): string {
    return jwt.sign(phrase, this._secret);
  }

  verify(token: string, phrase: string): boolean {
    if (!token) {
      return false;
    }
    const result = jwt.verify(token, this._secret);
    return result === phrase;
  }
}
