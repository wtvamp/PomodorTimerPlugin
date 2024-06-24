import PomodoroTimerPlugin from '../src/PomodoroTimerPlugin';

describe('PomodoroTimerPlugin', () => {
  let chart;
  let timerInput;
  let shortBreakElement;
  let longBreakElement;
  let startButton;
  let stopButton;
  let resetButton;

  beforeEach(() => {
    // Set up the DOM elements for testing
    document.body.innerHTML = `
      <canvas id="pomodoroChart"></canvas>
      <input type="text" id="timerInput" value="2" />
      <input type="text" id="shortBreakInput" value="1" />
      <input type="text" id="longBreakInput" value="2" />
      <button id="timerStart">Start</button>
      <button id="timerStop">Stop</button>
      <button id="timerReset">Reset</button>
    `;
    chart = {
        data: {
          datasets: [{ data: [0, 12] }] // Initial data for testing
        },
        update: jest.fn() // Mock the chart update method
    };
    timerInput = document.getElementById('timerInput');
    shortBreakElement = document.getElementById('shortBreakInput');
    longBreakElement = document.getElementById('longBreakInput');
    startButton = document.getElementById('timerStart');
    stopButton = document.getElementById('timerStop');
    resetButton = document.getElementById('timerReset');

    // Initialize the Pomodoro Timer Plugin
    PomodoroTimerPlugin.install(chart, {}, {
      timerInputId: 'timerInput',
      shortBreakInputId: 'shortBreakInput',
      longBreakInputId: 'longBreakInput',
      startButtonId: 'timerStart',
      stopButtonId: 'timerStop',
      resetButtonId: 'timerReset'
    });

    jest.useFakeTimers();
  });

  test('Timer Start', () => {
    startButton.click(); // Start the timer
    expect(timerInput.disabled).toBe(true); // Timer input should be disabled
    expect(startButton.disabled).toBe(true); // Start button should be disabled
    expect(stopButton.disabled).toBe(false); // Stop button should be enabled
    expect(resetButton.disabled).toBe(false); // Reset button should be enabled

    // Simulate timer update
    jest.advanceTimersByTime(2000); // Advance timer by 1 second; Set to 2s to account for 'timeLeft' property being set at -1 on install.
    expect(chart.data.datasets[0].data[0]).toBe(1); // Check if chart data is updated
    // Add more assertions as needed
  });

  test('Timer Stop', () => {
    startButton.click(); // Start the timer
    stopButton.click(); // Stop the timer
    expect(timerInput.disabled).toBe(true); // Timer input should still be disabled
    expect(startButton.disabled).toBe(false); // Start button should be enabled again
    expect(stopButton.disabled).toBe(true); // Stop button should be disabled
    expect(resetButton.disabled).toBe(false); // Reset button should still be enabled

    // Add more assertions to test timer stopping functionality
  });

  test('Timer Reset', () => {
    startButton.click();
    jest.advanceTimersByTime(11000);
    expect(chart.data.datasets[0].data[0]).toBe(10);
    stopButton.click();
    resetButton.click();
    expect(chart.data.datasets[0].data[0]).toBe(0)
  });

  test('Timer Skip', () => {
    startButton.click();
    let { taskCycleIndex } = PomodoroTimerPlugin.privateVariables.get(PomodoroTimerPlugin);
    expect(taskCycleIndex).toBe(0);
    PomodoroTimerPlugin.handleSkipTimer();
    taskCycleIndex = PomodoroTimerPlugin.privateVariables.get(PomodoroTimerPlugin).taskCycleIndex;
    expect(taskCycleIndex).toBe(1)
  });

  test('Methods are immutable', () => {
    expect(() => { PomodoroTimerPlugin.handleStartTimer = "potato" }).toThrow(TypeError);
    expect(() => { PomodoroTimerPlugin.handleStopTimer = 200 }).toThrow(TypeError);
    expect(() => { PomodoroTimerPlugin.handleSkipTimer = {foo: "bar"} }).toThrow(TypeError);
    expect(() => { PomodoroTimerPlugin.handleResetTimer = () => "override function" }).toThrow(TypeError);
  })

  // Add more test cases as needed
});
