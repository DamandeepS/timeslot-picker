import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

import './timeslot-unit.js';
/**
 * `timeslot-picker`
 * A polymer element for choosing timeslots. Timeslots can be variable.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class TimeslotPicker extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          width: 100%;
          overflow-x: auto;
          white-space: nowrap;
        }

        #units {
          display: flex;
          align-items: flex-start;
          flex-direction: row;
          min-width: 2400px;
        }

        :host(::-webkit-scrollbar) {
          display: none;
        }
      </style>
      <div id="units">
        <slot name="units">
        </slot>
      </div>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'timeslot-picker',
      },
    };
  }


    ready() {
      super.ready()
      for (let a of this.querySelectorAll('timeslot-unit'))
        a.addEventListener('book-room', e => {
          console.log(e);
        })
    }
}

customElements.define('timeslot-picker', TimeslotPicker);
