import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

import './internal-elements/timeslot-unit.js';
import './internal-elements/timeslot-overlay.js';
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
          margin-top: 30px;
        }

        #container {
          width: calc(100% - var(--timeslot-unit-width, 50px) - 4px);
          margin-left: calc(var(--timeslot-unit-width, 50px) / 2 + 2px);
          overflow-x: auto;
          white-space: nowrap;
          position: relative;
          overflow-y: hidden;
        }

        #container::-webkit-scrollbar {
          display: none;
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
          background: var(--timeslot-picker-tooltip-background,#000a);
          padding: 5px;
          color: var(--timeslot-picker-tooltip-color,#fff);
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
          font: var(--timeslot-picker-scroll-btn-font);
          box-sizing: border-box;
          line-height: var(--timeslot-unit-height, 50px);
          border: var(--timeslot-picker-scroll-btn-border, 1px solid #999);

          border-radius: var(--timeslot-picker-scroll-btn-border-radius, 0);
          position: absolute;
          text-align: center;
          background: var(--timeslot-picker-scroll-btn-background, #fff);
          z-index: 2;
          cursor: pointer;
          color: var(--timeslot-picker-scroll-btn-color, #000);
          user-select: none;
          @apply --timeslot-picker-scroll-btn;
        }

        .scroll-btn.left {
          left: 0;
          border-radius: var(--timeslot-picker-scroll-left-btn-border-radius, 0);
        }

        .scroll-btn.right {
          right:0;
          border-radius: var(--timeslot-picker-scroll-right-btn-border-radius, 0);
        }
      </style>
      <div tabindex="0" class="scroll-btn left" on-click='_scrollLeft'>[[scrollLeftBtnText]]</div>
      <div id="tooltip" hidden$="[[!_overlayActive]]" style="left: [[_tooltipLeftOffset]]px">[[chosenEndTime]]</div>
      <div id="container">
        <div id="units">
        </div>
        <div id="overlaycontainer" hidden$='[[!_overlayActive]]'></div>
      </div>
      <div tabindex="0" class="scroll-btn right" on-click='_scrollRight'>[[scrollRightBtnText]]</div>

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
      observer: '_initializeTimeline'
      },
      _availableSlots: {
        type: Array,
        value: []
      },
      _overlayActive: {
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
      selectedSlot: {
        type:Number,
        value: null,
        notify: true,
        reflectToAttribute: true
      },
      chosenUnits: {
        type: Number,
        value: null,
        reflectToAttribute: true,
        notify: true
      },

      _rangeContainerOffset: {
        type: Number,
        value: 0
      },

      _rangeLeftPosition: {
        type: Number,
        computed: '_computeRangeLeftPosition(_rangeContainerOffset)'
      },

      _tooltipLeftOffset: {
        type: Number,
        computed: '_computeTooltipLeftOffset(_rangeLeftPosition, chosenUnits)'
      },
      scrollLeftBtnText: {
        type: String,
        value: "<"
      },
      scrollRightBtnText: {
        type: String,
        value: ">"
      },
      noCloseOnOverlayTap: {
        type: Boolean,
        value: false
      },
      maxLimit: {
        type: Number,
        value: "6"
      }
    };

  }


  _initializeTimeline(newVal, oldVal) {
    const startTime='00:00'; //12:00 AM;
    while (this.$.units.firstChild) {
      this.$.units.removeChild(this.$.units.firstChild); //remove all children
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

      unit.addEventListener('unavailable-slot-selected', e=> {

          this.dispatchEvent(new CustomEvent('unavailable-slot-selected', {
            detail: {
              ...e.detail
            }
          }));
      })

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
        this._availableSlots.push({availableSlotStartTime,availableSlotId,aUnits})
        availableSlotStartTime=null;
        }
      } else{
          aUnits++;
      }

      unit.addEventListener('timeslot-pick-start', this._addOverlayListener.bind(this));

      if((i==47) && availableSlotStartTime)
        this._availableSlots.push({availableSlotStartTime,availableSlotId,aUnits})

      this.$.units.appendChild(unit);
    }

    // Now that we know of available slots, lets assign each of units to slots
    for(let a of this.get('_availableSlots')) {
      const index = parseInt(a['availableSlotId'].split('slot_')[1]),
      limit=((index + a['aUnits'])>=48)?48:(index + a['aUnits']);
        for(let i = index;i<limit;i++ ) {
          if(this.$.units.querySelector('#slot_' + i))
          this.$.units.querySelector('#slot_' + i).availableUnits = limit - i;
      }
    }
    setTimeout(()=> {
      this.shadowRoot.querySelector('timeslot-unit:not([disabled])').scrollIntoView(true);
    },200)

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

    this.set('_overlayActive', true);
    this.set('chosenStartTime', e.detail.time);
    this.set('selectedSlot', e.detail.id)
    const overlayContainer = this.$.overlaycontainer;
    overlayContainer.innerHTML = '';
    const overlay = document.createElement('timeslot-overlay');
    overlay.set('maxLimit', this.maxLimit);
    overlay.availableUnits=e.detail.aUnits;
    overlay.initialTime = e.detail.time;
    overlay.id = 'overlay';
    overlay.leftOffset = e.detail.leftOffset;
    overlayContainer.appendChild(overlay);
    overlay.addEventListener('timeslot-pick-cancelled', e => {
      if(!this.noCloseOnOverlayTap) {
        this.set('_overlayActive', false);
        this.set('chosenUnits', null);
        this.set('chosenStartTime', null);
        this.set('chosenEndTime', null);
      }
    });
    overlay.addEventListener('chosen-units-changed', e => {
      this.set('chosenUnits', e.detail.value);
    });
    overlay.addEventListener('chosen-time-changed', e => {
      this.set('chosenEndTime', e.detail.value);
    });

    this.set('_rangeContainerOffset', overlay.containerLeftoffset);
  }

  _scrollLeft() {
    this.$.container.scrollBy({top: 0, left: -250, behavior: 'smooth'});
  }
  _scrollRight() {
    this.$.container.scrollBy({top: 0, left: 250, behavior: 'smooth'});
  }

  ready() {
    super.ready();
    const unitWidth = parseInt(getComputedStyle(this).getPropertyValue('--timeslot-unit-width')) || 50,
    newWidth = 48*(unitWidth+1);
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
      this._rangeContainerOffset+=1;
      this._rangeContainerOffset-=1;
    });

    this.addEventListener('close', e=> {
      this.close();
    })

    this.addEventListener('open', e=> {
      let slot;
      if(e.detail)
      slot = e.detail.slot
      this.open(slot);
    })

    this.addEventListener('keydown', e=> {
      if(e.keyCode == 27) {
        this.close();
        e.preventDefault();
      }
    })
  }



  _computeRangeLeftPosition(_rangeContainerOffset){
    return  _rangeContainerOffset - this.$.container.scrollLeft;
  }

  _computeTooltipLeftOffset(pos, units) {
    const unitWidth = parseInt(getComputedStyle(this).getPropertyValue('--timeslot-unit-width')) || 50,
          maxWidth = this.$.container.getBoundingClientRect().width;
    let delta = pos + unitWidth*(parseInt(units-1)+0.5) + parseInt(units)*1;//0.5 is for left margin of the input range
    let scrollPos = delta>=0?delta:0;
    scrollPos = scrollPos<maxWidth?scrollPos:maxWidth;
    return scrollPos;
  }

  open(slotNumberToBeSelected) {
    this.close();
    const slot = this.shadowRoot.querySelector('#slot_' + slotNumberToBeSelected);
    if(slot) {
      this.$.container.scrollLeft = slot.offsetLeft-20;
      slot.click();
    }
  }

  close() {
    if(this._overlayActive)
    this.set('chosenEndTime', "");
    this.set('chosenStartTime', "");
    this.set('_overlayActive', false);
    this.$.overlaycontainer.innerHTML = "";
  }
}

customElements.define('timeslot-picker', TimeslotPicker);
