SC.WYSIWYGView = SC.View.extend(SC.ContentValueSupport, {

	contentKeys: {
		contentValueKey: 'value',
		contentErrorKey: 'error',
		contentIsInErrorKey: 'isInError'
	},

	classNameBindings: [ 'hasFirstResponder:focus' ],

	classNames: 'sc-wysiwyg-view',

	childViews: [ 'toolbar', 'editor' ],

	isTextSelectable: YES,

	buttons: [ 'formatting', '|', 'bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', 'outdent', 'indent', '|', 'image', 'table', 'link', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'horizontalrule' ],

	/**
	 * If this control is a fixed height, or grows in height to fit the content
	 */
	fixedHeight: YES,

	/**
	 * URL - that images are uploaded to
	 */
	imageUploadUrl: Matygo.config.apiPrefix + 'files/upload/public',

	/**
	 * URL - that files are uploaded to
	 */
	fileUploadUrl: Matygo.config.apiPrefix + 'files/upload/public',

	toolbar: SC.ToolbarView.extend(SC.FlowedLayout, {

		flowPadding: {
			top: 2,
			left: 2
		},

		flowSpacing: {
			right: 2
		},

		anchorLocation: SC.ANCHOR_TOP,
		classNames: 'silver-toolbar top',

		buttons: [ {
			title: 'B',
			command: 'bold'
		}, {
			title: 'I',
			command: 'italic'
		}, {
			title: 'U',
			command: 'underline'
		}, {
			title: 'OL',
			command: 'insertorderedlist'
		}, {
			title: 'UL',
			command: 'insertunorderedlist'
		}, {
			title: 'JL',
			command: 'justifyleft'
		}, {
			title: 'JC',
			command: 'justifycenter'
		}, {
			title: 'JR',
			command: 'justifyright'
		} ],

		init: function() {
			var self = this;
			var childViews = [];
			this.buttons.forEach(function(button) {
				self[button.command] = Matygo.ButtonView.extend({
					title: button.title,
					action: function() {
						this.getPath('parentView.parentView.editor').execCommand(button.command, false, null);
					}
				});
				childViews.push(button.command);
			});
			this.childViews = childViews;
			sc_super();
		}

	}),

	editor: SC.View.extend({

		layout: {
			top: 32,
			right: 0,
			bottom: 0,
			left: 0
		},

		classNames: 'sc-wysiwyg-editor',

		attributeBindings: [ 'frameborder', 'width', 'height' ],

		tagName: 'iframe',

		frameborder: 0,

		didCreateLayer: function() {
			this.invokeLater(function() {
				var doc = this.get('document');
				docu = doc;
				doc.designMode = "on";
				doc.execCommand("styleWithCSS", true, null);

				// find the style sheet for this frame, and mess
				// with it.
				var sheets = document.styleSheets;
				for ( var i = 0; i < sheets.length; i++) {
					var sheet = sheets[i];
					if (sheet.href && sheet.href.match(/wysiwyg/)) {
						var cssLink = doc.createElement("link");
						cssLink.href = sheet.href;
						cssLink.rel = "stylesheet";
						cssLink.type = "text/css";
						doc.head.appendChild(cssLink);
						doc.body.className = "sc-wysiwyg";
						break;
					}
				}
				// insert some place holder shit
				var ret = $(doc.body).append("<p> <br/></p>");

				console.log(ret);

				var self = this;

				// wire up events - probaby

				$(doc.body).focus(function() {
					Unicorn.mainPage.mainPane.makeFirstResponder(self);
				});

				$(doc.body).keydown(function(evt) {
					self.keyDown(evt);
				});

				$(doc.body).keyup(function(evt) {
					self.keyUp(evt);
				});
			}, 1000);

			boogah = this;
		},

		document: function() {
			return this.$()[0].contentDocument;
		}.property().cacheable(),

		width: function() {
			return this.get('frame').width;
		}.property('frame').cacheable(),

		height: function() {
			return this.get('frame').height;
		}.property('frame').cacheable(),

		execCommand: function(commandName, showDefaultUI, value) {
			SC.debug("Exec Command: " + commandName);
			this.get('document').execCommand(commandName, showDefaultUI, value);
		},

		didBecomeFirstResponder: function(responder) {

		},

		willLoseFirstResponder: function(responder) {

		},

		mouseWheel: function(evt) {
			return YES;
		},

		mouseDown: function(evt) {
			return YES;
		},

		mouseUp: function(evt) {
			return YES;
		},

		keyUp: function(evt) {
			// we don't allow regular returns because they are
			// divs we want paragraphs
			if (evt.keyCode === SC.Event.KEY_RETURN) {
				var el = this._formatElement($(this.get('document').getSelection().anchorNode), 'p');
				this._selectElement(el);
			}
			return YES;
		},

		keyDown: function(evt) {
			return YES;
		},

		/**
		 * Changes the format of an element note this is breaks the undo/redo
		 * stack so be ok with command+z
		 * 
		 * @param $element
		 * @param tagName
		 * @returns
		 */
		_formatElement: function($element, tagName) {
			var newElement = $('<' + tagName + '/>').append($element.clone().get(0).childNodes);
			$element.replaceWith(newElement);
			return newElement;
		},

		/**
		 * Selects the provided element
		 * 
		 * @param $element
		 */
		_selectElement: function($element) {
			if (window.getSelection) {
				var sel = window.getSelection();
				sel.removeAllRanges();
				var range = document.createRange();
				range.selectNodeContents($element[0]);
				sel.addRange(range);
			} else if (document.selection) {
				var textRange = document.body.createTextRange();
				textRange.moveToElementText($element[0]);
				textRange.select();
			}
		}

	// _updateValue: function(obj) {
	// this._ignore = true;
	// this.set('value', obj.getCode());
	// if (!this.get('fixedHeight')) this.adjust('height',
	// self.$('.redactor_box').height() - this._magicOffset);
	// },
	//
	// valueDidChange: function() {
	// // lets see if this is the problem
	// if (this._redactor) {
	// if (!this._ignore && this.get('value') != null) {
	// this._redactor.setCode(this.get('value'));
	// }
	// this._ignore = false;
	// }
	// }.observes('value'),

	})

});