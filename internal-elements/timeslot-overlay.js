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
          height: var(--timeslot-unit-height, 50px);
          background: var(--timeslot-overlay-background, url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAQAAAC1QeVaAAAASElEQVQY02NgQALS/5F5Ssg8qa/IUgooUg+QpWRRpA7hNB5VCsV4VANReKjOQDWDgYFIm/G4F7cv8YSNLG4pFCNQeSjq0MwAAPCoHW3Q0Dt9AAAAAElFTkSuQmCC'));
        }

        #units {
          display: flex;
          align-items: flex-start;
          flex-direction: row;
          min-width: var(--timeslot-unit-width, 50px);
        }

        #container {
          width: var(--timeslot-unit-width, 50px);
          height: var(--timeslot-unit-height, 50px);
          background: var(--timeslot-overlay-container-background,#ccc);
          position: absolute;
          display: flex;
          align-items: center;
          flex-direction: column;
          box-sizing: border-box;
          border-radius: var(--timeslot-border-radius, 0);
          overflow: hidden;
          @apply --timeslot-overlay-container;
        }

        .time-indicators {
          height: var(--timeslot-unit-height, 50px);
          position: absolute;
          text-align: center;
          color: var(--timeslot-overlay-indicators-color, #000);
          line-height: var(--timeslot-unit-height, 50px);
          width: var(--timeslot-unit-width, 50px);
          font-size: var(--timeslot-font-size, 10px);
          margin: 0 7px;
          @apply --timeslot-overlay-time-indicators;
        }

        #min-time {
          left: 0;
        }

        #container::before {
          content: "";
          height: 100%;
          z-index: 20;
          left:0;
          border-left: var(--timeslot-overlay-container-border-left, 1px solid black);
          position: absolute;
        }
        #container::after {
          content: "";
          height: 100%;
          z-index: 20;
          right:0;
          border-right: var(--timeslot-overlay-container-border-right, 1px solid black);
          position: absolute;
        }


        #max-time {
          right: 0;
          z-index: 0;
        }

        #range {
          box-sizing: border-box;
          padding: 20px auto;;
          height: var(--timeslot-unit-height, 50px);
          width: calc(100% - 10px);
          -webkit-appearance: none;
          background: transparent;

          @apply --timeslot-overlay-slider;
        }

        #range:focus {
          outline: none;
        }

        #range::-webkit-slider-runnable-track {
          width: 100%;
          max-width: calc(100% - 12px);
          margin: 0 auto;
          height: 100%;
          cursor: pointer;
          animate: 0.2s;
          box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
          background: #0000;
          border: 0px solid #000101;
        }
         #range::-ms-track {
          width: 100%;
          max-width: calc(100% - 12px);
          margin: 0 auto;
          height: 100%;
          cursor: pointer;
          animate: 0.2s;
          box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
          background: #0000;
          border: 0px solid #000101;
        }
        #range::-moz-range-track {
          width: 100%;
          height: 100%;
          max-width: calc(100% - 12px);
          margin: 0 auto;
          cursor: pointer;
          animate: 0.2s;
          box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
          background: #0000;
          border: 0px solid #000101;
        }

        #range:before {
          content: '';
          display: block;
          left: var(--timeslot-unit-height, 50px);
          right:  var(--timeslot-unit-width, 50px);
          top: calc( (var(--timeslot-unit-height, 50px) / 2) - 0.5px);
          position: absolute;
          bottom: calc( (var(--timeslot-unit-height, 50px) / 2) - 0.5px);
          background: var(--timeslot-overlay-indicators-color, #666);
        }

        #range::-webkit-slider-thumb {
          box-shadow: 0px 0px 0 #00000000, 0px 0px 0 #0d0d0d00;
          border: 0px solid #000000;
          height: calc( var(--timeslot-unit-height, 50px) - 24px);
          width: calc( var(--timeslot-unit-width, 50px) - 24px);
          border-radius: 50%;
          background:var(--timeslot-slider-thumb-background, url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUyIDUyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MiA1MjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik0yNiwwQzExLjY2NCwwLDAsMTEuNjYzLDAsMjZzMTEuNjY0LDI2LDI2LDI2czI2LTExLjY2MywyNi0yNlM0MC4zMzYsMCwyNiwweiBNMzguNSwyOEgyOHYxMWMwLDEuMTA0LTAuODk2LDItMiwycy0yLTAuODk2LTItMlYyOEgxMy41Yy0xLjEwNCwwLTItMC44OTYtMi0yczAuODk2LTIsMi0ySDI0VjE0YzAtMS4xMDQsMC44OTYtMiwyLTJzMiwwLjg5NiwyLDJ2MTBoMTAuNWMxLjEwNCwwLDIsMC44OTYsMiwyUzM5LjYwNCwyOCwzOC41LDI4eiIvPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPg==), #ffff);
          cursor: pointer;
          fill: var(--timeslot-unavailable-bg, #666);
          -webkit-appearance: none;
          margin-top: 10px;
          position: relative;
          z-index: 2;
        }

        #range:focus::-webkit-slider-thumb {
          box-shadow: 0px 2px 20px -2px #000000;
        }
        #range:focus-within::-webkit-slider-thumb {
          box-shadow: 0px 2px 20px -2px #000000;
        }


         #range::-ms-thumb {
          box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
          border: 0px solid #000000;
          height: calc( var(--timeslot-unit-height, 50px) - 24px);
          width: calc( var(--timeslot-unit-width, 50px) - 24px);
          border-radius: 50%;
          background:var(--timeslot-slider-thumb-background, url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUyIDUyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MiA1MjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik0yNiwwQzExLjY2NCwwLDAsMTEuNjYzLDAsMjZzMTEuNjY0LDI2LDI2LDI2czI2LTExLjY2MywyNi0yNlM0MC4zMzYsMCwyNiwweiBNMzguNSwyOEgyOHYxMWMwLDEuMTA0LTAuODk2LDItMiwycy0yLTAuODk2LTItMlYyOEgxMy41Yy0xLjEwNCwwLTItMC44OTYtMi0yczAuODk2LTIsMi0ySDI0VjE0YzAtMS4xMDQsMC44OTYtMiwyLTJzMiwwLjg5NiwyLDJ2MTBoMTAuNWMxLjEwNCwwLDIsMC44OTYsMiwyUzM5LjYwNCwyOCwzOC41LDI4eiIvPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPg==), #ffff);
          cursor: pointer;
          fill: var(--timeslot-unavailable-bg, #666);
          -webkit-appearance: none;
          margin-top: 10px;
          position: relative;
          z-index: 2;
        }

        #range::-moz-range-thumb {
          box-shadow: 0px 0px 0px #00000000, 0px 0px 0px #0d0d0d00;
          border: 0px solid #000000;
          height: calc( var(--timeslot-unit-height, 50px) - 24px);
          width: calc( var(--timeslot-unit-width, 50px) - 24px);
          border-radius: 50%;
          background:var(--timeslot-slider-thumb-background, url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUyIDUyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MiA1MjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik0yNiwwQzExLjY2NCwwLDAsMTEuNjYzLDAsMjZzMTEuNjY0LDI2LDI2LDI2czI2LTExLjY2MywyNi0yNlM0MC4zMzYsMCwyNiwweiBNMzguNSwyOEgyOHYxMWMwLDEuMTA0LTAuODk2LDItMiwycy0yLTAuODk2LTItMlYyOEgxMy41Yy0xLjEwNCwwLTItMC44OTYtMi0yczAuODk2LTIsMi0ySDI0VjE0YzAtMS4xMDQsMC44OTYtMiwyLTJzMiwwLjg5NiwyLDJ2MTBoMTAuNWMxLjEwNCwwLDIsMC44OTYsMiwyUzM5LjYwNCwyOCwzOC41LDI4eiIvPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPg==), #ffff);
          cursor: pointer;
          fill: var(--timeslot-unavailable-bg, #666);
          -webkit-appearance: none;
          margin-top: 10px;
          position: relative;
          z-index: 2;
        }
      </style>

      <div id='container'>
        <div class="time-indicators" id="min-time" hidden$="[[hideMinTime]]">[[minTime]]</div>
        <input id="range" min='1' step='1' type="range" max="[[_allowedUnits]]" value="1"></input>
        <div class="time-indicators" id="max-time" hidden$="[[hideMaxTime]]">[[maxTime]]</div>
      </div>
    `;
  }
  static get properties() {
    return {
      availableUnits: {
        type: Number,
        value: 1
      },
      leftOffset: {
        type: Number,
        value: 0,
        observer: '_leftOffsetChanged'
      },
      initialTime: {
        type: String,
        value: null,
        reflectToAttribute: true,
        // observer: 'initialTimeChanged'
      },
      minTime: {
        type: String,
        computed: '_computeTime(initialTime)'
      },
      chosenTime: {
        type: String,
        computed: '_computeTime(initialTime, chosenUnits)',
        notify: true
      },
      maxTime: {
        type: String,
        reflectToAttribute: true,
        computed: '_computeTime(initialTime, _allowedUnits)'
      },
      chosenUnits: {
        type: Number,
        value: 1,
        notify: true,
        observer: '_chosenUnitsChanged' //This is needed because z-index doesn't work with the slider thumb of input range !HACK
      },
      _allowedUnits: {
        type: Number,
        computed: '_computedAllowedUnits(availableUnits)',
        observer: '_allowedUnitsChanged'
      },
      containerLeftoffset: {
        type: Number,
        value: 0,
        reflectToAttribute: true
      },
      hideMinTime: {//This is needed because z-index doesn't work with the slider thumb of input range !HACK
        type: Boolean
      },
      hideMaxTime: {//This is needed because z-index doesn't work with the slider thumb of input range !HACK
        type: Boolean
      }
    };

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

  _computedAllowedUnits(aUnits) {
    return (aUnits>6)?6:aUnits;
  }

  _allowedUnitsChanged(newVal, oldVal) {
    const unitMargin = parseInt(getComputedStyle(this).getPropertyValue('--timeslot-unit-margin')) * 2 || 2,
          unitWidth = parseInt(getComputedStyle(this).getPropertyValue('--timeslot-unit-width')) + unitMargin || 52;
    this.$.container.style.width= ((newVal*unitWidth)-unitMargin) + 'px';
    this._generateUnitsSlider(newVal);
  }

  _generateUnitsSlider(units) {
    const range = this.$.range;
    //range.style.width = 52*(units-1) + 'px';
  }

  _leftOffsetChanged(newVal,oldVal) {
    this.$.container.style.left = newVal + 'px';
  }

  constructor() {
    super();
    this.addEventListener('click', e => {
      this.dispatchEvent(new CustomEvent('timeslot-pick-cancelled', {
        cancelled: 'User'
      }))
    })
  }

  connectedCallback() {
    super.connectedCallback();
    this.$.container.addEventListener('click', e=> {
      e.stopPropagation();
      e.preventDefault();
    });
    this.$.container.addEventListener('touchstart', e=> {
      e.stopPropagation();
    }, true);

    this.$.range.addEventListener('input', e=> {
      this.chosenUnits = this.$.range.value;
    });
    this.set('containerLeftoffset', parseInt(this.$.container.offsetLeft));
  }

  _computeTime(time, units) {
    if(time) {
      const minutes = 30*units || 30;
      return this._convert24to12Hours(this._addMinutes(this._convert12to24Hours(time) , minutes));
    }
  }

  _chosenUnitsChanged(newVal, oldVal) {
    this.hideMinTime = this.hideMaxTime = false;
    if(newVal==1)
      this.hideMinTime = true;
    else if(newVal == this._allowedUnits)
      this.hideMaxTime = true;
  }

}

customElements.define('timeslot-overlay', TimeslotOverlay);
