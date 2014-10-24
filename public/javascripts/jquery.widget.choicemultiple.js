/**
 * Copyright (c) 2014 NCS Pearson, Inc., All Rights Reserved.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
$.widget('pearson.choiceMultiple', {
    options: {
        identifier: null // qti identifier
    },

    _create: function() {
        this._container = this.element; // ul of the visible choice list
        this._shadowContainer = $("ul[data-identifier='" + this.options.identifier + "_shadow']");

        this._choices = $('input[name=group_' + this.options.identifier + ']', this._container);
        this._shadowChoices = $('input[type=checkbox]', this._shadowContainer);

        this._radioMode = $('input[type="radio"]', this._container).length > 0;

        if (!this._shadowContainer.length) {
            throw new Error("Choice interaction widget could not locate the shadow dom");
            return;
        }

        this._choices
            .change(this._update.bind(this))
            .attr('tabindex', -1);

        this._shadowChoices
            .change(this._update.bind(this))
            .focus(this._setVFocus.bind(this))
            .blur(this._blur.bind(this));


        if (this._radioMode) {
            this._shadowChoices.keydown(function(e) {
                var sLen = this._shadowChoices.length;
                if (e.keyCode === 37 || e.keyCode === 38) {
                    var idx = this._shadowChoices.index(e.target);
                    this._shadowChoices.get((idx + sLen - 1) % sLen).focus();
                }
                if (e.keyCode === 40 || e.keyCode === 39) {
                    var idx = this._shadowChoices.index(e.target);
                    this._shadowChoices.get((idx + sLen + 1) % sLen).focus();
                }
                if (e.keyCode === 9) {
                    this._choices.each(function(i, e) {
                        $(e).parent().parent().removeClass('glow-on')
                    })
                }
            }.bind(this)).attr({
                tabindex: -1,
                role: 'radio'
            }).eq(0).attr('tabindex', 0);
        }

        this._ready();
    },

    _setVFocus: function(e) {
        this._choices.each(function(i, e) {
            $(e).parent().parent().removeClass('glow-on')
        })
        this._choices.filter('[value="' + e.target.value + '"]')
            .parent().parent()
            .addClass('glow-on');
    },

    _blur: function(e) {
        if (!$.contains(this._shadowContainer[0], document.activeElement)) {
            this._choices.parent().parent().removeClass('glow-on')
        }
    },

    _update: function(e) {
        this._sync(e.target.value, $(e.target).prop('checked'));
    },

    _sync: function(val, check) {
        var sTarget = $('[value=' + val + ']', this._shadowContainer);
        if (this._radioMode) {
            // uncheck everything manually
            this._choices.add(this._shadowChoices)
                .prop('checked', false)
                .attr({
                    'aria-checked': false,
                    'tabindex': -1
                });
            sTarget.attr('tabindex', (check ? 0 : -1) );
        }

        sTarget
            .attr('aria-checked', check)
        	.focus()
            .add('[value=' + val + ']', this._container)
            .prop('checked', check);
    },
    
    _ready: function() {
		this._trigger('ready', null, {
			identifier: this.options.identifier
		});    	
    },

    destroy: function() {
        [this._container, this._shadowContainer, this._choices, this._shadowChoices]
        .forEach(function(e) {
            e.off().remove();
            delete e;
        });
        $.Widget.prototype.destroy.call(this);
    },

    getResponseData: function() {
        return $(':checked', this._container)
            .toArray()
            .map(function(el) {
                return el.value
            });
    },
    
    setResponseData: function(param) {
        if (param.length) {
            this._choices.add(this._shadowChoices).each(function(i, el) {
                $(el).prop('checked', param.indexOf(el.value) > -1)
            });
            if (this._radioMode) {
                this._shadowChoices
                    .attr('tabindex', -1)
                    .filter(':checked')
                    .attr('tabindex', 0);
            }
        }
    }
});