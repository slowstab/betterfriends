const { FluxDispatcher } = require('powercord/webpack');

/*
 * [ Information Modal ]
 * Handles the collection of data used by the information modal (little info button found on favorited friends in DM channels)
 */
module.exports = async function () {
	const _this = this;
	function listener({ message }) {
		if (message && _this.FAV_FRIENDS.includes(message.author.id)) {
			_this.FRIEND_DATA.lastMessageID[message.author.id] = {
				id: message.id,
				channel: message.channel_id,
			};
		}
	}
	if (this.settings.get('infomodal')) FluxDispatcher.subscribe('MESSAGE_CREATE', listener);
	else FluxDispatcher.unsubscribe('MESSAGE_CREATE', listener);
};
