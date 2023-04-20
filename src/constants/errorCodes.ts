enum errorCodes {
  ERR_LOG_OUT = 'ErrLogoutUnSuccessful',
  ERR_TOKEN_NOT_FOUND = 'ErrTokenNotFound',
  ERR_LOGIN_FAILED = 'ErrUnauthorized',
  ERR_ACCESS_DENIED = 'ErrAccessDenied',
  ERR_REFRESH_TOKEN = 'ErrRefreshTokenNotMatched',
  ERR_USER_NOT_FOUND = 'ErrUserNotFound',
  ERR_EMAIL_ALREADY_EXIST = 'ErrEmailAlreadyExist',
  ERR_UPLOAD_FILE_FAILED = 'ErrUploadFileFailed',
  ERR_CREATE_NEW_POST = 'ErrCreateNewPost',
  ERR_POST_NOT_FOUND = 'ErrPostNotFound',
  ERR_DELETE_POST_FAILED = 'ErrDeletePostFailed',
  ERR_POST_UPDATE_FAILED = 'ErrUpdatePostFailed',
  ERR_POST_STATUS_UPDATE_FAILED = 'ErrUpdatePostStatusFailed',
  ERR_ADD_NEW_COMMENT_FAILED = 'ErrAddNewCommentFailed',
  ERR_COMMENT_NOT_FOUND = 'ErrCommentNotFound',
  ERR_DELETE_COMMENT_FAILED = 'ErrDeleteCommentFailed',
}

export { errorCodes };
