const { inject } = require('powercord/injector');
const { open: openModal } = require('powercord/modal');
const {
	Icons: { Keyboard },
	Tooltip,
} = require('powercord/components');
const {
	React,
	Flux,
	getModuleByDisplayName,
	getModule,
	constants: { Routes },
} = require('powercord/webpack');

const FavoriteFriends = require("../components/FavoriteFriends");
const InformationModal = require("../components/InformationModal");

/*
 * [ Friend DM Channel ]
 * Creates and populates the "Favorited Friends" section on the private channel/DMs screen
 */
module.exports = async function () {
	const _this = this;
	this.expanded = true;
	const PrivateChannel = await getModuleByDisplayName('PrivateChannel');
	const ConnectedPrivateChannelsList = await getModule(m => m.default && m.default.displayName === 'ConnectedPrivateChannelsList');
	const channelStore = await getModule(['getChannel', 'getDMFromUserId']);
	const { lastMessageId } = await getModule(['lastMessageId']);
	const { getDMFromUserId } = await getModule(['getDMFromUserId']);
	const { getChannel } = await getModule(['getChannel']);
	const { DirectMessage } = await getModule(['DirectMessage']);
	const classes = {
		...(await getModule(['channel', 'closeButton'])),
		...(await getModule(['avatar', 'muted', 'selected'])),
		...(await getModule(['privateChannelsHeaderContainer'])),
	};

	// Patch PrivateChannel
	inject('bf-direct-messages-channel', PrivateChannel.prototype, 'render', function (args, res) {
		// console.log(_this.FAV_FRIENDS.includes(this.props.user?.id))
		if (_this.FAV_FRIENDS.some(f => this.props.user?.id === f.id)) {
			if (!res.props.className.includes('bf-favoritefriend')) res.props.className += ' bf-favoritefriend';
			if (powercord.api.settings.store.getSetting('betterfriends', 'infomodal'))
				res.props.children = [
					React.createElement(
						Tooltip,
						{
							text: 'User Information',
							position: 'top',
						},
						React.createElement(Keyboard, {
							className: 'bf-information',
							onClick: e => {
								e.stopPropagation();
								e.preventDefault();
								const info = _this.FRIEND_DATA.lastMessageID[this.props.user.id];
								openModal(() =>
									React.createElement(InformationModal, {
										user: { ...this.props.user, isSystemUser: () => false, isSystemDM: () => false },
										channel: !info ? 'nothing' : info.channel,
										message: !info ? 'nothing' : info.id,
										friend: _this.FAV_FRIENDS.find(f => f.id === this.props.user.id),
									})
								);
							},
						})
					),
					res.props.children,
				];
		}
		return res;
	});

	// Patch DM list
	inject('bf-direct-messages', ConnectedPrivateChannelsList, 'default', (args, res) => {
		res.props.privateChannelIds = res.props.privateChannelIds.filter(c => {
			const channel = channelStore.getChannel(c);
			return channel.type !== 1 || !this.FAV_FRIENDS.some(f => channel.recipients[0] === f.id);
		});

		// thanks https://github.com/Bricklou for the fix
		if (this.favFriendsInstance) {
			this.favFriendsInstance.props.selectedChannelId = res.props.selectedChannelId;
			this.favFriendsInstance.props.FAV_FRIENDS = this.FAV_FRIENDS.map(f => f.id);
			this.favFriendsInstance.update?.();
		} else
			this.favFriendsInstance = React.createElement(FavoriteFriends, {
				classes,
				FAV_FRIENDS: this.FAV_FRIENDS.map(f => f.id),
				selectedChannelId: res.props.selectedChannelId,
				_this,
			});
		if (res.props.children.find(x => x?.toString()?.includes('this.favFriendsInstance'))) return res;

		const dms = this.favFriendsInstance.props.FAV_FRIENDS.sort((a, b) => lastMessageId(getDMFromUserId(b)) - lastMessageId(getDMFromUserId(a))).map(
			userId => () =>
				getChannel(getDMFromUserId(userId)) &&
				this.expanded &&
				React.createElement(DirectMessage, {
					'aria-posinset': 7,
					'aria-setsize': 54,
					tabIndex: -1,
					channel: getChannel(getDMFromUserId(userId)),
					selected: res.props.selectedChannelId === getDMFromUserId(userId),
				})
		);
		res.props.children.push(() => this.favFriendsInstance, ...dms);
		return res;
	});
	ConnectedPrivateChannelsList.default.displayName = 'ConnectedPrivateChannelsList';
};
