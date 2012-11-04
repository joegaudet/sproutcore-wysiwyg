SC.WYSIWYGToolbarView = SC.ToolbarView.extend(SC.FlowedLayout, {

	flowPadding: {
		top: 4,
		left: 4,
		right: 4
	},

	defaultFlowSpacing: {
		right: 4
	},

	anchorLocation: SC.ANCHOR_TOP,

	buttons: [ {
		title: 'B',
		command: 'bold'
	}, {
		title: 'I',
		command: 'italic'
	}, {
		title: 'U',
		command: 'underline'
	}, {
		title: 'OL',
		command: 'insertorderedlist'
	}, {
		title: 'UL',
		command: 'insertunorderedlist'
	}, {
		title: 'JL',
		command: 'justifyleft'
	}, {
		title: 'JC',
		command: 'justifycenter'
	}, {
		title: 'JR',
		command: 'justifyright'
	}, {
		title: 'ID',
		command: 'indent'
	}, {
		title: 'OD',
		command: 'outdent'
	} ],

	childViews: [ 'imageButton' ],

	init: function() {
		var self = this;
		var childViews = this.childViews.copy();

		// Add the default buttons
		this.buttons.forEach(function(button) {
			self[button.command] = SC.ButtonView.extend({
				layout: {
					height: 24,
					width: 30,
					centerY: 0
				},
				title: button.title,
				command: button.command,
				action: 'buttonPressed',
				target: self
			});
			childViews.push(button.command);
		});

		this.childViews = childViews;
		sc_super();
	},

	buttonPressed: function(button) {
		this.get('editor').execCommand(button.get('command'), false, null);
	},

	insertImage: function() {
		this.get('editor').insertHtmlHtmlAtCaret('<img src="http://start.matygo.com/images/joe.jpg" />');
	},

	imageButton: SC.ButtonView.extend({
		layout: {
			height: 24,
			width: 30,
			centerY: 0
		},
		title: 'II',
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