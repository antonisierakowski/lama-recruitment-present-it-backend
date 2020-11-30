enum ENVIRONMENT {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export const isProd = (): boolean => {
  return process.env.NODE_ENV === ENVIRONMENT.PRODUCTION;
};
