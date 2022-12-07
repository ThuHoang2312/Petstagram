"use strict";
import { url } from "../config.js";

(async () => {
  // check sessionStorage
  if (!sessionStorage.getItem("token") || !sessionStorage.getItem("user")) {
    location.href = "../login/login.html";
    return;
  }

  // check if token valid
  try {
    const fetchOptions = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/user/token", fetchOptions);
    if (!response.ok) {
      location.href = "../login/login.html";
    } else {
      const json = await response.json();
      sessionStorage.setItem("user", JSON.stringify(json.user));
    }
  } catch (e) {
    console.log(e.message);
  }
})();
