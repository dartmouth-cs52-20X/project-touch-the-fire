/* eslint-disable no-plusplus */
import escape from 'lodash/escape';

const leaderboard = document.getElementById('leaderboard');
// Includes the header row
const rows = document.querySelectorAll('#leaderboard table tr');

// Using the method from https://victorzhou.com/blog/build-an-io-game-part-1/
// Might want to rethink the leaderboard later
export function updateLeaderboard(data) {
  for (let i = 0; i < data.length; i++) {
    // i + 1 b/c need to skip over the header row
    rows[i + 1].innerHTML = `<td>${escape(data[i].username.slice(0, 15)) || 'Anonymous'}</td><td>${data[i].score}</td>`;
  }
  for (let i = data.length; i < 5; i++) {
    rows[i + 1].innerHTML = '<td>-</td><td>-</td>';
  }
}

export function setLeaderboardHidden(hidden) {
  if (hidden) {
    leaderboard.classList.add('hidden');
  } else {
    leaderboard.classList.remove('hidden');
  }
}
