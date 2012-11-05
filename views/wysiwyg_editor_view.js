SC.WYSIWYGEditorView = SC.View.extend(SC.Control, {

	acceptsFirstResponder: YES,

	classNames: 'sc-wysiwyg-editor',

	attributeBindings: [ 'frameborder', 'width', 'height', 'scrolling' ],

	tagName: 'iframe',

	frameborder: 0,

	_updateStyles: NO,

	/**
	 * Whether or not this view uses native scrolling
	 */
	useNativeScrolling: NO,

	scrolling: function() {
		return this.get('useNativeScrolling') ? 'yes' : 'no';
	}.property('useNativeScrolling'),

	minHeight: 200,

	carriageReturnText: '<p><br /></p>',

	/**
	 * Pointer to the document inside of the iFrame
	 */
	document: function() {
		return this.$()[0].contentDocument;
	}.property().cacheable(),

	/**
	 * Pointer to the document inside of the iFrame
	 */
	window: function() {
		return this.$()[0].contentWindow;
	}.property().cacheable(),

	width: function() {
		return this.get('frame').width;
	}.property('frame').cacheable(),

	height: function() {
		return this.get('frame').height;
	}.property('frame').cacheable(),

	/**
	 * 
	 */
	isBold: function() {
		return this.queryCommandState('bold');
	}.property('_updateStyles'),

	isItalic: function() {
		return this.queryCommandState('italic');
	}.property('_updateStyles'),

	isUnderline: function() {
		return this.queryCommandState('underline');
	}.property('_updateStyles'),

	isJustifyleft: function() {
		return this.queryCommandState('justifyleft');
	}.property('_updateStyles'),

	isJustifycenter: function() {
		return this.queryCommandState('justifycenter');
	}.property('_updateStyles'),

	isJustifyright: function() {
		return this.queryCommandState('justifyright');
	}.property('_updateStyles'),

	/**
	 * On create of the layer we bind to the iframe load event so we can set up
	 * our editor
	 */
	didCreateLayer: function() {
		SC.Event.add(this.$(), 'load', this, this.iframeDidLoad);
	},

	/**
	 * Clean up the load events
	 */
	didDestroyLayer: function() {
		SC.Event.remove(this.$(), 'load', this, this.iframeDidLoad);
	},

	_value: '',

	_changeByEditor: false,

	init: function() {
		sc_super();
		this._value = this.get('carriageReturnText');
	},

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

	domValueDidChange: function() {
		// get the value from the inner document
		this._changeByEditor = true;
		this.set('value', this.get('document').body.innerHTML);
		this.notifyPropertyChange('_updateStyles');
	},

	iframeDidLoad: function() {

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

		// load the intial value and select the first shild
		var $body = this.$(doc.body);
		$body.append(this.get('value'));
		this._selectElement($body.children().first());

		this._setupEvents();
	},

	/**
	 * We need to attach the iFrame to the RootResponder for maximum SC
	 * compatibility sexiness
	 */
	_setupEvents: function() {
		// handle basic events
		var doc = this.get('document'), window = this.get('window');
		var responder = SC.RootResponder.responder;

		// TODO: remove these to prevent memory leaks
		responder.listenFor([ 'keydown', 'keyup', 'beforedeactivate', 'mousedown', 'mouseup', 'click', 'dblclick', 'mousemove', 'selectstart', 'contextmenu' ], doc);

		// focus wire up the focus
		if (SC.browser.isIE8OrLower) {
			SC.Event.add(window, 'focusin', this, this.focus);
			SC.Event.add(window, 'focusin', this, this.blur);
		} else {
			SC.Event.add(window, 'focus', this, this.focus);
			SC.Event.add(window, 'blur', this, this.blur);
		}
	},

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

	focus: function() {
		this.becomeFirstResponder();
	},

	blur: function() {
		this.resignFirstResponder();
	},

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
		this.get('document').execCommand(commandName, showDefaultUI, value);
		this.domValueDidChange();
	},

	queryCommandState: function(commandName) {
		return this.get('document').queryCommandState(commandName);
	},

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

				this.domValueDidChange();
			}
		} else if (document.selection && document.selection.type != "Control") {
			document.selection.createRange().pasteHTML(html);
			this.domValueDidChange();
		}
	},

	insertImage: function(url) {
		this.insertHtmlHtmlAtCaret('<img src="%@" width="100%" height="auto" />'.fmt(url));
	},

	mouseWheel: function(evt) {
		return this.get('useNativeScrolling');
	},

	mouseDown: function(evt) {
		evt.allowDefault();
		return YES;
	},

	mouseUp: function(evt) {
		evt.allowDefault();
		this.notifyPropertyChange('_updateStyles');
		return YES;
	},

	// TODO: This is a mess.
	keyUp: function(evt) {
		var doc = this.get('document');
		// we don't allow regular returns because they are
		// divs we want paragraphs
		if (evt.keyCode === SC.Event.KEY_RETURN) {
			var node = doc.getSelection().anchorNode;
			// if this carriage return inserted a div
			// lets reformat it to a paragraph
			if (node.nodeName === "DIV") {
				var el = this._formatElement($(node), 'p');
				this._selectElement(el);
			}
		}

		this.domValueDidChange();

		// if we don't use native scrolling we need to update the frame size
		// based on doc size.
		if (!this.get('useNativeScrolling')) {
			// this could probably be done better
			var lastNode = SC.$(docu.body).children().last();
			// if we've deleted all of those nodes. lets put the empty one
			// in
			if (lastNode.length === 0) {
				SC.$(doc.body).html(this.get('carriageReturnText'));
				lastNode = SC.$(docu.body).children().last();

				this.domValueDidChange();
			}
			var calcHeight = lastNode.offset().top + lastNode.height();
			this.adjust('height', Math.max(calcHeight, this.get('minHeight')));
		}
		this.notifyPropertyChange('_updateStyles');
		evt.allowDefault();

		return YES;
	},

	keyDown: function(evt) {
		evt.allowDefault();
		return YES;
	},

	/**
	 * Reformats
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
	 * Selects the provided element in the views iFrame
	 * 
	 * @param $element
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
	}

});