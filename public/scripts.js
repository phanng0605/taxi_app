document.addEventListener("DOMContentLoaded", function () {
  const profileForm = document.getElementById("profile-form");
  const matchForm = document.getElementById("match-form");

  if (profileForm) {
    profileForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const flightDate = document.getElementById("flight-date").value;
      const timeStart = document.getElementById("time-start").value;
      const timeEnd = document.getElementById("time-end").value;
      const airport = document.getElementById("airport").value;

      fetch("/api/save-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          flightDate,
          timeStart,
          timeEnd,
          airport,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error saving profile and flight.");
        });
    });
  }

  if (matchForm) {
    matchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const flightDate = document.getElementById("match-flight-date").value;
      const timeStart = document.getElementById("match-time-start").value;
      const timeEnd = document.getElementById("match-time-end").value;
      const airport = document.getElementById("match-airport").value;

      fetch("/api/find-matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flightDate, timeStart, timeEnd, airport }),
      })
        .then((response) => response.json())
        .then((data) => {
          const matchList = document.getElementById("match-list");
          matchList.innerHTML = "";
          if (data.matches.length > 0) {
            data.matches.forEach((match) => {
              const li = document.createElement("li");
              li.innerHTML = `
                          <p>Name: ${match.name}</p>
                          <p>Email: ${match.email}</p>
                          <p>Flight Date: ${match.flightDate}</p>
                          <p>Time Range: ${match.timeStart} - ${match.timeEnd}</p>
                          <p>Airport: ${match.airport}</p>
                      `;
              matchList.appendChild(li);
            });
          } else {
            matchList.innerHTML = "<li>No matches found</li>";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error finding matches.");
        });
    });
  }
});
