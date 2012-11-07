// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
SC.WYSIWYGPickerCommandSupport = {

	pickerPane: null,

	_popup: function(anchor, controller) {
		if (this.pickerPane) this.pickerPane.create({
			controller: controller,
			command: this
		}).popup(anchor, SC.PICKER_POINTER, [ 2, 3, 0, 1, 2 ]);
	}
};
