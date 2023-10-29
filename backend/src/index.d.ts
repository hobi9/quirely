declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'test' | 'development' | 'production';
  }
}
