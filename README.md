# \<timeslot-picker\>

## NOT YET PRODUCTION READY
A polymer element for choosing timeslots. Timeslots can be variable.

The element can be used to display a slider with timeslots at 30 minutes interval. User can select a slot (Max 6 units).
An overlay is shown as slider to select slots

## Properties


|Property|type|required|reflected|notify|description|
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

## Styling

|CSS variable|description|default|
|-|-|-|
|`--timeslot-unit-height`|Timeslot unit height|50px|
|`--timeslot-unit-width`|Timeslot unit width|50px|
|`--timeslot-available-bg`|Timeslot Available background color| #fff|
|`--timeslot-unavailable-bg`|Timeslot Unvailable background color| #666|
|`--timeslot-font-size`|Timeslot indicators and slots text size| 10px|

Please note: Property with `notify: true` fires a _property_-changed event when the value is changed.
    Example: *PropertyName* fires `property-name-changed` event on value change

    Reflected attributes updates the element with property attribute when the value changes.
    Example: *PropertyName* updates the attribute as `property-name="value"`

##Event Listener
|Event|Detail Object|Description|
|--|--|--|
|close| |Closes the Choose Slider|
|open|slot|Opens the Choose slider|

dispatch Event to this element
Example: ```javascript
          document.querySelector('timeslot-picker').dispatchEvent(new CustomEvent('open', {
            detail: {
              slot: 2
            }
          }))```






[npm][1]

[github][2]


[1]: https://www.npmjs.com/package/timeslot-picker
[2]: https://github.com/DamandeepS/timeslot-picker
