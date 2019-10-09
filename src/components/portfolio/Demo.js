/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { KeyboardElement } from './common/keyboard_element';
import { SynthWindow } from '../SynthWindow';
import { keyEvents$, observerSubscribe } from '../../store';
import { map, filter } from 'rxjs/operators';
import { mapKeyCodeToMidi } from '../../common';
import { EVENT_KEY_DOWN } from '../../redux/actionTypes';
import { Subscription } from 'rxjs';
import { MetaParam, InvertedMetaParam } from '../../redux/types';

export class ProductDemo extends Component {
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

  render() {
    return (
      <section id="demo">
        <SynthWindow />
        <div className="row keys">
          <div className="keyboard-container">
            <div id="keyboard" ref={this.containerRef} />
          </div>
          <div className="octave-container">
            <span className="octave">OCTAVE: {this.state.octave >= 0 ? '+' : ''}{this.state.octave}</span>
          </div>
        </div>
      </section>
    );
  }
}
