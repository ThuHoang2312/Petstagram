"use strict";

import { url } from "../config.js";

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

  if (json.user) {
    // save token
    sessionStorage.setItem("token", json.token);
    sessionStorage.setItem("user", JSON.stringify(json.user));
    location.href = "../front/index.html";
    return;
  }

  alert(json.message);
});
