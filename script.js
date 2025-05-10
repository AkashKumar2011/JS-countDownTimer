timers = [];

function addTimer() {
  const name = document.getElementById('timer-name').value;
  const date = document.getElementById('date-input').value;
  const time = document.getElementById('time-input').value;

  if (!name || !date || !time) {
    alert("Please fill in all fields.");
    return;
  }

  const target = new Date(`${date}T${time}`).getTime();
  if (isNaN(target)) {
    alert("Invalid date/time format.");
    return;
  }

  const id = Date.now();
  const timerObj = {
    id,
    name,
    target,
    paused: false,
    interval: null
  };

  timers.push(timerObj);
  renderTimer(timerObj);

  document.getElementById('timer-name').value = "";
  document.getElementById('date-input').value = "";
  document.getElementById('time-input').value = "";
}

function renderTimer(timer) {
  const timerBox = document.createElement('div');
  timerBox.className = 'timer-box';
  timerBox.id = `timer-${timer.id}`;

  timerBox.innerHTML = `
    <div class="message" id="message-${timer.id}">Timer Start</div>
    <button class="cancel-btn" onclick="removeTimer(${timer.id})">✖</button>
    <div class="timer-name">${timer.name}</div>
    <div class="countdown">
      <div><span id="days-${timer.id}">00</span><span class="timerTxt">Days</span></div>
      <div><span id="hours-${timer.id}">00</span><span class="timerTxt">Hours</span></div>
      <div><span id="minutes-${timer.id}">00</span><span class="timerTxt">Minutes</span></div>
      <div><span id="seconds-${timer.id}">00</span><span class="timerTxt">Seconds</span></div>
    </div>
    <button class="stopBtn" onclick="togglePause(${timer.id})">Pause</button>
  `;

  document.getElementById('timers').appendChild(timerBox);
  startCountdown(timer);
}

function removeTimer(id) {
  const timerIndex = timers.findIndex(t => t.id === id);
  if (timerIndex > -1) {
    clearInterval(timers[timerIndex].interval);
    timers.splice(timerIndex, 1); // Remove from array
    const timerBox = document.getElementById(`timer-${id}`);
    if (timerBox) timerBox.remove(); // Remove from DOM
  }
}

function togglePause(id) {
  const timer = timers.find(t => t.id === id);
  if (!timer) return;

  timer.paused = !timer.paused;
  // const btn = document.querySelector(`#timer-${id} button`);
  const btn = document.querySelector(`#timer-${id} .stopBtn`);
  btn.textContent = timer.paused ? 'Resume' : 'Pause';

  // const message = document.getElementById(`message-${id} .message`);
  // message.textContent = timer.paused ? "Timer Stop" : "Timer Started";
  // message.style.background = timer.paused ? "orangered" : "green";
  // message.style.color = timer.paused ? "yellow" : "white";
}

function startCountdown(timer) {
  timer.interval = setInterval(() => {
    if (timer.paused) return;

    const now = new Date().getTime();
    const diff = timer.target - now;

    if (diff <= 0) {
      clearInterval(timer.interval);
      document.getElementById(`days-${timer.id}`).textContent = "00";
      document.getElementById(`hours-${timer.id}`).textContent = "00";
      document.getElementById(`minutes-${timer.id}`).textContent = "00";
      document.getElementById(`seconds-${timer.id}`).textContent = "00";
      document.getElementById(`message-${timer.id}`).textContent = "Time's up! 🎉";
      document.getElementById(`message-${timer.id}`).style.background = "orangered";
      document.getElementById(`message-${timer.id}`).style.color = "yellow";
      document.getElementById("alarm-sound").play();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById(`days-${timer.id}`).textContent = String(days).padStart(2, '0');
    document.getElementById(`hours-${timer.id}`).textContent = String(hours).padStart(2, '0');
    document.getElementById(`minutes-${timer.id}`).textContent = String(minutes).padStart(2, '0');
    document.getElementById(`seconds-${timer.id}`).textContent = String(seconds).padStart(2, '0');
  }, 1000);
} 