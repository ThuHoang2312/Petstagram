"use strict";

//import { url } from "../config.js";
const url = "http://localhost:3000";
import logOut from "../logout.js";

// get user data
const token = sessionStorage.getItem("token");
const logInUser = sessionStorage.getItem("user");
const loginUser = JSON.parse(logInUser);
const loginUserId = loginUser.user_id;

//if user does not login yet, redirect back to login page
if (!token && !logInUser) {
  location.href = "../home/index.html";
}

/*-- Display username and avatar of log In user--*/
//Select existing html elements
const userInfo = document.querySelector(".user-profile");
if (token && logInUser) {
  const p = document.createElement("p");
  p.innerHTML = loginUser.username;
  const img = document.createElement("img");
  if (loginUser.avatar == null) {
    img.src = "../../assets/user_icon.png";
  } else {
    img.src = url + "/" + user.avatar;
  }
  img.alt = loginUser.username;
  userInfo.appendChild(img);
  userInfo.appendChild(p);

  img.addEventListener("click", () => {
    location.href = `../profile/profile.html?id=${loginUserId}`;
  });
}

/*-- Create post content --*/

//Get all the likes from the beginning
const likeIcon = document.getElementById("like-icon");
const likeCount = document.getElementById("like-count");

// async function getAllLikes() {
//   try {
//     const response = await fetch(url + "/like/photo/" + photo_id);
//     const allLikes = await response.json();
//     updateHeartCount(allLikes.allLikes);
//   } catch (error) {
//     alert(error.message);
//   }
// }

// // Get like of the login user
// async function getLikeOfUser() {
//   try {
//     const fetchOptions = {
//       method: "GET",
//       headers: {
//         Authorization: "Bearer " + sessionStorage.getItem("token"),
//       },
//     };
//     const response = await fetch(url + "/like/" + photo_id, fetchOptions);
//     const like = await response.json();
//     updateHeartIcon(like.like);
//   } catch (error) {
//     alert(error.message);
//   }
// }
//getFollowingOfUser();

async function getFollowOfUser() {
  try {
    const fetchOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url + "/follow/" + loginUserId, fetchOptions);
    const follows = await response.json();
    updateFollow(follows);
  } catch (error) {
    alert(error.message);
  }
}

//update UI of follow button
function updateFollow(follow) {
  if (follow.length > 0) {
    followButton.className = "btn-follow";
    followButton.innerHTML = "Following";
  } else {
    followButton.className = "btn-follow";
    followButton.style.color = "Follow";
  }
}

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
      imgProfile.src = url + "/user/" + photo.avatar;
    }
    imgProfile.alt = photo.username;
    const p = document.createElement("p");
    p.innerHTML = photo.username;

    profilePic.appendChild(imgProfile);
    profileUser.appendChild(profilePic);
    profileUser.appendChild(p);
    userInfo.appendChild(profileUser);

    //delete button is add when admin or photo owner
    if (photo.role == 0 || loginUserId === photo.user_id) {
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "Delete";
      deleteButton.className = "btn-delete";

      profileUser.appendChild(deleteButton);

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
    if (!(logInUser == photo.user_id)) {
      const followButton = document.createElement("button");
      followButton.innerHTML = "Follow";
      followButton.className = "btn-follow";

      profileUser.appendChild(followButton);

      followButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const fetchOptions =
          followButton.className === "btn-follow"
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
          const response = await fetch(
            url + "/follow/" + photo.user_id,
            fetchOptions
          );

          if (response.status === 200) {
            getFollowOfUser();
          }
        } catch (error) {
          alert(error.message);
        }
      });
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
    description.className = "description";

    const date = document.createElement("p");
    date.className = "post-time";
    date.innerHTML = photo.created_at;

    postContent.appendChild(postImg);
    postContent.appendChild(description);
    postContent.appendChild(date);
    post.appendChild(postContent);
    console.log(post);

    postContent.addEventListener("click", () => {
      location.href = `../post/single.html?id=${photo.photo_id}`;
    });
  });
};

//Get all image with id
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

// /*-- Trending users --*/

// const suggestion = document.querySelector("profile-card");
// const createTrend = (topUsers) => {
//   topUsers.forEach((topUser) => {
//     const profilePic = document.createElement("div");
//     profilePic.className = "profile-pic";
//     const img = document.createElement("img");
//     img.src = url + "/user/" + topUser.user_id;
//     img.alt = topUser.username;

//     const div = document.createElement("div");
//     const p = document.createElement("p");
//     p.innerHTML = topUser.username;
//     div.appendChild(p);
//     profilePic.appendChild(img);
//     suggestion.appendChild(profilePic);
//     suggestion.appendChild(div);

//     suggestion.addEventListener("click", () => {
//       location.href = `profile.html?id=${topUser.user_id}`;
//     });
//   });
// };

// const getTrend = async () => {
//   try {
//     const options = {
//       headers: {
//         Authorization: "Bearer " + sessionStorage.getItem("token"),
//       },
//     };
//     const response = await fetch(url + "/user/trend", options);
//     const topUsers = await response.json();
//     createTrend(topUsers);
//   } catch (e) {
//     console.log(e.message);
//   }
// };
// getTrend();

/*-- Log out --*/
const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  console.log("click logout");
  logOut();
});
