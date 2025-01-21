from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__, template_folder="views")

def trips_crossing_segment(N, i, direction):
    """
    Returns a list of trips that cross the segment i -> j in a circular loop based on the direction.

    Parameters:
        N (int): Total number of stops in the loop.
        i (int): Start of the segment (i -> j).
        direction (str): Direction of traversal, either "clockwise" or "counterclockwise".

    Returns:
        tuple: 
            list of tuples: Each tuple represents a trip (k -> m) that crosses the segment i -> j.
            int: Automatically calculated end of the segment j.
    """
    # Normalize i in case it exceeds N
    i = (i - 1) % N + 1

    # Calculate j based on direction
    if direction == "clockwise":
        j = (i % N) + 1
    elif direction == "counterclockwise":
        j = ((i - 2 + N) % N) + 1
    else:
        raise ValueError("Direction must be 'clockwise' or 'counterclockwise'.")

    trips = []

    # Extend the loop representation to capture circular behavior
    extended_stops = list(range(1, N + 1)) * 2  # Double the stops to simulate an infinite loop

    for k in range(1, N + 1):  # Origin stop (within the main loop)
        for m in range(1, N + 1):  # Destination stop (within the main loop)
            if k != m:  # Exclude trips starting and ending at the same stop
                # Determine the range of stops the trip traverses
                if direction == "clockwise":
                    start_idx = extended_stops.index(k)
                    end_idx = extended_stops.index(m, start_idx)
                else:  # Counterclockwise
                    start_idx = extended_stops.index(k + N - 1)
                    end_idx = extended_stops.index(m + N - 1, start_idx)

                # Check if the segment i -> j is crossed
                for idx in range(start_idx, end_idx):
                    if extended_stops[idx] == i and extended_stops[idx + 1] == j:
                        trips.append((k, m))
                        break

    return trips, j

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/compute', methods=['POST'])
def compute():
    data = request.json
    N = int(data['N'])
    i = int(data['i'])
    direction = data['direction']

    # Get trips and the end of the segment j
    trips, j = trips_crossing_segment(N, i, direction)

    # Create the origin-destination matrix
    matrix = np.zeros((N, N), dtype=int)
    for k, m in trips:
        matrix[k - 1, m - 1] = 1

    return jsonify({
        "formula": "Trips crossing segment i -> j: {(k, m) | k ≠ m, ∃s ∈ path(k → m), s = i and (s+1) ≡ j (mod N)}",
        "interpretation": "A trip (k, m) crosses the segment i -> j if there exists a stop s in the circular path from k to m such that s = i and (s+1) = j.",
        "trips": trips,
        "j": j,
        "matrix": matrix.tolist()
    })

if __name__ == '__main__':
    app.run(debug=True)
