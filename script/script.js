// Have an array of 6 or more city names, [new york, toronto, california, chicago, montreal, london]
// Github jobs = 3 job listings using search param of city names
// Teleport api = image of 6 cities using city id

// Loop through the cityArr and call the github api to get a list of 3 job titles, and link to that site from that city using the keyword search url, At the same time, Call the teleport city api and get an image of that city, and use the when() jquery method we get both promises resolved, we append both response from both api calls onto the page, below the each city categories.
// The user is able to click onto each job achor and be taken to be taken to the original external job posting.

// DOM element selections
const jobListingContainer = $(".jobListingsContainer");
const citySelected = $(".citySelect");
const scoreCategory = $(".scoreCategory");

gitHiredApp = {};
gitHiredApp.init = () => {
  gitHiredApp.cityArray = [
    "new-york",
    "toronto",
    "los-angeles",
    "chicago",
    "montreal",
    "london",
    "boston",
    "lisbon",
    "berlin",
    "san-francisco-bay-area",
    "barcelona",
    "hamburg"
  ];

  gitHiredApp.cityImageUrlObject = {};
  gitHiredApp.teleCityBaseUrl = "https://api.teleport.org/api/urban_areas/";
  gitHiredApp.githubJobBaseUrl = "https://jobs.github.com/positions.json";
};

// Ajax from Teleport API
gitHiredApp.teleCityReusableApiCall = (cityName, infoType) => {
  return $.ajax({
    url: `${gitHiredApp.teleCityBaseUrl}slug:${cityName}/${infoType}`,
    dataType: "json",
    method: "GET"
  });
};

// Ajax from GitHub Jobs API
gitHiredApp.githubJobsReusableApiCall = cityName => {
  return $.ajax({
    url: "http://proxy.hackeryou.com",
    dataType: "json",
    method: "GET",
    data: {
      reqUrl: gitHiredApp.githubJobBaseUrl,
      params: {
        location: cityName
      },
      xmlToJSON: false,
      useCache: false
    }
  });
};

// Appends City Image to Landing Page
gitHiredApp.teleCityImageAjaxCall = cityName => {
  let selectCityImageContainer = $(`.${cityName} .imageContainer`);
  gitHiredApp.teleCityReusableApiCall(cityName, "images").then(res => {
    const renderHtml = `<img src=${
      res.photos[0].image.mobile
    } alt="This is a photo of ${cityName.replace("-", " ")}" />`;
    gitHiredApp.cityImageUrlObject[cityName] = renderHtml;
    selectCityImageContainer.append(renderHtml);
  });
};

// Appends Job Details on Landing Page
gitHiredApp.githubJobsAjaxCall = cityName => {
  let selectCityContainer = $(`.${cityName} .jobsContainer`);
  gitHiredApp.githubJobsReusableApiCall(cityName).then(res => {
    for (let i = 0; i < 3; i++) {
      const renderHtml = `
          <div class="singleJobPost"> 
          <h3>${res[i].title} (${res[i].type})</h3>
              <p class="company">Company: ${res[i].company}</p>
              <p><a class="button" href=${res[i].url} target="_blank">Apply Here</a></p>
            </div>`;
      selectCityContainer.append(renderHtml);
    }
  });
};

// Appends Job Details on Detailed Section
gitHiredApp.handleOnChangeJobDetails = selectedSingleCity => {
  gitHiredApp.githubJobsReusableApiCall(selectedSingleCity).then(res => {
    jobListingContainer.append(`<h2>Job Details</h2>`);

    for (let i = 0; i < 6; i++) {
      const renderHtml = `
        <div class="singleJobPost"> 
          <h3>${res[i].title} (${res[i].type})</h3>
          <p class="company">Company: ${res[i].company}</p>
          <a class="button" href=${res[i].url} target="_blank">Apply Here</a>
        <div/>`;
      jobListingContainer.append(renderHtml);
    }
  });
};

// his function calls the teleCityReusableApiCall, with the selected city value we get from the select element, once the promise resolves, then we loop through the results, and append each score category onto the 
gitHiredApp.handleOnChangeCityDetails = selectedSingleCity => {
  gitHiredApp
    .teleCityReusableApiCall(selectedSingleCity, "scores")
    .then(res => {
      res.categories.forEach(stat => {
        scoreCategory.append(`<li>
        <h3>${stat.name}</h3>
        <p>Score: ${stat.score_out_of_10.toFixed(1)}</p>
        <div class="scoreBar"> 
        <div class="scoreBarFill" style="height:24px;width:${stat.score_out_of_10 *
          10}%;background-color:${stat.color}"></div>
        </div>
        </li>`);
      });

      // Appends City Details
      const renderHtml = `
      <div class="cityDetailImageContainer">
      ${gitHiredApp.cityImageUrlObject[selectedSingleCity]}
      </div>
      <div class="cityDetailsCard">
      <h2>${selectedSingleCity.replace("-", " ")} City Details</h2>
      <p>Average Quality of life Score: <span class="cityAvgScore">${Math.round(
        res.teleport_city_score
      )} / 100</span></p>
      </div>
      ${res.summary}`;
      $(".cityDetailsContainer").html(renderHtml);

      // Changes the color based on city score
      const cityAvgScore = $(".cityAvgScore");
      if (res.teleport_city_score >= 69.5) {
        cityAvgScore.css("color", "#34a853");
      } else if (res.teleport_city_score >= 50) {
        cityAvgScore.css("color", "#fbbc05");
      } else {
        cityAvgScore.css("color", "#ea4335");
      }
    });
};

// Smooth Scroll for City/Job Details, and Back to Top button
gitHiredApp.reuseableSmoothScroll = selector => {
  const y = selector.offset().top;
  $("html, body").animate({ scrollTop: y }, 750, "swing");
};

gitHiredApp.returnSelectedCityValue = () => {
  citySelected.on("change", e => {
    $(".showScore").css("display", "block");
    $("html, body").css("overflow", "visible");
    gitHiredApp.reuseableSmoothScroll($("main"));
    jobListingContainer.html("");

    let selectedSingleCity = e.target.value;
    gitHiredApp.handleOnChangeJobDetails(selectedSingleCity);
    gitHiredApp.handleOnChangeCityDetails(selectedSingleCity);
  });
};

// Populates City and Job Details
gitHiredApp.populateWithImagesAndJobs = () => {
  gitHiredApp.cityArray.forEach(city => {
    gitHiredApp.teleCityImageAjaxCall(city);
    gitHiredApp.githubJobsAjaxCall(city);
  });
};

$(".backToTop").on("click", () => {
  gitHiredApp.reuseableSmoothScroll($("header"));
});

$(".showScore").on("click", () => {
  scoreCategory.toggleClass("hidden");
});

$(document).ready(function() {
  $(".main-carousel").flickity({
    wrapAround: true,
    cellAlign: "left",
    contain: true
  });
  gitHiredApp.init();
  gitHiredApp.populateWithImagesAndJobs();
  gitHiredApp.returnSelectedCityValue();
});
