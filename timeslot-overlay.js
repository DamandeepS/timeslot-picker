import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `timeslot-overlay`
 * A polymer element for choosing timeslots. Timeslots can be variable.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class TimeslotOverlay extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          width: 100%;
          overflow-x: auto;
          white-space: nowrap;
          position: relative;
          height: 50px;
        }

        #units {
          display: flex;
          align-items: flex-start;
          flex-direction: row;
          min-width: 50px;
        }

        #container {
          width: 50px;
          height: 50px;
          background: #ccc9;
          position: absolute;
        }
      </style>

      <div id='container'>
        // TODO: ADD a range slider
      </div>
    `;
  }
  static get properties() {
    return {

      availableUnits: {
        type: Number,
        value: 1,
        observer: '_availableUnitsChanged'
      },
      leftOffset: {
        type: Number,
        value: 0,
        observer: '_leftOffsetChanged'
      },
      initialTime: {
        type: String,
        value: null
      },
      currentSlots: {
        type: Number,
        value: 1
      },
      _allowedSlots: {
        type: Number,
        computed: '_computedAllowedUnits(availableUnits)',
        observer: '_allowedSlotsChanged'
      }
    };

  }


  _convert24to12Hours(time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }

  _addMinutes(time, minsToAdd) {
    function D(J){ return (J<10? '0':'') + J};
    var piece = time.split(':'),
    mins = piece[0]*60 + +piece[1] + +minsToAdd;

    return D(mins%(24*60)/60 | 0) + ':' + D(mins%60);
  }

  _availableUnitsChanged(newVal, oldVal) {
  }

  _computedAllowedUnits(aUnits) {
    console.log(aUnits)
    return (aUnits>6)?6:aUnits;
  }

  _allowedSlotsChanged(newVal, oldVal) {
    console.log(newVal)
    this.$.container.style.width= (newVal*51-1) + 'px';
    this._generateUnitsSlider(newVal);
  }

  _generateUnitsSlider(units) {
  }

  _leftOffsetChanged(newVal,oldVal) {
    this.$.container.style.left = newVal + 'px';
  }

  constructor() {
    super();
    this.addEventListener('click', e => {
      this.dispatchEvent('timeslot-pick-cancelled', {
        cancelled: 'User'
      })
    })
  }

}

customElements.define('timeslot-overlay', TimeslotOverlay);
