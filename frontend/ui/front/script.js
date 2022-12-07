"use strict";

//import { url } from "../config.js";
const url = "http://localhost:3000";
import logOut from "../logout.js";

// get user data
const token = sessionStorage.getItem("token");
const user = sessionStorage.getItem("user");
const loginUser = JSON.parse(user);
const loginUserId = loginUser.user_id;

// //if user does not login yet, redirect back to login page
// if (!token && !user) {
//   location.href = "../login/login.html";
// }

/*-- Display username and avatar of log In user--*/
//Select existing html elements
const userInfo = document.querySelector(".user-profile");
if (token && user) {
  const p = document.createElement("p");
  p.innerHTML = user.username;
  const img = document.createElement("img");
  img.src = url + "/" + user.avatar;
  img.alt = user.username;
  userInfo.appendChild(img);
  userInfo.appendChild(p);

  img.addEventListener("click", () => {
    location.href = `profile.html?id=${loginUserId}`;
  });
}

/*-- Create post content --*/
//Get all image with id
const getFollowingPhotos = async (id) => {
  try {
    const fetchOptions = {
      method: "GET",
    };
    const response = await fetch(url + "/photo/user" + id, fetchOptions);
    const photos = await response.json();
    createPosts(photos);
  } catch (e) {
    console.log(e.message);
  }
};
getFollowingPhotos(loginUserId);

//get all users
const getAllUsers = async () => {
  try {
    const fetchOptions = {
      method: "GET",
    };
    const response = await fetch(url + "/", fetchOptions);
    const users = await response.json();
  } catch (e) {
    console.log(e.message);
  }
};
getAllUsers();

//Get all the likes from the beginning
const likeIcon = document.querySelector("#like-icon");
const likeCount = document.querySelector("#like-count");

async function getAllLikes() {
  try {
    const response = await fetch(url + "/like/photo/" + photo_id);
    const allLikes = await response.json();
    updateHeartCount(allLikes.allLikes);
  } catch (error) {
    alert(error.message);
  }
}

// Get like of the login user
async function getLikeOfUser() {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/like/user/" + photo_id, fetchOptions);
    const like = await response.json();
    updateHeartIcon(like.like);
  } catch (error) {
    alert(error.message);
  }
}

getAllLikes();
if (user && token) {
  getLikeOfUser();
}

//Toggle like and display number of likes
likeIcon.addEventListener("click", async (event) => {
  event.preventDefault();

  const fetchOptions =
    likeIcon.className === "bx bx-heart"
      ? {
          method: "POST",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      : {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        };

  try {
    const response = await fetch(url + "/like/user/" + photo_id, fetchOptions);

    if (response.status === 200) {
      getAllLikes();
      getLikeOfUser();
    }
  } catch (error) {
    alert(error.message);
  }
});

//update UI of heart Icon
function updateHeartIcon(userLike) {
  if (userLike > 0) {
    likeIcon.className = "bx bx-heart";
    likeIcon.style.color = "red";
  } else {
    likeIcon.className = "bx bx-heart";
    likeIcon.style.color = "black";
  }
}

function updateHeartCount(allLikes) {
  likeCount.textContent = allLikes + " likes";
}

//Display feeds
const post = document.querySelector(".post");
const createPosts = (photos) => {
  photos.forEach((photo) => {
    const info = document.querySelector(".info");
    const user = document.createElement("div");
    user.className = "user";
    const profilePic = document.createElement("div");
    profilePic.className = "profile-pic";
    const imgProfile = document.createElement("img");
    img.src = url + "/user/" + photo.user_id.avatar;
    img.src = photo.user_id.username;

    const p = document.createElement("p");
    p.innerHTML = photo.user_id.username;

    const postImg = document.createElement("img");
    postImg.src = url + "/photo/" + photo.phot_id;
    postImg.alt = photo.description;

    const postContent = document.querySelector(".post-content");
    const description = document.createElement("p");
    description.innerHTML = photo.description;
    description.className = "description";

    const date = document.createElement("p");
    date.className = "post-time";
    date.innerHTML = photo.created_at;

    profilePic.appendChild(imgProfile);
    user.appendChild(profilePic);
    user.appendChild(p);
    info.appendChild(user);

    //delete button is add when admin or photo owner
    if (user.role == 0 || loginUserId === photo.user_id) {
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "Delete";
      deleteButton.className = "btn-delete";
      user.appendChild(deleteButton);

      deleteButton.addEventListener("click", async () => {
        const fetchOptions = {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        };
        if (confirm("You are deleting a photo, continue?")) {
          try {
            const response = await fetch(
              url + "/photo/" + photo.photo_id,
              fetchOptions
            );
            const json = await response.json();
            console.log("delete photo", json);
          } catch (e) {
            console.log(e.message);
          }
        } else {
          alert("You cancelled the action");
        }
      });
    }

    postContent.appendChild(description);
    postContent.appendChild(date);
  });
};

/*-- Trending users --*/
const suggestion = document.querySelector("profile-card");
const createTrend = (topUsers) => {
  topUsers.forEach((topUser) => {
    const profilePic = document.createElement("div");
    profilePic.className = "profile-pic";
    const img = document.createElement("img");
    img.src = url + "/user/" + topUser.user_id;
    img.alt = topUser.username;

    const div = document.createElement("div");
    const p = document.createElement("p");
    p.innerHTML = topUser.username;
    div.appendChild(p);
    profilePic.appendChild(img);
    suggestion.appendChild(profilePic);
    suggestion.appendChild(div);

    suggestion.addEventListener("click", () => {
      location.href = `profile.html?id=${topUser.user_id}`;
    });
  });
};

const getTrend = async () => {
  try {
    const options = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/user/trend", options);
    const topUsers = await response.json();
    createTrend(topUsers);
  } catch (e) {
    console.log(e.message);
  }
};
getTrend();

/*-- Log out --*/
const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  console.log("click logout");
  logOut();
});
