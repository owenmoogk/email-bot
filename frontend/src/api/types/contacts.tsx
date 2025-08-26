export type ContactData = {
  id: string;
  name: string;
  email: string;
};

export type NewContact = {
  name: string;
  email: string;
  variables: NewVariable[];
};

export type NewVariable = {
  name: string;
  value: string;
};
