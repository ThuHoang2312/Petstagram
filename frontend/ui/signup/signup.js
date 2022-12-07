"use strict";

import { url } from "../config.js";

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

  if (json) {
    location.href = "../login/login.html";
    return;
  }

  //alert the errors from validation
  if (json.length > 0) {
    let errors = "";
    json.forEach((err) => (errors += `${err.msg}\n`));
    alert(errors);
    return false;
  }

  //alert errors from backend
  alert(json.message);
  return false;
});
