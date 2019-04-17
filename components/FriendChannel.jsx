const { React } = require('powercord/webpack');
const { getModule } = require('powercord/webpack');
const { open: openModal } = require('powercord/modal');
const InformationModal = require('./InformationModal');
const { Tooltip } = require('powercord/components');
const { Info } = require('powercord/components/Icons');
const { Statuses } = require('./../Constants');
const { getDMFromUserId } = getModule([ 'getDMFromUserId' ]);
const { openPrivateChannel } = getModule([ 'openPrivateChannel' ]);
const { transitionTo } = getModule([ 'transitionTo' ]);
const { getRelationships } = getModule([ 'getRelationships' ]);
const { getCurrentUser } = getModule([ 'getCurrentUser' ]);
const { getStatus } = getModule([ 'getStatus' ]);
const Plugin = powercord.pluginManager.get('betterfriends');
const { config: { infomodal } } = Plugin.settings;

module.exports = class BetterFriendChannel extends React.Component {
  constructor ({ target }) {
    super();
    this.target = target;

    // bind this to button click event
    this.informationClick = this.informationClick.bind(this);
    this.userClick = this.userClick.bind(this);
  }

  // no usage of "this", no need to bind
  userClick (e) {
    e.stopPropagation();
    e.preventDefault();

    let { target } = e;
    const callNewTarget = () => {
      target = target.parentElement;
      if (![ ...target.classList ].includes('channel-2QD9_O')) {
        callNewTarget();
      }
    };
    callNewTarget();
    for (const elm of [ ...document.querySelectorAll('.selected-1HYmZZ') ]) {
      elm.classList.remove('selected-1HYmZZ');
      target.classList.add('selected-1HYmZZ');
    }

    if (!target.firstChild.getAttribute('href').includes('undefined')) {
      transitionTo(target.firstChild.getAttribute('href'));
    } else {
      const user = getCurrentUser();
      openPrivateChannel(user.id, this.target.id);
    }
    target.classList.add('selected-1HYmZZ');
  }

  informationClick (e) {
    e.preventDefault();
    const info = Plugin.FRIEND_DATA.lastMessageID[this.target.id];
    openModal(() => React.createElement(InformationModal, {
      user: this.target,
      channel: !info ? 'nothing' : info.channel,
      message: !info ? 'nothing' : info.id
    }));
    e.stopPropagation();
  }

  render () {
    return (() => {
      // Group DM
      if (this.target.icon) {
        return ((() => (
          <div className="channel-2QD9_O pc-channel pc-friendchannel" style={{ height: '42px',
            opacity: 1 }}>
            <a href={`/channels/@me/${this.target.id}`} onClick={this.userClick}>
              <div className="wrapper-2F3Zv8 pc-wrapper small-5Os1Bb pc-small forceDarkTheme-2cI4Hb pc-forceDarkTheme avatar-28BJzY pc-avatar avatarSmall-3ACRaI">
                <div className="inner-1W0Bkn pc-inner stop-animation" style={{ backgroundImage: `url("https://cdn.discordapp.com/channel-icons/${this.target.id}/${this.target.icon}")` }}></div>
              </div>
              <div className="nameWrapper-10v56U"><span className="name-2WpE7M">{this.target.name}</span></div>
              <button className='close-3hZ5Ni'></button>
            </a>
          </div>
        ))());
      }

      // This ain't a user, son! This is just a generic channel with a name and SVG avatar.
      if (!this.target.id) {
        return (<div className="channel-2QD9_O pc-channel pc-friendchannel" style={{ height: '42px',
          opacity: 1 }}>
          <a href={this.target.href} onClick={this.userClick}>
            <svg name={this.target.name} className='linkButtonIcon-Mlm5d6' width={this.target.width || '24'} height={this.target.height || '24'} viewBox={this.target.viewBox || '0 0 24 24'}>
              <g fill='none' fill-rule='evenodd'>
                <path fill='currentColor' d={this.target.avatar}></path>
                <rect width='24' height='24'></rect>
              </g>
            </svg>
            <div className="name-2WpE7M pc-name">{this.target.name}</div>
            {(() => {
              if (this.target.name === 'Friends') {
                const rel = getRelationships();
                const pending = Object.keys(rel).filter(r => rel[r] === 3);
                if (pending.length) {
                  return (<div className="wrapper-232cHJ pc-wrapper">{pending.length}</div>);
                }
              }
            })()}
          </a>
        </div>);
      }

      return ((() => {
        const status = getStatus(this.target.id);
        return (<div className="channel-2QD9_O pc-channel pc-friendchannel bf-channel" style={{ height: '42px',
          opacity: 1 }}>
          <a href={`/channels/@me/${getDMFromUserId(this.target.id)}`} onClick={this.userClick}>
            <div className="wrapper-2F3Zv8 pc-wrapper small-5Os1Bb pc-small forceDarkTheme-2cI4Hb pc-forceDarkTheme avatar-28BJzY pc-avatar avatarSmall-3ACRaI">
              <div user={this.target.username} status={status} className="inner-1W0Bkn pc-inner stop-animation" style={{ backgroundImage: `url(${this.target.avatarURL})` }}></div>
              <div className={`${Statuses[status].class} status-oxiHuE pc-${status} pc-status small-5Os1Bb pc-small status-2zcSVk pc-status status-1ibiUI pc-status`}></div>
            </div>
            <div className="nameWrapper-10v56U"><span className="name-2WpE7M">{this.target.username}</span></div>
            {Plugin.FAV_FRIENDS.includes(this.target.id) && infomodal && <Tooltip className="bf-information-tooltip" text='User Information' position='top'><Info className="bf-information" onClick={this.informationClick} /></Tooltip>}
            {!Plugin.FAV_FRIENDS.includes(this.target.id) && <button className='close-3hZ5Ni'></button>}
          </a>
        </div>);
      })());
    })();
  }
};
