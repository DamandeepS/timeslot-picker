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
          white-space: nowrap;
          position: relative;
        }

        #container {
          width: calc(100% - var(--timeslot-unit-width, 50px) - 4px);
          margin-left: calc(var(--timeslot-unit-width, 50px) / 2 + 2px);
          overflow-x: auto;
          white-space: nowrap;
          position: relative;
          overflow-y: hidden;
        }

        #units {
          display: flex;
          align-items: flex-start;
          flex-direction: row;
          min-width: 2450px;
        }

        #tooltip {
          position: absolute;
          top: -30px;
          width: calc( var(--timeslot-unit-width, 50px) - 10px);
          background: #000a;
          padding: 5px;
          color: #fff;
          overflow: hidden;
          border-radius: 3px;
          font-size: 10px;
          text-align: center;
          @apply --timeslot-picker-tooltip;
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
          background: var(--timeslot-available-bg, #fff);
          z-index: 2;
          cursor: pointer;
          @apply --timeslot-picker-scroll-btn;
        }

        .scroll-btn.left {
          left: 0;
        }

        .scroll-btn.right {
          right:0;
        }
      </style>
      <div class="scroll-btn left" on-click='scrollLeft'>&lt;</div>
      <div id="tooltip" hidden$="[[!overlayActive]]" style="left: [[tooltipLeftOffset]]px">[[chosenEndTime]]</div>
      <div id="container">
        <div id="units">
        </div>
        <div id="overlaycontainer" hidden$='[[!overlayActive]]'></div>
      </div>
      <div class="scroll-btn right" on-click='scrollRight'>&gt;</div>

    `;
  }
  static get properties() {
    return {
      bookings: {
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

      rangeContainerOffset: {
        type: Number,
        value: 0
      },

      rangeLeftPosition: {
        type: Number,
        computed: '_computeRangeLeftPosition(rangeContainerOffset)'
      },

      tooltipLeftOffset: {
        type: Number,
        computed: '_computeTooltipLeftOffset(rangeLeftPosition, chosenUnits)'
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
    })(this.bookings)

    var availableSlotStartTime = null, aUnits=0, availableSlotId=null;
    for(let i=0; i<=47; i++) {

      let time = this._convert24to12Hours(this._addMinutes(startTime,30 * i));

      let unit = document.createElement('timeslot-unit');
      unit.set('initialTime', time);
      unit.setAttribute('slot','units');
      unit.id='slot_'+i;
      if(!availableSlotStartTime || aUnits == 0) {
        availableSlotStartTime=time;
        availableSlotId= 'slot_'+i;
        aUnits=0;
      }

      if(bookedSlots.indexOf(time)>-1) {
        const currentBooking = ((o,t) => {
          for(const b of o) {
            if(b.meetingStartTime == t)
              return b;
          }
          return null;
        })(this.bookings,time);
        if(currentBooking) {
          unit.set('units', currentBooking.units||1);
          unit.set('bookingId',currentBooking.meetingId);
          i+=currentBooking.units-1;
        }
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

      this.$.units.appendChild(unit);
    }

    // Now that we know of available slots, lets assign each of units to slots
    for(let a of this.get('availableSlots')) {
      const index = parseInt(a['availableSlotId'].split('slot_')[1]),
      limit=index+a['aUnits'];
        for(let i = index;i<limit;i++ ) {
        this.$.units.querySelector('#slot_' + i).availableUnits = limit - i;
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

    this.set('rangeContainerOffset', overlay.containerLeftoffset);
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
    if(newVal && !this.chosenEndTime) {
      const end = this._convert24to12Hours(this._addMinutes(this._convert12to24Hours(newVal),30))
      this.chosenEndTime =  end;
      this.set('chosenUnits', 1);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.$.container.addEventListener('scroll', e => {
      this.rangeContainerOffset+=1;
      this.rangeContainerOffset-=1;
    });

    this.addEventListener('close', e=> {
      this.$.overlaycontainer.innerHTML;
      this.set('overlayActive', false);
    })

    this.addEventListener('open', e=> {
      let slot;
      if(e.detail)
      slot = e.detail.slot
      if(slot)
      this.querySelector('#slot_' + slot).click();
    })
  }



  _computeRangeLeftPosition(rangeContainerOffset){
    return  rangeContainerOffset - this.$.container.scrollLeft;
  }

  _computeTooltipLeftOffset(pos, units) {
    const unitWidth = parseInt(getComputedStyle(this).getPropertyValue('--timeslot-unit-width')) || 50,
    maxWidth = this.$.container.getBoundingClientRect().width;
    let delta = pos + unitWidth*(parseInt(units-1)+0.5) + parseInt(units)*1;//0.5 is for left margin of the input range
    let scrollPos = delta>=0?delta:0;
    scrollPos = scrollPos<maxWidth?scrollPos:maxWidth;
    return scrollPos;
  }
}

customElements.define('timeslot-picker', TimeslotPicker);
