// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('commands/wysiwyg_command');
sc_require('commands/wysiwyg_picker_command_support');
sc_require('panes/wysiwyg_image_picker_pane');

SC.WYSIWYGInsertImageCommand = SC.WYSIWYGCommand.extend(SC.WYSIWYGPickerCommandSupport, {

	action: 'insertImage',

	url: '',

	pickerPane: SC.WYSIWYGImagePickerPane,

	execute: function(source, controller) {
		this._popup(source, controller);
	},

	commitCommand: function(controller) {
		controller.execCommand('insertImage', false, this.get('url'));
	}

});
SC.WYSIWYGCommandFactory.registerCommand('insertImage', SC.WYSIWYGInsertImageCommand);
