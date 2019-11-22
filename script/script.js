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

gitHiredApp.teleCityAjaxCall = cityName => {
  let selectCityImageContainer = $(`.${cityName} .imageContainer`);
  // City Api
  $.ajax({
    url: `${gitHiredApp.teleCityBaseUrl}slug:${cityName}/images`,
    dataType: "json",
    method: "GET"
  }).then(res => {
    const renderHtml = `<img src=${
      res.photos[0].image.mobile
    } alt="This is a photo of ${cityName.replace("-", " ")}" />`;

    selectCityImageContainer.append(renderHtml);
  });
};

gitHiredApp.githubJobsApiCall = (cityName) => {
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
  gitHiredApp.githubJobsApiCall(cityName).then(res => {
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

gitHiredApp.returnSelectedCityValue = () => {
  const citySelected = $(".citySelect");

  citySelected.on("change", e => {
    let selectedSingleCity = e.target.value;

    gitHiredApp.githubJobsApiCall(selectedSingleCity).then(res => {
      console.log(res[0])
    })


  });
};

gitHiredApp.populateWithImagesAndJobs = () => {
  gitHiredApp.cityArray.forEach(city => {
    gitHiredApp.teleCityAjaxCall(city);
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
