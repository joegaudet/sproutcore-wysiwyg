// ==========================================================================
// Framework:   SproutCoreWysiwyg
// Copyright: @2012 Joe Gaudet - joe@learndot.com.
// ==========================================================================
/*globals SC */
sc_require('wysiwyg_command');
/**
 * @namespace
 * 
 * My cool new framework. Describe your framework.
 * 
 * @extends SC.Object
 */
SproutCoreWysiwyg = SC.Object.create(
/** @scope SproutcoreWysiwyg.prototype */
{

	NAMESPACE: 'SproutcoreWysiwyg',
	VERSION: '0.1.0',

	commands: {
		insertImage: SC.WYSIWYGCommand.create({
			action: 'insertImage',
			extendedCommand: true
		}),

		embed: SC.WYSIWYGCommand.create({
			action: 'embed',
			keyEquivalent: '',
			extendedCommand: true
		}),

		link: SC.WYSIWYGCommand.create({
			action: 'createLink',
			toolTip: 'Insert a link',
			keyEquivalent: 'ctrl_l',
			extendedCommand: true
		}),

		bold: SC.WYSIWYGCommand.create({
			action: 'bold',
			toolTip: 'Bold text',
			keyEquivalent: 'ctrl_b'
		}),

		italic: SC.WYSIWYGCommand.create({
			action: 'italic',
			toolTip: 'Italicize text',
			keyEquivalent: 'ctrl_i'
		}),

		underline: SC.WYSIWYGCommand.create({
			action: 'underline',
			toolTip: 'Underline text',
			keyEquivalent: 'ctrl_u'
		}),

		insertOrderedList: SC.WYSIWYGCommand.create({
			action: 'insertOrderedList',
			toolTip: 'Insert an ordered list'
		}),

		insertUnorderedList: SC.WYSIWYGCommand.create({
			action: 'insertUnorderedList',
			toolTip: 'Insert an unordered list'
		}),

		justifyLeft: SC.WYSIWYGCommand.create({
			action: 'justifyLeft',
			toolTip: 'Left justify text',
			keyEquivalent: 'ctrl_['
		}),

		justifyCenter: SC.WYSIWYGCommand.create({
			action: 'justifyCenter',
			toolTip: 'Center justify text',
			keyEquivalent: 'ctrl_\\'
		}),

		justifyRight: SC.WYSIWYGCommand.create({
			action: 'justifyRight',
			toolTip: 'Right justify text',
			keyEquivalent: 'ctrl_]'
		}),

		justifyFull: SC.WYSIWYGCommand.create({
			action: 'justifyFull',
			toolTip: 'Justify text'
		}),

		indent: SC.WYSIWYGCommand.create({
			action: 'indent'
		}),

		outdent: SC.WYSIWYGCommand.create({
			action: 'outdent'
		})
	},

	styles: [ {
		title: 'Paragraph',
		value: 'p',
		height: 20
	}, {
		title: '<h1>Heading 1</h1>',
		value: 'h1',
		height: 40
	}, {
		title: '<h2>Heading 2</h2>',
		value: 'h2',
		height: 35
	}, {
		title: '<h3>Heading 3</h3>',
		value: 'h3',
		height: 35
	}, {
		title: '<h4>Heading 4</h4>',
		value: 'h4',
		height: 30
	}, {
		title: '<h5>Heading 5</h5>',
		value: 'h5',
		height: 24
	}, {
		title: '<h6>Heading 6</h6>',
		value: 'h6',
		height: 20
	} ]
});
