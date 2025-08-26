export type Auth = {
  url: string;
};

export type AccountInfo = {
  address: string;
};

export type CurrentUser = {
  username: string;
};

export type Token = {
  access: string;
  refresh: string;
};

export type Signup = {
  token: string;
  username: string;
};
