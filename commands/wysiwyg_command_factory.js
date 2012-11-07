// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('commands/wysiwyg_command');

SC.WYSIWYGCommandFactory = SC.Object.create({

	commandFor: function(key) {
		var klass = this.get(key);
		return klass ? klass.create() : klass;
	},

	registerCommand: function(key, klass) {
		this.set(key, klass);
	},

	bold: SC.WYSIWYGCommand.extend({
		action: 'bold',
		toolTip: 'Bold text',
		keyEquivalent: 'ctrl_b'
	}),

	italic: SC.WYSIWYGCommand.extend({
		action: 'italic',
		toolTip: 'Italicize text',
		keyEquivalent: 'ctrl_i'
	}),

	underline: SC.WYSIWYGCommand.extend({
		action: 'underline',
		toolTip: 'Underline text',
		keyEquivalent: 'ctrl_u'
	}),

	insertOrderedList: SC.WYSIWYGCommand.extend({
		action: 'insertOrderedList',
		toolTip: 'Insert an ordered list'
	}),

	insertUnorderedList: SC.WYSIWYGCommand.extend({
		action: 'insertUnorderedList',
		toolTip: 'Insert an unordered list'
	}),

	justifyLeft: SC.WYSIWYGCommand.extend({
		action: 'justifyLeft',
		toolTip: 'Left justify text',
		keyEquivalent: 'ctrl_['
	}),

	justifyCenter: SC.WYSIWYGCommand.extend({
		action: 'justifyCenter',
		toolTip: 'Center justify text',
		keyEquivalent: 'ctrl_\\'
	}),

	justifyRight: SC.WYSIWYGCommand.extend({
		action: 'justifyRight',
		toolTip: 'Right justify text',
		keyEquivalent: 'ctrl_]'
	}),

	justifyFull: SC.WYSIWYGCommand.extend({
		action: 'justifyFull',
		toolTip: 'Justify text'
	}),

	indent: SC.WYSIWYGCommand.extend({
		action: 'indent'
	}),

	outdent: SC.WYSIWYGCommand.extend({
		action: 'outdent'
	}),

	styles: SC.WYSIWYGCommand.extend({
		action: 'formatBlock',
		toolTile: 'Format text'
	})
});
console.log("Yo");