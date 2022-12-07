"use strict";

import { url } from "../config.js";
import logOut from "../logout.js";

//Get data from session storage
const token = sessionStorage.getItem("token");
const logInUser = sessionStorage.getItem("user");
const logInUserId = logInUser.user_id;

/*--------Display logIn user avatar and username-------*/

const userInfo = document.querySelector(".user-profile");
if (token && user) {
  const p = createElement("p");
  p.innerHTML = logInUser.username;
  const img = createElement("img");
  img.src = url + "/" + logInUser.avatar;
  img.alt = logInUser.username;
  userInfo.appendChild(img);
  userInfo.appendChild(p);

  img.addEventListener("click", () => {
    location.href = `profile.html?id=${logInUserId}`;
  });
}

/*--------Overlay form handler--------*/

const generalBtn = document.querySelector(".general");
const passwordBtn = document.querySelector(".setting-item password");
const deleteBtn = document.querySelector(".setting-item delete");

const updateOverlay = document.querySelector(".updateOverlay");
const closeUpdateOverlay = document.querySelector("#edit");

generalBtn.addEventListener("click", () => {
  updateOverlay.classList.add("overlay-open");
});
closeUpdateOverlay.addEventListener("click", () => {
  updateOverlay.classList.remove("overlay-open");
});

const passwordOverlay = document.querySelector(".passwordOverlay");
const closePassOverlay = document.querySelector("#update");

passwordBtn.addEventListener("click", () => {
  passwordOverlay.classList.add("overlay-open");
});

closePassOverlay.addEventListener("click", () => {
  passwordOverlay.classList.remove("overlay-open");
});

const deleteOverlay = document.querySelector(".deleteOverlay");
const closeDeleteOverlay = document.querySelector("#delete");

deleteBtn.addEventListener("click", () => {
  deleteOverlay.classList.add("overlay-open");
});

closeDeleteOverlay.addEventListener("click", () => {
  deleteOverlay.classList.remove("overlay-open");
});

/*--------Update profile form handler--------*/

const updateProfile = async () => {
  let submittedForm = document.querySelector("#updateInfoForm");
  submittedForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const data = new FormData(submittedForm);

    //Check if form data is having all blank fields:
    let isEmpty = true;
    for (var pair of data.entries()) {
      if (pair[1] !== "" && pair[1].name !== "") {
        isEmpty = false;
      }
    }
    //Fill the dummy data to form if the user leaves fields blank
    if (data.get("username") === "") {
      data.set("username", logInUser.username);
    }
    if (data.get("image") === "") {
      data.set("image", logInUser.avatar);
    }
    if (data.get("description") === "") {
      data.set("description", logInUser.description);
    }
    const options = {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: data,
    };

    const response = await fetch(url + `/user/${logInUserId}`, options);
    const json = await response.json();
    console.log(json);

    if (isEmpty) {
      alert("You submitted a blank form");
    } else if (!response.ok) {
      alert("Error " + response.statusText + " occurred when updating profile");
    } else {
      alert(json.message);
    }
    if (json.error) {
      alert(json.error.message);
    }

    location.href = "setting.html";
  });
};

/*--------Password change form handler--------*/

const changePassword = async () => {
  const passwordForm = document.querySelector("#updatePasswordForm");
  passwordForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const data = serializeJson(passwordForm);

    //Check if new password confirmation matching:
    const matchingPassword = data["newPassword"] !== data["checkPassword"];
    if (matchingPassword) {
      alert("New passwords must match");
    } else {
      const options = {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(
        url + `/user/${logInUserId}/passwordChange`,
        options
      );
      const json = await response.json();

      if (!response.ok) {
        alert("Error " + response.status + " occurred when updating password");
      } else {
        alert(json.message);
      }
      if (json.error) {
        alert(json.error.message);
      }

      location.href = "setting.html";
    }
  });
};

/*--------Delete account form handler--------*/

const handleDeleteForm = async () => {
  const deleteForm = document.querySelector("#deleteForm");
  deleteForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const data = serializeJson(deleteForm);
    console.log(data);

    if (data["email"] === "") {
      alert("Please confirm");
    } else if (data["email"] === loggedInUser.email) {
      const options = {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(url + `/user/${logInUserId}`, options);
      const json = await response.json();

      if (!response.ok) {
        alert("Error " + response.status + " occurred when updating password");
      } else {
        alert(json.message);
      }
      if (json.error) {
        alert(json.error.message);
      }
      console.log("deletion confirmed");
      location.href = "login.html";
    } else {
      alert("Please type your email to confirm");
    }
  });
};

/*--------handle logout button clicked--------*/

const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
  logOut();
});