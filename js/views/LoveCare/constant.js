// action type
import keyMirror from 'fbjs/lib/keyMirror';

module.exports = {
  actionType: keyMirror({
    LOAD_FAILED: null,
    LOADED: null,
    CAN_GO_BACK: null,
  }),
};