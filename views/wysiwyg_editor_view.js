// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
// Framework:   SproutcoreWysiwyg
/**
 * @class
 * 
 * View class responsible for encapsulating the RTE editor built into modern
 * browsers.
 * 
 * https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
 * http://msdn.microsoft.com/en-us/library/ms536419(v=vs.85).aspx
 * https://dvcs.w3.org/hg/editing/raw-file/tip/editing.html
 * 
 * @extends SC.View
 * @extends SC.Control
 * @author Joe Gaudet - joe@learndot.com
 */
SC.WYSIWYGEditorView = SC.View.extend(SC.Control,
/** @scope SC.WYSIWYGEditorView.prototype */
{

	classNames: 'sc-wysiwyg-editor',

	tagName: 'iframe',

	/**
	 * bind the tag attributes to the the following properties
	 */
	attributeBindings: [ 'frameborder', 'width', 'height', 'scrolling' ],

	/**
	 * Cause it's ugly.
	 */
	frameborder: 0,

	/**
	 * @property {Number} used to map the width of the frame to the width of the
	 *           iframe keeping them consistent
	 */
	width: function() {
		return this.get('frame').width;
	}.property('frame').cacheable(),

	/**
	 * @property {Number} used to map the height of the frame to the width of
	 *           the iframe keeping them consistent
	 */
	height: function() {
		return this.get('frame').height;
	}.property('frame').cacheable(),

	scrolling: 'no',

	/**
	 * Min height of the frame
	 */
	minHeight: 200,

	/**
	 * Text to be entered on a carraige return
	 */
	carriageReturnText: '<p><br /></p>',

	init: function() {
		sc_super();
		this._value = this.get('carriageReturnText');
	},

	/**
	 * Pointer to the window inside of the iFrame
	 */
	window: function() {
		if (!this._window) this._window = this.$()[0].contentWindow;
		return this._window;
	}.property(),

	/**
	 * Pointer to the document inside of the iFrame
	 */
	document: function() {
		if (!this._document) this._document = this.$()[0].contentDocument;
		return this._document;
	}.property(),

	/**
	 * Executes a command against the iFrame:
	 * 
	 * https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
	 * http://msdn.microsoft.com/en-us/library/ms536419(v=vs.85).aspx
	 * https://dvcs.w3.org/hg/editing/raw-file/tip/editing.html
	 * 
	 * @param commandName
	 * @param showDefaultUI
	 * @param value
	 */
	execCommand: function(commandName, showDefaultUI, value) {
		var ret = this.get('document').execCommand(commandName, showDefaultUI, value);
		this._domValueDidChange();
		return ret;
	},

	/**
	 * Determines whether or not a commandHasBeen executed at the current
	 * selection.
	 * 
	 * @param commandName
	 * @returns {Boolean}
	 */
	queryCommandState: function(commandName) {
		var document = this.get('document');
		return document && document.queryCommandState(commandName);
	},
	/**
	 * Determines whether or not a commandHasBeen executed at the current
	 * selection.
	 * 
	 * @param commandName
	 * @returns {Boolean}
	 */
	queryCommandValue: function(commandName) {
		var document = this.get('document');
		return document && document.queryCommandValue(commandName);
	},

	/**
	 * Insert some html at the current caret position
	 * 
	 * @param html
	 *            {String} html to be inserted
	 */
	insertHtmlHtmlAtCaret: function(html) {
		var document = this.get('document'), window = this.get('window'), sel, range;
		if (document.getSelection) {
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
				var el = document.createElement("div");
				el.innerHTML = html;
				var frag = document.createDocumentFragment(), node = null, lastNode = null;
				while (node = el.firstChild) {
					lastNode = frag.appendChild(node);
				}
				range.insertNode(frag);

				if (lastNode) {
					range = range.cloneRange();
					range.setStartAfter(lastNode);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);
				}

				this._domValueDidChange();
			}
		} else if (document.selection && document.selection.type != "Control") {
			document.selection.createRange().pasteHTML(html);
			this._domValueDidChange();
		}
	},

	/**
	 * Reformats
	 * 
	 * @param $element
	 * @param tagName
	 * @private
	 * @returns
	 */
	_formatElement: function($element, tagName) {
		var newElement = $('<' + tagName + '/>').append($element.clone().get(0).childNodes);
		$element.replaceWith(newElement);
		return newElement;
	},

	/**
	 * Selects the provided element in the views iFrame
	 * 
	 * @param $element
	 * @private
	 */
	_selectElement: function($element) {
		var contentWindow = this.get('window');
		if (contentWindow.getSelection) {
			var sel = contentWindow.getSelection();
			sel.removeAllRanges();
			var range = document.createRange();
			range.selectNodeContents($element[0]);
			sel.addRange(range);
		} else if (contentWindow.document.selection) {
			var textRange = contentWindow.document.body.createTextRange();
			textRange.moveToElementText($element[0]);
			textRange.select();
		}
	},

	_value: '',

	/**
	 * Whether or not the value has been changed by the editor
	 * 
	 * @property {Boolean}
	 * @private
	 */
	_changeByEditor: false,

	/**
	 * @property {String} html document inside of the editor
	 */
	value: function(key, value) {
		if (value !== undefined) {
			// SET
			if (value) {
				if (!this._changeByEditor) {
					this.$(this.get('document').body).html(value);
				}
			} else {
				value = this.get('carriageReturnText');
			}
			this._value = value;
			this._changeByEditor = false;
		} else {
			// GET
			value = this._value;
		}
		return value;
	}.property().idempotent(),

	/**
	 * @private notify the dom that values have been updated.
	 */
	_domValueDidChange: function() {
		// get the value from the inner document
		this._changeByEditor = true;
		this.set('value', this.get('document').body.innerHTML);
	},

	/**
	 * On create of the layer we bind to the iframe load event so we can set up
	 * our editor
	 */
	didCreateLayer: function() {
		SC.Event.add(this.$(), 'load', this, this._iframeDidLoad);
	},

	/**
	 * Clean up the load events
	 */
	didDestroyLayer: function() {
		SC.Event.remove(this.$(), 'load', this, this._iframeDidLoad);
		this._teardownEvents();
	},

	/**
	 * We need to attach the iFrame to the RootResponder for maximum SC
	 * compatibility sexiness
	 * 
	 * @private
	 */
	_setupEvents: function() {
		// handle basic events
		var window = this.get('window');

		var responder = SC.RootResponder.responder;

		// TODO: remove these to prevent memory leaks
		responder.listenFor([ 'keydown', 'keyup', 'beforedeactivate', 'mousedown', 'mouseup', 'click', 'dblclick', 'mousemove', 'selectstart', 'contextmenu' ], window);

		// focus wire up the focus
		if (SC.browser.isIE8OrLower) {
			SC.Event.add(window, 'focusin', this, this.focus);
			SC.Event.add(window, 'focusin', this, this.blur);
		} else {
			SC.Event.add(window, 'focus', this, this.focus);
			SC.Event.add(window, 'blur', this, this.blur);
		}
	},

	/**
	 * Tear down the events that we added at init
	 * 
	 * @private
	 */
	_teardownEvents: function() {
		var window = this.get('window');

		// focus wire up the focus
		if (SC.browser.isIE8OrLower) {
			SC.Event.remove(window, 'focusin', this, this.focus);
			SC.Event.remove(window, 'focusin', this, this.blur);
		} else {
			SC.Event.remove(window, 'focus', this, this.focus);
			SC.Event.remove(window, 'blur', this, this.blur);
		}
	},

	/**
	 * Called once the internal iframe has loaded, sets the document to editor
	 * mode.
	 * 
	 * @private
	 * @param evt
	 */
	_iframeDidLoad: function(evt) {
		var doc = this.get('document');
		if (!doc) return;
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

		// load the intial value and select the first shild
		var $body = this.$(doc.body);
		$body.append(this.get('value'));
		this._selectElement($body.children().first());

		this._setupEvents();
	},

	mouseWheel: function(evt) {
		return NO;
	},

	mouseDown: function(evt) {
		evt.allowDefault();
		return YES;
	},

	mouseUp: function(evt) {
		evt.allowDefault();
		return YES;
	},

	// TODO: This is a mess -- needs to have more well partitioned
	// responsibilities
	keyUp: function(evt) {
		var doc = this.get('document');
		// we don't allow regular returns because they are
		// divs we want paragraphs
		if (evt.keyCode === SC.Event.KEY_RETURN) {
			if (this.queryCommandValue('formatBlock') === 'div') {
				this.execCommand('formatBlock', null, 'p');
			}
		}

		// if we don't use native scrolling we need to update the frame size
		// based on doc size.
		// this could probably be done better
		var lastNode = SC.$(doc.body).children().last();
		// if we've deleted all of those nodes. lets put the empty one
		// in
		if (lastNode.length === 0) {
			SC.$(doc.body).html(this.get('carriageReturnText'));
			lastNode = SC.$(doc.body).children().last();
			this._domValueDidChange();
		}
		var calcHeight = lastNode.offset().top + lastNode.height();
		this.adjust('height', Math.max(calcHeight, this.get('minHeight')));

		this._domValueDidChange();

		return YES;
	},

	keyDown: function(evt) {
		evt.allowDefault();
		return YES;
	}

});
