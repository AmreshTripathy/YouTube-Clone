// const apiKey = "AIzaSyANx1UPkWHvToob56jN_YyFHFqGhQozdIA";
const apiKey = "AIzaSyBgWM9TxrPL4Y7Kql7vAnZzgb0_oO6KfhE";
// const apiKey = "AIzaSyBetu2BtPlE_YOZx2Pnb38epfP-AU5Qr6g";
// const apiKey = "AIzaSyB4sZV9KvbcX4Be-ZDTtg6hys9m6Oa1Irk";
const baseUrl = "https://www.googleapis.com/youtube/v3";
const container = document.getElementById("videos");

async function fetchSearchResult(searchString) {
    var url = `${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=24`;
    try {
        const response = await fetch(url);
        const result = await response.json();
        renderVideosOnUi(result.items);
    } catch (error) {
        console.log(error);
        alert("Some error occured");
    }
}


function renderVideosOnUi(videosList) {
    videosList.forEach(async (video) => {
        var url = `${baseUrl}/videos?key=${apiKey}&part=snippet,contentDetails,statistics&id=${video.id.videoId}`;

        let url_1 = `${baseUrl}/channels?key=${apiKey}&part=snippet,contentDetails,statistics&id=${video.snippet.channelId}`;


        fetch(url)
            .then(response => response.json())
            .then(data => {
                fetch(url_1)
                    .then(response => response.json())
                    .then(data_1 => {
                        const videoContainer = document.createElement("div");
                        videoContainer.className = "card";
                        videoContainer.innerHTML = `
                    <img src="${video.snippet.thumbnails.high.url}" alt="video">
                    <div class="card-info">
                        <div class="part-1"><img src="${data.items[0].snippet.thumbnails.default.url}" alt="logo"></div>
                        <div class="part-2">
                            <div class="part-2-1">${video.snippet.title}</p></div>
                                <div class="part-2-2">
                                    <p>${video.snippet.channelTitle}</p>
                                    <p>${formatViewCount((data.items[0]["statistics"]["viewCount"]) ? data.items[0]["statistics"]["viewCount"] : 0)}${calculateTimeGap(video.snippet.publishTime)}</p>
                                </div>
                            </div>
                        </div>`;
                        container.appendChild(videoContainer);
                    })
            })
            .catch(error => {
                console.log(error);
            })
    });
}

function formatViewCount(viewCount) {
    var views = parseInt(viewCount);
    let count;
    if (views < 1000) {
        count = views;
    } else if (views < 1000000) {
        count = Math.ceil(views / 1000) + "K";
    } else if (views < 1000000000) {
        count = Math.ceil(views / 1000000) + "M";
    } else {
        count = Math.ceil(views / 1000000000) + "B";
    }
    return count + " Views . ";
}

function calculateTimeGap(publishTime) {
    let publishDate = new Date(publishTime);
    let currentDate = new Date();

    let secondsGap = (currentDate.getTime() - publishDate.getTime()) / 1000;

    const secondsPerDay = 24 * 60 * 60;
    const secondsPerWeek = 7 * secondsPerDay;
    const secondsPerMonth = 30 * secondsPerDay;
    const secondsPerYear = 365 * secondsPerDay;

    if (secondsGap < secondsPerDay) {
        return `${Math.ceil(secondsGap / (60 * 60))}hrs ago`;
    }
    if (secondsGap < secondsPerWeek) {
        return `${Math.ceil(secondsGap / secondsPerWeek)} weeks ago`;
    }
    if (secondsGap < secondsPerMonth) {
        return `${Math.ceil(secondsGap / secondsPerMonth)} months ago1`;
    }
    if (secondsGap < secondsPerYear) {
        return `${Math.ceil(secondsGap / secondsPerYear)} years ago`;
    }
}


fetchSearchResult("");

var input_box = document.getElementById("input-box");

function search_result() {
    input_box.setAttribute("class", "input-cursor");
    fetchSearchResult(input_box.value);
    container.innerHTML = ``;
}

input_box.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      search_result();
    }
  });

input_box.addEventListener('mouseup', function(event) {
    input_box.classList.remove("input-cursor");
});