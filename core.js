// ==========================================================================
// Framework:   SproutcoreWysiwyg
// Copyright: @2012 Joe Gaudet - joe@learndot.com.
// ==========================================================================
/*globals SC */

/**
 * @namespace
 * 
 * My cool new framework. Describe your framework.
 * 
 * @extends SC.Object
 */
SproutcoreWysiwyg = SC.Object.create(
/** @scope SproutcoreWysiwyg.prototype */
{

	NAMESPACE: 'SproutcoreWysiwyg',
	VERSION: '0.1.0',

	commands: {
		insertImage: {
			action: 'insertImage',
			icon: 'insert-image',
			toolTip: 'Insert Image',
			keyEquivalent: '',
			extendedCommand: true
		},

		embed: {
			action: 'embed',
			icon: 'embed',
			toolTip: 'Embed',
			keyEquivalent: ''
		},

		bold: {
			action: 'bold',
			icon: 'bold',
			toolTip: 'Bold text',
			keyEquivalent: 'ctrl_b'
		},

		italic: {
			action: 'italic',
			icon: 'italic',
			toolTip: 'Italicize text',
			keyEquivalent: 'ctrl_i'
		},

		underline: {
			action: 'underline',
			icon: 'underline',
			toolTip: 'Underline text',
			keyEquivalent: 'ctrl_u'
		},

		insertOrderedList: {
			action: 'insertorderedlist',
			icon: 'insert-ordered-list',
			toolTip: 'Insert an ordered list'
		},

		insertUnorderedList: {
			action: 'insertunorderedlist',
			icon: 'insert-unordered-list',
			toolTip: 'Insert an unordered list'
		},

		justifyLeft: {
			action: 'justifyleft',
			icon: 'justify-left',
			toolTip: 'Left justify text',
			keyEquivalent: 'ctrl_['
		},

		justifyCenter: {
			action: 'justifycenter',
			icon: 'justify-center',
			toolTip: 'Center justify text',
			keyEquivalent: 'ctrl_\\'
		},

		justifyRight: {
			action: 'justifyright',
			icon: 'justify-right',
			toolTip: 'Right justify text',
			keyEquivalent: 'ctrl_]'
		},

		indent: {
			action: 'indent',
			icon: 'indent',
		},

		outdent: {
			action: 'outdent',
			icon: 'outdent',
		}
	}
});
