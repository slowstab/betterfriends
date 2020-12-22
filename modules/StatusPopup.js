const { inject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');
const { waitFor, getOwnerInstance } = require('powercord/util');
const { StatusHandler } = require('./../components');
const { XenoLib } = global;

const FRIENDLY_STATEMENT = {
  online: 'went online',
  offline: 'went offline',
  dnd: 'went in to do not disturb',
  idle: 'went idle'
}

const STATUS_COLOR = {
  online: '#43b581',
  offline: '#747f8d',
  dnd: '#f04747',
  idle: '#faa61a'
}

/*
 * [ Status Popup ]
 * Listens for status changes from favorited friends, stores them and displays a little notification.
 * Contributors: aetheryx#0001
 */
module.exports = async function () {
  if (!this.settings.get('statuspopup', true)) return;
  const Avatar = await getModule(m => m && m.Sizes && typeof m === 'function' && m.Sizes['SIZE_32'] === 'SIZE_32');
  this.createFriendPopup = (user, status) => {

    const timeout = this.settings.wpmTimeout ? Math.min(this.calculateTime(notif.title) + this.calculateTime(notif.content), 60000) : 0;
    const notificationId = global.XenoLib.Notifications.show(
    React.createElement(
        'div',
        {
        className: 'BF-message'
        },
        React.createElement(StatusHandler, {
          status,
          user,
          Avatar
        }),
    ),
    {
        timeout: Math.max(5000, timeout),
        color: STATUS_COLOR[status]
    }
    );
  }

  const { getStatus } = await getModule([ 'getStatus' ]);
  const getUser = await getModule([ 'getUser', 'getCurrentUser' ]);

  inject('bf-user', getUser, 'getUser', (args, res) => {
    if (res && this.FAV_FRIENDS.includes(res.id)) {
      const status = getStatus(res.id);
      const previous = this.FRIEND_DATA.statusStorage[res.id];
      if (previous && status !== previous) {
        this.log('Showing notification');
        this.createFriendPopup(res, status)
      }

      this.FRIEND_DATA.statusStorage[res.id] = status;
    }
    return res;
  });
};
