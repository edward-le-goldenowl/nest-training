enum errorMessages {
  SOME_THING_WENT_WRONG = 'Something went wrong',
  EMAIL_ALREADY_EXISTS = 'Email already exists',
  REGISTER_FAILED = 'Unable to register with the information provided',
  LOGIN_FAILED = 'Email or password is not correct',
  NOT_FOUND_USER = 'Cannot find this user',
  TOKEN_NOT_FOUND = 'Token not found',
  ACCESS_DENIED = 'Access Denied',
  UPLOAD_FILE_FAILED = 'Failed to upload file',
  CREATE_NEW_POST_FAILED = 'Cannot create this post',
  NOT_FOUND_POST = 'Cannot find this post',
  UPDATE_POST_FAILED = 'Cannot update this post',
  DELETE_POST_FAILED = 'Cannot delete this post',
  UPDATE_POST_STATUS_FAILED = 'Cannot update status this post',
}

enum successMessages {
  SUCCESS = 'SUCCESS',
}

export { errorMessages, successMessages };
