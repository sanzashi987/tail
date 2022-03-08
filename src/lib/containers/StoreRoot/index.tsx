import React, { Component, createRef } from 'react';
import { RecoilNexus } from '@app/utils';
import { RecoilRoot, RecoilState, RecoilValue } from 'recoil';
import type { RecoilNexusInterface, UpdaterType } from '@types';
import { StoreProvider } from '@app/contexts/store';

class StoreRoot extends Component {
  nexus = createRef<RecoilNexusInterface>();
  
  set = <T,>(atom: RecoilState<T>, updater: UpdaterType<T>) =>
    this.nexus.current!.setRecoil<T>(atom, updater); // ! shall be ok
  get = <T,>(atom: RecoilValue<T>) => this.nexus.current!.getRecoil<T>(atom);
  reset = (atom: RecoilState<any>) => this.nexus.current!.resetRecoil(atom);
  getPromise = <T,>(atom: RecoilValue<T>) => this.nexus.current!.getRecoilPromise<T>(atom);

  render() {
    const { get, set, getPromise, reset } = this;
    return (
      <RecoilRoot>
        <RecoilNexus ref={this.nexus} />
        <StoreProvider value={{ get, set, getPromise, reset }}>{this.props.children}</StoreProvider>
      </RecoilRoot>
    );
  }
}

export default StoreRoot;
