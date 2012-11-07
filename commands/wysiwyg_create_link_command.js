// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('commands/wysiwyg_command');
sc_require('commands/wysiwyg_command_factory');
sc_require('commands/wysiwyg_picker_command_support');
sc_require('panes/wysiwyg_link_picker_pane');

SC.WYSIWYGCreateLinkCommand = SC.WYSIWYGCommand.extend(SC.WYSIWYGPickerCommandSupport, {

	action: 'createLink',

	url: '',

	toolTip: 'Insert a link',

	keyEquivalent: 'ctrl_l',

	pickerPane: SC.WYSIWYGLinkPickerPane,

	execute: function(source, controller) {
		this._popup(source, controller);
	},

	commitCommand: function(controller) {
		controller.execCommand('createLink', false, this.get('url'));
	}

});
SC.WYSIWYGCommandFactory.registerCommand('link', SC.WYSIWYGCreateLinkCommand);
