import { midiToKeyCodeMapping } from '../../../common';
import * as workerActions from '../../../workerActions';
import { keyUpEvent, keyDownEvent } from '../../../redux/actions/MetaActions';
import store from '../../../store';

//@ts-check
/* Copyright 2017 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
const offsets = [0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6];
const minNote = 60;
const maxNote = 77;
export class KeyboardElement {
  /**
   * @param {Element} container
   */
  constructor(container) {
    this.container = container;
    this.keys = {};
    this.resize();
    this.notes = {};
  }

  resize() {
    // clear the previous ones.
    this.keys = {};
    this.container.innerHTML = '';
    // each of the keys.
    const keyWidth = 1 / 52;
    for (let i = minNote; i <= maxNote; i++) {
      const key = document.createElement('div');
      key.classList.add('key');
      const isSharp = ([1, 3, 6, 8, 10].indexOf(i % 12) !== -1);
      key.classList.add(isSharp ? 'black' : 'white');
      this.container.appendChild(key);
      // position the element
      const noteOctave = Math.floor(i / 12) - Math.floor(minNote / 12);
      const offset = offsets[i % 12] + noteOctave * 7 - 5;
      key.style.width = keyWidth * 100 + '%';
      key.style.left = (offset * keyWidth * 100 + 10) + '%';
      key.id = i.toString();

      const mouseDownHandler = ev => this.handleMouse(ev, true, i);
      key.addEventListener('mousedown', mouseDownHandler);
      key.addEventListener('touchstart', mouseDownHandler);
      const mouseUpHandler = ev => this.handleMouse(ev, false, i);
      key.addEventListener('mouseup', mouseUpHandler);
      key.addEventListener('touchend', mouseUpHandler);

      const fill = document.createElement('div');
      fill.classList.add('fill');
      key.appendChild(fill);
      this.keys[i] = key;
    }
  }

  handleMouse(ev, isDown, idx) {
    const actionCreator = isDown ? keyDownEvent : keyUpEvent;
    const keyCode = +midiToKeyCodeMapping[idx];
    store.dispatch(actionCreator({keyCode, oct: -1}));
  }

  /**
   * @param {number} noteNum
   */
  keyDown(noteNum) {
    if (noteNum in this.keys) {
      const key = this.keys[noteNum];
      const note = new Note(key.querySelector('.fill'));
      if (!this.notes[noteNum]) {
        this.notes[noteNum] = [];
      }
      this.notes[noteNum].push(note);
    }
  }

  /**
   * @param {number} noteNum
   */
  keyUp(noteNum) {
    if (noteNum in this.keys) {
      if (!(this.notes[noteNum] && this.notes[noteNum].length)) {
        // eslint-disable-next-line no-console
        console.warn('note off before note on');
      }
      else {
        this.notes[noteNum].shift().noteOff();
      }
    }
  }
}

class Note {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    this.element.classList.add('active');
  }

  noteOff() {
    this.element.classList.remove('active');
  }
}
