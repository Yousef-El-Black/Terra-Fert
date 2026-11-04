export const validateUsername = (username: string) => {
  if (username.length < 6) {
    return false;
  } else {
    return true;
  }
};

export const validatePassoword = (pass: string) => {
  if (pass.length < 8) {
    return false;
  } else {
    return true;
  }
};
