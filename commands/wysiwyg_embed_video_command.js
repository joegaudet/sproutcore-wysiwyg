// ==========================================================================
// Project:   SproutCoreWysiwyg Editor
// Author: Joe Gaudet - joe@learndot.com
// ==========================================================================
/*globals SproutCoreWysiwyg */
sc_require('commands/wysiwyg_command');
sc_require('commands/wysiwyg_picker_command_support');
sc_require('panes/wysiwyg_video_picker_pane');

SC.WYSIWYGEmbedVideoCommand = SC.WYSIWYGCommand.extend(SC.WYSIWYGPickerCommandSupport, {

	action: 'embedVideo',

	url: '',

	type: 'youtube',

	types: [ 'youtube', 'vimeo' ],

	_vimeoString: '<iframe src="http://player.vimeo.com/video/%@" width="440" height="360" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>',

	_youtubeString: '<iframe class="youtube-player" type="text/html" width="440" height="360" src="http://www.youtube.com/embed/%@" frameborder="0"></iframe>',

	pickerPane: SC.WYSIWYGVideoPickerPane,

	execute: function(source, controller) {
		this._popup(source, controller);
	},

	commitCommand: function(controller) {
		var url = this.get('url');
		if (this.get('type') === 'youtube') {
			var youtubeId = /v=([A-z0-9]+)/.exec(url);

			if (youtubeId && youtubeId[1]) {
				controller.insertHtmlHtmlAtCaret(this._youtubeString.fmt(youtubeId[1]));
			}
		} else {
			var vimeoId = /vimeo.com\/(\d+)/.exec(url);
			if (vimeoId && vimeoId[1]) {
				controller.insertHtmlHtmlAtCaret(this._vimeoString.fmt(vimeoId[1]));
			}
		}
	}

});
SC.WYSIWYGCommandFactory.registerCommand('embedVideo', SC.WYSIWYGEmbedVideoCommand);