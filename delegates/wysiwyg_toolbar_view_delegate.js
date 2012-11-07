SC.WYSIWYGToolbarViewDelegate = {

	isWYSIWYGToolbarViewDelegate: YES,

	buttonHeight: 24,

	buttons: [ 'styles', 'insertImage', 'embed', 'link', 'bold', 'italic', 'underline', 'insertOrderedList', 'insertUnorderedList', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent' ],

	wysiwygView: null,

	controller: null,

	initButtons: function() {
		// Add the default buttons
		var buttons = this.get('buttons');
		for ( var i = 0; i < buttons.length; i++) {
			var button = buttons[i], command = SproutCoreWysiwyg.commands[button];
			var view = command ? this.buttonForCommand(button, command) : this[button];
			view = this[button] = this.createChildView(view);
			this.childViews.push(view);
		}
	},

	buttonForCommand: function(key, command) {
		var buttonClass = self[key], controller = this.get('controller'), buttonHeight = this.get('buttonHeight');
		return (buttonClass || this.get('exampleView')).extend({
			layout: {
				height: buttonHeight,
				width: 30
			},
			icon: command.get('icon'),
			command: command,
			toolTip: command.get('toolTip'),
			action: 'executeCommand',
			target: controller,
			keyEquivalent: command.get('keyEquivalent'),
			isSelectedBinding: SC.Binding.oneWay('.parentView.is' + command.action.classify())
		});
	},

	exampleView: SC.ButtonView.extend({

	})
};