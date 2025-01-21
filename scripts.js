document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();

    const N = parseInt(document.getElementById("N").value);
    const i = parseInt(document.getElementById("i").value);
    const direction = document.getElementById("direction").value;

    // Normalize i
    const normalizedI = ((i - 1) % N) + 1;

    // Calculate j
    let j;
    if (direction === "clockwise") {
        j = (normalizedI % N) + 1;
    } else if (direction === "counterclockwise") {
        j = ((normalizedI - 2 + N) % N) + 1;
    }
    document.getElementById("j").innerText = j;

    // Calculate trips crossing the segment
    const trips = [];
    const extendedStops = [...Array(N).keys()].map(x => x + 1).concat(
        [...Array(N).keys()].map(x => x + 1)
    );

    for (let k = 1; k <= N; k++) {
        for (let m = 1; m <= N; m++) {
            if (k !== m) {
                let startIdx, endIdx;
                if (direction === "clockwise") {
                    startIdx = extendedStops.indexOf(k);
                    endIdx = extendedStops.indexOf(m, startIdx);
                } else {
                    startIdx = extendedStops.lastIndexOf(k);
                    endIdx = extendedStops.lastIndexOf(m, startIdx);
                }

                for (let idx = startIdx; idx < endIdx; idx++) {
                    if (extendedStops[idx] === normalizedI && extendedStops[idx + 1] === j) {
                        trips.push([k, m]);
                        break;
                    }
                }
            }
        }
    }

    // Display trips
    document.getElementById("trips").textContent = JSON.stringify(trips);

    // Create the matrix
    const matrix = Array.from({ length: N }, () => Array(N).fill(0));
    trips.forEach(([k, m]) => {
        matrix[k - 1][m - 1] = 1;
    });

    // Display the matrix
    const matrixDiv = document.getElementById("matrix");
    matrixDiv.innerHTML = createMatrixTable(matrix);

    // Explanation
    document.getElementById("formula").innerText =
        "Trips crossing segment i -> j: {(k, m) | k ≠ m, ∃s ∈ path(k → m), s = i and (s+1) ≡ j (mod N)}";
    document.getElementById("interpretation").innerText =
        "A trip (k, m) crosses the segment i -> j if there exists a stop s in the circular path from k to m such that s = i and (s+1) = j.";
    document.getElementById("explanation").innerText =
        `Imagine a circular bus route with ${N} stops. The segment crossing trips are calculated based on the direction: ${direction}.`;
    document.getElementById("steps").innerHTML = `
        <li>Trips are defined as (k, m), where k is the origin and m is the destination.</li>
        <li>The segment i -> j depends on the chosen direction.</li>
    `;
    document.getElementById("example").innerText =
        `Example: For N = ${N}, i = ${i}, direction = ${direction}, the trips crossing segment are calculated as shown in the matrix.`;

    MathJax.typeset();
});

function createMatrixTable(matrix) {
    let html = "<table><tr><th></th>";
    for (let i = 0; i < matrix.length; i++) {
        html += `<th>${i + 1}</th>`;
    }
    html += "</tr>";

    for (let i = 0; i < matrix.length; i++) {
        html += `<tr><th>${i + 1}</th>`;
        for (let j = 0; j < matrix[i].length; j++) {
            html += `<td>${matrix[i][j] ? "■" : ""}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    return html;
}
