enum errorMessages {
  SOME_THING_WENT_WRONG = 'Something went wrong',
  EMAIL_ALREADY_EXISTS = 'Email already exists',
  REGISTER_FAILED = 'Unable to register with the information provided',
  LOGIN_FAILED = 'Email or password is not correct',
}

enum successMessages {
  REGISTER_SUCCESSFULLY = 'Register successfully',
  LOGIN_SUCCESSFULLY = 'Login successfully',
}

export { errorMessages, successMessages };
