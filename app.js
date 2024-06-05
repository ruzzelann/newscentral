
function showSection(sectionId) {
    // hide sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Shows chosen section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}
// title color 
document.addEventListener("DOMContentLoaded", function() {
    const textElement = document.getElementById('colored-text');
    const text = textElement.textContent;
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    
    textElement.innerHTML = '';

    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.backgroundColor = colors[i % colors.length];
        span.style.opacity = (i + 5) / text.length;
        textElement.appendChild(span);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const apiKey = 'cd6d8d2084584cb1a148b79bc8e2465d'; // Your API key from https://newsapi.org
    const youtubeApiKey = 'AIzaSyBJwQqFOLkl2AW5rUu1flkxvxKDx4TIbj4'; // Your API key from https://developers.google.com/youtube/v3
    const categories = [ 'bbc-home','news', 'travel', 'sports', 'culture'];
    const categoryContainers = {};

    // Create references to each category container
    categories.forEach(category => {
        categoryContainers[category] = {
            trending: document.getElementById(`${category}-trending`),
            more: document.getElementById(`${category}-more`),
            videos: document.getElementById(`${category}-videos`)
        };
    });

    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const searchedNewsContainer = document.getElementById("searched-news-container");
    const searchedNewsSection = document.getElementById("searched-news");

    // Function to create and append a news article
    function addArticle(article, container) {
        const articleDiv = document.createElement("div");
        articleDiv.className = "article";

        if (article.urlToImage) {
            const img = document.createElement("img");
            img.src = article.urlToImage;
            img.alt = article.title;
            articleDiv.appendChild(img);
        }

        const title = document.createElement("h2");
        const link = document.createElement("a");
        link.href = `article.html?title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.description)}&image=${encodeURIComponent(article.urlToImage)}&author=${encodeURIComponent(article.author)}&content=${encodeURIComponent(article.content)}&publishedAt=${encodeURIComponent(article.publishedAt)}&source=${encodeURIComponent(article.source.name)}&url=${encodeURIComponent(article.url)}`;
        link.textContent = article.title;
        link.target = "_self"; // Open link in the same tab
        title.appendChild(link);
        articleDiv.appendChild(title);

        const description = document.createElement("p");
        description.textContent = article.description;
        articleDiv.appendChild(description);

        container.appendChild(articleDiv);
    }

    // Function to create and append a video
    function addVideo(video, container) {
        const videoDiv = document.createElement("div");
        videoDiv.className = "video";

        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${video.id.videoId}`;
        iframe.width = "100%";
        iframe.height = "200px";
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        videoDiv.appendChild(iframe);

        const title = document.createElement("h3");
        title.textContent = video.snippet.title;
        videoDiv.appendChild(title);

        container.appendChild(videoDiv);
    }

    // Function to fetch and display articles for a given category
    function fetchCategoryArticles(category) {
        let url;

        switch (category) {
            case 'bbc-home':
                url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${apiKey}`;
                break;
            case 'news':
                url = `https://newsapi.org/v2/top-headlines?category=general&country=us&apiKey=${apiKey}`;
                break;
            case 'travel':
                url = `https://newsapi.org/v2/everything?q=travel&apiKey=${apiKey}`;
                break;
            case 'sports':
                url = `https://newsapi.org/v2/top-headlines?category=sports&country=us&apiKey=${apiKey}`;
                break;
            case 'culture':
                url = `https://newsapi.org/v2/top-headlines?category=entertainment&country=us&apiKey=${apiKey}`;
                break;
            default:
                url = `https://newsapi.org/v2/top-headlines?category=general&country=us&apiKey=${apiKey}`;
                break;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const articles = data.articles;
                const trendingContainer = categoryContainers[category].trending;
                const moreContainer = categoryContainers[category].more;

                articles.slice(0, 5).forEach(article => addArticle(article, trendingContainer));
                articles.slice(5).forEach(article => addArticle(article, moreContainer));
            })
            .catch(error => console.error("Error fetching category articles:", error));
    }

    // Function to fetch and display videos for a given category
    function fetchCategoryVideos(category) {
        const query = category === 'bbc-home' ? 'BBC' : category;
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${youtubeApiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const videos = data.items;
                const videosContainer = categoryContainers[category].videos;

                videos.forEach(video => addVideo(video, videosContainer));
            })
            .catch(error => console.error("Error fetching category videos:", error));
    }

    // Function to fetch search results
    function fetchSearchResults(query) {
        const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const articles = data.articles;
                searchedNewsContainer.innerHTML = ''; // Clear previous search results

                articles.forEach(article => addArticle(article, searchedNewsContainer));

                // Show the search results section if there are results
                searchedNewsSection.style.display = articles.length > 0 ? 'block' : 'none';
            })
            .catch(error => console.error("Error fetching search results:", error));
    }

    // Attach event listener to the search button
    searchButton.addEventListener("click", function() {
        const query = searchInput.value.trim();
        if (query) {
            fetchSearchResults(query);
        }
    });

    // Load articles and videos for each category
    categories.forEach(category => {
        fetchCategoryArticles(category);
        fetchCategoryVideos(category);
    });

    // Automatically open the "BBC Home" tab and load its content on page load
    document.getElementById("defaultOpen").click();
});

// Function to open a category tab
function openCategory(evt, categoryName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(categoryName).style.display = "block";
    evt.currentTarget.className += " active";
}
