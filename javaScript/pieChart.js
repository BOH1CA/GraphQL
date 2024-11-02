// Function to create the audit ratio div with a pie chart
export function createAuditRatioDiv(userData) {
    // Creating auditRatio div
    const auditRatioDiv = document.createElement('div');
    auditRatioDiv.id = 'auditRatioDiv';

    // Creating a heading for the audit ratio
    const auditRatioHeading = document.createElement('h2');
    auditRatioHeading.innerText = 'Audit Ratio: ' + userData.auditRatio.toFixed(2);

    // Get totalUp and totalDown from userData and convert to Mbits
    const totalReceivedXP = userData.totalDown;
    const totalGivenXP = userData.totalUp; 

    // Convert Bytes to Mbits
    const totalReceivedXP_MBits = (totalReceivedXP / 1000000).toFixed(2); 
    const totalGivenXP_MBits = (totalGivenXP / 1000000).toFixed(2); 

    // Creating and displaying the received and given XP elements
    const totalReceivedXPElement = document.createElement('p');
    totalReceivedXPElement.innerText = 'Total Received XP: ' + totalReceivedXP_MBits + ' MB';

    const givenXPElement = document.createElement('p');
    givenXPElement.innerText = 'Given XP: ' + totalGivenXP_MBits + ' MB';

    // Creating a div for the pie chart
    const pieChartDiv = document.createElement('div');
    pieChartDiv.id = 'pieChartDiv';

    // Calling function to render the pie chart inside pieChartDiv
    renderPieChart(userData, pieChartDiv);

    // Appending the heading, XP values, and pie chart to auditRatioDiv
    auditRatioDiv.appendChild(auditRatioHeading);
    auditRatioDiv.appendChild(totalReceivedXPElement);
    auditRatioDiv.appendChild(givenXPElement);
    auditRatioDiv.appendChild(pieChartDiv);

    return auditRatioDiv;
}

// Function to render the pie chart based on totalUp and totalDown
function renderPieChart(userData, pieChartDiv) {
    const svgNS = "http://www.w3.org/2000/svg";
    const pieChartSVG = document.createElementNS(svgNS, 'svg');
    pieChartSVG.setAttribute('width', '200');
    pieChartSVG.setAttribute('height', '200');

    // Get totalUp and totalDown from userData
    const totalReceivedXP = userData.totalDown;
    const totalGivenXP = userData.totalUp;
    const totalXP = totalReceivedXP + totalGivenXP;

    // Calculate angles for the pie chart
    const receivedAngle = (totalReceivedXP / totalXP) * 360;
    const givenAngle = (totalGivenXP / totalXP) * 360;

    // Create paths for received and given XP
    const receivedPath = createPiePath(receivedAngle, 100, 100, 100, svgNS, '#4caf50');
    const givenPath = createPiePath(givenAngle, 100, 100, 100, svgNS, '#800080', receivedAngle);

    // Append paths to the SVG
    pieChartSVG.appendChild(receivedPath);
    pieChartSVG.appendChild(givenPath);

    // Append SVG to the pieChartDiv
    pieChartDiv.appendChild(pieChartSVG);
}

// Helper function to create SVG path for pie chart
function createPiePath(angle, cx, cy, radius, svgNS, color, startAngle = 0) {
    const largeArcFlag = angle > 180 ? 1 : 0;
    const startX = cx + radius * Math.cos((startAngle - 90) * (Math.PI / 180));
    const startY = cy + radius * Math.sin((startAngle - 90) * (Math.PI / 180));
    const endX = cx + radius * Math.cos((startAngle + angle - 90) * (Math.PI / 180));
    const endY = cy + radius * Math.sin((startAngle + angle - 90) * (Math.PI / 180));

    const path = document.createElementNS(svgNS, 'path');
    const d = `M ${cx} ${cy} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
    path.setAttribute('d', d);
    path.setAttribute('fill', color);

    return path;
}