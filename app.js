/* Pumpkin Night — Family Halloween Night Planner.
   Plain JavaScript, no libraries. All data lives in localStorage under one key.
   No network calls, no tracking. */

'use strict';

var STORAGE_KEY = 'pumpkinNight.v1';
var MAX_PHOTO_DIM = 320;      // photos are shrunk to this size before saving
var MAX_PHOTOS = 24;

/* ---------- state ---------- */

var DEFAULT_CHECKLIST = [
  'Flashlight (and spare batteries)',
  'Candy bag or bucket',
  'Reflective tape or vest',
  'Phone charged',
  'Water bottle',
  'First-aid kit',
  'Warm layer for later in the night',
  'House keys',
  'Cash and coins',
  'Camera'
];

function defaultState() {
  return {
    stops: [],      // {id, name, minutes, note, safety}
    members: [],    // {id, name, age, tag}
    photos: [],     // {id, src, caption, year}
    checklist: DEFAULT_CHECKLIST.map(function (label, i) {
      return { id: 'c' + i, label: label, done: false, custom: false };
    })
  };
}

var state = load();

function load() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    var parsed = JSON.parse(raw);
    // Fill in anything missing so old saved data still works.
    var fresh = defaultState();
    if (Array.isArray(parsed.stops)) fresh.stops = parsed.stops;
    if (Array.isArray(parsed.members)) fresh.members = parsed.members;
    if (Array.isArray(parsed.photos)) fresh.photos = parsed.photos;
    if (Array.isArray(parsed.checklist) && parsed.checklist.length) fresh.checklist = parsed.checklist;
    return fresh;
  } catch (e) {
    return defaultState();
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    // Storage full (usually too many/large photos). Tell the user plainly.
    alert('Could not save: browser storage is full. Delete a photo and try again.');
    return false;
  }
}

function uid() {
  return 'id' + Date.now().toString(36) + Math.floor(Math.random() * 10000).toString(36);
}

/* Small helper: create an element with safe text (no HTML injection). */
function el(tag, text, className) {
  var node = document.createElement(tag);
  if (text !== undefined && text !== null) node.textContent = text;
  if (className) node.className = className;
  return node;
}

/* ---------- countdown to the next October 31 ---------- */

function nextHalloween(now) {
  // Halloween night starts at 6:00 PM local time on October 31.
  var target = new Date(now.getFullYear(), 9, 31, 18, 0, 0);
  if (now >= target) target = new Date(now.getFullYear() + 1, 9, 31, 18, 0, 0);
  return target;
}

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  var now = new Date();
  var target = nextHalloween(now);
  var diff = Math.max(0, target - now);
  var days = Math.floor(diff / 86400000);
  var hours = Math.floor(diff / 3600000) % 24;
  var minutes = Math.floor(diff / 60000) % 60;
  var seconds = Math.floor(diff / 1000) % 60;
  document.getElementById('cd-days').textContent = days;
  document.getElementById('cd-hours').textContent = pad(hours);
  document.getElementById('cd-minutes').textContent = pad(minutes);
  document.getElementById('cd-seconds').textContent = pad(seconds);
  document.getElementById('cd-target').textContent =
    'October 31, ' + target.getFullYear() + ' · 6:00 PM';
}

/* ---------- 1. trick-or-treat route ---------- */

function renderStops() {
  var list = document.getElementById('stop-list');
  list.innerHTML = '';
  var total = 0;
  state.stops.forEach(function (stop, index) {
    total += stop.minutes;
    var li = el('li', null, 'stop-item');

    li.appendChild(el('span', String(index + 1), 'stop-order'));

    var body = el('div', null, 'stop-body');
    var title = el('strong');
    title.appendChild(document.createTextNode(stop.name + ' '));
    var mins = el('span', stop.minutes + ' min', 'stop-minutes');
    title.appendChild(mins);
    body.appendChild(title);
    if (stop.note) body.appendChild(el('p', stop.note));
    if (stop.safety) body.appendChild(el('p', 'Safety: ' + stop.safety));
    li.appendChild(body);

    var actions = el('div', null, 'stop-actions');
    var up = el('button', '↑', 'icon-btn');
    up.type = 'button';
    up.setAttribute('aria-label', 'Move ' + stop.name + ' up');
    up.disabled = index === 0;
    up.addEventListener('click', function () { moveStop(index, -1); });
    var down = el('button', '↓', 'icon-btn');
    down.type = 'button';
    down.setAttribute('aria-label', 'Move ' + stop.name + ' down');
    down.disabled = index === state.stops.length - 1;
    down.addEventListener('click', function () { moveStop(index, 1); });
    var remove = el('button', 'Remove', 'icon-btn danger');
    remove.type = 'button';
    remove.setAttribute('aria-label', 'Remove ' + stop.name);
    remove.addEventListener('click', function () { removeStop(stop.id); });
    actions.appendChild(up);
    actions.appendChild(down);
    actions.appendChild(remove);
    li.appendChild(actions);

    list.appendChild(li);
  });

  var totalEl = document.getElementById('route-total');
  if (state.stops.length === 0) {
    totalEl.textContent = 'No stops yet. Total route time: 0 minutes.';
  } else {
    totalEl.textContent = state.stops.length + (state.stops.length === 1 ? ' stop' : ' stops') +
      '. Total route time: ' + total + ' minutes.';
  }
}

function moveStop(index, delta) {
  var next = index + delta;
  if (next < 0 || next >= state.stops.length) return;
  var tmp = state.stops[index];
  state.stops[index] = state.stops[next];
  state.stops[next] = tmp;
  save();
  renderStops();
}

function removeStop(id) {
  state.stops = state.stops.filter(function (s) { return s.id !== id; });
  save();
  renderStops();
}

document.getElementById('stop-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var name = document.getElementById('stop-name').value.trim();
  var minutes = parseInt(document.getElementById('stop-minutes').value, 10);
  if (!name || !(minutes >= 1)) return;
  state.stops.push({
    id: uid(),
    name: name,
    minutes: Math.min(120, minutes),
    note: document.getElementById('stop-note').value.trim(),
    safety: document.getElementById('stop-safety').value.trim()
  });
  save();
  renderStops();
  e.target.reset();
  document.getElementById('stop-minutes').value = 10;
  document.getElementById('stop-name').focus();
});

/* ---------- 2. costume matcher ---------- */

/* Family themes. Each theme lists a costume for each age group and the
   interest tags it fits. The matcher scores themes against the members. */
var THEMES = [
  {
    name: 'Classic Monsters',
    note: 'The old favorites, all in one family photo.',
    tags: ['spooky', 'classic'],
    costumes: { child: 'Little ghost', teen: 'Vampire', adult: "Frankenstein's monster" }
  },
  {
    name: 'Pumpkin Patch Crew',
    note: 'Straight from the pumpkin patch.',
    tags: ['classic', 'funny'],
    costumes: { child: 'Pumpkin', teen: 'Scarecrow', adult: 'Witch' }
  },
  {
    name: 'Superhero Squad',
    note: 'One hero, one sidekick, one villain.',
    tags: ['hero', 'movie'],
    costumes: { child: 'Junior superhero', teen: 'Masked hero', adult: 'Super villain' }
  },
  {
    name: 'Animal Parade',
    note: 'A different animal for each person.',
    tags: ['animal', 'funny'],
    costumes: { child: 'Black cat', teen: 'Werewolf', adult: 'Wise owl' }
  },
  {
    name: 'Movie Night Frights',
    note: 'Costumes from the films everyone knows.',
    tags: ['movie', 'spooky'],
    costumes: { child: 'Young wizard', teen: 'Ghost hunter', adult: 'Pirate captain' }
  },
  {
    name: 'Fairytale Frights',
    note: 'A storybook gone spooky.',
    tags: ['classic', 'spooky'],
    costumes: { child: 'Little Red Riding Hood', teen: 'Big Bad Wolf', adult: 'Wicked Queen' }
  },
  {
    name: 'Space Spooks',
    note: 'Halloween, but make it orbit.',
    tags: ['hero', 'movie'],
    costumes: { child: 'Little alien', teen: 'Astronaut', adult: 'Robot' }
  }
];

/* Individual ideas: age group + interest tag -> two concrete costumes. */
var IDEAS = {
  child: {
    spooky: ['Little ghost', 'Friendly bat'],
    funny: ['Banana', 'Slice of pizza'],
    hero: ['Junior superhero', 'Firefighter'],
    animal: ['Black cat', 'Little lion'],
    classic: ['Pumpkin', 'Witch in training'],
    movie: ['Toy cowboy', 'Young wizard']
  },
  teen: {
    spooky: ['Vampire', 'Grim reaper'],
    funny: ['Inflatable dinosaur', 'Hot dog'],
    hero: ['Masked hero', 'Space ranger'],
    animal: ['Werewolf', 'Fox'],
    classic: ['Scarecrow', 'Mad scientist'],
    movie: ['Ghost hunter', 'Time traveler']
  },
  adult: {
    spooky: ["Frankenstein's monster", 'Headless horseman'],
    funny: ['Disco skeleton', 'Giant taco'],
    hero: ['Superhero', 'Knight'],
    animal: ['Owl', 'Wolf'],
    classic: ['Witch', 'Wizard'],
    movie: ['Detective', 'Pirate captain']
  }
};

var AGE_LABELS = { child: 'Child', teen: 'Teen', adult: 'Adult' };
var TAG_LABELS = {
  spooky: 'Spooky', funny: 'Funny', hero: 'Hero',
  animal: 'Animal', classic: 'Classic', movie: 'Movie'
};

function renderMembers() {
  var list = document.getElementById('member-list');
  list.innerHTML = '';
  state.members.forEach(function (m) {
    var li = el('li', null, 'member-chip');
    li.appendChild(document.createTextNode(
      m.name + ' · ' + AGE_LABELS[m.age] + ' · ' + TAG_LABELS[m.tag] + ' '));
    var remove = el('button', '✕', 'icon-btn danger');
    remove.type = 'button';
    remove.setAttribute('aria-label', 'Remove ' + m.name);
    remove.addEventListener('click', function () { removeMember(m.id); });
    li.appendChild(remove);
    list.appendChild(li);
  });
  renderThemes();
  renderMemberIdeas();
}

function removeMember(id) {
  state.members = state.members.filter(function (m) { return m.id !== id; });
  save();
  renderMembers();
}

function renderThemes() {
  var box = document.getElementById('theme-results');
  var empty = document.getElementById('theme-empty');
  box.innerHTML = '';
  if (state.members.length === 0) {
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';

  var agesPresent = {};
  state.members.forEach(function (m) { agesPresent[m.age] = true; });

  var scored = THEMES.map(function (theme) {
    var matches = 0;
    state.members.forEach(function (m) {
      if (theme.tags.indexOf(m.tag) !== -1) matches++;
    });
    return { theme: theme, matches: matches };
  });
  scored.sort(function (a, b) { return b.matches - a.matches; });

  scored.forEach(function (entry, i) {
    // Only the first card is marked as the best match, even when several
    // themes tie on score — marking every tied card made the highlight
    // meaningless. The score line on each card still shows its own count.
    var card = el('div', null, 'theme-card' + (i === 0 && entry.matches > 0 ? ' top' : ''));
    card.appendChild(el('h4', entry.theme.name));
    card.appendChild(el('p', entry.theme.note));
    var score = el('p', null, 'theme-score');
    score.textContent = entry.matches > 0
      ? 'Matches ' + entry.matches + ' of ' + state.members.length + ' member' +
        (state.members.length === 1 ? '' : 's') + '.'
      : 'No direct tag match — still works as a group theme.';
    card.appendChild(score);
    var ul = el('ul');
    ['child', 'teen', 'adult'].forEach(function (age) {
      if (agesPresent[age]) {
        ul.appendChild(el('li', AGE_LABELS[age] + ': ' + entry.theme.costumes[age]));
      }
    });
    card.appendChild(ul);
    box.appendChild(card);
  });
}

function renderMemberIdeas() {
  var box = document.getElementById('member-ideas');
  box.innerHTML = '';
  state.members.forEach(function (m) {
    var ideas = (IDEAS[m.age] && IDEAS[m.age][m.tag]) || [];
    var row = el('div', null, 'idea-row');
    row.appendChild(el('strong', m.name + ' (' + AGE_LABELS[m.age] + ', ' + TAG_LABELS[m.tag] + '): '));
    row.appendChild(document.createTextNode(ideas.join(' or ')));
    box.appendChild(row);
  });
}

document.getElementById('member-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var name = document.getElementById('member-name').value.trim();
  if (!name) return;
  state.members.push({
    id: uid(),
    name: name,
    age: document.getElementById('member-age').value,
    tag: document.getElementById('member-tag').value
  });
  save();
  renderMembers();
  e.target.reset();
  document.getElementById('member-name').focus();
});

/* ---------- 3. photo memory album ---------- */

function renderPhotos() {
  var grid = document.getElementById('photo-grid');
  grid.innerHTML = '';
  state.photos.forEach(function (photo) {
    var item = el('div', null, 'photo-item');
    var img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.caption || 'Halloween photo';
    item.appendChild(img);
    var meta = el('div', null, 'photo-meta');
    if (photo.caption) meta.appendChild(el('p', photo.caption));
    meta.appendChild(el('p', String(photo.year), 'photo-year'));
    var remove = el('button', 'Delete photo', 'icon-btn danger');
    remove.type = 'button';
    remove.setAttribute('aria-label', 'Delete photo' + (photo.caption ? ': ' + photo.caption : ''));
    remove.addEventListener('click', function () { removePhoto(photo.id); });
    meta.appendChild(remove);
    item.appendChild(meta);
    grid.appendChild(item);
  });
  var count = document.getElementById('photo-count');
  count.textContent = state.photos.length === 0
    ? 'No photos saved yet.'
    : state.photos.length + ' photo' + (state.photos.length === 1 ? '' : 's') +
      ' saved in this browser (max ' + MAX_PHOTOS + ').';
}

function removePhoto(id) {
  state.photos = state.photos.filter(function (p) { return p.id !== id; });
  save();
  renderPhotos();
}

/* Shrink the image to a small thumbnail so localStorage stays usable. */
function downscaleImage(file, done) {
  var reader = new FileReader();
  reader.onload = function () {
    var img = new Image();
    img.onload = function () {
      var scale = Math.min(1, MAX_PHOTO_DIM / Math.max(img.width, img.height));
      var canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      done(canvas.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = function () { done(null); };
    img.src = reader.result;
  };
  reader.onerror = function () { done(null); };
  reader.readAsDataURL(file);
}

document.getElementById('photo-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var fileInput = document.getElementById('photo-file');
  var file = fileInput.files && fileInput.files[0];
  if (!file) return;
  if (state.photos.length >= MAX_PHOTOS) {
    alert('Album is full (' + MAX_PHOTOS + ' photos). Delete one first.');
    return;
  }
  var caption = document.getElementById('photo-caption').value.trim();
  var year = parseInt(document.getElementById('photo-year').value, 10) || new Date().getFullYear();
  downscaleImage(file, function (dataUrl) {
    if (!dataUrl) {
      alert('That file could not be read as an image.');
      return;
    }
    var before = state.photos.length;
    state.photos.push({ id: uid(), src: dataUrl, caption: caption, year: year });
    if (!save()) {
      // Storage full: roll back the photo we just added.
      state.photos = state.photos.slice(0, before);
      return;
    }
    renderPhotos();
    e.target.reset();
    document.getElementById('photo-year').value = new Date().getFullYear();
  });
});

/* ---------- 4. night-of checklist ---------- */

function renderChecklist() {
  var list = document.getElementById('checklist');
  list.innerHTML = '';
  var done = 0;
  state.checklist.forEach(function (item) {
    if (item.done) done++;
    var li = el('li', null, item.done ? 'done' : '');
    var box = document.createElement('input');
    box.type = 'checkbox';
    box.id = 'chk-' + item.id;
    box.checked = item.done;
    box.addEventListener('change', function () {
      item.done = box.checked;
      save();
      renderChecklist();
    });
    li.appendChild(box);
    var label = el('label', item.label);
    label.htmlFor = box.id;
    li.appendChild(label);
    if (item.custom) {
      var remove = el('button', '✕', 'icon-btn danger');
      remove.type = 'button';
      remove.setAttribute('aria-label', 'Remove checklist item: ' + item.label);
      remove.addEventListener('click', function () { removeCheckItem(item.id); });
      li.appendChild(remove);
    }
    list.appendChild(li);
  });
  document.getElementById('checklist-progress').textContent =
    done + ' of ' + state.checklist.length + ' packed.';
}

function removeCheckItem(id) {
  state.checklist = state.checklist.filter(function (c) { return c.id !== id; });
  save();
  renderChecklist();
}

document.getElementById('check-item-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var input = document.getElementById('custom-item');
  var label = input.value.trim();
  if (!label) return;
  state.checklist.push({ id: uid(), label: label, done: false, custom: true });
  save();
  renderChecklist();
  input.value = '';
  input.focus();
});

document.getElementById('reset-checklist').addEventListener('click', function () {
  state.checklist = defaultState().checklist;
  save();
  renderChecklist();
});

/* ---------- start ---------- */

renderStops();
renderMembers();
renderPhotos();
renderChecklist();
updateCountdown();
setInterval(updateCountdown, 1000);
