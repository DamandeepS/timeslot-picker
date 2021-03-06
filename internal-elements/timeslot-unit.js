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
          flex-direction: row;
          width: var(--timeslot-unit-width, 50px);
          max-width: var(--timeslot-unit-width, 50px);
          color:var(--timeslot-available-color, #000);
          flex: 1 1;
          align-items: center;
          height: var(--timeslot-unit-height, 50px);
          background: var(--timeslot-available-bg, #fff);
          margin-left: var(--timeslot-unit-margin, 1px);
          margin-right: var(--timeslot-unit-margin, 1px);
          align-self: flex-start;
          border: var(--timeslot-unit-border,1px solid #999);
          box-sizing: border-box;
          cursor: pointer;
          border-radius: var(--timeslot-border-radius, 0);

          @apply --timeslot-unit-available;
        }

        :host([disabled]) {
        background: var(--timeslot-disabled-bg, #acc);
        }

        :host(:focus:not([disabled])) {
          border: 3px solid red;
          outline: none;
        }

        :host([booking-id]:not([booking-id=''])) {
          background: var(--timeslot-unavailable-bg, #666);
          color:var(--timeslot-unavailable-color, #fff);
          cursor: default;
        }

        .container {
          text-align: center;
          flex: 1 1;
          flex-grow: inherit;
          align-items: center;
          max-width: 100%;
        }

        .container p.time {
          display: flex;
          flex-direction: row;
        }

        .container p.time, .container p.time span{
          font-size: var(--timeslot-font-size, 10px);
          word-wrap: break-word;
          word-break: break-all;
          margin: var(--timeslot-unit-text-margin, 2px);
          flex-grow: 1;
        }

        .container p.time .dash {
          flex-grow: 100;
          height: 1px;
          background: var(--timeslot-unavailable-color, #fff);
          align-self: center;
        }

        .container p.time[hidden] {
          display: none;
        }

        .container[single-line] p.time {
          flex-direction: column;
        }
        .container[single-line] p.time .dash {
          width: 20px;
          margin: var(--timeslot-unit-text-margin, 2px);
        }
      </style>
      <div class='container' single-line$="[[!singleLineView]]">
        <p class='time' hidden$="[[bookingId]]" ><span>[[initialTime]]</span> </p><p class='time' hidden$="[[!bookingId]]" hidden$="[[bookingId=='']]"> <span>[[initialTime]]</span>  <span class="dash"></span> <span>[[computedTime]]</span></p>
      </div>
    `;
  }
  static get properties() {
    return {
      units: {
        type: Number,
        value: '1',
        notify: true,
        observer: '_unitsChanged'
      },
      disabled: {
        type: Boolean,
        computed: '__computeIfDisabled(computedTime)',
        reflectToAttribute: !0
      },
      initialTime: {
        type: String
      },
      computedTime: {
        computed: '_computeTime(initialTime, units)'
      },
      bookingId: {
        type: String,
        value: null,
        observer: '_bookingChanged',
        reflectToAttribute: true
      },
      availableUnits: {
        type: Number,
        value: 0,
        reflectToAttribute: true
      }
    };
  }

  _computeTime(initialTime, units) {
    var hoursTime = this._convert12to24Hours(initialTime.toUpperCase()),
    newTimein24Hours =  this._addMinutes(hoursTime, (units * 30).toString());
    const nextDay = parseInt(hoursTime.split(':').join(''))>=parseInt(newTimein24Hours.split(':').join(''));

    return this._convert24to12Hours(newTimein24Hours) + (nextDay?" (Next Day)": "");
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


  _unitsChanged(newVal,oldVal) {
    const unitWidth = this.unitWidth || parseInt(getComputedStyle(this).getPropertyValue('--timeslot-unit-width')) || 50;//getComputedStyle(this).getPropertyValue('--timeslot-unit-width') is not working for UNTIS in firefox !HACK
      this.style.maxWidth = (unitWidth*newVal) + 'px';
      this.style.width = (unitWidth*newVal) + 'px';
      this.set('singleLineView', newVal!=1)
  }

  _addMinutes(time, minsToAdd) {
    function D(J){ return (J<10? '0':'') + J};
    var piece = time.split(':'),
    mins = piece[0]*60 + +piece[1] + +minsToAdd;

    return D(mins%(24*60)/60 | 0) + ':' + D(mins%60);
  }

  _bookingChanged(newVal,oldVal) {
    if(!newVal) {
      this.set('units', 1);
    }
  }

  constructor() {
    super();

    this.addEventListener('click', e => {
      if(!this.disabled && !this.bookingId)
        this.dispatchEvent(new CustomEvent('timeslot-pick-start', {
          detail: {
            time: this.initialTime,
            aUnits: this.availableUnits,
            leftOffset: this.offsetLeft,
            id: parseInt(this.id.split('slot_')[1])
          }
        }));
      else if(this.bookingId)
        this.dispatchEvent(new CustomEvent('unavailable-slot-selected', {
          detail: {
            time: this.initialTime,
            aUnits: this.availableUnits,
            bookingId: this.bookingId
          }
        }));
    });
    this.addEventListener('keyup',e=> {
      if(e.keyCode==32||e.keyCode=='13') {
        this.click();
      }
    })
  }
  __computeIfDisabled(t) {
    var v = new Date();
    const d = (v.getMonth() + 1) + "-" + v.getDate() + "-" + v.getFullYear();
    const r = (t.indexOf(" (Next Day)")==-1) && (new Date(d + " " + t.split(" (Next Day)")[0]) < new Date());
    if(r)
      this.setAttribute('tabindex','-1');
    else
      this.setAttribute('tabindex','0');
    return r;
  }
}

customElements.define('timeslot-unit', TimeslotUnit);
