"use strict"
const url = "http://localhost:3000"
// const url = "https://petstagram.northeurope.cloudapp.azure.com/app";

export default async function logOut() {
  // remove token
  sessionStorage.removeItem("token")
  sessionStorage.removeItem("user")
  try {
    const response = await fetch(url + "/auth/logout")
    const json = await response.json()
    console.log(json)
    alert("You have logged out")
    location.href = "../home/index.html"
  } catch (e) {
    console.log(e.message)
  }
}
