import uuid from 'uuid-v4';

function formatTime(s) {
	if (s < 3601) {
		const seconds = Math.floor(s % 60);
		const minutes = Math.floor(s / 60);
		const humanized = [
			pad(minutes.toString(), 2),
			pad(seconds.toString(), 2)
		].join(':');
		return humanized;
	}
	const hours = Math.floor(s / 60 / 60);
	const minutes = Math.floor((s / 60) % 60);
	const humanized = [pad(hours.toString(), 2), pad(minutes.toString(), 2)].join(
		':'
	);
	return humanized;
}

function pad(numberString, size) {
	let padded = numberString;
	while (padded.length < size) padded = `0${padded}`;
	return padded;
}

function alertMessage(flag) {
	const breakMsg = 'Good job. Take a break.';
	const startMsg = 'Break is over. Click Start for new Pomotris';
	flag === 'break' ? alert(breakMsg) : alert(startMsg);
}

// this should be called on save for color setting being submitted
function addColorDetail(records, categories) {
	const newRecords = records.map(record => {
		categories.forEach(category => {
			if (record.category !== '' && category.category === record.category) {
				record.color = category.color;
			}
		});
		return record;
	});
	return newRecords;
}

function generateID() {
	return uuid();
}

function generateRandomColor(task, categories) {
	let color = '#afe6b1';
	if (!categories.length || !task) {
		return color;
	}
	const categoriesArray = categories.map(c => c.category);
	// categories data exist but task does not match any of tasks
	if (categoriesArray.indexOf(task) < 0) {
		return color;
	}
	categories.forEach(c => {
		if (c.category === task) {
			color = c.color;
		}
	});
	return color;
}

function filterByToday(records) {
	const today = new Date(Date.now()).toLocaleString();
	const matcher = today.slice(0, 10);
	const todayRecords = records.filter(record =>
		record.startTime.includes(matcher)
	);
	return todayRecords;
}

module.exports = {
	formatTime,
	alertMessage,
	generateRandomColor,
	addColorDetail,
	generateID,
	filterByToday
};
