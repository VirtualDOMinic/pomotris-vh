import React, { Component } from 'react';
import { formatTime, alertMessage } from '../js/helper';
import uuid from 'uuid-v4';
// 25 min/ 10 min  is default setting
class Timer extends Component {
	state = {
		category: null,
		title: null,
		startTime: null,
		duration: 25,
		remained: 25 * 60,
		breakTime: 10 * 60,
		isTimerRunning: false,
		isBreakRunning: false
	};

	// breakTime will be passes as props from Dashboard in future (from setting modal)
	componentDidUpdate() {
		if (!this.state.remained && this.state.isTimerRunning) {
			this.handleComplete();
		}
		if (this.state.breakTime < 0) {
			this.handleBreakOver();
		}
	}
	countDown = () => {
		const remainedSeconds = this.state.remained - 1;
		this.setState({
			remained: remainedSeconds
		});
	};
	breakTimeCountDown = () => {
		const breakTime = this.state.breakTime - 1;
		this.setState({ breakTime });
	};
	resetTimer = newDuration => {
		clearInterval(this.countDownID);
		this.setState({
			category: null,
			title: null,
			startTime: null,
			duration: newDuration,
			breakTime: 10 * 60,
			remained: newDuration * 60,
			isTimerRunning: false,
			isBreakRunning: false
		});
	};

	handleFieldsSubmit = fields => {
		this.setState({
			title: fields.title,
			category: fields.category
		});
	};
	// handle button-clicks
	handleActionButtonsClick = event => {
		const btn = event.target.value;
		if (btn === 'Start') {
			this.handleStartClick();
		} else if (btn === 'Stop' || btn === 'Pause') {
			this.handleStopClick(btn);
		} else if (btn === 'Resume' || btn === 'Continue') {
			this.handleResumeClick(btn);
		} else {
			this.handleCancelClick();
		}
	};

	handleStartClick = () => {
		this.countDownID = setInterval(() => this.countDown(), 1000);
		this.setState({
			startTime: new Date(Date.now()).toLocaleString(),
			isTimerRunning: true
		});
	};

	handleResumeClick = btn => {
		if (btn === 'Continue') {
			this.countDownID = setInterval(() => this.countDown(), 1000);
			this.setState({
				isTimerRunning: true
			});
		} else {
			// btn === Resume
			this.breakTimeCountDownID = setInterval(
				() => this.breakTimeCountDown(),
				1000
			);
			this.setState({
				isBreakRunning: true
			});
		}
	};

	handleStopClick = btn => {
		if (btn === 'Stop') {
			clearInterval(this.countDownID);
			this.setState({
				isTimerRunning: false
			});
		} else {
			// btn === Pause
			clearInterval(this.breakTimeCountDownID);
			this.setState({
				isBreakRunning: false
			});
		}
	};

	handleCancelClick = () => {
		this.resetTimer(this.state.duration);
		clearInterval(this.breakTimeCountDownID);
	};

	handleBreakStart = () => {
		this.breakTimeCountDownID = setInterval(
			() => this.breakTimeCountDown(),
			1000
		);
		this.setState({
			isBreakRunning: true
		});
	};
	handleBreakOver = () => {
		alertMessage('start');
		clearInterval(this.breakTimeCountDownID);
		this.resetTimer(this.state.duration);
		this.setState({
			isBreakRunning: false
		});
	};
	handleComplete = () => {
		alertMessage('break');
		clearInterval(this.countDownID);
		this.handleRecordSubmit();
		this.handleBreakStart();
		this.setState({
			isTimerRunning: false
		});
	};
	handleRecordSubmit = () => {
		const category = this.state.category;
		const title = this.state.title;
		const startTime = this.state.startTime;
		const duration = this.state.duration;
		const id = uuid();
		this.props.onRecordSubmit({ category, title, startTime, duration, id });
	};
	handleOptionClick = value => {
		this.resetTimer(value);
	};

	render() {
		return (
			<div className="timer">
				<Clock
					time={
						this.state.remained
							? formatTime(this.state.remained)
							: formatTime(this.state.breakTime)
					}
				/>
				<Fields
					onFieldsSubmit={this.handleFieldsSubmit}
					title={this.state.title}
					category={this.state.category}
				/>
				<TimeOptions optionClick={this.handleOptionClick} />
				<ActionButtons
					isNew={this.state.remained === this.state.duration * 60}
					isCompleted={!this.state.remained}
					isBreakRunning={this.state.isBreakRunning}
					isTimerRunning={this.state.isTimerRunning}
					onButtonClick={this.handleActionButtonsClick}
				/>
			</div>
		);
	}
}

const Clock = props => <div className='clock'>{props.time}</div>;

class Fields extends Component {
	state = {
		fields: {
			category: '',
			title: ''
		},
		formOpen: true
	};

	// when new title & cateroy props are empty ( aka, it is a new timer), then clear input
	componentWillReceiveProps(nextProps) {
		if (!nextProps.category && !nextProps.title) {
			this.clearForm();
		}
	}

	clearForm = () => {
		this.setState({
			fields: {
				category: '',
				title: ''
			},
			formOpen: true
		});
	};

	// input data remains after submit, clearing happens when current timer is over or timer is reset
	onFormSubmit = event => {
		const fields = this.state.fields;
		this.props.onFieldsSubmit(fields);
		event.preventDefault();
	};

	onInputChange = event => {
		const fields = this.state.fields;
		fields[event.target.name] = event.target.value;
		this.setState({ fields });
	};

	render() {
		return (
			<form onSubmit={this.onFormSubmit} onBlur={this.onFormSubmit}>
				<input
					size={15}
					autoFocus
					placeholder="  Category "
					name="category"
					value={this.state.fields.category}
					onChange={this.onInputChange}
				/>
				<input
					size={25}
					name="title"
					placeholder="Task"
					value={this.state.fields.title}
					onChange={this.onInputChange}
				/>
				<input style={{ display: 'none' }} type="submit" />
			</form>
		);
	}
}

class TimeOptions extends Component {
	state = {
		options: [25, 45, 60]
	};

	selectOption = event => {
		this.props.optionClick(event.target.value);
	};

	render() {
		return (
			<div>
				<TimerOptionButtons
					options={this.state.options}
					onOptionClick={this.selectOption}
				/>
			</div>
		);
	}
}
const TimerOptionButtons = props =>
	props.options.map((option, i) => (
		<button key={i} onClick={props.onOptionClick} value={option}>
			{option} min
		</button>
	));

class ActionButtons extends Component {
	// prefer to have clean render function, so extract codes into button choice function
	renderButton = () => {
		let buttonText;
		if (this.props.isBreakRunning && !this.props.isTimerRunning)
			buttonText = 'Pause';
		else if (this.props.isCompleted) buttonText = 'Resume';
		else if (!this.props.isNew && !this.props.isTimerRunning)
			buttonText = 'Continue';
		else if (!this.props.isTimerRunning) buttonText = 'Start';
		else buttonText = 'Stop';
		return buttonText;
	};

	render() {
		return (
			<div>
				<button
					onClick={this.props.onButtonClick}
					value={this.renderButton(this.props)}>
					{this.renderButton(this.props)}
				</button>
				<button onClick={this.props.onButtonClick} value="cancel">
					Cancel
				</button>
			</div>
		);
	}
}
export default Timer;
