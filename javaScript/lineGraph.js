export function createXpProgressionDiv(userData) {
    // Create a new div for XP progression
    const xpProgressionDiv = document.createElement('div');
    xpProgressionDiv.id = 'xpProgressionDiv';
    // Calculate the total XP using userData.xps
    const totalXP = userData.xps.reduce((sum, xp) => sum + xp.amount, 0);
    // Convert total XP to KB and round it
    const totalXP_KB = Math.ceil(totalXP / 1000);
    // Create a heading to display the total XP in bold
    const xpHeader = document.createElement('h2');
    xpHeader.innerText = 'Total XP: ' + totalXP_KB + ' KB';
    xpHeader.style.fontWeight = 'bold';
    // Append the header to the XP progression div
    xpProgressionDiv.appendChild(xpHeader);
    // Create SVG for the line graph
    const svg = createLineGraph(userData);
    // Append the SVG to the XP progression div
    xpProgressionDiv.appendChild(svg);
    return xpProgressionDiv;
}
function createLineGraph(userData) {
    const svgWidth = 400;
    const svgHeight = 200;
    const padding = 20;
    // Map the progresses to a more usable format
    const progressesMap = new Map(userData.progresses.map(p => [p.path, new Date(p.createdAt)]));
    // Create an array for the points
    const dataPoints = userData.xps
        .map(xp => {
            const createdAt = progressesMap.get(xp.path);
            return createdAt ? { date: createdAt, amount: xp.amount, path: xp.path } : null;
        })
        .filter(point => point !== null);
    // Create the SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    // Scale the XP values for the graph
    const maxXP = Math.max(...dataPoints.map(point => point.amount));
    const minXP = Math.min(...dataPoints.map(point => point.amount));
    const minDate = new Date(Math.min(...dataPoints.map(point => point.date)));
    const maxDate = new Date(Math.max(...dataPoints.map(point => point.date)));
    const totalDuration = maxDate - minDate;
    // Generate points for the line graph
    const scaledPoints = dataPoints.map((point, index) => {
        const x = (svgWidth - padding * 2) / (dataPoints.length - 1) * index + padding;
        const y = svgHeight - padding - ((point.amount - minXP) / (maxXP - minXP) * (svgHeight - padding * 2));
        return { x, y, path: point.path };
    });
    // Create the path for the line
    const linePath = scaledPoints.map((point, index) => {
        return index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`;
    }).join(' ');
    // Create the line element
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", linePath);
    line.setAttribute("stroke", "black");
    line.setAttribute("fill", "none");
    line.setAttribute("stroke-width", "2");
    // Append the line to the SVG
    svg.appendChild(line);
    // Create a tooltip
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'white';
    tooltip.style.border = '2px solid black';
    tooltip.style.padding = '5px';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);
    // Add round points for each data point
    scaledPoints.forEach(point => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", point.x);
        circle.setAttribute("cy", point.y);
        circle.setAttribute("r", 4);
        circle.setAttribute("fill", "black");
        svg.appendChild(circle);
        // Mouseover event to show tooltip
        circle.addEventListener('mouseover', (event) => {
            // Get the last part of the path
            const pathName = point.path.split('/').pop();
            tooltip.innerText = `${pathName}`;
            tooltip.style.left = `${event.pageX + 5}px`;
            tooltip.style.top = `${event.pageY + 5}px`;
            tooltip.style.display = 'block';
        });
        // Mouseout event to hide tooltip
        circle.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });
    });
    // Draw the x-axis
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", padding);
    xAxis.setAttribute("y1", svgHeight - padding);
    xAxis.setAttribute("x2", svgWidth - padding);
    xAxis.setAttribute("y2", svgHeight - padding);
    xAxis.setAttribute("stroke", "black");
    xAxis.setAttribute("stroke-width", "1");
    svg.appendChild(xAxis);
    // Draw the y-axis
    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", padding);
    yAxis.setAttribute("y1", padding);
    yAxis.setAttribute("x2", padding);
    yAxis.setAttribute("y2", svgHeight - padding);
    yAxis.setAttribute("stroke", "black");
    yAxis.setAttribute("stroke-width", "1");
    svg.appendChild(yAxis);
    return svg;
}
