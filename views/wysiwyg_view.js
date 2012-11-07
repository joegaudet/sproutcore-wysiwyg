// ==========================================================================
// Framework:   SproutcoreWysiwyg
// Copyright: @2012 Joe Gaudet - joe@learndot.com.
// ==========================================================================
/*globals SC */

/**
 * @class
 * 
 * 
 * @extends SC.View
 * @extends SC.Control
 * @author Joe Gaudet - joe@learndot.com
 */
SC.WYSIWYGView = SC.View.extend({

	acceptsFirstResponder: YES,

	classNames: 'sc-wysiwyg-view',

	classNameBindings: [ 'isFirstResponder:focus' ],

	childViews: [ 'toolbar', 'scrollView' ],

	isTextSelectable: YES,

	value: '',

	// Event handlers

	mouseWheel: function(evt) {
		return NO;
	},

	mouseDown: function(evt) {
		evt.allowDefault();
		return YES;
	},

	mouseUp: function(evt) {
		evt.allowDefault();
		return this.get('editor').mouseUp(evt);
	},

	keyUp: function(evt) {
		return this.get('editor').keyUp(evt);
	},

	keyDown: function(evt) {
		return NO;
	},

	focus: function(evt) {
		this.becomeFirstResponder();
	},

	blur: function(evt) {
		this.resignFirstResponder();
	},

	// Toolbar Commands

	executeCommand: function(source) {
		var command = source.get('command');
		if (!command.extendedCommand) {
			this.get('editor').execCommand(command.action, false, command.argument || null);
		} else {
			this[command.action](source, command);
		}
	},

	_popup: function(anchor, popup) {
		popup.create({
			wysiwyg: this
		}).popup(anchor, SC.PICKER_POINTER, [ 2, 0, 1, 3, 2 ]);
	},

	createLink: function(button, commabnd) {
		this._popup(button, this.createLinkPopup);
	},

	createLinkPopup: SC.PickerPane.extend({
		layout: {
			width: 220,
			height: 40
		},
		wysiwyg: null,
		pointerPos: 'perfectTop',
		contentView: SC.View.extend({
			childViews: [ 'url' ],
			url: SC.TextFieldView.extend({
				hint: 'Link Url',
				layout: {
					top: 5,
					right: 5,
					bottom: 5,
					left: 5
				},
				insertNewline: function() {
					var pane = this.get('pane');
					pane.get('wysiwyg').performLink(this.get('value'));
					pane.remove();
				}
			})
		})
	}),

	performLink: function(url) {
		if (url) {
			this.get('editor').execCommand('createLink', false, url);
		}
	},

	insertImage: function(button, command) {
		this._popup(button, this.insertImagePopup);
	},

	performImageInsert: function(url) {
		this.get('editor').execCommand('insertImage', false, url);
	},

	insertImagePopup: SC.PickerPane.extend({
		layout: {
			width: 220,
			height: 40
		},
		wysiwyg: null,
		pointerPos: 'perfectTop',
		contentView: SC.View.extend({
			childViews: [ 'textArea' ],
			textArea: SC.TextFieldView.extend({
				hint: 'Image Url',
				layout: {
					top: 5,
					right: 5,
					bottom: 5,
					left: 5
				},
				insertNewline: function() {
					var pane = this.get('pane');
					pane.get('wysiwyg').performImageInsert(this.get('value'));
					pane.remove();
				}
			})
		})
	}),

	// -------- Views

	/**
	 * 
	 * Pointer to the editorView, which is set to the contentView of the
	 * ScrollPane
	 * 
	 * @property {SC.WYSIWYGEditorView}
	 */
	editor: SC.outlet('scrollView.contentView'),

	/**
	 * The toolbar that will be used for this view.
	 * 
	 * @property {SC.WYSIWYGToolbarView}
	 */
	toolbar: SC.WYSIWYGToolbarView.extend({
		wysiwygView: SC.outlet('parentView'),

		// Wire up the is<command> properties
		isBoldBinding: SC.Binding.oneWay('.wysiwygView.editor.isBold'),
		isItalicBinding: SC.Binding.oneWay('.wysiwygView.editor.isItalic'),
		isUnderlineBinding: SC.Binding.oneWay('.wysiwygView.editor.isUnderline'),
		isJustifyLeftBinding: SC.Binding.oneWay('.wysiwygView.editor.isJustifyLeft'),
		isJustifyCenterBinding: SC.Binding.oneWay('.wysiwygView.editor.isJustifyCenter'),
		isJustifyRightBinding: SC.Binding.oneWay('.wysiwygView.editor.isJustifyRight'),
		isJustifyFullBinding: SC.Binding.oneWay('.wysiwygView.editor.isJustifyFull'),
		currentStyleBinding: SC.Binding.oneWay('.wysiwygView.editor.currentStyle'),
	}),

	/**
	 * Container for the editor view
	 * 
	 * @property {SC.ScrollView}
	 */
	scrollView: SC.ScrollView.extend({

		layout: {
			top: 32,
			right: 0,
			bottom: 0,
			left: 0
		},

		contentView: SC.WYSIWYGEditorView.extend({

			wysiwygView: SC.outlet('parentView.parentView.parentView'),

			valueBinding: '.wysiwygView.value',

			minHeightBinding: SC.Binding.transform(function(frame) {
				return frame ? frame.height : 0;
			}).oneWay('.parentView.parentView.frame'),

			/**
			 * Extended to support
			 */
			keyUp: function(evt) {
				var ret = sc_super();
				var anchorNode = this.get('document').getSelection().anchorNode;
				if (anchorNode && anchorNode.parentNode) {
					var $node = SC.$(anchorNode.parentNode);
					var position = $node.position();
					this.getPath('parentView.parentView').scrollTo(0, position.top + $node.height());
				}
				return ret;
			},

			/**
			 * Override the default behavior of the editor grabbing focus and
			 * let the wysiwyg view manage it.
			 */
			focus: function(evt) {
				this.get('wysiwygView').focus(evt);
			},

			/**
			 * Override the default behavior of the editor grabbing focus
			 */
			blur: function(evt) {
				this.get('wysiwygView').blur(evt);
			}
		})
	})

});