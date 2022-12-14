# PETSTAGRAM

## Where pet lovers meet

Petstagram is where pet owners and pet lovers share their precious moments with their pets to each other. Our desire is to connect pet lovers for form relationships, meet new friends, find comfort and help in moments of need. In future, we hope this is where animal shelters can post infos about those who are in need of adoption.

https://petstagram.northeurope.cloudapp.azure.com/frontend/ui/home/index.html

## Features:

1. Login

With credentials then enter the home page.

2. Register

Create a new username - after creation redirect to login. Email duplication is checked.

3. Profile page

- View user's profile information.
- View photos that user have uploaded.
- Upload photo together with description.
- There is follow button so you can decide to follow the profile user.

4. Front page

- Display the photo that people you as user has followed.
- Random photo generation if the user has not followed anyone.
- Only admin and photo owner can see delete button on each post.
- Click on each post will link to that single post.
- Trending section, which display the top users of the app. Click on the profile picture will link the that person's profile page.

5. Search page

- Search username for finding user. Click on the result will link to the profile of the user.
- Search for photo by filtering photo description. Click on the result will link to the photo post.

7. Single post page

- Single photo display.
- Comment, like and number of like on the photo are displayed.
- If the photo has exif data, the location will show in the map.

8. Account settings page

- User can edit general information such as username, description, avatar. 
- User can change password.

9. Secure with HTTPS redirection

## Screenshot of the deployed app

Homepage:
![Screenshot 2022-12-14 at 11 24 28](https://user-images.githubusercontent.com/89455223/207557276-44013903-23ac-4e42-a58d-3bec4f786c87.png)

Front page:
![Screenshot 2022-12-14 at 11 26 00](https://user-images.githubusercontent.com/89455223/207557520-0b8402c4-26f0-4c76-a673-7f119d6e17d5.png)

## Stack

- Front-end: HTML, CSS and JavaScript
- Back-end: NodeJS and Express
- Database: MariaDB
- The app is deployed on Azure.

## Dependencies
    "bcrypt": "^5.1.0",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "exif": "^0.6.0",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "express-validator": "^6.14.2",
    "jsonwebtoken": "^8.5.1",
    "multer": "^1.4.5-lts.1",
    "mysql2": "^2.3.3",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.0",
    "passport-local": "^1.0.0",
    "sharp": "^0.31.2"

## Installation

Clone the repo:

```
git clone https://github.com/ThuHoang2312/Petstagram.git
```

To run the back-end:

```
cd backend
npm install
```

Create and .env file with the following content:

```
PORT=<your-port-number>
DB_HOST=<your-localhost>
DB_USER=<your-db-user>
DB_PASS=<your-db-user_password>
DB_NAME=<your-db-name>
JWT_SECRET=<your-secret-key>
```

```
npm run dev
```

To run front-end: You can open the ui/home/index.html on VSCode. For VSCode, you can click the Go Live on the bottom bar to open the web on your default browser.

## Database structures

1. Relation Schema and ER

![image-3](https://user-images.githubusercontent.com/58989517/207555912-8775c85c-a46d-4afa-a4c7-59ac3b260951.png)


![image-4](https://user-images.githubusercontent.com/58989517/207555933-8ac1e939-9758-48ac-b0b2-87b70e0df4ef.png)


2. Project database SQL:

   https://github.com/ThuHoang2312/Petstagram/blob/main/backend/petstagram-dump.sql

## Contributors

[Chi Nguyen](https://github.com/chinguyen202)<br>
[Thu Hoang](https://github.com/ThuHoang2312)<br>
[Tuomas Heikkilä](https://github.com/Tuomas01)<br>

Contact contributors for help if neccessary.

## License

Apache License 2.0

