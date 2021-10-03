module.exports = ({
  Statuses: {
    online: {
      friendly: 'online',
      class: 'online-2S838R'
    },
    idle: {
      friendly: 'idle',
      class: 'idle-3DEnRT'
    },
    dnd: {
      friendly: 'on do not disturb',
      class: 'dnd-1_xrcq'
    },
    offline: {
      friendly: 'offline',
      class: 'offline-3qoTek'
    },
    invisible: { // just if switch accounts
      friendly: 'offline',
      class: 'offline-3qoTek'
    }
  },
  InjectionIDs: {
    ContextMenu: [ 'bf-DMUserContextMenu', 'bf-GroupDMUserContextMenu', 'bf-GuildChannelUserContextMenu' ],
    DisplayStar: [ 'bf-star-member', 'bf-star-message' ],
    FavoriteFriendChannel: [ 'bf-direct-messages', 'bf-direct-messages-channel', 'bf-direct-messages-mount' ],
    FavoriteFriendsSection: [ 'bf-favorite-friends-tabbar' ],
    InformationModal: [ 'bf-message-listener' ],
    StatusPopup: [ 'bf-user' ],
    ChannelTypingIntegration: [ 'bf-ct-integration' ],
    SpotifyIntegration: [ 'bf-spotify-integration', 'bf-spotify-integration2' ],
    NotificationSounds: [ 'bf-notification', 'bf-playSound' ]
  },
  Sounds: {
    message1: 'Message',
    call_ringing: 'Incoming Call',
    user_join: 'User Joining Voice Channel'
  }
});
