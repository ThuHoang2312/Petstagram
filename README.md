# PETSTAGRAM

## Where pet lovers meet

Petstagram is where pet owners and pet lovers share their precious moments with their pets to each other. Our desire is to connect pet lovers for form relationships, meet new friends, find comfort and help in moments of need. In future, we hope this is where animal shelters can post infos about those who are in need of adoption.

[Live demo](Link here)

## Features:

1. Login

With credentials then enter the home page.

2. Register

Create a new username - after creation redirect to login. Email duplication is checked.

3. Profile page

- View user's profile information
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

- Search user
- Click on the result will link to the profile of the user.

7. Single post page

- Single photo display
- Comment, like and number of like on the photo are displayed.
- If the photo has exif data, click on the photo will display a map.

8. Account settings page

- User can edit general information as in side menu in user page
- User can change password

9. Secure with HTTPS redirection

## Screenshot of the deployed app

Homepage:
![Screenshot 2022-12-13 at 13 00 32](https://user-images.githubusercontent.com/89455223/207300404-92efbe32-cce4-44fc-9281-548af91e680f.png)

Front page:
![Screenshot 2022-12-13 at 12 59 18](https://user-images.githubusercontent.com/89455223/207300231-aab2131c-cbf7-4c25-b80b-2f9fd8add5fa.png)

## Stack

- Front-end: HTML, CSS and JavaScript
- Back-end: NodeJS and Express
- Database: MariaDB
- The app is deployed on Azure.

## Installation

Clone the repo:

```
git clone (link here)
```

To run the back-end:

```
cd backend
npm install
```

Create and .env file with the following content:

```
DB_HOST="127.1.0.0"
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

1. Relation Schema

![WhatsApp Image 2022-12-13 at 1 23 17 PM](https://user-images.githubusercontent.com/89455223/207312482-50351c5d-0209-4e1a-820d-6d96b36868f5.jpeg)
![WhatsApp Image 2022-12-13 at 2 02 57 PM](https://user-images.githubusercontent.com/89455223/207313043-7e8b9c58-f768-41ae-8d34-12355f0c94b2.jpeg)



2. Project database SQL:
   Link here

## Contributors

[Chi Nguyen](https://github.com/chinguyen202)<br>
[Thu Hoang](https://github.com/ThuHoang2312)<br>
[Tuomas Heikkila](https://github.com/Tuomas01)<br>

Contact contributors for help if neccessary.

## License

Apache License 2.0

