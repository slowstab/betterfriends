const {
	React,
	i18n: { Messages },
	getModule,
} = require('powercord/webpack');
const { Flex, Icon } = require('powercord/components');

module.exports = ({ title, _this }) => {
	const [sortKey, setSortKey] = React.useState(_this.sortKey);
	const [sortReversed, setSortReversed] = React.useState(_this.sortReversed);
	const headers = getModule(['headerCell'], false);
	const updateList = () => {
		document.querySelector('.peopleList-3c4jOR').dispatchEvent(new Event('focusin'));
		setTimeout(() => document.querySelector('.peopleList-3c4jOR').dispatchEvent(new Event('focusout')));
	};

	return (
		<Flex align={Flex.Align.CENTER} justify={Flex.Justify.CENTER}>
			<div className={`bf-header bf-nameCell ${headers.headerCell}`}>
				<div className={headers.headerCellContent}>{title}</div>
			</div>
			{[
				{ key: 'usernameLower', label: Messages.FRIENDS_COLUMN_NAME },
				{ key: 'statusIndex', label: Messages.FRIENDS_COLUMN_STATUS },
				{ key: 'isFavorite', label: 'Favorite' },
			].map(data => (
				<div
					className={['bf-header bf-nameCell', headers.headerCell, sortKey === data.key && headers.headerCellSorted, headers.clickable].join(' ')}
					onClick={() => {
						if (sortKey === data.key) {
							if (!sortReversed) {
								setSortReversed(true);
								_this.sortReversed = true;
								updateList();
							} else {
								setSortKey('');
								setSortReversed(false);
								_this.sortKey = '';
								_this.sortReversed = false;
								updateList();
							}
						} else {
							setSortKey(data.key);
							setSortReversed(false);
							_this.sortKey = data.key;
							_this.sortReversed = false;
							updateList();
						}
					}}
				>
					<div className={headers.headerCellContent}>
						{data.label} {sortKey === data.key && <Icon className={headers.sortIcon} name={sortReversed ? 'ArrowDropDown' : 'ArrowDropUp'} />}
					</div>
				</div>
			))}
		</Flex>
	);
};
