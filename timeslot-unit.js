import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `timeslot-unit`
 * A single timeslot.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class TimeslotUnit extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          width: 50px;
          flex: 1 1;
          align-items: center;
          height: 50px;
          background: var(--available-bg, #fff);
          margin: 0 1px 0 0;
          align-self: flex-start;
          border: 2px solid #999;
          box-sizing: border-box;
        }

        :host([booking-id]:not([booking-id=''])) {
          background: var(--unavailable-bg, #c3c2c3);
          color: #fff;
        }

        .container {
          text-align: center;
          display: flex;
          flex-direction: row;
          flex: 1 1;
          flex-grow: inherit;
          align-items: center;
          max-width: 100%;
        }

        .container p.time {
          font-size: 10px;
          word-wrap: break-word;
          word-break: break-all;
        }
      </style>
      <div class='container'>
        <p class='time'>[[initialTime]] </p><p class='time' hidden$="[[!bookingId]]" hidden$="[[bookingId=='']]">---[[computedTime]]</p>
      </div>
    `;
  }
  static get properties() {
    return {
      units: {
        type: Number,
        value: '1',
        notify: true,
        reflectToAttribute: true,
        observer: '_unitsChanged'
      },
      initialTime: {
        type: String
      },
      computedTime: {
        computed: '_computeTime(initialTime, units)'
      },
      bookingId: {
        type: String,
        value: '',
        observer: '_bookingChanged'
      }
    };
  }

  _computeTime(initialTime, units) {
    var hoursTime = this._convert12to24Hours(initialTime.toUpperCase()),
    newTimein24Hours =  this._addMinutes(hoursTime, (units * 30).toString());
    return this._convert24to12Hours(newTimein24Hours);
  }

  _convert12to24Hours(time) {
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return (sHours + ":" + sMinutes);
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

  _unitsChanged(newVal,oldVal) {
      this.style.maxWidth = (50*newVal) + 'px'
  }

  _bookingChanged(newVal,oldVal) {
    console.log(newVal,oldVal)
    if(!newVal)
      this.set('units', 1);
  }

  constructor() {
    super();

    this.addEventListener('click', e => {
      if(!this.bookingId)
        this.dispatchEvent(new CustomEvent('book-room', {
          detail: {
            time: this.initialTime
          }
        }))
    })
  }
}

customElements.define('timeslot-unit', TimeslotUnit);
