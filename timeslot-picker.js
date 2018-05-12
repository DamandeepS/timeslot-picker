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
          min-width: 2450px;
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
      occupancy: {
        type: Array,
        value: [{
            meetingName: 'Sai\'s Meeting',
            meetingId: 'bbcks',
            meetingStartTime: '3:00 PM',
            units: 4
          },
          {
            meetingName: 'Ranveer\'s Meeting',
            meetingId: 'wqqps',
            meetingStartTime: '7:00 PM',
            units: 2
          },
          {
            meetingName: 'Daman\'s Meeting',
            meetingId: 'kisoe',
            meetingStartTime: '8:00 PM',
            units: 1
          }
        ],
      notify: true,
      observer: 'initializeTimeline'
      },
      availableSlots: {
        type: Array,
        value: []
      }
    };

  }


  initializeTimeline(newVal, oldVal) {
    const startTime='00:00'; //12:00 AM;
    while (this.firstChild) {
        this.removeChild(this.firstChild); //remove all children
    }
    const bookedSlots = ((e) => {
      const arr = [];
      for(let b of e) {
        arr.push(b['meetingStartTime'].toUpperCase())

      }
      return arr;
    })(this.occupancy)

    var availableSlotStartTime = null, aUnits=-1;
    for(let i=0; i<=47; i++) {

      let time = this._convert24to12Hours(this._addMinutes(startTime,30 * i));
        //console.log(time, bookedSlots);

      let unit = document.createElement('timeslot-unit');
      unit.set('initialTime', time);
      unit.setAttribute('slot','units');
      if(!availableSlotStartTime) {
        availableSlotStartTime=time;
        aUnits=-1; //not include self
      }

        // console.log(time, bookedSlots)
        if(bookedSlots.indexOf(time)>-1) {
                console.log(time, bookedSlots)
          const currentBooking = ((o,t) => {
            for(const b of o) {
              if(b.meetingStartTime == t)
                return b;
            }
            return null;
          })(this.occupancy,time);
          // console.log('BOOKING: ', currentBooking)
          if(currentBooking) {
            unit.set('units', currentBooking.units||1);
            unit.set('bookingId',currentBooking.meetingId);
            i+=currentBooking.units-1;
          }
          // console.log(unit);
          this.availableSlots.push({availableSlotStartTime,aUnits})
          availableSlotStartTime=null;
        } else{
            aUnits++;
        }

        unit.addEventListener('book-room', e => {
          console.log(e);
        });
        if((i==47) && availableSlotStartTime)
          this.availableSlots.push({availableSlotStartTime,aUnits})

      this.appendChild(unit);
    }

    
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
}

customElements.define('timeslot-picker', TimeslotPicker);
