export interface AuthorizationServiceInterface {
  sign(phrase: string): string;

  verify(token: string, phrase: string): boolean;
}
