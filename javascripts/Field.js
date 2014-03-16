(function (global, ns) {

	'use strict';

	function Field() {
		this.dom = null;
		this.index = null;
		this.type = null;
		this.isClicked = false;
	}

	Field.prototype = {
		constructor : Field,

		setType : function (type) {
			this.type = type;
			this.dom.classList.add('field--' + type);
		},

		setIndex : function (index) {
			this.index = index;
			this.dom.setAttribute('data-field-index', index);
		},

		click : function () {
			this.dom.classList.add('clicked');
			this.isClicked = true;
		},

		equals : function (otherField) {
			if (otherField instanceof Field === false) {
				return false;
			}

			return (this.type === otherField.type);

		},

		valueOf : function () {
			return this.type;
		}
	};

	ns.Field = Field;

}(window, window.TJ = window.TJ || {}));