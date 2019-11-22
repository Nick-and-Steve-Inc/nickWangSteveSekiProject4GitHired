gitHiredApp = {};
gitHiredApp.init = () => {
  gitHiredApp.cityArray = [
    "new-york",
    "toronto",
    "los-angeles",
    "chicago",
    "montreal",
    "london"
  ];
  gitHiredApp.cityImages = [];

  gitHiredApp.teleCityBaseUrl = "https://api.teleport.org/api/urban_areas/";

  gitHiredApp.githubJobBaseUrl = "https://jobs.github.com/positions.json";
};

// https://api.teleport.org/api/urban_areas/slug:auckland/scores

gitHiredApp.teleCityReusableApiCall = (cityName, infoType) => {
  return $.ajax({
    url: `${gitHiredApp.teleCityBaseUrl}slug:${cityName}/${infoType}`,
    dataType: "json",
    method: "GET"
  });
};


gitHiredApp.cityImageUrlObject = {};

gitHiredApp.teleCityImageAjaxCall = (cityName) => {
  let selectCityImageContainer = $(`.${cityName} .imageContainer`);
  gitHiredApp.teleCityReusableApiCall(cityName, "images").then(res => {
    const renderHtml = `<img src=${
      res.photos[0].image.mobile
    } alt="This is a photo of ${cityName.replace("-", " ")}" />`;
    
    gitHiredApp.cityImageUrlObject[cityName] = renderHtml;
    selectCityImageContainer.append(renderHtml);
  });
};




gitHiredApp.githubJobsReusableApiCall = cityName => {
  // Github jobs API
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

gitHiredApp.githubJobsAjaxCall = cityName => {
  let selectCityContainer = $(`.${cityName} .jobsContainer`);
  gitHiredApp.githubJobsReusableApiCall(cityName).then(res => {
    for (let i = 0; i < 3; i++) {
      const renderHtml = `
          <div class="singleJobPost"> 
              <h3>${res[i].title}</h3>
              <p class="jobType">${res[i].type}</p>
              <p class="company">Company: ${res[i].company}</p>
              <p><a href=${res[i].url} target="_blank">Apply Here</a></p>
            <div/>`;

      selectCityContainer.append(renderHtml);
    }
  });
};

const jobListingContainer = $(".jobListingsContainer");

gitHiredApp.handleOnChangeJobDetails = (selectedSingleCity) => {

  gitHiredApp.githubJobsReusableApiCall(selectedSingleCity).then(res => {
    for (let i = 0; i < 6; i++) {
      const renderHtml = `
        <div class="singleJobPost"> 
          <h3>${res[i].title}</h3>
          <p class="jobType">${res[i].type}</p>
          <p class="company">Company: ${res[i].company}</p>
          <p class="createdAt">Company: ${res[i].created_at}</p>
          <p><a href=${res[i].url} target="_blank">Apply Here</a></p>
        <div/>`;
      jobListingContainer.append(renderHtml);
    };
  });
}

gitHiredApp.handleOnChangeCityDetails = (selectedSingleCity) => {
  gitHiredApp.teleCityReusableApiCall(selectedSingleCity, "scores").then(res => {
    const renderHtml
  })
};


gitHiredApp.returnSelectedCityValue = () => {
  const citySelected = $(".citySelect");

  
  citySelected.on("change", e => {
    jobListingContainer.html("");
    let selectedSingleCity = e.target.value;
    gitHiredApp.handleOnChangeJobDetails(selectedSingleCity);
    gitHiredApp.handleOnChangeCityDetails(selectedSingleCity);

  });
};

gitHiredApp.populateWithImagesAndJobs = () => {
  gitHiredApp.cityArray.forEach(city => {
    gitHiredApp.teleCityImageAjaxCall(city);
    gitHiredApp.githubJobsAjaxCall(city);
  });
};

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
