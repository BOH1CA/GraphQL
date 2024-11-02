import { createAuditRatioDiv } from './pieChart.js';
import { createXpProgressionDiv } from './lineGraph.js';

export function displayStats(userData, transactionsData) {
    console.log('token:');
    console.log(localStorage.getItem('jwToken'));

    // Creating the page DIV
    const page = document.createElement('div');
    page.id = 'graphPage';

    // Creating the header container
    const header = document.createElement('div');
    header.id = 'header';

    // Left side - GraphQL text
    const graphqlText = document.createElement('h2');
    graphqlText.innerText = 'GraphQL';
    header.appendChild(graphqlText);

    // Right side - Logout button
    const logoutButton = document.createElement('button');
    logoutButton.type = 'button';
    logoutButton.textContent = 'Log out';

    // Adding logout functionality
    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('jwToken');
        location.reload();
    });

    // Appending the logout button to the header
    header.appendChild(logoutButton);

    // Creating a container for the cross layout
    const crossContainer = document.createElement('div');
    crossContainer.id = 'crossContainer';

    // Creating userInfo DIV by calling createUserInfoDiv function
    const userInfo = createUserInfoDiv(userData);

    // Creating auditRatio DIV with a pie chart
    const auditRatioDiv = createAuditRatioDiv(userData, transactionsData);

    // Creating XP progression DIV
    const xpProgressionDiv = createXpProgressionDiv(userData);

    // Appending userInfo, auditRatioDiv, and xpProgressionDiv to the cross container
    crossContainer.appendChild(userInfo);
    crossContainer.appendChild(auditRatioDiv);
    crossContainer.appendChild(xpProgressionDiv);

    // Appending header and cross container to the page
    page.appendChild(header);
    page.appendChild(crossContainer);

    // Creating the new barGraphDiv container
    const barGraphDiv = document.createElement('div');
    barGraphDiv.id = 'barGraphDiv';
    barGraphDiv.style.width = '100%';

    // Generating and appending the bar graph to barGraphDiv
    createBarGraph(userData.xps, barGraphDiv);

    // Append the new barGraphDiv below the crossContainer
    page.appendChild(barGraphDiv);

    // Adding contents to the body
    document.body.appendChild(page);
}

// Function to create and append a simplified vertical bar graph based on xpsData
function createBarGraph(xpsData, container) {
    // Set up container for a row of vertical bars
    container.classList.add('bar-graph-container');

    // Maximum amount to scale the bars proportionally
    const maxAmount = Math.max(...xpsData.map(xp => xp.amount));
    const barCount = xpsData.length;

    xpsData.forEach((xp) => {
        // Create the bar element (vertical)
        const bar = document.createElement('div');
        bar.classList.add('bar');

        // Set width to fill based on the total number of bars
        bar.style.width = `calc((100% / ${barCount}) - (5px * (1 / ${barCount})))`;
        // Set height for the bar based on the scaled value
        bar.style.height = `${Math.max((xp.amount / maxAmount) * 100, 1)}%`;

        // Create the label element
        const label = document.createElement('div');
        label.textContent = `${xp.path.split('/').pop()}: ${xp.amount}B`;
        label.classList.add('bar-label');

        // Append the label to the bar
        bar.appendChild(label);
        // Append each bar directly to the container
        container.appendChild(bar);
    });
}

// Function to create the user info div
function createUserInfoDiv(userData) {
    // Creating userInfo div
    const userInfo = document.createElement('div');
    userInfo.id = 'userInfo';


    // Creating elements for user information
    const userLogin = document.createElement('h2');
    const userFirstName = document.createElement('span');
    const userLastName = document.createElement('span');
    const userPhone = document.createElement('span');
    const userMail = document.createElement('span');
    const userCountry = document.createElement('span');
    const userCity = document.createElement('span');
    const userAddr = document.createElement('span');

    userLogin.innerText = 'User: ' + (userData.login || 'Login not available');
    userFirstName.innerText = 'First Name: ' + (userData.attrs.firstName || 'First name not available');
    userLastName.innerText = 'Last Name: ' + (userData.attrs.lastName || 'Last name not available');
    userPhone.innerText = 'Phone: ' + (userData.attrs.tel || 'Phone not available');
    userMail.innerText = 'Email: ' + (userData.attrs.email || 'E-mail not available');
    userCountry.innerText = 'Address:\n' + (userData.attrs.addressCountry || 'Country not available');
    userCity.innerText = userData.attrs.addressCity || 'City not available';
    userAddr.innerText = userData.attrs.addressStreet || 'Street info not available';

    // Appending user information to userInfo div
    userInfo.appendChild(userLogin);
    userInfo.appendChild(userFirstName);
    userInfo.appendChild(userLastName);
    userInfo.appendChild(userPhone);
    userInfo.appendChild(userMail);
    userInfo.appendChild(userCountry);
    userInfo.appendChild(userCity);
    userInfo.appendChild(userAddr);

    return userInfo;
}



