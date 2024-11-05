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

    // Map progresses to use createdAt for sorting
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

    // Find min and max for XP amount (used for scaling both x and y axes)
    const minXP = Math.min(...dataPoints.map(point => point.amount));
    const maxXP = Math.max(...dataPoints.map(point => point.amount));

    // Scale both x and y axes based on XP amount
    const scaledPoints = dataPoints.map((point, index) => {
        // x-axis: scaled based on the progression in the amount
        const x = padding + ((point.amount - minXP) / (maxXP - minXP)) * (svgWidth - padding * 2);
        // y-axis: scaled similarly to the x-axis for a unified "amount-based" progression
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

    // Add round points on the graph
    scaledPoints.forEach(point => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", point.x);
        circle.setAttribute("cy", point.y);
        circle.setAttribute("r", 5);  // Adjust the size as needed
        circle.setAttribute("fill", "blue");  // Match line color
        svg.appendChild(circle);
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
