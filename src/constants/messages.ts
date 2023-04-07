enum errorMessages {
  SOME_THING_WENT_WRONG = 'Something went wrong',
  EMAIL_ALREADY_EXISTS = 'Email already exists',
  REGISTER_FAILED = 'Unable to register with the information provided',
  LOGIN_FAILED = 'Email or password is not correct',
  NOT_FOUND_USER = 'Cannot find this user',
  TOKEN_NOT_FOUND = 'Token not found',
  ACCESS_DENIED = 'Access Denied',
}

enum successMessages {
  REGISTER_SUCCESSFULLY = 'Register successfully',
  LOGIN_SUCCESSFULLY = 'Login successfully',
  LOGOUT_SUCCESSFULLY = 'Logout successfully',
  SUCCESS = 'SUCCESS',
}

export { errorMessages, successMessages };
