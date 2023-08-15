export type GlobalConfig = {
  redirectUrl: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
};

export type ResponseType<T> = {
  type: string;
  message: string;
  data?: T;
};

export interface IResponseSuccess<T> extends ResponseType<T> {
  type: 'success';
}

export interface IResponseError<T> extends ResponseType<T> {
  type: 'error';
  code?: string;
  error?: Error;
}

export type ReturnResult<T> = IResponseSuccess<T> | IResponseError<T>;

export type AccountType = 'buyer' | 'seller';
