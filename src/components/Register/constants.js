import PlanDetails from './PlanDetails';
import TaskDetails from './TaskDetails';
import SignupDetails from './SignupDetails';
// import OTP from './OTP';

export const registerFlow = [
	// {
	// 	title: 'OTP Verification',
	// 	element: <OTP />,
	// },
	{
		title: 'Task Details',
		element: <TaskDetails/>
	},
	{
		title: 'Choose Plan',
		element: <PlanDetails />,
	},
	{
		title: 'Task Details',
		element: <TaskDetails/>
	},
	{
		title: 'Add Details',
		element: <SignupDetails />,
	},
];
