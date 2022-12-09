"use strict";

// import { url } from "../config.js";
const url = "http://localhost:3000";
// select existing html elements
const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const data = serializeJson(signupForm);
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(url + "/auth/register", fetchOptions);
  const json = await response.json();
  //alert errors from backend
  alert(json.message);
  console.log("signup response: ", json);

  if (!response.ok) {
    //alert("Error " + response.statusText + " occurred when register profile!");
    window.location.href = "signup.html";
  } else {
    window.location.href = "../login/login.html";
  }
});
