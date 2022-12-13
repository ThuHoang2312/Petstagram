"use strict";
const url = "https://petstagram.northeurope.cloudapp.azure.com/app"

export default async function logOut() {
  try {
    const response = await fetch(url + "/auth/logout");

    // remove token
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    alert("You have logged out");
    location.href = "../home/index.html";
  } catch (e) {
    console.log(e.message);
  }
}
