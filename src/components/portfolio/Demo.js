/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { KeyboardElement } from './common/keyboard_element';
import { SynthWindow } from '../SynthWindow';
import store, { keyEvents$, observerSubscribe } from '../../store';
import { map, filter } from 'rxjs/operators';
import { mapKeyCodeToMidi } from '../../common';
import { EVENT_KEY_DOWN, EVENT_OCTAVE_INCREMENT } from '../../redux/actionTypes';
import { Subscription } from 'rxjs';
import { MetaParam, InvertedMetaParam } from '../../redux/types';

export const ProductDemo = () => {
  return (
    <section id="demo">
      <SynthWindow />
      <SynthWindowControls />
    </section>
  );
};

class SynthWindowControls extends Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.midiEvent$ = keyEvents$.pipe(
      map(action => ({
        isDown: action.type === EVENT_KEY_DOWN,
        midi: mapKeyCodeToMidi(action.payload && action.payload.keyCode)
      })),
      filter(midiAction => !!midiAction)
    );

    this.state = {
      octave: 0
    };

    const octaveSelector = store => store.meta[InvertedMetaParam[MetaParam.kbOctave]] || 0;
    this.observerUnsubscribe = observerSubscribe(store => {
      this.setState({ octave: octaveSelector(store) });
    }, octaveSelector);

    this.handleOctaveIncr = this.handleOctaveIncr.bind(this);
  }

  componentDidMount() {
    const container = this.containerRef.current;
    this.keyboardInterface = new KeyboardElement(container);
    window.addEventListener('resize', this.resize.bind(this));

    this.subscriptions = new Subscription();

    const midiEventSubscription = this.midiEvent$.subscribe(midiAction =>
      midiAction.isDown
        ? this.keyboardInterface.keyDown(midiAction.midi)
        : this.keyboardInterface.keyUp(midiAction.midi)
    );
    this.subscriptions.add(midiEventSubscription);
  }

  componentWillUnmount() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
    if (this.observerUnsubscribe) {
      this.observerUnsubscribe();
    }
  }

  resize() {
    this.keyboardInterface.resize();
  }

  handleOctaveIncr(incrAmount) {
    store.dispatch({
      type: EVENT_OCTAVE_INCREMENT,
      payload: incrAmount
    });
  }

  render() {
    return (
      <div className="row keys">
        <div className="keyboard-container">
          <div id="keyboard" ref={this.containerRef} />
        </div>
        <div className="kb-label">
          <span className="kb-label--text">PC Keyboard Controls:</span>
        </div>
        <div className="octave-container">
          <span className="octave-btn" onClick={() => this.handleOctaveIncr(-1)}>DOWN</span>
          <span className="octave">OCTAVE: {this.state.octave >= 0 ? '+' : ''}{this.state.octave}</span>
          <span className="octave-btn" onClick={() => this.handleOctaveIncr(+1)}>UP</span>
        </div>
      </div>
    );
  }
}
