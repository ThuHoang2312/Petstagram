"use strict";
//import { url } from "config.js";

export default async function logOut() {
  const url = "http://localhost:3000"
  try {
    const response = await fetch(url + "/auth/logout");
    const json = await response.json();

    // remove token
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    alert("You have logged out");
    location.href = "../home/index.html";
  } catch (e) {
    console.log(e.message);
  }
}
