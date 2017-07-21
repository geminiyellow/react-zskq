import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reduxLogger from 'redux-logger';
import rootReducer from './reducers';

const middlewares = [
  thunkMiddleware,
];

if (process.env.NODE_ENV === 'development') {
  // middlewares.push(reduxLogger());
}

export default function configureStore(initialState) {
  return compose(applyMiddleware(...middlewares))(createStore)(rootReducer, initialState);
}