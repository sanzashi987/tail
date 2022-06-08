import { Component, createContext, FC, useContext } from 'react';
import { DifferContext } from '@lib/contexts';
import { CoordinateCalc } from '@lib/components/Dragger';

const EdgeCallbacks = createContext();

class EdgeConnects extends Component {
  static contextType = EdgeCallbacks;
  private dragger = new CoordinateCalc();




  
  render() {
    return;
  }
}

export default EdgeConnects;
