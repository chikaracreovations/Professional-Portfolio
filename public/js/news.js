const newsList = [
    {
        id: 1,
        text:"More blogs coming soon. Keep an eye out! ",
    },
    {
        id: 2,
        text: "New update on the journal website: You can now add images to capture key moments from your day",
    },
    // Add more news items here...
    {
        id: 3,
        text: `Check out the latest horror-themed Days Until website <a href="https://chikaracreovations.github.io/WebApps/daysuntil.html" target="_blank">here</a>!`,
    },

];



function renderNews() {
    const newsContainer = document.querySelector('.news-list');
    newsContainer.innerHTML = ""; // Clear any previous content

    newsList.forEach(newsItem => {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        newsElement.innerHTML = `<p class="news-text">${newsItem.text}</p>`;
        newsContainer.appendChild(newsElement);
    });
}

// Initialize
renderNews();


