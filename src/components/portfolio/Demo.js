/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { KeyboardElement } from './common/keyboard_element';
import { SynthWindow } from '../SynthWindow';
import { keyEvents$ } from '../../store';
import { map, filter } from 'rxjs/operators';
import { mapKeyCodeToMidi } from '../../common';
import { EVENT_KEY_DOWN } from '../../redux/actionTypes';

export class ProductDemo extends Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.midiEvent$ = keyEvents$.pipe(
      map(action => ({
        isDown: action.type === EVENT_KEY_DOWN,
        midi: mapKeyCodeToMidi(action.payload)
      })),
      filter(midiAction => !!midiAction)
    );
  }

  componentDidMount() {
    const container = this.containerRef.current;
    this.keyboardInterface = new KeyboardElement(container);
    window.addEventListener('resize', this.resize.bind(this));
    
    this.midiEvent$.subscribe(midiAction =>
      midiAction.isDown
        ? this.keyboardInterface.keyDown(midiAction.midi)
        : this.keyboardInterface.keyUp(midiAction.midi)
    );
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
        </div>
      </section>
    );
  }
}
