SC.WYSIWYGToolbarView = SC.ToolbarView.extend(SC.FlowedLayout, {

	classNames: 'sc-wysiwyg-toolbar',

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

	buttons: [ {
		command: 'bold'
	}, {
		command: 'italic'
	}, {
		command: 'underline'
	}, {
		command: 'insertorderedlist'
	}, {
		command: 'insertunorderedlist'
	}, {
		command: 'justifyleft'
	}, {
		command: 'justifycenter'
	}, {
		command: 'justifyright'
	}, {
		command: 'indent'
	}, {
		command: 'outdent'
	} ],

	childViews: [ 'embedButton', 'imageButton' ],

	init: function() {
		var self = this, childViews = this.childViews.copy(), buttonHeight = self.get('buttonHeight');

		// Add the default buttons
		this.buttons.forEach(function(button) {
			self[button.command] = SC.ButtonView.extend({
				layout: {
					height: buttonHeight,
					width: 30,
					centerY: 0
				},
				icon: button.command,
				command: button.command,
				action: 'buttonPressed',
				target: self,
				isDefaultBinding: SC.Binding.oneWay('.parentView.editor.is' + button.command.titleize())
			});
			childViews.push(button.command);
		});
		this.childViews = childViews;
		sc_super();

		this.imageButton.adjust('height', buttonHeight);
		this.styles.adjust('height', buttonHeight);
	},

	buttonPressed: function(button) {
		this.get('editor').execCommand(button.get('command'), false, null);
	},

	insertImage: function() {
		var self = this;
		var pane = SC.PickerPane.create({
			layout: {
				width: 220,
				height: 40
			},
			pointerPos: 'perfectTop',
			contentView: SC.View.extend({
				childViews: [ 'textArea' ],
				textArea: SC.TextFieldView.extend({
					hint: 'Image Url',
					layout: {
						top: 5,
						right: 5,
						bottom: 5,
						left: 5
					},
					insertNewline: function() {
						self.performImageInsert(this.get('value'));
						pane.remove();
					}
				})
			})
		}).popup(this.get('imageButton'), SC.PICKER_POINTER, [ 2, 0, 1, 3, 2 ]);
	},

	performImageInsert: function(url) {
		this.get('editor').insertImage(url);
	},

	imageButton: SC.ButtonView.extend({
		layout: {
			height: 24,
			width: 30,
			centerY: 0
		},
		icon: 'insert-image',
		action: 'insertImage',
		target: SC.outlet('parentView')
	}),

	styles: SC.SelectView.extend({
		layout: {
			width: 120,
			height: 24,
			centerY: 0
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