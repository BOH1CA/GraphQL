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

    // Map progresses to use createdAt for sorting and amount for y-axis values
    const progressesMap = new Map(userData.progresses.map(p => [p.path, new Date(p.createdAt)]));

    // Create and sort data points by date
    const dataPoints = userData.xps
        .map(xp => {
            const createdAt = progressesMap.get(xp.path);
            return createdAt ? { date: createdAt, amount: xp.amount, path: xp.path } : null;
        })
        .filter(point => point !== null)
        .sort((a, b) => a.date - b.date);  // Sort by date

    // Create the SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);

    // Find min and max for x-axis (date) and y-axis (XP amount)
    const minDate = dataPoints[0].date.getTime();
    const maxDate = dataPoints[dataPoints.length - 1].date.getTime();
    const minXP = Math.min(...dataPoints.map(point => point.amount));
    const maxXP = Math.max(...dataPoints.map(point => point.amount));

    // Scale points on both axes
    const scaledPoints = dataPoints.map(point => {
        const x = padding + ((point.date.getTime() - minDate) / (maxDate - minDate)) * (svgWidth - padding * 2);
        const y = svgHeight - padding - ((point.amount - minXP) / (maxXP - minXP) * (svgHeight - padding * 2));
        return { x, y, path: point.path };
    });

    // Generate a smooth line path with Bezier curves
    const linePath = scaledPoints.map((point, index, arr) => {
        if (index === 0) return `M ${point.x} ${point.y}`;
        const prev = arr[index - 1];
        const cp1x = prev.x + (point.x - prev.x) / 2;
        const cp1y = prev.y;
        const cp2x = point.x - (point.x - prev.x) / 2;
        const cp2y = point.y;
        return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
    }).join(' ');

    // Create and style the line element
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", linePath);
    line.setAttribute("stroke", "blue");  // Change color as needed
    line.setAttribute("fill", "none");
    line.setAttribute("stroke-width", "2");

    // Append the smooth line to the SVG
    svg.appendChild(line);

    // Create a tooltip for showing details
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'white';
    tooltip.style.border = '1px solid black';
    tooltip.style.padding = '5px';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    // Add points on the line with larger, colored circles
    scaledPoints.forEach(point => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", point.x);
        circle.setAttribute("cy", point.y);
        circle.setAttribute("r", 5);  // Adjust the size as desired
        circle.setAttribute("fill", "blue");  // Match line color
        svg.appendChild(circle);

        // Add mouseover for tooltip
        circle.addEventListener('mouseover', (event) => {
            const pathName = point.path.split('/').pop();
            tooltip.innerText = `${pathName}`;
            tooltip.style.left = `${event.pageX + 5}px`;
            tooltip.style.top = `${event.pageY + 5}px`;
            tooltip.style.display = 'block';
        });

        // Hide tooltip on mouseout
        circle.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });
    });

    // Draw x-axis and y-axis lines
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", padding);
    xAxis.setAttribute("y1", svgHeight - padding);
    xAxis.setAttribute("x2", svgWidth - padding);
    xAxis.setAttribute("y2", svgHeight - padding);
    xAxis.setAttribute("stroke", "black");
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", padding);
    yAxis.setAttribute("y1", padding);
    yAxis.setAttribute("x2", padding);
    yAxis.setAttribute("y2", svgHeight - padding);
    yAxis.setAttribute("stroke", "black");
    svg.appendChild(yAxis);

    return svg;
}
