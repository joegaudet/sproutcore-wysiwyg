SC.WYSIWYGToolbarView = SC.ToolbarView.extend(SC.FlowedLayout, {

	classNames: 'sc-wysiwyg-toolbar',

	wysiwygView: null,

	buttons: [ 'styles', 'insertImage', 'embed', 'link', 'bold', 'italic', 'underline', 'insertOrderedList', 'insertUnorderedList', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent' ],

	flowPadding: {
		top: 4,
		left: 4,
		right: 4
	},

	defaultFlowSpacing: {
		right: 4
	},

	anchorLocation: SC.ANCHOR_TOP,

	buttonHeight: 24,

	init: function() {
		this._initButtons();
		sc_super();
	},

	_initButtons: function() {
		var self = this, childViews = this.childViews.copy(), buttonHeight = self.get('buttonHeight');

		// Add the default buttons

		this.buttons.forEach(function(button) {
			var buttonClass = self[button], command = SproutCoreWysiwyg.commands[button];

			if (!buttonClass) buttonClass = SC.ButtonView;

			if (buttonClass === SC.ButtonView) {
				self[button] = buttonClass.extend({
					layout: {
						height: buttonHeight,
						width: 30
					},
					icon: command.get('icon'),
					command: command,
					toolTip: command.get('toolTip'),
					action: 'executeCommand',
					target: SC.outlet('parentView.wysiwygView'),
					keyEquivalent: command.get('keyEquivalent'),
					isSelectedBinding: SC.Binding.oneWay('.parentView.is' + button.capitalize())
				});
			}

			childViews.push(button);
		});
		this.childViews = childViews;
	},

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

		currentStyleBinding: SC.Binding.oneWay('.parentView.currentStyle'),
		currenStyleDidChange: function() {
			this._ignoreChange = true;
			this.set('value', this.get('currentStyle'));
		}.observes('currentStyle'),

		valueDidChange: function() {
			var value = this.get('value');
			if (value && !this._ignoreChange) {
				this.command = {
					action: 'formatBlock',
					argument: '<%@>'.fmt(value.toUpperCase())
				};
				this.getPath('parentView.wysiwygView').executeCommand(this);
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