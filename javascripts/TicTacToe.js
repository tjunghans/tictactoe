(function(global, ns) {
	'use strict';

	function TicTacToe() {
		this.init.call(this, Array.prototype.slice.call(arguments));
	}

	TicTacToe.prototype = {
		constructor: TicTacToe,
		init: function(id) {

			this.id = id;

			this.rows = 3;

			this.maxFields = this.rows * this.rows;

			this.fieldType = {
				0: 'nought',
				1: 'cross'
			};

			this.prepareGame();

		},

		prepareGame: function() {

			this.ctx = document.getElementById(this.id);
			this.model = null;
			this.fields = null;
			this.playCounter = 0;
			this.fieldDomMapping = {};

			this.buildGameModel();
			this.buildGameBoard();

			this.bindEvents();
		},


		buildGameModel: function() {

			this.model = [];
			this.fields = [];

			for (var row = 0; row < this.rows; row++) {

				this.model[row] = [];

				for (var col = 0; col < this.rows; col++) {
					var newField = this.createField();

					this.model[row].push(newField);
					this.fields.push(newField);
				}


			}

		},


		buildGameBoard: function() {

			for (var rowCounter = 0; rowCounter < this.rows; rowCounter++) {

				var row = document.createElement('div');
				row.className = 'row row--' + rowCounter;

				for (var colCounter = 0; colCounter < this.rows; colCounter++) {
					var domField = this.createDomField();
					var col = domField;
					var fieldIndex = (rowCounter * this.rows) + colCounter;
					var field = this.model[rowCounter][colCounter];

					field.dom = domField;
					field.setIndex(fieldIndex);


					this.fieldDomMapping[fieldIndex] = field;

					row.appendChild(col);

				}


				this.ctx.appendChild(row);

			}

		},

		createField: function() {
			return new ns.Field();
		},

		createDomField: function() {
			var field = document.createElement('div');

			field.className = 'field';

			return field;
		},

		getFieldsByRow: function(rowNr) {
			return this.model[rowNr];
		},

		getFieldsByCol: function(colNr) {

			var col = [];

			for (var row = 0; row < this.rows; row++) {
				col.push(this.model[row][colNr]);
			}

			return col;

		},

		fieldClick: function(event) {


			if (event.target.classList.contains('field')) {
				var domField = event.target;

				if (domField.classList.contains('clicked')) {
					return true;
				}

				var fieldIndex = domField.getAttribute('data-field-index');
				var field = this.getFieldByIndex(fieldIndex);


				field.click();
				field.setType(this.getFieldType(this.playCounter));

				var isWinner = this.isWinner(fieldIndex);

				if (isWinner) {
					return true;
				}

				this.playCounter += 1;

				if (this.playCounter === this.maxFields) {
					global.alert('It\'s a tie');
					this.reset();
				}


			}
		},


		bindEvents: function() {

			this.fieldClickBound = this.fieldClick.bind(this);

			this.ctx.addEventListener('click', this.fieldClickBound);
		},

		getFieldByIndex: function(index) {
			return this.fieldDomMapping[index];
		},

		getFieldType: function(counter) {
			return this.fieldType[counter % 2];
		},

		getColByFieldIndex: function(fieldIndex) {
			return fieldIndex % this.rows;
		},

		getRowByFieldIndex: function(fieldIndex) {
			return Math.floor(fieldIndex / this.rows);
		},

		isWinningRow: function(fieldIndex) {
			var fields = this.getFieldsByRow(this.getRowByFieldIndex(fieldIndex));
			return this.isWinningGroup(fields);
		},

		isWinningCol: function(fieldIndex) {
			var fields = this.getFieldsByCol(this.getColByFieldIndex(fieldIndex));
			return this.isWinningGroup(fields);
		},

		isWinningGroup: function(fields) {

			var type = fields[0].type;

			if (type === null) {
				return false;
			}

			if (fields[0].equals(fields[1]) && fields[0].equals(fields[2])) {
				return type;
			} else {
				return false;
			}

		},

		isWinningDiag: function() {

			var centerField = this.getFieldByIndex(4),
				rows = this.rows;


			if (centerField.isClicked === false) {
				return false;
			}

			var matchType = centerField.type,
				firstDiagCounter = 1,
				secondDiagCounter = 1;

			for (var i = 0; i < rows; i += 2) {

				// First diag
				var field = this.getFieldByIndex(i * rows + i);

				if (field.isClicked && field.type === matchType) {
					firstDiagCounter += 1;
				}

				// Second diag
				field = this.getFieldByIndex(i * rows + ((rows - 1) - i));

				if (field.isClicked && field.type === matchType) {
					secondDiagCounter += 1;
				}
			}

			return (firstDiagCounter === rows || secondDiagCounter === rows);

		},

		isWinner: function(fieldIndex) {

			var type = this.getFieldByIndex(fieldIndex).type;

			// Check row
			if (this.isWinningRow(fieldIndex) !== false || this.isWinningCol(fieldIndex) !== false || this.isWinningDiag(fieldIndex) !== false) {

				global.alert(type + ' wins!');
				
				this.reset();
				return true;
			}

			return false;

		},

		reset: function() {
			this.ctx.removeEventListener('click', this.fieldClickBound);
			this.ctx.innerHTML = '';
			this.prepareGame();
		}

	};

	ns.TicTacToe = TicTacToe;

}(window, window.TJ = window.TJ || {}));