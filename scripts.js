function tripsCrossingSegment(N, i, direction) {
    /**
     * Returns trips crossing the segment i -> j in a circular loop.
     * @param {number} N - Total number of stops.
     * @param {number} i - Start of the segment.
     * @param {string} direction - Direction of traversal ("clockwise" or "counterclockwise").
     * @returns {object} - Contains trips list and end of segment j.
     */
    i = ((i - 1) % N) + 1;

    let j;
    if (direction === "clockwise") {
        j = (i % N) + 1;
    } else if (direction === "counterclockwise") {
        j = ((i - 2 + N) % N) + 1;
    } else {
        throw new Error("Direction must be 'clockwise' or 'counterclockwise'.");
    }

    const trips = [];
    const extendedStops = [...Array(N).keys()].map((x) => x + 1).concat([...Array(N).keys()].map((x) => x + 1));

    for (let k = 1; k <= N; k++) {
        for (let m = 1; m <= N; m++) {
            if (k !== m) {
                const startIdx = direction === "clockwise"
                    ? extendedStops.indexOf(k)
                    : extendedStops.indexOf(k + N - 1);
                const endIdx = direction === "clockwise"
                    ? extendedStops.indexOf(m, startIdx)
                    : extendedStops.indexOf(m + N - 1, startIdx);

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

document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();

    const N = parseInt(document.getElementById('N').value);
    const i = parseInt(document.getElementById('i').value);
    const direction = document.getElementById('direction').value;

    const { trips, j } = tripsCrossingSegment(N, i, direction);

    document.getElementById('formula').innerHTML = `\\[
        \\text{Trips crossing segment } i \\to j: \\{ (k, m) \\mid k \\neq m, \\exists s \\in \\text{path}(k \\to m), s = i \\text{ and } (s+1) \\equiv j \\,(\\text{mod } N) \\}.
    \\]`;

    document.getElementById('interpretation').innerHTML = `\\[
        \\text{A trip (k, m) crosses the segment } i \\to j \\text{ if there exists a stop } s \\text{ in the circular path from } k \\to m \\text{ such that } s = i \\text{ and } (s+1) = j.
    \\]`;

    document.getElementById('explanation').innerHTML = `
        Imagine a <b>circular bus route</b> with <b>${N}</b> stops labeled 1 to <b>${N}</b>. The bus starts at stop 1, visits all stops in a 
        <b>${direction}</b> direction, and returns to stop 1 after stop <b>${N}</b>, forming a loop. Trips and paths are determined based on the specified direction.
    `;

    const tripsLatex = trips.map(([k, m]) => `(${k}, ${m})`).join(', ');
    document.getElementById('trips').innerHTML = `\\[
        \\{ ${tripsLatex} \\}
    \\]`;

    MathJax.typeset();

    const matrix = Array.from({ length: N }, () => Array(N).fill(0));
    trips.forEach(([k, m]) => {
        matrix[k - 1][m - 1] = 1;
    });

    let table = '<table><thead><tr><th></th>';
    for (let stop = 1; stop <= N; stop++) {
        table += `<th>${stop}</th>`;
    }
    table += '</tr></thead><tbody>';
    for (let row = 0; row < matrix.length; row++) {
        table += `<tr><th>${row + 1}</th>`;
        for (let col = 0; col < matrix[row].length; col++) {
            table += `<td>${matrix[row][col] ? '&#x25A0;' : ''}</td>`;
        }
        table += '</tr>';
    }
    table += '</tbody></table>';
    document.getElementById('matrix').innerHTML = table;

    document.getElementById('j').innerText = j;
});
