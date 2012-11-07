// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
SC.WYSIWYGToolbarViewDelegate = {

	isWYSIWYGToolbarViewDelegate: YES,

	buttonHeight: 24,

	buttons: [ 'styles', 'insertImage', 'embedVideo', 'link', 'bold', 'italic', 'underline', 'insertOrderedList', 'insertUnorderedList', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent' ],

	controller: null,

	initButtons: function() {
		// Add the default buttons
		var buttons = this.get('buttons');
		for ( var i = 0; i < buttons.length; i++) {
			var button = buttons[i], command = SC.WYSIWYGCommandFactory.commandFor(button);
			var view = command ? this.buttonForCommand(button, command) : this[button];
			if (view) {
				view = this[button] = this.createChildView(view);
				this.childViews.push(view);
			}
		}
	},

	buttonForCommand: function(key, command) {
		var buttonClass = this[key], buttonHeight = this.get('buttonHeight');
		if (buttonClass) {
			buttonClass = buttonClass.extend({
				command: command
			});
		} else {
			buttonClass = this.get('exampleView').extend({
				layout: {
					height: buttonHeight,
					width: 30
				},
				icon: command.get('icon'),
				command: command,
				toolTip: command.get('toolTip'),
				action: 'invokeCommand',
				target: this,
				keyEquivalent: command.get('keyEquivalent'),
				isSelectedBinding: SC.Binding.oneWay('.parentView.controller.is' + command.action.classify())
			});
		}
		return buttonClass;
	},

	invokeCommand: function(source) {
		this.get('controller').invokeCommand(source);
	},

	exampleView: SC.ButtonView.extend({

	})
};
