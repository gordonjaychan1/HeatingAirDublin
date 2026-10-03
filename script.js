// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
  });
});

// "Open now" status, based on business hours in Pacific time.
// Hours in minutes after midnight; day 0 = Sunday.
const HOURS = {
  weekday: { open: 7 * 60 + 30, close: 19 * 60 + 30, label: '7:30 PM', openLabel: '7:30 AM' },
  weekend: { open: 9 * 60, close: 17 * 60, label: '5 PM', openLabel: '9 AM' },
};

function pacificNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false,
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const minutes = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
  return { day, minutes };
}

const hoursFor = (day) => (day === 0 || day === 6 ? HOURS.weekend : HOURS.weekday);

function updateStatus() {
  const { day, minutes } = pacificNow();
  const today = hoursFor(day);
  const status = document.getElementById('openStatus');
  const dot = document.querySelector('.status-dot');

  if (minutes >= today.open && minutes < today.close) {
    status.textContent = `Open now · until ${today.label}`;
    dot.classList.add('open');
  } else {
    const next = minutes < today.open ? today : hoursFor((day + 1) % 7);
    const when = minutes < today.open ? 'today' : 'tomorrow';
    status.textContent = `Closed now · opens ${when} at ${next.openLabel}`;
    dot.classList.remove('open');
  }

  document.querySelectorAll('.hours-table tr').forEach((row) => {
    row.classList.toggle('today', row.dataset.days.split(',').includes(String(day)));
  });
}

updateStatus();
setInterval(updateStatus, 60 * 1000);

document.getElementById('year').textContent = new Date().getFullYear();
