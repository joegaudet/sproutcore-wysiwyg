SC.WYSIWYGToolbarView = SC.ToolbarView.extend(SC.FlowedLayout, {

	classNames: 'sc-wysiwyg-toolbar',

	wysiwygView: null,

	buttons: [ 'styles', 'insertImage', 'embed', 'bold', 'italic', 'underline', 'insertOrderedList', 'insertUnorderedList', 'justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent' ],

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
			var buttonClass = self[button], command = SproutcoreWysiwyg.commands[button];

			if (!buttonClass) buttonClass = SC.ButtonView;

			if (buttonClass === SC.ButtonView) {
				self[button] = buttonClass.extend({
					layout: {
						height: buttonHeight,
						width: 30
					},
					icon: command.icon,
					command: command,
					toolTip: command.toolTip,
					action: 'executeCommand',
					target: SC.outlet('parentView.wysiwygView'),
					keyEquivalent: command.keyEquivalent,
					isSelectedBinding: SC.Binding.oneWay('.parentView.is' + button.capitalize())
				});
			}

			childViews.push(button);
		});
		this.childViews = childViews;
	},

	styles: SC.SelectView.extend({
		layout: {
			width: 120,
			height: 24
		},
		itemTitleKey: 'title',
		itemValueKey: 'value',
		items: [ {
			title: 'Paragraph',
			value: '<P>'
		}, {
			title: 'Heading 1',
			value: '<H1>'
		}, {
			title: 'Heading 2',
			value: '<H2>'
		}, {
			title: 'Heading 3',
			value: '<H3>'
		}, {
			title: 'Heading 4',
			value: '<H4>'
		}, {
			title: 'Heading 5',
			value: '<H5>'
		}, {
			title: 'Heading 6',
			value: '<H6>'
		} ].map(function(values) {
			return SC.Object.create(values);
		})
	})

});