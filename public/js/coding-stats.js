// coding-stats.js - Live stats loader for LeetCode and GitHub
document.addEventListener("DOMContentLoaded", () => {
  loadLeetCodeStats();
  loadGitHubStats();
});

async function loadLeetCodeStats() {
  const username = "chikaracreovations";
  const url = `https://alfa-leetcode-api.onrender.com/userProfile/${username}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("LeetCode API response not ok");
    const data = await res.json();

    if (data && typeof data.totalSolved === "number") {
      const totalSolved = data.totalSolved;
      const easySolved = data.easySolved || 0;
      const mediumSolved = data.mediumSolved || 0;
      const hardSolved = data.hardSolved || 0;
      const totalEasy = data.totalEasy || 974;
      const totalMed = data.totalMedium || 2136;
      const totalHard = data.totalHard || 986;

      const totalEl = document.getElementById("lcTotalSolved");
      if (totalEl) totalEl.textContent = totalSolved;

      const easyEl = document.getElementById("lcEasySolved");
      if (easyEl) easyEl.textContent = `${easySolved} / ${totalEasy}`;

      const medEl = document.getElementById("lcMediumSolved");
      if (medEl) medEl.textContent = `${mediumSolved} / ${totalMed}`;

      const hardEl = document.getElementById("lcHardSolved");
      if (hardEl) hardEl.textContent = `${hardSolved} / ${totalHard}`;

      // Calculate progress percentage with minimum 2% for visibility if > 0
      const easyPct = Math.max((easySolved / totalEasy) * 100, easySolved > 0 ? 3 : 0);
      const medPct = Math.max((mediumSolved / totalMed) * 100, mediumSolved > 0 ? 3 : 0);
      const hardPct = hardSolved > 0 ? Math.max((hardSolved / totalHard) * 100, 3) : 0;

      const easyBar = document.getElementById("lcEasyBar");
      if (easyBar) easyBar.style.width = `${easyPct.toFixed(1)}%`;

      const medBar = document.getElementById("lcMediumBar");
      if (medBar) medBar.style.width = `${medPct.toFixed(1)}%`;

      const hardBar = document.getElementById("lcHardBar");
      if (hardBar) hardBar.style.width = `${hardPct.toFixed(1)}%`;

      // Ranking
      const rankEl = document.getElementById("lcRanking");
      if (rankEl && data.ranking) {
        rankEl.textContent = `#${data.ranking.toLocaleString()}`;
      }

      // Acceptance
      const acceptEl = document.getElementById("lcAcceptance");
      if (acceptEl && data.matchedUserStats && data.matchedUserStats.acSubmissionNum) {
        const allAc = data.matchedUserStats.acSubmissionNum.find(i => i.difficulty === "All")?.submissions || 40;
        const allTotal = data.matchedUserStats.totalSubmissionNum?.find(i => i.difficulty === "All")?.submissions || 47;
        const rate = ((allAc / (allTotal || 1)) * 100).toFixed(1);
        acceptEl.textContent = `${rate}%`;
      }
    }
  } catch (err) {
    console.warn("Using verified cached LeetCode stats:", err.message);
    // Verified baseline fallback already rendered in HTML
  }
}

async function loadGitHubStats() {
  const username = "chikaracreovations";
  const url = `https://api.github.com/users/${username}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("GitHub API response not ok");
    const data = await res.json();

    if (data && typeof data.public_repos === "number") {
      const repoEl = document.getElementById("ghRepoCount");
      if (repoEl) repoEl.textContent = data.public_repos;

      const followersEl = document.getElementById("ghFollowers");
      if (followersEl) {
        followersEl.textContent = `${data.public_repos} Repos`;
      }
    }
  } catch (err) {
    console.warn("Using verified cached GitHub stats:", err.message);
    // Verified baseline fallback already rendered in HTML
  }
}

