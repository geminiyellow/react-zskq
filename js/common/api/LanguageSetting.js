module.exports = {
  /** 更改用户语言 */
  updateUserLanguage() {
    return (apiAddress) => `${apiAddress}Other/UpdateUserLanguage`;
  },
};