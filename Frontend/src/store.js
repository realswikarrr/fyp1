import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { productsReducer } from "./Reducers/productReducers";

const reducer = combineReducers({
  products: productsReducer,
});

let initalState = {};

const middleWare = [thunk];
const store = createStore(
  reducer,
  initalState,
  composeWithDevTools(applyMiddleware(...middleWare))
);

export default store;
