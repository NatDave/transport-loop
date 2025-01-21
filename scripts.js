// Function to calculate trips crossing a segment (i → j)
function tripsCrossingSegment(N, i, direction) {
    // Normalize i to ensure it's within range [1, N]
    i = ((i - 1) % N) + 1;

    let j;
    let extendedStops = [];

    // Determine j and extended stops based on direction
    if (direction === "clockwise") {
        j = (i % N) + 1;
        extendedStops = [...Array(N).keys()].map(x => x + 1).concat([...Array(N).keys()].map(x => x + 1)); // [1, 2, ..., N, 1, 2, ..., N]
    } else if (direction === "counterclockwise") {
        j = ((i - 2 + N) % N) + 1;
        extendedStops = [...Array(N).keys()].map(x => N - x).concat([...Array(N).keys()].map(x => N - x)); // [N, N-1, ..., 1, N, N-1, ..., 1]
    } else {
        throw new Error("Invalid direction. Must be 'clockwise' or 'counterclockwise'.");
    }

    let trips = [];

    // Calculate trips
    for (let k = 1; k <= N; k++) { // Origin stop
        for (let m = 1; m <= N; m++) { // Destination stop
            if (k !== m) { // Exclude trips where origin == destination
                const startIdx = extendedStops.indexOf(k);
                const endIdx = extendedStops.indexOf(m, startIdx);

                // Traverse the loop to check if the segment i → j is crossed
                for (let idx = startIdx; idx < endIdx; idx++) {
                    if (extendedStops[idx] === i && extendedStops[idx + 1] === j) {
                        trips.push([k, m]);
                        break;
                    }
                }
            }
        }
    }

    return { trips, j };
}

// Event listener for the form
document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get user input
    const N = parseInt(document.getElementById("N").value);
    const i = parseInt(document.getElementById("i").value);
    const direction = document.getElementById("direction").value;

    // Calculate trips and segment endpoint j
    const { trips, j } = tripsCrossingSegment(N, i, direction);

    // Display calculated j
    document.getElementById("j").innerText = j;

    // Display trips in LaTeX format
    const tripsLatex = trips.map(([k, m]) => `(${k}, ${m})`).join(", ");
    document.getElementById("trips").innerHTML = `\\[ \\{ ${tripsLatex} \\} \\]`;

    // Display formula and interpretation
    document.getElementById("formula").innerHTML = `
        \\[
        \\text{Trips crossing segment } i \\to j: \\{ (k, m) \\mid k \\neq m, \\exists s \\in \\text{path}(k \\to m), s = i, (s+1) \\equiv j \\,(\\text{mod } N) \\}.
        \\]
    `;
    document.getElementById("interpretation").innerHTML = `
        \\[
        \\text{A trip (k, m) crosses the segment } i \\to j \\text{ if there exists a stop } s \\text{ in the circular path from } k \\to m \\text{ such that } s = i \\text{ and } (s+1) = j.
        \\]
    `;

    // Generate a color-coded matrix for visualization
    const matrix = Array.from({ length: N }, () => Array(N).fill(0));
    trips.forEach(([k, m]) => {
        matrix[k - 1][m - 1] = 1; // Mark the trip in the matrix
    });

    // Render the matrix
    const matrixContainer = document.getElementById("matrix");
    matrixContainer.innerHTML = ""; // Clear previous matrix
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";

    // Create table header with stop names
    const headerRow = document.createElement("tr");
    headerRow.appendChild(document.createElement("th")); // Top-left empty cell
    for (let stop = 1; stop <= N; stop++) {
        const th = document.createElement("th");
        th.innerText = `Stop ${stop}`;
        th.style.padding = "5px";
        th.style.border = "1px solid black";
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Create table rows with stop names on the left
    for (let row = 0; row < N; row++) {
        const tr = document.createElement("tr");
        const rowHeader = document.createElement("th");
        rowHeader.innerText = `Stop ${row + 1}`;
        rowHeader.style.padding = "5px";
        rowHeader.style.border = "1px solid black";
        tr.appendChild(rowHeader);

        for (let col = 0; col < N; col++) {
            const td = document.createElement("td");
            td.style.width = "20px";
            td.style.height = "20px";
            td.style.border = "1px solid black";
            td.style.backgroundColor = matrix[row][col] === 1 ? "lightblue" : "white";
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    matrixContainer.appendChild(table);

    // Re-render MathJax
    MathJax.typeset();
});
