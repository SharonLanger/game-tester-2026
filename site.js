(() => {
  'use strict';
  const games = Array.isArray(window.GAME_LIST) ? window.GAME_LIST : [];
  if (document.body.dataset.page === 'home') {
    const list = document.querySelector('#games');
    document.querySelector('#game-count').textContent = games.length === 1 ? 'משחק אחד לבדיקה' : games.length + ' משחקים לבדיקה';
    if (!games.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'עדיין אין משחקים. המשחק הראשון שיתווסף לתיקייה יופיע כאן אוטומטית.';
      list.append(empty);
    }
    games.forEach(game => {
      const card = document.createElement('article');
      card.className = 'game-card';
      const icon = document.createElement('div');
      icon.className = 'iconbox';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = game.icon || '🎮';
      const name = document.createElement('h3');
      name.textContent = game.title;
      const description = document.createElement('p');
      description.textContent = game.description || 'גרסת בדיקה — בואו לשחק!';
      const link = document.createElement('a');
      link.className = 'button';
      link.href = 'play.html?game=' + encodeURIComponent(game.id);
      link.textContent = 'כניסה למשחק ←';
      card.append(icon, name, description, link);
      list.append(card);
    });
  }
  if (document.body.dataset.page === 'play') {
    const id = new URLSearchParams(location.search).get('game');
    const game = games.find(g => g.id === id);
    if (!game) {
      document.querySelector('#play-error').hidden = false;
      document.querySelector('#play-title').textContent = 'משחק לא נמצא';
      return;
    }
    document.querySelector('#play-title').textContent = game.title;
    document.title = game.title + ' | בודקים משחקים';
    const frame = document.querySelector('#game-frame');
    frame.title = game.title;
    frame.src = 'games/' + game.path;
    frame.hidden = false;
  }
})();
