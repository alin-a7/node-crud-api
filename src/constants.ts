export const ERROR_MESSAGES = {
  serverError: 'Internal Server Error',
  endpointNotFound: 'Endpoint not found. Try "/users" endpoint',
  userIdRequired: 'User id is required',
  invalidUserId: 'Invalid UUID format for user id',
  userNotFound: 'User not found',
  fieldRequired: (field: string) => `${field} is required`,
  fieldIsArray: (field: string) => `${field} must be an array`,
}

export const ERROR_CODES = {
  badRequest: 'bad_request',
  notFound: 'not_found',
}
