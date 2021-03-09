import {combineReducers} from 'redux';
import countReducer from './countReducer.js';
import multyReducer from './multiplyReducer';
import allCasesReducer from './allCasesReducer';
const allReducers= combineReducers({
    count: countReducer,
    multy: multyReducer,
    data : allCasesReducer
});
export default allReducers;
