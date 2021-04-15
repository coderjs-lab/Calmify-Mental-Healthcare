import React, {Component} from 'react';
import { createAppContainer } from 'react-navigation';
import { AppDrawerNavigator } from './components/AppDrawerNavigator';

export default class App extends Component {

  //Displaying various components in render
  render() {
    return(
      <AppContainer/> 
    );
  }
}

//Creating app container which contains all screens
const AppContainer =  createAppContainer(AppDrawerNavigator);