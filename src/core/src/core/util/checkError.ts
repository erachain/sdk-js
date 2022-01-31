export const checkProp = (obj: any, name: string): boolean => {
  if (!obj) {
    return false;
  }
  return {}.hasOwnProperty.call(obj, name);
};

export const checkError = (e: any): string => {
  if (typeof e === 'string') {
    return e;
  }
  if ({}.hasOwnProperty.call(e, 'response')) {
    if (e.response !== undefined && {}.hasOwnProperty.call(e.response, 'data')) {
      if (e.response.data !== undefined && {}.hasOwnProperty.call(e.response.data, 'message')) {
        return e.response.data.message;
      }
      if (e.response.data !== undefined && {}.hasOwnProperty.call(e.response.data, 'error')) {
        return e.response.data.error;
      }
      return 'API error';
    }
    return 'Server error';
  }
  if ({}.hasOwnProperty.call(e, 'message')) {
    return e.message;
  }
  return 'Undefined error';
};
