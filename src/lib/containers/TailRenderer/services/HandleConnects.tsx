import { Component, createContext } from 'react';
import { DifferContext } from '@lib/contexts';
import { CoordinateCalc } from '@lib/components/Dragger';

const EdgeCallbacks = createContext();

class HandleCallbacks extends Component {
  private dragger = new CoordinateCalc();

  render() {
    return;
  }
}

export default HandleCallbacks;
