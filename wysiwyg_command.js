SC.WYSIWYGCommand = SC.Object.extend({

	action: 'insertImage',

	icon: function() {
		return this.get('action').dasherize();
	}.property().cacheable(),

	toolTip: function() {
		return this.get('action').titleize();
	}.property().cacheable(),

	keyEquivalent: '',

	extendedCommand: NO
});