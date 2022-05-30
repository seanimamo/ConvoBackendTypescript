export type UserProps = {
  username: string;
  // private UserAccountType accountType;
  // private UserPassword password;
  email: string;
  firstName: string;
  lastName: string;
}

export class User {
  readonly username: string;
  // private UserAccountType accountType;
  // private UserPassword password;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;

  constructor(props: UserProps) {
    this.username = props.username;
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
  }
}