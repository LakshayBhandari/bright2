const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];

export const getDay = date => {
	const d = new Date(date);
	return days[d.getDay()];
};

export const getDate = date => {
	const d = new Date(date);
	return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const getFormattedDate = date => {
	const d = new Date(date);
	let month = String(d.getMonth() + 1);
	if(month.length < 2)
		month = "0" + month;
	let day = String(d.getDate() + 1);
	if(day.length < 2)
		day = "0" + day;
	return `${d.getFullYear()}-${month}-${day - 1}`;
};

export const getAge = date => {
	const d = new Date(date);
	return new Date().getFullYear() - d.getFullYear();
};

export const getAgeGroupColor = date => {
	const age = getAge(date);
	if (age <= 2) return '#F75549';
	if (age >= 3 && age <= 5) return '#FF8513';
	if (age >= 6 && age <= 8) return '#F8B200';
	if (age >= 9 && age <= 11) return '#33A200';
	if (age >= 12 && age <= 14) return '#1596DC';
	if (age >= 15) return '#CB85C2';
};

export const getAgeGroup = date => {
	const age = getAge(date);
	if (age <= 2) return '0-2';
	if (age >= 3 && age <= 5) return '3-5';
	if (age >= 6 && age <= 8) return '6-8';
	if (age >= 9 && age <= 11) return '9-11';
	if (age >= 12 && age <= 14) return '12-14';
	if (age >= 15) return '15+';
};

export const getApiAgeGroup = date => {
	const age = getAge(date);
	if (age <= 2) return 1;
	if (age >= 3 && age <= 5) return 2;
	if (age >= 6 && age <= 8) return 3;
	if (age >= 9 && age <= 11) return 4;
	if (age >= 12 && age <= 14) return 5;
	if (age >= 15) return 6;
};
