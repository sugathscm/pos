/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// This is to disable the updates in android simulator - Only for dev mode
console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
