// Simple pseudo

// Have an array of 6 city names, [new york, toronto, california, chicago, montreal, london]
// Github jobs = 3 job listings using search param of city names
// Teleport api = image of 6 cities using city id

// Loop through the cityArr and call the github api to get a list of 3 job titles, and link to that site from that city using the keyword search url, At the same time, Call the teleport city api and get an image of that city, and use the when() jquery method we get both promises resolved, we append both response from both api calls onto the page, below the each city categories.
// The user is able to click onto each job achor and be taken to be taken to the original external job posting.



// Pseudo Code:

// Teleport API = teleAPI
// GitHubJobs API = gitAPI

// Init function
// Call Teleport API to get list of cities available to the API, place the list in cityList =[]
// Using cityList[], will do a forEach using the location as a parameter for searching the GitAPI for available job.
// Jobs per city will be pushed to gitJobArray per city.
// If cityGitJobArray.length != 0, create an append to the HTML using the following layout:
// List of every city will be populated to a drop down menu of available cities(stretch goal is to replace this with a search bar)
// The main page will also append: <li> <a> City </a> - Job Title  </li>
// When the user selects a city from the drop down OR clicks on one of the cities:
// Another API call to teleAPI to pull the city details(description, photo, etc)
// Feed to pre - templated html elements which will render on main section of the HTML.
// API call to gitAPI with query param of the selected city
// Pull the details for Position, Employer, Description, etc.and render it onto the Job section.
// The user can click the job, which will take them to the source page of the job posting(which is also available from the earlier API call).




