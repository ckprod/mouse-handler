mouse-handler
=============

Base class to distinguish between left mouse button actions: click vs. drag

###Samples

See [here](http://irhc.github.io/mouse-handler) for a basic sample which shows how to use the mouse handler template to distinguish between drag and click actions. The associated javascript file is mouse-handler.sample.js.

More sophisticated samples are:

- [table-drag](https://github.com/irhc/table-drag)
- [table-resize](https://github.com/irhc/table-resize)
- [table-drag-sort-resize](https://github.com/irhc/table-drag-sort-resize)

###Description

mouse-handler is a small javascript component which can be used as base class for mouse actions. Its main purpose is to distinguish between drag and click actions. If the left mouse button is pressed (and still held) and the mouse movement is within the "no drag"-circle, it is still in the click case. Otherwise (movement beyond circle) the drag case is triggered. The following functions are available for overriding:

- _mousePrepareClick: called on left mouse button down
- _mousePrepareDrag: called on triggering the drag case
- _mouseDrag: called on every mouse move
- _mouseExecuteClick: called on left mouse button release (if in the click case)
- _mouseStopDrag: called on left mouse button release (if in the drag case)

It is completely independent from other javascript libraries but should work side-by-side with libraries like jQuery, etc.

###Options

distance: Sets the radius of a circle, where no drag action is triggered as long as mouse movements are within the circle.

###How to use

Inherite from the base class, code the constructor and the placeholder methods if you need them, e.g.

```html 
// constructor   
function SampleHandler(/* arguments, */ options) {#

	//set other default options
	//this.options.*** = ***;
		
    // set options
	var newOptions = {};
    for (var opt in this.options)
		newOptions[opt] = options[opt] || this.options[opt];
	this.options = newOptions;

	//...
}

//...

// the overriden placeholder methods
SampleHandler.prototype._mousePrepareClick = function (/*event*/) {/* code */};
SampleHandler.prototype._mousePrepareDrag = function (/*event*/) {/* code */};
SampleHandler.prototype._mouseDrag = function (/*event*/) {/* code */}
SampleHandler.prototype._mouseExecuteClick = function (/*event*/) {/* code */};
SampleHandler.prototype._mouseStopDrag = function (/*event*/) {/* code */};
```

Create and add some handlers to your export class and attach them as listeners to your objects.

```html 
var sampleHandler = new SampleHandler(/* arguments, */ options);

// attach handlers
addEvent(element, 'mousedown', function (event) {
	sampleHandler._mouseDown(event);
});
```

###Supported browsers

- Internet Explorer 8 and newer
- Opera
- Chrome
- Firefox
- Safari 5.1.7 (and highly possible newer)

###References

This small javascript component uses or is based on other javascript projects and code snippets:

- [mouse.js by jQuery](https://github.com/jquery/jquery-ui/blob/master/ui/mouse.js)
- [addEvent() recoding contest entry](http://ejohn.org/apps/jselect/event.html)
- [Coordinates from javascript.info](http://javascript.info/tutorial/coordinates)

### Licence

MIT