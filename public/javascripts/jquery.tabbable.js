/*
 * jQuery.tabbable 1.0
 * Copyright 2013, Mark Lagendijk
 * Released under the MIT license
 */
(function($){
	'use strict';

	$.focusNext = function(){
		selectNextTabbableOrFocusable(':focusable');
	};

	$.focusPrev = function(){
		selectPrevTabbableOrFocusable(':focusable');
	};
	
	$.tabNext = function(){
		selectNextTabbableOrFocusable(':tabbable');
	};

	$.tabPrev = function(){
		selectPrevTabbableOrFocusable(':tabbable');
	};

	function selectNextTabbableOrFocusable(selector){
		var selectables = $(selector);
		var current = $(':focus');
		var nextIndex = 0;
		if(current.length === 1){
			var currentIndex = selectables.index(current);
			if(currentIndex + 1 < selectables.length){
				nextIndex = currentIndex + 1;
			}
		}

		selectables.eq(nextIndex).focus();
	}

	function selectPrevTabbableOrFocusable(selector){
		var selectables = $(selector);
		var current = $(':focus');
		var prevIndex = selectables.length - 1;
		if(current.length === 1){
			var currentIndex = selectables.index(current);
			if(currentIndex > 0){
				prevIndex = currentIndex - 1;
			}
		}

		selectables.eq(prevIndex).focus();
	}

	$.extend($.expr[ ':' ], {
		data: $.expr.createPseudo ?
			$.expr.createPseudo(function(dataName){
				return function(elem){
					return !!$.data(elem, dataName);
				};
			}) :
			// support: jQuery <1.8
			function(elem, i, match){
				return !!$.data(elem, match[ 3 ]);
			},

		focusable: function(element){
			return focusable(element, !isNaN($.attr(element, 'tabindex')));
		},

		tabbable: function(element){
			var tabIndex = $.attr(element, 'tabindex'),
				isTabIndexNaN = isNaN(tabIndex);
			return ( isTabIndexNaN || tabIndex >= 0 ) && focusable(element, !isTabIndexNaN);
		}
	});

	function focusable(element){
		var map, mapName, img,
			nodeName = element.nodeName.toLowerCase(),
			isTabIndexNotNaN = !isNaN($.attr(element, 'tabindex'));
		if('area' === nodeName){
			map = element.parentNode;
			mapName = map.name;
			if(!element.href || !mapName || map.nodeName.toLowerCase() !== 'map'){
				return false;
			}
			img = $('img[usemap=#' + mapName + ']')[0];
			return !!img && visible(img);
		}
		return ( /input|select|textarea|button|object/.test(nodeName) ?
			!element.disabled :
			'a' === nodeName ?
				element.href || isTabIndexNotNaN :
				isTabIndexNotNaN) &&
			// the element and all of its ancestors must be visible
			visible(element);

		function visible(element){
			// Reason for not using addback is that we are using 1.7 jqeury and addback is jquery 1.8,
			// Here is my workaround.
			//return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function(){
			return $.expr.filters.visible(element) && !$(element).add($(element).parents()).filter(function(){
					return $.css(this, 'visibility') === 'hidden';
			}).length;
		}
	}
})(jQuery);