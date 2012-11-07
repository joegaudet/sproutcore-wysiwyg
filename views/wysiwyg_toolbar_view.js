// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('delegates/wysiwyg_toolbar_view_delegate');

SC.WYSIWYGToolbarView = SC.ToolbarView.extend(SC.WYSIWYGToolbarViewDelegate, SC.FlowedLayout, {

	classNames: 'sc-wysiwyg-toolbar',

	controller: null,

	flowPadding: {
		top: 4,
		left: 4,
		right: 4
	},

	defaultFlowSpacing: {
		right: 4
	},

	anchorLocation: SC.ANCHOR_TOP,

	init: function() {
		sc_super();
		this.invokeDelegateMethod(this.get('viewDelegate'), 'initButtons');
	},

	delegate: null,

	viewDelegate: function() {
		return this.delegateFor('isWYSIWYGToolbarViewDelegate', this.get('delegate'));
	}.property('_viewDelegate'),

	styles: SC.SelectView.extend({

		/**
		 * Prevent this field from stealing focus from the toolber
		 */
		acceptsFirstResponder: NO,

		isDefaultPosition: YES,

		layout: {
			width: 120,
			height: 24
		},

		itemTitleKey: 'title',
		itemValueKey: 'value',

		items: SproutCoreWysiwyg.styles.map(function(values) {
			return SC.Object.create(values);
		}),

		escapeHTML: NO,

		currentStyleBinding: SC.Binding.oneWay('.parentView.controller.currentStyle'),
		currenStyleDidChange: function() {
			this._ignoreChange = true;
			this.set('value', this.get('currentStyle'));
		}.observes('currentStyle'),

		valueDidChange: function() {
			var value = this.get('value');
			if (value && !this._ignoreChange) {
				this.command.set('argument', '<%@>'.fmt(value.toUpperCase()));
				var controller = this.getPath('parentView.controller');
				if (controller) controller.invokeCommand(this);
			}
			this._ignoreChange = false;
		}.observes('value'),

		exampleView: SC.MenuItemView.extend({
			escapeHTML: NO,
			classNames: 'sc-wysiwyg-menu-item'
		}),

		_action: function() {
			sc_super();
			this.menu.adjust('width', 190);
		}
	})

});
