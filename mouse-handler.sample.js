;
if (typeof DEBUG === "undefined") DEBUG = true;

// debugging utils
function log() {
    var a = arguments[0],
                    s = arguments.length > 1 ? Array.prototype.slice.call(arguments) : a;

    if (typeof console !== "undefined" && typeof console.log !== "undefined") {
        console[/error/i.test(a) ? 'error' : /warn/i.test(a) ? 'warn' : 'log'](s);
    } else {
        alert(s);
    }
}

function benchmark(text, time) {
    log(text + " (" + (new Date().getTime() - time.getTime()) + "ms)");
}

(function () {
    "use strict";

	// template for left mouse button actions: click vs drag
	// based on
	// https://github.com/jquery/jquery-ui/blob/master/ui/mouse.js
	// with basic ie8 support
	// if you want more special ie8 functionality or have some ie8 bugs see the comments and code in the mentioned url above
    function MouseHandler () {
		//this._mouseDownEvent
		//this._mouseStarted
		//this._mouseMoveDelegate
		//this._mouseUpDelegate
    }
    MouseHandler.prototype = (function () {
		// helper functions
		
		// Cross browser event data based on
		// jquery implementation
		function getEvent(event) {
			return event || window.event;
		}
		function eventWhich(event) {
			return event.which || event.button;
		}
		function eventPageX(event) {
			var pageX = event.pageX;

			if (typeof pageX == 'undefined') {
				var body = document.body;
				var docElem = document.documentElement;
				pageX = event.clientX + (docElem && docElem.scrollLeft || body && body.scrollLeft || 0) - (docElem && docElem.clientLeft || body && body.clientLeft || 0);
			}

			return pageX;
		}
		function eventPageY(event) {
			var pageY = event.pageY;

			if (typeof pageY == 'undefined') {
				var body = document.body;
				var docElem = document.documentElement;
				pageY = event.clientY + (docElem && docElem.scrollTop || body && body.scrollTop || 0) - (docElem && docElem.clientTop || body && body.clientTop || 0);
			}

			return pageY;
		}		
		
		// prototype functions
		
        function _mouseDown(event) {
		
			// ie8 support
            event = getEvent(event);

            // we may have missed mouseup (out of window) - clean start, reset all
            (this._mouseStarted && this._mouseUp(event));

            // to compute the first (and the following) mouse move correctly
            this._mouseDownEvent = event;
			// the above line only works for ie>8,  because _mouseDownEvent is a reference to the event
			// so in ie8 you have two references (_mouseDownEvent and event) which points to the same object, the window.event
			// to overcome this, you need a copy of the event e.g.
			if (!event.which) { // detect ie8
				var copy = {};
				for (var attr in event) {
					copy[attr] = event[attr];
				}
				this._mouseDownEvent = copy;
			}

            // only left mouse button down is of interest
			// ie8 support
            if (eventWhich(event) !== 1) {
                return true;
            }
            
            // lets start and check distance first
            if (this.options.distance == 0) {
				this._mouseStarted = this._mousePrepareDrag(event) !== false;
				if (!this._mouseStarted) {
					// ie8 support
					
					(event.preventDefault ? event.preventDefault() : (event.returnValue=false));
					(event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true));
					
					return true;
                }
            } else { // 
				this._mousePrepareClick(event);
			}

            // to keep context
            var _this = this;
            this._mouseMoveDelegate = function (event) {
                return _this._mouseMove(event);
            };
            this._mouseUpDelegate = function (event) {
                return _this._mouseUp(event);
            };

            addEvent(document.body, 'mousemove', this._mouseMoveDelegate);
            addEvent(document.body, 'mouseup', this._mouseUpDelegate);

			// ie8 support
			(event.preventDefault ? event.preventDefault() : (event.returnValue=false));
			(event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true));

            return true;
		}
        function _mouseMove(event) {
			// ie8 support
            event = getEvent(event);

            // Iframe mouseup check - mouseup occurred in another document
            if (!eventWhich(event)) {
                return this._mouseUp(event);
            }

            // drag functionality
            if (this._mouseStarted) {
                this._mouseDrag(event);
                
				// ie8 support
				(event.preventDefault ? event.preventDefault() : (event.returnValue=false));
				(event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true));

                return false;
            }

            // check distance (no action circle)
            if (this._mouseDistanceMet(event, this._mouseDownEvent)) {
				// lets start
                this._mouseStarted = (this._mousePrepareDrag(this._mouseDownEvent, event) !== false);
				// and move or stop
                (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
            }

			// ie8 support
			(event.preventDefault ? event.preventDefault() : (event.returnValue=false));
			(event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true));
			
            return !this.mouseStarted;
		}
        function _mouseUp(event) {
			// ie8 support
            event = getEvent(event);
			
            removeEvent(document.body, 'mousemove', this._mouseMoveDelegate);
            removeEvent(document.body, 'mouseup', this._mouseUpDelegate);

            if (this._mouseStarted) {
                this._mouseStarted = false;

				this._mouseStopDrag(event);
            } else {
				this._mouseExecuteClick(event);
			}

			// ie8 support
			(event.preventDefault ? event.preventDefault() : (event.returnValue=false));
			(event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true));
				
            return false;
		}
        function _mouseDistanceMet(newEvent, lastEvent) {
			var x = Math.abs(eventPageX(lastEvent) - eventPageX(newEvent)),
				y = Math.abs(eventPageY(lastEvent) - eventPageY(newEvent));
			return (Math.sqrt(x*x + y*y)) >= this.options.distance;
		}

        // These are placeholder methods, to be overriden by extentions
        function _mousePrepareClick() {}
		function _mousePrepareDrag() {}
        function _mouseDrag() {}
        function _mouseExecuteClick() {}
		function _mouseStopDrag() {}
		
		return {
			constructor: MouseHandler,
			options: {
                distance: 0
			},
			_mouseDown: _mouseDown,
			_mouseMove: _mouseMove,
			_mouseUp: _mouseUp,
			_mouseDistanceMet: _mouseDistanceMet,
			_mousePrepareClick: _mousePrepareClick,
			_mousePrepareDrag: _mousePrepareDrag,
			_mouseDrag: _mouseDrag,
			_mouseExecuteClick: _mouseExecuteClick,
			_mouseStopDrag: _mouseStopDrag
		};
	})();
	
    function SampleHandler(dragElement, dragArea, statusElement, options) {
		this.dragElement = dragElement;
		this.dragArea = dragArea;
		this.statusElement = statusElement;
		
		//set other default options
		//this.options.*** = ***;
		
        // set options
		var newOptions = {};
        for (var opt in this.options)
			newOptions[opt] = options[opt] || this.options[opt];
		this.options = newOptions;
		
		this._init();
    }
    (function () {
		SampleHandler.prototype = new MouseHandler();
		SampleHandler.prototype.constructor = SampleHandler;
		
		// helper functions
		
		function eventPageX(event) {
			var pageX = event.pageX;

			if (typeof pageX == 'undefined') {
				var body = document.body;
				var docElem = document.documentElement;
				pageX = event.clientX + (docElem && docElem.scrollLeft || body && body.scrollLeft || 0) - (docElem && docElem.clientLeft || body && body.clientLeft || 0);
			}

			return pageX;
		}
		function eventPageY(event) {
			var pageY = event.pageY;

			if (typeof pageY == 'undefined') {
				var body = document.body;
				var docElem = document.documentElement;
				pageY = event.clientY + (docElem && docElem.scrollTop || body && body.scrollTop || 0) - (docElem && docElem.clientTop || body && body.clientTop || 0);
			}

			return pageY;
		}
		function setStatus(element) {
			var text = 'Status: ';
			for (var i = 1; i<arguments.length; i++) {
				text += '<br>- ' + arguments[i];
			}
			element.innerHTML = text;
		}
        function elementStyleProperty(element, prop) {
            if (window.getComputedStyle) {
                return window.getComputedStyle(element, "").getPropertyValue(prop);
            } else { // http://stackoverflow.com/questions/21797258/getcomputedstyle-like-javascript-function-for-ie8
                var re = /(\-([a-z]){1})/g;
                if (prop == 'float') prop = 'styleFloat';
                if (re.test(prop)) {
                    prop = prop.replace(re, function () {
                        return arguments[2].toUpperCase();
                    });
                }
                return element.currentStyle[prop]
            }
        };
		function numericProperty(prop) {
            return (typeof prop == 'undefined' || prop == '' || prop == null) ? 0 : parseInt(prop);
        };
		
		// public functions
		
		//TableDrag.prototype.refresh = function () { };
		
		// private functions
		
		SampleHandler.prototype._init = function () {
			var posDragArea = getOffsetRect(this.dragArea),
				posDragElement = getOffsetRect(this.dragElement);
			
			var canvas = document.getElementById('canvas');
			if (canvas.getContext){
				var ctx = canvas.getContext('2d');
				
				ctx.beginPath();
				ctx.lineWidth='1';
				ctx.strokeStyle='#999999';
				ctx.rect(posDragElement.left-posDragArea.left,posDragElement.top-posDragArea.top,this.dragElement.offsetWidth,this.dragElement.offsetHeight); 
				ctx.stroke();
			}
		};
		
		// the overriden placeholder methods
		
		SampleHandler.prototype._mousePrepareClick = function (event) {
			this.dragElement.style.backgroundColor = 'white';
			
			var posDragArea = getOffsetRect(this.dragArea),
				pageX = eventPageX(event),
				pageY = eventPageY(event);
			
			var canvas = document.getElementById('canvas');
			if (canvas.getContext){
				var ctx = canvas.getContext('2d');
				
				ctx.beginPath();
				ctx.strokeStyle='blue';
				ctx.arc(pageX-posDragArea.left,pageY-posDragArea.top,this.options.distance,0,Math.PI*2,true);
				ctx.stroke();
			}
		
			setStatus(this.statusElement, 'action: _mousePrepareClick');
		};
		SampleHandler.prototype._mousePrepareDrag = function (event) {
			var posDragArea = getOffsetRect(this.dragArea),
				posDragElement = getOffsetRect(this.dragElement),
				pageX = eventPageX(event),
				pageY = eventPageY(event);

			// event boundaries
			this.xMin = posDragArea.left+pageX-posDragElement.left;
			this.yMin = posDragArea.top+pageY-posDragElement.top;
			this.xMax = posDragArea.left+pageX-posDragElement.left+this.dragArea.offsetWidth-this.dragElement.offsetWidth;
			this.yMax = posDragArea.top+pageY-posDragElement.top+this.dragArea.offsetHeight-this.dragElement.offsetHeight;
		
			setStatus(this.statusElement, 'action: _mousePrepareDrag',
										  'xMin: ' + this.xMin + ' xMax: ' + this.xMax, 'yMin: ' + this.yMin + ' yMax: ' + this.yMax,
										  'pageX: ' + pageX + ' pageY: ' + pageY);
		};
		SampleHandler.prototype._mouseDrag = function (event) {
			var pageX = eventPageX(event),
				pageY = eventPageY(event);
				
			if (pageX < this.xMin) { // left boundary
				this.dragElement.style.left = 0 + 'px';
			} else if (this.xMax < pageX) { // right boundary
				this.dragElement.style.left = this.dragArea.offsetWidth-this.dragElement.offsetWidth + 'px';
			} else { // within drag area
				var xMove = pageX - eventPageX(this._mouseDownEvent),
					left = numericProperty(elementStyleProperty(this.dragElement, 'left')) + xMove;
					
				this.dragElement.style.left = left + 'px';
			}
			
			if (pageY < this.yMin) { // top boundary
				this.dragElement.style.top = 0 + 'px';
			} else if (this.yMax < pageY) { // lower boundary
				this.dragElement.style.top = this.dragArea.offsetHeight-this.dragElement.offsetHeight + 'px';
			} else { // within drag area
				var yMove = pageY - eventPageY(this._mouseDownEvent),
					top = numericProperty(elementStyleProperty(this.dragElement, 'top')) + yMove;
					
				this.dragElement.style.top = top + 'px';
			}
			
			if (!event.which) { // detect ie8
				var copy = {};
				for (var attr in event) {
					copy[attr] = event[attr];
				}
				this._mouseDownEvent = copy;
			} else {
				this._mouseDownEvent = event;
			}
			
			var posDragArea = getOffsetRect(this.dragArea);
			var canvas = document.getElementById('canvas');
			if (canvas.getContext){
				var ctx = canvas.getContext('2d');
				
				ctx.fillRect(pageX-posDragArea.left,pageY-posDragArea.top,1,1);
			}
			
			setStatus(this.statusElement, 'action: _mouseDrag',
										  'xMin: ' + this.xMin + ' xMax: ' + this.xMax, 'yMin: ' + this.yMin + ' yMax: ' + this.yMax,
										  'pageX: ' + pageX + ' pageY: ' + pageY);
		}
		SampleHandler.prototype._mouseExecuteClick = function () {
			var value = Math.random() * 0xFF | 0;
			var grayscale = (value << 16) | (value << 8) | value;
			var color = '#' + grayscale.toString(16);
			
			this.dragElement.style.backgroundColor = color;
		
			setStatus(this.statusElement, 'action: _mouseExecuteClick');
		};
		SampleHandler.prototype._mouseStopDrag = function () {
			setStatus(this.statusElement, 'action: _mouseStopDrag');
		};
	})();

	
    function SampleDragClick(dragElement, dragArea, statusElement, options) {

        var sampleHandler = new SampleHandler(dragElement, dragArea, statusElement, options);
		
        // to keep context
        var that = this;
		
        // attach handlers
        addEvent(dragElement, 'mousedown', function (event) {
            sampleHandler._mouseDown(event);
        });
    }
	
    // export
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SampleDragClick;
    } else {
        window.SampleDragClick = SampleDragClick;
    }
    
    // polyfills and public code snippets

    // http://javascript.info/tutorial/coordinates
    function getOffsetRect(elem) {
        // (1)
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docElem = document.documentElement;

        // (2)
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

        // (3)
        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;

        // (4)
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left) };
    }

    // http://ejohn.org/apps/jselect/event.html
    function addEvent(obj, type, fn) {
        if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function () {
                obj['e' + type + fn](window.event);
            };
            obj.attachEvent('on' + type, obj[type + fn]);
        } else
            obj.addEventListener(type, fn, false);
    }
    function removeEvent(obj, type, fn) {
        if (obj.detachEvent) {
            obj.detachEvent('on' + type, obj[type + fn]);
            obj[type + fn] = null;
        } else
            obj.removeEventListener(type, fn, false);
    }
	
})();