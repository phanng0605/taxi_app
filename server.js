const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// In-memory hash table to store user profiles and flight details
const users = {};

// Routes
app.post("/api/save-profile", (req, res) => {
  const { name, email, password, flightDate, timeStart, timeEnd, airport } =
    req.body;

  if (users[email]) {
    // Update existing user
    users[email].name = name;
    users[email].password = password;
    // Optionally update flights here if needed
    users[email].flights.push({ flightDate, timeStart, timeEnd, airport });
    return res.json({
      success: true,
      message: "Profile updated successfully!",
    });
  } else {
    // Create new user
    users[email] = {
      name,
      email,
      password,
      flights: [{ flightDate, timeStart, timeEnd, airport }],
    };
    return res.json({
      success: true,
      message: "Profile created successfully!",
    });
  }
});

// Endpoint to get user data
app.get("/api/get-profile", (req, res) => {
  const email = req.query.email; // Assume email is passed as a query parameter
  if (users[email]) {
    res.json({ success: true, data: users[email] });
  } else {
    res.json({ success: false, message: "User not found" });
  }
});

app.post("/api/find-matches", (req, res) => {
  const { flightDate, timeStart, timeEnd, airport } = req.body;

  const matches = [];
  for (const email in users) {
    const user = users[email];
    user.flights.forEach((flight) => {
      if (
        flight.flightDate === flightDate &&
        flight.airport === airport &&
        ((flight.timeStart <= timeEnd && flight.timeEnd >= timeStart) ||
          (flight.timeStart >= timeStart && flight.timeEnd <= timeEnd))
      ) {
        matches.push({ name: user.name, email: user.email, ...flight });
      }
    });
  }

  res.json({ matches });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
