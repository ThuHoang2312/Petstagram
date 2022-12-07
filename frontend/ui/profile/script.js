"use strict";

import { url } from "../config.js";
import logOut from "../logout.js";

const token = sessionStorage.getItem("token");
const user = sessionStorage.getItem("user");

// get user data from session storage
const logInUser = JSON.parse(user);

//if user does not login yet, redirect back to login page
if (!token && !user) {
  location.href = "../login/login.html";
}

/*-- Display username and avatar of log In user--*/
//Select existing html elements
const userInfo = document.querySelector(".user-profile");
if (token && user) {
  const p = createElement("p");
  p.innerHTML = user.username;
  const img = createElement("img");
  img.src = url + "/" + user.avatar;
  img.alt = user.username;
  userInfo.appendChild(img);
  userInfo.appendChild(p);

  img.addEventListener("click", () => {
    location.href = `profile.html?id=${user.user_id}`;
  });
}

/*---------Display user's profile------------*/
//Get id on url
const getQParam = (param) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
};
const userId = getQParam("id");

//get user and display user
const getUserById = async (id) => {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + `/user/${userId}`, fetchOptions);
    const users = await response.json();
    profileDisplay(users);
  } catch (e) {
    console.log(e.message);
  }
};
getUserById(userId);

//Display user's info on profile
const profile = document.querySelector(".user-info");
const profileDisplay = (users) => {
  users.forEach((user) => {
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    const img = document.createElement("img");
    img.src = url + "/thumbnails" + user.avatar;
    img.alt = user.username;

    const userDetail = document.createElement("div");
    userDetail.className = "user-detail";
    const h2 = document.createElement("h2");
    h2.innerHTML = user.username;
    const description = document.createElement("p");
    p.innerHTML = user.description;

    avatar.appendChild(img);
    userDetail.appendChild(h2);
    userDetail.appendChild(description);
    profile.appendChild(avatar);
    profile.appendChild(userDetail);
  });
};

//Upload photo when it is the login user's profile page

const add = document.querySelector(".add");
if (!logInUser.user_id == userId) {
  add.style.display = "none";
}

const addPhotoOverlay = document.querySelector(".overlay");
const closeOverlay = document.querySelector(".overlay i");

//Append file name to text
document.getElementById("imagePosting").onchange = function () {
  const fileName = this.value.split("\\");
  document.getElementById("uploadImage").textContent =
    fileName[fileName.length - 1];
};

add.addEventListener("click", () => {
  addPhotoOverlay.classList.add("overlay-open");
});

closeOverlay.addEventListener("click", () => {
  addPhotoOverlay.classList.remove("overlay-open");
});

//Post Photo
const postPhoto = document.querySelector("#post-image");
postPhoto.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const data = new FormData(postPhoto);

  const fetchOptions = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: data,
  };

  await fetch(url + "/photo/user", fetchOptions);
});

/*---------Display the photo upload by user------------*/

//get photo by user id
const getPhotosByUser = async (id) => {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/image/user/" + id, fetchOptions);
    const images = await response.json();
    createLibrary(photos);
  } catch (e) {
    console.log(e.message);
  }
};

getPhotosByUser(userId);

//Display photo uploaded by user

const photoList = document.querySelector("#photo-lib");
const createCard = (photos) => {
  photos.forEach((photo) => {
    const photo = document.createElement("div");
    photo.className = "single-image";
    const img = document.createElement("img");
    img.src = url + "/thumbnails" + photo.filename;
    img.alt = item.text;
    photo.appendChild(img);
    photoList.appendChild(photo);

    photo.addEventListener("click", () => {
      location.href = `../post/single.html?id=${photo.photo_id}`;
    });
  });
};

/*-- Log out --*/
const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
  logOut();
});
