

export const handleError = (error) => {
	console.log(error);
}

export const handleApiErrors = (error, dispatch, setErrorList) => {
	if (error.status === 500) {
		dispatch(setErrorList({ global: 'A server error occurred. Please try again later.' }))
	}
	else if (error.data?.errors) {

		const responseErrors = error.data?.errors;
		const newErrors = {};
		responseErrors.forEach(err => {
			newErrors[err.field] = err.data[0].message;
		});
		dispatch(setErrorList(newErrors));
	} else {
		// Handle other types of errors if necessary
		console.error('An unexpected error occurred:', error);
	}
};

export const logOutUser = () => {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	localStorage.removeItem('tokenExpireTime');
	localStorage.removeItem('refreshTokenExpireTime');
	window.location.href = '/';

}

export const getCurrentTime = () => {
	const now = new Date();
	return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: "2-digit", hour12: false });
};

export const combineDateTime = (date, time) => {
	const [day, month, year] = date.split('/').map(Number);
	const [hours, minutes] = time.split(':').map(Number);

	const formatedDate = new Date(year, month - 1, day, hours, minutes);

	return formatedDate.toISOString();
}



export const separateDateTime = (dateTimeString) => {


	const date = new Date(dateTimeString);
	const localDate = date.toLocaleDateString();
	const [day, month, year] = localDate.split('/');
	const formattedLocalDate = `${day}/${month}/${year}`;
	const localTime = date.toLocaleTimeString();

	return {
		date: formattedLocalDate,
		time: localTime
	};
}

export const getRandomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomColor = () => {
	const profileBgColors = ['bg-blue-500',
		'bg-red-500',
		'bg-green-500',
		'bg-cyan-500',
		'bg-purple-500',
		'bg-pink-500',
		'bg-indigo-500',
		'bg-gray-500',];
	const color = profileBgColors[getRandomInt(0, 7)];
	return color;
}

export const getInitials = (assignee) => {
	if (assignee === null || assignee === " ") {
		return ""
	}
	const assigneeName = assignee.toString();
	const assigneeNameParts = assigneeName.split(" ");
	const assigneeFirstName = assigneeNameParts[0];
	const assigneLastName = assigneeNameParts.length > 1 && assigneeNameParts[assigneeNameParts.length - 1];
	const assigneeInitials = assigneeName && (assigneLastName ? assigneeFirstName[0].toUpperCase() + assigneLastName[0].toUpperCase() : assigneeFirstName[0].toUpperCase());
	return assigneeInitials
}


export const calculateBgColor = (startDate, endDate, progress) => {
	const currentDate = new Date();
	const start = new Date(startDate);
	const end = new Date(endDate);
	// Calculating the toata number of days for the task
	const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
	// Calculating the remaining number of days
	const remainingDays = Math.round(
		(end - currentDate) / (1000 * 60 * 60 * 24)
	);
	const remainingDaysPercentage = (remainingDays / totalDays) * 100;

	if (progress === 100) {
		return " bg-green-100 group-hover:bg-green-100 dark:border-green-400  dark:group-hover:bg-gray-600 dark:bg-gray-800";
	}
	else if (remainingDaysPercentage <= 0) {
		return " bg-red-100 group-hover:bg-red-200 dark:border-red-400  dark:group-hover:bg-gray-600 dark:bg-gray-800";
	}
	else if (remainingDaysPercentage <= 20) {
		return " bg-red-100 group-hover:bg-red-100  dark:border-red-400  dark:group-hover:bg-gray-600 dark:bg-gray-800";
	}
	else if (remainingDaysPercentage <= 50) {
		return " bg-yellow-100 group-hover:bg-yellow-200 dark:group-hover:bg-gray-600 dark:bg-gray-800 dark:border-yellow-200 ";
	} else {
		return " bg-white group-hover:bg-gray-100 dark:bg-gray-800 dark:group-hover:bg-gray-600";
	}

};

export const createRowSpans = (tasks) => {
	const rowSpans = [];
	let currentTaskName = '';
	let currentIndex = 0;

	tasks.forEach((task, index) => {
		if (task.name !== currentTaskName) {
			currentTaskName = task.name;
			currentIndex = index;
			rowSpans.push({ taskName: task.name, index, span: 1 });
		} else {
			rowSpans[currentIndex].span += 1;
			rowSpans.push({ taskName: task.name, index, span: 0 });
		}
	});

	return rowSpans;
};


export const formatDateStringForComment = (dateStr, locale = 'en-GB') => {
	const date = new Date(dateStr);


	const day = date.toLocaleDateString(locale, { day: 'numeric' });
	const month = date.toLocaleDateString(locale, { month: 'short' });
	const year = date.toLocaleDateString(locale, { year: 'numeric' });

	return `${day} ${month}, ${year}`;
}

export const formatDateToISO = (dateString) => {

	const year = dateString.getFullYear();
	const month = String(dateString.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
	const day = String(dateString.getDate()).padStart(2, '0');

	return `${day}/${month}/${year}`;
}

export const getTodayDate = () => {
	const today = new Date();
	const day = String(today.getDate()).padStart(2, '0');
	const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
	const year = today.getFullYear();
	const formattedDate = `${day}/${month}/${year}`;
	return formattedDate;
}

export const convertDateToDatePickerFormat = (date) => {
	const [day, month, year] = date.split('/');
	return (`${year}-${month}-${day}`);

}

export const convertDateToDDMMYYYY = (dateString) => {
	// Split the input date string into an array [YYYY, MM, DD]
	const [year, month, day] = dateString.split('-');

	// Rearrange and return the date in DD/MM/YYYY format
	return `${day}/${month}/${year}`;
}

export const darkenHexColor = (hex, percent = 60) => {
	// Remove the hash if present
	if(!hex) return 
	hex = hex.replace(/^#/, '');

	// Convert to RGB
	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);

	// Darken each channel by the given percentage
	r = Math.max(0, Math.floor(r * (1 - percent / 100)));
	g = Math.max(0, Math.floor(g * (1 - percent / 100)));
	b = Math.max(0, Math.floor(b * (1 - percent / 100)));

	// Convert back to hex and return the darkened color
	return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}


export const getButtonStyles = (bgColor, theme) => {
    const isDarkTheme=theme=="dark" ? true: false;
	
	return {

		backgroundColor: isDarkTheme ? "#4B5563" : bgColor, // bg-gray-600 in hex
		color: "#FFFFFF",
	}
};



export const colors = [
	"#024F8A",
	"#4F46E5", // Indigo
	"#6366F1", // Blue-Violet
	"#8B5CF6", // Violet
	"#A855F7", // Purple
	"#D946EF", // Fuchsia
	"#EC4899", // Pink
	"#06B6D4", // Cyan
	"#0EA5E9", // Sky Blue
	"#2563EB", // Royal Blue
	"#3B82F6", // Blue

];