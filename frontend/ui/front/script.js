"use strict";

//import { url } from "../config.js";
const url = "http://localhost:3000";
import logOut from "../logout.js";

// get user data
const token = sessionStorage.getItem("token");
const logInUser = sessionStorage.getItem("user");
const loginUser = logInUser && JSON.parse(logInUser);

//if user does not login yet, redirect back to front page
if (!token) {
  console.log("redirect");
  location.href = "../home/index.html";
}

const loginUserId = loginUser.user_id;
/*-- Display username and avatar of log In user--*/
//Select existing html elements

if (token && logInUser) {
  const img = document.querySelector(".user-wrapper img");
  if (loginUser.avatar == null) {
    img.src = "../../assets/user_icon.png";
  } else {
    img.src = url + "/" + loginUser.avatar;
  }
  const h4 = document.querySelector(".user-wrapper h4");
  h4.innerHTML = loginUser.username;

  img.addEventListener("click", () => {
    location.href = `../profile/profile.html?id=${loginUserId}`;
  });
}

/*-- Create post content --*/

const getFollowStatus = async (id) => {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(
      url + "/follow/followStatus/" + id,
      fetchOptions
    );
    const follow = await response.json();
    console.log("Follow status: ", follow.message);
  } catch (error) {
    alert(error.message);
  }
};

const post = document.querySelector(".post");
const createPost = (photos) => {
  photos.forEach((photo) => {
    const userInfo = document.createElement("div");
    userInfo.className = "info";
    const profileUser = document.createElement("div");
    profileUser.className = "user";
    const profilePic = document.createElement("div");
    profilePic.className = "profile-pic";

    /*---Avatar display-----*/
    const imgProfile = document.createElement("img");
    if (photo.avatar == null) {
      imgProfile.src = "../../assets/user_icon.png";
    } else {
      imgProfile.src = url + "/" + photo.avatar;
    }
    imgProfile.alt = photo.username;
    const p = document.createElement("p");
    p.innerHTML = photo.username;

    profilePic.appendChild(imgProfile);
    profileUser.appendChild(profilePic);
    profileUser.appendChild(p);
    userInfo.appendChild(profileUser);

    const buttonDiv = document.createElement("div");
    userInfo.appendChild(buttonDiv);

    //delete button is add when login user'role admin or photo owner
    if (loginUserId == 0 || loginUserId === photo.user_id) {
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "Delete";
      deleteButton.className = "btn-delete";

      buttonDiv.appendChild(deleteButton);

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

    //Create follow button
    if (!(loginUserId == photo.user_id)) {
      const followButton = document.createElement("button");
      followButton.innerHTML = "Follow";
      followButton.className = "btn-follow";
      buttonDiv.appendChild(followButton);
      const followStatus = getFollowStatus(photo.user_id);
      if (followStatus) {
        followButton.innerHTML = "Following";
      } else {
        followButton.innerHTML = "Follow";
      }
    }

    post.appendChild(userInfo);

    const postContent = document.createElement("div");
    postContent.className = "post-content";
    const postImg = document.createElement("img");
    postImg.src = url + "/" + photo.filename;
    onerror = () => {
      postImg.src = "https://picsum.photos/seed/picsum/100/200";
    };
    postImg.alt = photo.description;

    const description = document.createElement("p");
    description.innerHTML = photo.description;
    const textDiv = document.createElement("div");
    textDiv.className = "description";
    const username = document.createElement("span");
    username.innerHTML = photo.username;
    textDiv.appendChild(username);
    textDiv.appendChild(description);
    const date = document.createElement("p");
    date.className = "post-time";
    if (photo.created_at != null) {
      date.innerHTML = photo.created_at.substring(0, 10);
    } else {
      date.innerHTML = photo.created_at;
    }

    const line = document.createElement("hr");
    line.className = "line";
    postContent.appendChild(postImg);
    postContent.appendChild(textDiv);
    postContent.appendChild(date);
    post.appendChild(postContent);
    post.appendChild(line);
    console.log(post);

    userInfo.addEventListener("click", () => {
      location.href = `../profile/profile.html?id=${photo.user_id}`;
    });

    postContent.addEventListener("click", () => {
      location.href = `../post/single.html?id=${photo.photo_id}`;
    });
  });
};

//Get all photo of following account
const getFollowingPhotos = async () => {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/photo", fetchOptions);
    const photos = await response.json();
    console.log(photos);

    //If there is no following account's photo, return random generate photo
    if (!(photos.length == 0)) {
      createPost(photos);
    } else {
      getRandom();
    }
  } catch (e) {
    console.log(e.message);
  }
};
getFollowingPhotos();

const getRandom = async () => {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/photo/explore", fetchOptions);
    const photos = await response.json();
    console.log(photos);
    createPost(photos);
  } catch (e) {
    console.log(e.message);
  }
};

/*-- Trending users --*/

const suggestion = document.querySelector(".profile-card");
const createTrend = (topUsers) => {
  topUsers.forEach((topUser) => {
    const div = document.createElement("div");
    const img = document.createElement("img");
    if (topUser.avatar == null) {
      img.src = "../../assets/user_icon.png";
    } else {
      img.src = url + "/" + topUser.avatar;
    }
    img.alt = topUser.username;
    const p = document.createElement("p");
    p.innerHTML = topUser.username;
    div.appendChild(img);
    div.appendChild(p);
    suggestion.appendChild(div);

    div.addEventListener("click", () => {
      location.href = `../profile/profile.html?id=${topUser.user_id}`;
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
    console.log("getTrend: ", topUsers);
    createTrend(topUsers);
  } catch (e) {
    console.log(e.message);
  }
};
getTrend();

/*-- Hambuger menu --*/

const menu_toggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");

menu_toggle.addEventListener("click", () => {
  menu_toggle.classList.toggle("is-active");
  sidebar.classList.toggle("is-active");
});

/*-- Log out --*/
const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  console.log("click logout");
  logOut();
});
