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
	const PrivateChannel = await getModuleByDisplayName('PrivateChannel');
	const ConnectedPrivateChannelsList = await getModule(m => m.default && m.default.displayName === 'ConnectedPrivateChannelsList');
	const dms = await getModule(['openPrivateChannel']);
	const transition = await getModule(['transitionTo']);
	const userStore = await getModule(['getUser', 'getCurrentUser']);
	const channelStore = await getModule(['getChannel', 'getDMFromUserId']);
	const classes = {
		...(await getModule(['channel', 'closeButton'])),
		...(await getModule(['avatar', 'muted', 'selected'])),
		...(await getModule(['privateChannelsHeaderContainer'])),
	};

	// Patch PrivateChannel
	inject('bf-direct-messages-channel', PrivateChannel.prototype, 'render', function (args, res) {
		// console.log(_this.FAV_FRIENDS.includes(this.props.user?.id))
		if (_this.FAV_FRIENDS.includes(this.props.user?.id)) {
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
									})
								);
							},
						})
					),
					res.props.children,
				];

			if (this.props.channel.id === '0' && res.props.children) {
				res.props.onMouseDown = () => void 0;
				res.props.children = React.createElement('a', null, res.props.children.props.children);
				res.props.onClick = async () => {
					const channelId = await dms.openPrivateChannel(userStore.getCurrentUser().id, this.props.user.id);
					// eslint-disable-next-line new-cap
					transition.transitionTo(Routes.CHANNEL('@me', channelId));
					if (_this.favFriendsInstance) _this.favFriendsInstance.forceUpdate();
				};
			}
		}
		return res;
	});

	// Patch DM list
	inject('bf-direct-messages', ConnectedPrivateChannelsList, 'default', (args, res) => {
		res.props.privateChannelIds = res.props.privateChannelIds.filter(c => {
			const channel = channelStore.getChannel(c);
			return channel.type !== 1 || !this.FAV_FRIENDS.includes(channel.recipients[0]);
		});

		if (this.favFriendsInstance) this.favFriendsInstance.forceUpdate();
		res.props.children = [
			// Previous elements
			...res.props.children,
			// Favorite Friends
			() =>
				React.createElement(FavoriteFriends, {
					classes,
					FAV_FRIENDS: this.FAV_FRIENDS,
					selectedChannelId: res.props.selectedChannelId,
					_this,
				}),
		];

		return res;
	});
	ConnectedPrivateChannelsList.default.displayName = 'ConnectedPrivateChannelsList';
};
