$.widget("custom.combobox", {
	_create : function() {
		this.wrapper = $('<span class="custom-combobox">').insertAfter(this.element);
		this.element.hide();
		this._createAutocomplete();
		this._createShowAllButton();
	},
	_createAutocomplete : function() {
		var selected = this.element.children(":selected"),
		    value = selected.val() ? selected.text() : "";
		this.input = $('<input class="custom-combobox-input" data-title="" type="text">').appendTo(this.wrapper).val(value).autocomplete({
			delay : 0,
			minLength : 0,
			source : $.proxy(this, "_source")
		}).tooltip({
			classes : {
				"ui-tooltip" : "ui-state-highlight"
			}
		});
		this._on(this.input, {
			autocompleteselect : function(event, ui) {
				ui.item.option.selected = true;
				this._trigger("select", event, {
					item : ui.item.option
				});
			},

			autocompletechange : "_removeIfInvalid"
		});
	},
	_createShowAllButton : function() {
		var input = this.input,
		    wasOpen = false;
		$("<a class='custom-combobox-toggle' tabIndex='-1' title='List'>").tooltip().appendTo(this.wrapper).button({
			icons : {
				primary : "ui-icon-triangle-1-s"
			},
			text : false
		}).on("mousedown", function() {
			wasOpen = input.autocomplete("widget").is(":visible");
		}).on("click", function() {
			input.trigger("focus");
			if (wasOpen) {
				return;
			}
			input.autocomplete("search", "");
		});
	},
	_source : function(request, response) {
		var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
		response(this.element.children("option").map(function() {
			var text = $(this).text();
			if (this.value && (!request.term || matcher.test(text)))
				return {
					label : text,
					value : text,
					option : this
				};
		}));
	},
	_removeIfInvalid : function(event, ui) {
		if (ui.item) {
			return;
		}
		var value = this.input.val(),
		    valueLowerCase = value.toLowerCase(),
		    valid = false;
		this.element.children("option").each(function() {
			if ($(this).text().toLowerCase() === valueLowerCase) {
				this.selected = valid = true;
				return false;
			}
		});
		if (valid) {
			return;
		}
		if (value.length > 0) {
			this.input.val("");
			this.input.data("title", "No match!").tooltip("open");
			this.element.val("");
			this._delay(function() {
				this.input.tooltip("close").data("title", "");
			}, 2500);
		} else {
			this.input.val("");
			this.element.val("");
		}
	},
	_destroy : function() {
		this.wrapper.remove();
		this.element.show();
	}
});
