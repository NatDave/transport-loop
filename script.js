document.getElementById("input-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get input values
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

    // Create and display matrix
    const matrix = Array.from({ length: N }, () => Array(N).fill(0));
    trips.forEach(([k, m]) => {
        matrix[k - 1][m - 1] = 1;
    });

    const matrixDiv = document.getElementById("matrix");
    matrixDiv.innerHTML = createMatrixTable(matrix);
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
