# \<timeslot-picker\>

## NOT YET PRODUCTION READY
A polymer element for choosing timeslots. Timeslots can be variable.

The element can be used to display a slider with timeslots at 30 minutes interval. User can select a slot (Max 6 units).
An overlay is shown as slider to select slots

## Properties


|Property|type|required|reflected _\*_|notify _\*_|description|
|----|---|--|--|--|--|
|bookings|Array|yes|false|false|Set of slots already booked |
|chosenStartTime|String|no|true|true|Starting time slot value|
|chosenEndTime|String|no|true|true|Ending time slot value|
|chosenUnits|Number|no|true|true|Number of slots chosen|



### _bookings_ property must be an Array of meetings

```javascript  
    bookings: [{
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
        ]
```



### _\*_ Please note: ###
Property with `notify: true` fires a _property_-changed event when the value is changed.
    Example: *PropertyName* fires `property-name-changed` event on value change

Reflected attributes updates the element with property attribute when the value changes.
    Example: *PropertyName* updates the attribute as `property-name="value"`

## Events

|Event|Detail Object|Description|
|--|--|--|
|close| _not required_ |Closes the Slider|
|open|slot: `<number>`|Opens the slider at the mentioned slot|

dispatch Event to this element
Example:
```javascript
document.querySelector('timeslot-picker').dispatchEvent(new CustomEvent('open', {
    detail: {
          slot: 2
        }
}))
```

## Styling ##

|CSS variable|description|default|
|-|-|-|
|`--timeslot-unit-height`|Timeslot unit height|50px|
|`--timeslot-unit-width`|Timeslot unit width|50px|
|`--timeslot-available-bg`|Timeslot Available background color| #fff|
|`--timeslot-unavailable-bg`|Timeslot Unavailable background color| #666|
|`--timeslot-font-size`|Timeslot indicators and slots text size| 10px|
|`--timeslot-picker-tooltip-background`|Tooltip bubble background color| #000|
|`--timeslot-picker-tooltip-color`|Tooltip bubble text color| #fff|
|`--timeslot-picker-scroll-btn-background`|Left and right scroll buttons background| #fff|
|`--timeslot-picker-scroll-btn-color`|Left and right scroll text background| #000|
|`--timeslot-overlay-background`| Background color for overlay over the timeslot units| **Right Striped Image**|
|`--timeslot-overlay-container-background`| Background color for the container which contains slider| #777|
|`--timeslot-overlay-container-border-left`|Timeslot indicators left border| none |
|`--timeslot-overlay-container-border-right`|Timeslot indicators right border| none |

[npmjs.org][1]

[github.com][2]

[webcomponents.org][3]


[1]: https://www.npmjs.com/package/timeslot-picker
[2]: https://github.com/DamandeepS/timeslot-picker
[3]: https://www.webcomponents.org/element/timeslot-picker
