// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */

SC.WYSIWYGCommand = SC.Object.extend({

	action: 'insertImage',

	icon: function() {
		return this.get('action').dasherize();
	}.property().cacheable(),

	toolTip: function() {
		return this.get('action').titleize();
	}.property().cacheable(),

	keyEquivalent: '',

	extendedCommand: NO,

	argument: null,

	execute: function(source, controller) {
		controller.execCommand(this.get('action'), false, this.get('argument'));
	}
});
