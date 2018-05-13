import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

import './timeslot-unit.js';
import './timeslot-overlay.js';
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
          position: relative;
        }

        #container {
          width: calc(100% - var(--timeslot-unit-width, 50px) + 4px);
          margin-left: calc(var(--timeslot-unit-width, 50px) / 2 + 2px);
          overflow-x: auto;
          white-space: nowrap;
          position: relative;
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

        #overlaycontainer {
          height: var(--timeslot-unit-height, 50px);
          position: absolute;
          left: 0;
          width: 2450px;
          bottom: 0;
          top: 0;
        }

        .scroll-btn {
          height: var(--timeslot-unit-height, 50px);
          width: calc( var(--timeslot-unit-width, 50px) / 2);
          top: 0;
          box-sizing: border-box;
          line-height: var(--timeslot-unit-height, 50px);
          border: 1px solid #999;
          position: absolute;
          text-align: center;
          cursor: pointer;
        }

        .scroll-btn.left {
          left: 0;
        }

        .scroll-btn.right {
          right:0
        }
      </style>
            <div class="scroll-btn left" on-click='scrollLeft'>&lt;</div>
      <div id="container">
            <div id="units">
              <slot name="units">
              </slot>
            </div>
      <div id="overlaycontainer" hidden$='[[!overlayActive]]'></div>

        </div>
                <div class="scroll-btn right" on-click='scrollRight'>&gt;</div>

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
      },
      overlayActive: {
        type: Boolean,
        value: false
      },
      chosenEndTime: {
        type: String,
        value: '',
        reflectToAttribute: true,
        notify: true
      },
      chosenStartTime: {
        type: String,
        value: null,
        reflectToAttribute: true,
        notify: true,
        observer: '_startTimeChanged'
      },
      chosenUnits: {
        type: Number,
        value: null,
        reflectToAttribute: true,
        notify: true
      },

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

    var availableSlotStartTime = null, aUnits=0, availableSlotId=null;
    for(let i=0; i<=47; i++) {

      let time = this._convert24to12Hours(this._addMinutes(startTime,30 * i));
        //console.log(time, bookedSlots);

      let unit = document.createElement('timeslot-unit');
      unit.set('initialTime', time);
      unit.setAttribute('slot','units');
      unit.id='slot_'+i;
      if(!availableSlotStartTime || aUnits == 0) {
        availableSlotStartTime=time;
        availableSlotId= 'slot_'+i;
        aUnits=0;
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
          if(aUnits>0) {
          this.availableSlots.push({availableSlotStartTime,availableSlotId,aUnits})
          availableSlotStartTime=null;
          }
        } else{
            aUnits++;
        }

        unit.addEventListener('timeslot-pick-start', this._addOverlayListener.bind(this));

        if((i==47) && availableSlotStartTime)
          this.availableSlots.push({availableSlotStartTime,availableSlotId,aUnits})

      this.appendChild(unit);
    }

    // Now that we know of available slots, lets assign each of units to slots
    for(let a of this.get('availableSlots')) {
      const index = parseInt(a['availableSlotId'].split('slot_')[1]),
      limit=index+a['aUnits'];
        // console.log(a, index, index+limit)
        for(let i = index;i<limit;i++ ) {
        // console.log(a, "asd") //, parseInt(a['availableSlotId'].split('slot_')[1]), i, a['aUnits'] - i
        document.querySelector('#slot_' + i).availableUnits = limit - i;
      }
    }
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

  _addOverlayListener(e) {

    this.set('chosenStartTime', e.detail.time);
    this.set('overlayActive', true);
    const overlayContainer = this.$.overlaycontainer;
    overlayContainer.innerHTML = '';
    const overlay = document.createElement('timeslot-overlay');
    overlay.availableUnits=e.detail.aUnits;
    overlay.initialTime = e.detail.time;
    overlay.id = 'overlay';
    overlay.leftOffset = e.detail.leftOffset;
    overlayContainer.appendChild(overlay);
    overlay.addEventListener('timeslot-pick-cancelled', e => {
      this.set('overlayActive', false);
      this.set('chosenUnits', null);
      this.set('chosenStartTime', null);
      this.set('chosenEndTime', null);
    });
    overlay.addEventListener('chosen-units-changed', e => {
      this.set('chosenUnits', e.detail.value);
    });
    overlay.addEventListener('chosen-time-changed', e => {
      this.set('chosenEndTime', e.detail.value);
    });
  }

  scrollLeft() {
    this.$.container.scrollBy(-250,0);
  }
  scrollRight() {
    this.$.container.scrollBy(250,0);
  }

  ready() {
    super.ready();
    const unitWidth = parseInt(getComputedStyle(this).getPropertyValue('--timeslot-unit-width')) || 50,
    newWidth = 48*(unitWidth+1) + 2; //1 for margin
    this.$.units.style.width = newWidth + "px";
    this.$.units.style.minWidth = newWidth + "px";
    this.$.overlaycontainer.style.width = newWidth + "px";
  }

  _startTimeChanged(newVal, oldVal) {
    console.log(newVal)
    if(newVal && !this.chosenEndTime) {
      const end = this._convert24to12Hours(this._addMinutes(this._convert12to24Hours(newVal),30))
      this.chosenEndTime =  end;
      this.set('chosenUnits', 1);
    }
  }
}

customElements.define('timeslot-picker', TimeslotPicker);
