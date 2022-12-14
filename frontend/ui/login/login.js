"use strict";
const url = "http://localhost:3000";
// const url = "https://petstagram.northeurope.cloudapp.azure.com/app";

//select existing html element
const loginForm = document.querySelector("#login-form");

// login
loginForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + "/auth/login", fetchOptions);
  const json = await response.json();
  console.log("login response: ", json);

  //alert if not an existing user
  if (!json.user) {
    alert(json.message);
  } else {
    // save token
    sessionStorage.setItem("token", json.token);
    sessionStorage.setItem("user", JSON.stringify(json.user));
    location.href = "../front/index.html";
  }
});
