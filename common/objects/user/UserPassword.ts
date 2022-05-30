import * as bcrypt from 'bcrypt'

export class UserPassword {
  #saltRounds = 10;
  salt: string;
  passwordHash: string;

  constructor(plainFextPassword: string) {
    this.salt = bcrypt.genSaltSync(this.#saltRounds);
    this.passwordHash = bcrypt.hashSync(plainFextPassword, this.salt);
  };

  isPasswordCorrect = (password: string) => {
    return bcrypt.compareSync(password, this.passwordHash);
  }
}