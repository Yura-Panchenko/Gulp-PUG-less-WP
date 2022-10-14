jQuery(function() {
  initMobileNav();
  initTouchNav();
  initOpenClose();
});

// Fix for height = 100vh for iOS because of UI banners
;(function( w ) {
	var vh = w.innerHeight * 0.01;

	refreshVH();
	w.addEventListener('load', refreshVH);
	w.addEventListener('resize', refreshVH);
	w.addEventListener('orientationchange', refreshVH);

	function refreshVH() {
		vh = w.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', vh + 'px');
	}
}(window));

// mobile menu init
function initMobileNav() {
  jQuery('body').mobileNav({
    menuActiveClass: 'nav-active',
    menuOpener: '.nav-opener'
  });
}

// handle dropdowns on mobile devices
function initTouchNav() {
	jQuery('.nav-holder').each(function() {
		new TouchNav({
			navBlock: this
		});
	});
}

// open-close init
function initOpenClose() {
	jQuery('.open-close-filter').openClose({
		activeClass: 'active-filter',
		opener: '.opener-filter',
		slider: '.slide-filter',
		animSpeed: 400,
		effect: 'slide'
	});
}

jQuery(document).ready(function($) {
	//create the slider
	$('.flexslider').flexslider({
		selector: ".slider > li",
		animation: "slide",
		controlNav: true,
		slideshow: false,
		smoothHeight: true,
		directionNav: true,
		controlNav: false,
		start: function() {
			$('.slider').children('li').css({
				'opacity': 1,
				'position': 'relative'
			});
		}
	});

	if ($('.banner-slider').length > 0) {
		$('.banner-slider').flexslider({
			selector: ".wrap > li",
			animation: "slide",
			slideshow: true,
			smoothHeight: true,
			directionNav: false,
			controlNav: false,
			useCSS: true, 
			slideshowSpeed: 5000,
			start: function() {
				$('.wrap').children('li').css({
					'opacity': 1,
					'position': 'relative'
				});
			}
		});
	}
});

$(document).ready(function() {
  $('.flex-next').html('<img src="../img/arr.png">');
  $('.flex-prev').html('<img src="../img/arr.png">');
});

/*
  * Simple Mobile Navigation
  */
;(function($) {
  function MobileNav(options) {
    this.options = $.extend({
      container: null,
      hideOnClickOutside: false,
      menuActiveClass: 'nav-active',
      menuOpener: '.nav-opener',
      menuDrop: '.nav-drop',
      toggleEvent: 'click',
      outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
    }, options);
    this.initStructure();
    this.attachEvents();
  }
  MobileNav.prototype = {
    initStructure: function() {
      this.page = $('html');
      this.container = $(this.options.container);
      this.opener = this.container.find(this.options.menuOpener);
      this.drop = this.container.find(this.options.menuDrop);
    },
    attachEvents: function() {
      var self = this;

      if(activateResizeHandler) {
        activateResizeHandler();
        activateResizeHandler = null;
      }

      this.outsideClickHandler = function(e) {
        if(self.isOpened()) {
          var target = $(e.target);
          if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
            self.hide();
          }
        }
      };

      this.openerClickHandler = function(e) {
        e.preventDefault();
        self.toggle();
      };

      this.opener.on(this.options.toggleEvent, this.openerClickHandler);
    },
    isOpened: function() {
      return this.container.hasClass(this.options.menuActiveClass);
    },
    show: function() {
      this.container.addClass(this.options.menuActiveClass);
      if(this.options.hideOnClickOutside) {
        this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
      }
    },
    hide: function() {
      this.container.removeClass(this.options.menuActiveClass);
      if(this.options.hideOnClickOutside) {
        this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
      }
    },
    toggle: function() {
      if(this.isOpened()) {
        this.hide();
      } else {
        this.show();
      }
    },
    destroy: function() {
      this.container.removeClass(this.options.menuActiveClass);
      this.opener.off(this.options.toggleEvent, this.clickHandler);
      this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
    }
  };

  var activateResizeHandler = function() {
    var win = $(window),
      doc = $('html'),
      resizeClass = 'resize-active',
      flag, timer;
    var removeClassHandler = function() {
      flag = false;
      doc.removeClass(resizeClass);
    };
    var resizeHandler = function() {
      if(!flag) {
        flag = true;
        doc.addClass(resizeClass);
      }
      clearTimeout(timer);
      timer = setTimeout(removeClassHandler, 500);
    };
    win.on('resize orientationchange', resizeHandler);
  };

  $.fn.mobileNav = function(opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];

    return this.each(function() {
      var $container = jQuery(this);
      var instance = $container.data('MobileNav');

      if (typeof opt === 'object' || typeof opt === 'undefined') {
        $container.data('MobileNav', new MobileNav($.extend({
          container: this
        }, opt)));
      } else if (typeof method === 'string' && instance) {
        if (typeof instance[method] === 'function') {
          args.shift();
          instance[method].apply(instance, args);
        }
      }
    });
  };
}(jQuery));

// navigation accesibility module
function TouchNav(opt) {
  this.options = {
      hoverClass: 'hover',
      menuItems: 'li',
      menuOpener: 'a',
      menuDrop: 'ul',
      navBlock: null,
      destroy: null
  };
  for (var p in opt) {
      if (opt.hasOwnProperty(p)) {
          this.options[p] = opt[p];
      }
  }
  // console.log(this)
  this.init();
}


TouchNav.isActiveOn = function (elem) {
return elem && elem.touchNavActive;
};


TouchNav.prototype = {
  init: function () {
      if (typeof this.options.navBlock === 'string') {
          this.menu = document.getElementById(this.options.navBlock);
      } else if (typeof this.options.navBlock === 'object') {
          this.menu = this.options.navBlock;
      }
      if (this.menu) {
          this.hanldeEvents();
      }
  },
  hanldeEvents: function () {
      // attach event handlers
      var self = this;
      var touchEvent = (navigator.pointerEnabled && 'pointerdown') || (navigator.msPointerEnabled && 'MSPointerDown') || (this.isTouchDevice && 'touchstart');
      this.menuItems = lib.queryElementsBySelector(this.options.menuItems, this.menu);

      var initMenuItem = function (item) {
          var currentDrop = lib.queryElementsBySelector(self.options.menuDrop, item)[0],
              currentOpener = lib.queryElementsBySelector(self.options.menuOpener, item)[0];

          // only for touch input devices
          if (currentDrop && currentOpener && (self.isTouchDevice || self.isPointerDevice)) {
              if (!self.options.destroy) {
                  lib.event.add(currentOpener, 'click', lib.bind(self.clickHandler, self));
                  lib.event.add(currentOpener, 'mousedown', lib.bind(self.mousedownHandler, self));
                  lib.event.add(currentOpener, touchEvent, function (e) {
                      if (!self.isTouchPointerEvent(e)) {
                          self.preventCurrentClick = false;
                          return;
                      }
                      self.touchFlag = true;
                      self.currentItem = item;
                      self.currentLink = currentOpener;
                      self.pressHandler.apply(self, arguments);
                  });
              } else {
                  lib.event.remove(currentOpener, 'click');
                  lib.event.remove(currentOpener, 'mousedown');
                  lib.event.remove(currentOpener, touchEvent);
              }
          }
          if (!self.options.destroy) {
              // for desktop computers and touch devices
              jQuery(item).bind('mouseenter', function () {
                  if (!self.touchFlag) {
                      self.currentItem = item;
                      self.mouseoverHandler();
                  }
              });
              jQuery(item).bind('mouseleave', function () {
                  if (!self.touchFlag) {
                      self.currentItem = item;
                      self.mouseoutHandler();
                  }
              });
              item.touchNavActive = true;

          } else {
              jQuery(item).unbind('mouseenter');
              jQuery(item).unbind('mouseleave');

              item.touchNavActive = false;

          }

      };

      // addd handlers for all menu items
      for (var i = 0; i < this.menuItems.length; i++) {
          initMenuItem(self.menuItems[i]);
      }

      // hide dropdowns when clicking outside navigation
      if (this.isTouchDevice || this.isPointerDevice) {
          lib.event.add(document.documentElement, 'mousedown', lib.bind(this.clickOutsideHandler, this));
          lib.event.add(document.documentElement, touchEvent, lib.bind(this.clickOutsideHandler, this));
      }
  },
  mousedownHandler: function (e) {
      if (this.touchFlag) {
          e.preventDefault();
          this.touchFlag = false;
          this.preventCurrentClick = false;
      }
  },
  mouseoverHandler: function () {
      lib.addClass(this.currentItem, this.options.hoverClass);
      /**/
      // jQuery(this.currentItem).trigger('itemhover');
      /**/
  },
  mouseoutHandler: function () {
      lib.removeClass(this.currentItem, this.options.hoverClass);
      /**/
      // jQuery(this.currentItem).trigger('itemleave');
      /**/
  },
  hideActiveDropdown: function () {
      for (var i = 0; i < this.menuItems.length; i++) {
          if (lib.hasClass(this.menuItems[i], this.options.hoverClass)) {
              lib.removeClass(this.menuItems[i], this.options.hoverClass);
              /**/
              // jQuery(this.menuItems[i]).trigger('itemleave');
              /**/
          }
      }
      this.activeParent = null;
  },
  pressHandler: function (e) {
      // hide previous drop (if active)
      if (this.currentItem !== this.activeParent) {
          if (this.activeParent && this.currentItem.parentNode === this.activeParent.parentNode) {
              lib.removeClass(this.activeParent, this.options.hoverClass);
          } else if (!this.isParent(this.activeParent, this.currentLink)) {
              this.hideActiveDropdown();
          }
      }
      // handle current drop
      this.activeParent = this.currentItem;
      if (lib.hasClass(this.currentItem, this.options.hoverClass)) {
          this.preventCurrentClick = false;
      } else {
          e.preventDefault();
          this.preventCurrentClick = true;
          lib.addClass(this.currentItem, this.options.hoverClass);
          /**/
          // jQuery(this.currentItem).trigger('itemhover');
          /**/
      }
  },
  clickHandler: function (e) {
      // prevent first click on link
      if (this.preventCurrentClick) {
          e.preventDefault();
      }
  },
  clickOutsideHandler: function (event) {
      var e = event.changedTouches ? event.changedTouches[0] : event;
      if (this.activeParent && !this.isParent(this.menu, e.target)) {
          this.hideActiveDropdown();
          this.touchFlag = false;
      }
  },
  isParent: function (parent, child) {
      while (child.parentNode) {
          if (child.parentNode == parent) {
              return true;
          }
          child = child.parentNode;
      }
      return false;
  },

  isTouchPointerEvent: function (e) {
      return (e.type.indexOf('touch') > -1) ||
          (navigator.pointerEnabled && e.pointerType === 'touch') ||
          (navigator.msPointerEnabled && e.pointerType == e.MSPOINTER_TYPE_TOUCH);
  },
  isPointerDevice: (function () {
      return !!(navigator.pointerEnabled || navigator.msPointerEnabled);
  }()),
  isTouchDevice: (function () {
      return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
  }())
};

/*
* Utility module
*/
lib = {
hasClass: function(el,cls) {
  return el && el.className ? el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')) : false;
},
addClass: function(el,cls) {
  if (el && !this.hasClass(el,cls)) el.className += " "+cls;
},
removeClass: function(el,cls) {
  if (el && this.hasClass(el,cls)) {el.className=el.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'),' ');}
},
extend: function(obj) {
  for(var i = 1; i < arguments.length; i++) {
    for(var p in arguments[i]) {
      if(arguments[i].hasOwnProperty(p)) {
        obj[p] = arguments[i][p];
      }
    }
  }
  return obj;
},
each: function(obj, callback) {
  var property, len;
  if(typeof obj.length === 'number') {
    for(property = 0, len = obj.length; property < len; property++) {
      if(callback.call(obj[property], property, obj[property]) === false) {
        break;
      }
    }
  } else {
    for(property in obj) {
      if(obj.hasOwnProperty(property)) {
        if(callback.call(obj[property], property, obj[property]) === false) {
          break;
        }
      }
    }
  }
},
event: (function() {
  var fixEvent = function(e) {
    e = e || window.event;
    if(e.isFixed) return e; else e.isFixed = true;
    if(!e.target) e.target = e.srcElement;
    e.preventDefault = e.preventDefault || function() {this.returnValue = false;};
    e.stopPropagation = e.stopPropagation || function() {this.cancelBubble = true;};
    return e;
  };
  return {
    add: function(elem, event, handler) {
      if(!elem.events) {
        elem.events = {};
        elem.handle = function(e) {
          var ret, handlers = elem.events[e.type];
          e = fixEvent(e);
          for(var i = 0, len = handlers.length; i < len; i++) {
            if(handlers[i]) {
              ret = handlers[i].call(elem, e);
              if(ret === false) {
                e.preventDefault();
                e.stopPropagation();
              }
            }
          }
        };
      }
      if(!elem.events[event]) {
        elem.events[event] = [];
        if(elem.addEventListener) elem.addEventListener(event, elem.handle, false);
        else if(elem.attachEvent) elem.attachEvent('on'+event, elem.handle);
      }
      elem.events[event].push(handler);
    },
    remove: function(elem, event, handler) {
      var handlers = elem.events[event];
      for(var i = handlers.length - 1; i >= 0; i--) {
        if(handlers[i] === handler) {
          handlers.splice(i,1);
        }
      }
      if(!handlers.length) {
        delete elem.events[event];
        if(elem.removeEventListener) elem.removeEventListener(event, elem.handle, false);
        else if(elem.detachEvent) elem.detachEvent('on'+event, elem.handle);
      }
    }
  };
}()),
queryElementsBySelector: function(selector, scope) {
  scope = scope || document;
  if(!selector) return [];
  if(selector === '>*') return scope.children;
  if(typeof document.querySelectorAll === 'function') {
    return scope.querySelectorAll(selector);
  }
  var selectors = selector.split(',');
  var resultList = [];
  for(var s = 0; s < selectors.length; s++) {
    var currentContext = [scope || document];
    var tokens = selectors[s].replace(/^\s+/,'').replace(/\s+$/,'').split(' ');
    for (var i = 0; i < tokens.length; i++) {
      token = tokens[i].replace(/^\s+/,'').replace(/\s+$/,'');
      if (token.indexOf('#') > -1) {
        var bits = token.split('#'), tagName = bits[0], id = bits[1];
        var element = document.getElementById(id);
        if (element && tagName && element.nodeName.toLowerCase() != tagName) {
          return [];
        }
        currentContext = element ? [element] : [];
        continue;
      }
      if (token.indexOf('.') > -1) {
        var bits = token.split('.'), tagName = bits[0] || '*', className = bits[1], found = [], foundCount = 0;
        for (var h = 0; h < currentContext.length; h++) {
          var elements;
          if (tagName == '*') {
            elements = currentContext[h].getElementsByTagName('*');
          } else {
            elements = currentContext[h].getElementsByTagName(tagName);
          }
          for (var j = 0; j < elements.length; j++) {
            found[foundCount++] = elements[j];
          }
        }
        currentContext = [];
        var currentContextIndex = 0;
        for (var k = 0; k < found.length; k++) {
          if (found[k].className && found[k].className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'))) {
            currentContext[currentContextIndex++] = found[k];
          }
        }
        continue;
      }
      if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
        var tagName = RegExp.$1 || '*', attrName = RegExp.$2, attrOperator = RegExp.$3, attrValue = RegExp.$4;
        if(attrName.toLowerCase() == 'for' && this.browser.msie && this.browser.version < 8) {
          attrName = 'htmlFor';
        }
        var found = [], foundCount = 0;
        for (var h = 0; h < currentContext.length; h++) {
          var elements;
          if (tagName == '*') {
            elements = currentContext[h].getElementsByTagName('*');
          } else {
            elements = currentContext[h].getElementsByTagName(tagName);
          }
          for (var j = 0; elements[j]; j++) {
            found[foundCount++] = elements[j];
          }
        }
        currentContext = [];
        var currentContextIndex = 0, checkFunction;
        switch (attrOperator) {
          case '=': checkFunction = function(e) { return (e.getAttribute(attrName) == attrValue) }; break;
          case '~': checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('(\\s|^)'+attrValue+'(\\s|$)'))) }; break;
          case '|': checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('^'+attrValue+'-?'))) }; break;
          case '^': checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) == 0) }; break;
          case '$': checkFunction = function(e) { return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length) }; break;
          case '*': checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) > -1) }; break;
          default : checkFunction = function(e) { return e.getAttribute(attrName) };
        }
        currentContext = [];
        var currentContextIndex = 0;
        for (var k = 0; k < found.length; k++) {
          if (checkFunction(found[k])) {
            currentContext[currentContextIndex++] = found[k];
          }
        }
        continue;
      }
      tagName = token;
      var found = [], foundCount = 0;
      for (var h = 0; h < currentContext.length; h++) {
        var elements = currentContext[h].getElementsByTagName(tagName);
        for (var j = 0; j < elements.length; j++) {
          found[foundCount++] = elements[j];
        }
      }
      currentContext = found;
    }
    resultList = [].concat(resultList,currentContext);
  }
  return resultList;
},
trim: function (str) {
  return str.replace(/^\s+/, '').replace(/\s+$/, '');
},
bind: function(f, scope, forceArgs){
  return function() {return f.apply(scope, typeof forceArgs !== 'undefined' ? [forceArgs] : arguments);};
}
};

/*
 * jQuery Open/Close plugin
 */
;(function($) {
	function OpenClose(options) {
		this.options = $.extend({
			addClassBeforeAnimation: true,
			hideOnClickOutside: false,
			activeClass: 'active',
			opener: '.opener',
			slider: '.slide',
			animSpeed: 400,
			effect: 'fade',
			event: 'click'
		}, options);
		this.init();
	}
	OpenClose.prototype = {
		init: function() {
			if (this.options.holder) {
				this.findElements();
				this.attachEvents();
				this.makeCallback('onInit', this);
			}
		},
		findElements: function() {
			this.holder = $(this.options.holder);
			this.opener = this.holder.find(this.options.opener);
			this.slider = this.holder.find(this.options.slider);
		},
		attachEvents: function() {
			// add handler
			var self = this;
			this.eventHandler = function(e) {
				e.preventDefault();
				if (self.slider.hasClass(slideHiddenClass)) {
					self.showSlide();
				} else {
					self.hideSlide();
				}
			};
      self.slider.attr('aria-hidden', 'true');
      self.opener.attr('aria-expanded', 'false');
			self.opener.on(self.options.event, this.eventHandler);

			// hover mode handler
			if (self.options.event === 'hover') {
				self.opener.on('mouseenter', function() {
					if (!self.holder.hasClass(self.options.activeClass)) {
						self.showSlide();
					}
				});
				self.holder.on('mouseleave', function() {
					self.hideSlide();
				});
			}

			// outside click handler
			self.outsideClickHandler = function(e) {
				if (self.options.hideOnClickOutside) {
					var target = $(e.target);
					if (!target.is(self.holder) && !target.closest(self.holder).length) {
						self.hideSlide();
					}
				}
			};

			// set initial styles
			if (this.holder.hasClass(this.options.activeClass)) {
				$(document).on('click touchstart', self.outsideClickHandler);
			} else {
				this.slider.addClass(slideHiddenClass);
			}
		},
		showSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.addClass(self.options.activeClass);
			}
      self.slider.attr('aria-hidden', 'false');
      self.opener.attr('aria-expanded', 'true');
			self.slider.removeClass(slideHiddenClass);
			$(document).on('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', true);
			toggleEffects[self.options.effect].show({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.addClass(self.options.activeClass);
					}
					self.makeCallback('animEnd', true);
				}
			});
		},
		hideSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.removeClass(self.options.activeClass);
			}
			$(document).off('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', false);
			toggleEffects[self.options.effect].hide({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.removeClass(self.options.activeClass);
					}
					self.slider.addClass(slideHiddenClass);
          self.slider.attr('aria-hidden', 'true');
          self.opener.attr('aria-expanded', 'false');
					self.makeCallback('animEnd', false);
				}
			});
		},
		destroy: function() {
			this.slider.removeClass(slideHiddenClass).css({
				display: ''
			});
			this.opener.off(this.options.event, this.eventHandler);
			this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
			$(document).off('click touchstart', this.outsideClickHandler);
		},
		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	};

	// add stylesheet for slide on DOMReady
	var slideHiddenClass = 'js-slide-hidden';
	(function() {
		var tabStyleSheet = $('<style type="text/css">')[0];
		var tabStyleRule = '.' + slideHiddenClass;
		tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
		if (tabStyleSheet.styleSheet) {
			tabStyleSheet.styleSheet.cssText = tabStyleRule;
		} else {
			tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
		}
		$('head').append(tabStyleSheet);
	}());

	// animation effects
	var toggleEffects = {
		slide: {
			show: function(o) {
				o.box.stop(true).hide().slideDown(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).slideUp(o.speed, o.complete);
			}
		},
		fade: {
			show: function(o) {
				o.box.stop(true).hide().fadeIn(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).fadeOut(o.speed, o.complete);
			}
		},
		none: {
			show: function(o) {
				o.box.hide().show(0, o.complete);
			},
			hide: function(o) {
				o.box.hide(0, o.complete);
			}
		}
	};

	// jQuery plugin interface
	$.fn.openClose = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		return this.each(function() {
			var $holder = jQuery(this);
			var instance = $holder.data('OpenClose');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				$holder.data('OpenClose', new OpenClose($.extend({
					holder: this
				}, opt)));
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
}(jQuery));