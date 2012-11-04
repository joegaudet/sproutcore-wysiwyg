SC.WYSIWYGView = SC.View.extend({

	classNames: 'sc-wysiwyg-view',

	childViews: [ 'toolbar', 'editor' ],

	isTextSelectable: YES,

	value: '',


	toolbar: SC.WYSIWYGToolbarView.extend({
		editor: SC.outlet('parentView.editor.contentView')
	}),

	editor: SC.ScrollView.extend({

		layout: {
			top: 32,
			right: 0,
			bottom: 0,
			left: 0
		},

		contentView: SC.WYSIWYGEditorView.extend({
			toolbar: SC.outlet('parentView.parentView.parentView.toolbar'),
			// this looks like too many layers... but seems to be working
			valueBinding: '.parentView.parentView.parentView.value',

			minHeight: function() {
				return this.getPath('parentView.parentView.frame').height;
			}.property(),

			// TODO: FIX THIS SO IT WORKS SANELY
			keyUp: function() {
				var ret = sc_super();
				var $node = SC.$(this.get('document').getSelection().anchorNode.parentNode);
				var position = $node.position();
				this.getPath('parentView.parentView').scrollTo(0, position.top + $node.height());
				return ret;
			}
		})
	})

});