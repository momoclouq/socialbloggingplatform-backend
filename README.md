# Social blogging platform
This project is about a social blogging platform where people can view/create and manage their own posts.

---
##### Note: This is the repo for the backend, you can find the frontend [here](https://github.com/momoclouq/socialbloggingplatform)
---

## Public API URL:
https://blooming-tor-01512.herokuapp.com/

## Technology used:
- Main: ExpressJs, Mongoose (MongoDB), passportJs (for authentication)
- Minor: bcrypt, cors, dotenv, express-validator, jsonwebtoken

## How to run locally:
1. Install Node
2. Clone the repo
3. Navigate to the repo folder
4. run `npm install` to install the dependencies
5. run `npm run devstart` or `npm run start` to start the server
6. The server is then running on localhost:8000

## How to use the API:
Example: Get all published post with page = 3. Path provided is `post/published`, method = "GET"
1. Combine the public API URL with the provided path: `https://blooming-tor-01512.herokuapp.com/post/published`
2. Send GET request to the URI with necessary data (authenticate token, form data, etc)
3. `200 posts` = status 200, json with posts field

## API Description
1. Authenticatication
- Login:   
    Path: "/login"  
    Method: "POST"  
    Data body: `username-string`, `password-string`  
    Success: `200 token`  
    Failure: `404 error`  
    Authentication: none  
    Reason failing: wrong password  

- Signup:  
    Path: "/signup"  
    Method: "POST"  
    Data body: `username-string-max40-required` `email-isEmail-required` `password-string-min6-required` `motto-string-max400-optional`  
    Success: `200 message`  
    Failure: `404 error` 
    Authentication: none  
    Reason faling: Wrong data, username used, email used  

- Logout:  
    Path: "/logout"  
    Method: "POST"  
    Data body:  
    Success: `200 logout`  
    Failure: `401`  
    Authentication: Bearer with token  
    Reason failing: wrong token  

2. Post management
- Get all personal post with page:  
    Path: "/post/personal"  
    Method: "GET"  
    Data body:  
    Argument: `p-page number`  
    Success: `200 posts`  
    Failure: `401` `404 error`  
    Authentication: Bearer with token  
    Reason failing: wrong token, posts cannot be found/ no post with that page  

- Get all published posts (public) with page: 
    Path: "/post/published"  
    Method: "GET"  
    Data body:   
    Argument: `p-page number` `m-mode`    
    Success: `200 posts`  
    Failure: `401` `404 error`  
    Authentication: Bearer with token  
    Reason failing: wrong token, posts cannot be found/ no post with that page  

- Get published post with id (public):   
    Path: "/post/published/:id"  
    Method: "GET"  
    Data body:   
    Argument:   
    Success: `200 post`  
    Failure: `404 error`  
    Authentication: none  
    Reason failing: post with id does not exist 

- Get post with id:  
    Path: "/post/:id"  
    Method: "GET"  
    Data body:   
    Argument:   
    Success: `200 post`  
    Failure: `401` `404 error`  
    Authentication: Bearer with token    
    Reason failing: wrong token, post with id does not exist  

- Delete post with id:  
    Path: "/post/:id"  
    Method: "DELETE"  
    Data body:   
    Argument:   
    Success: `200 post`  
    Failure: `401` `404 error`  
    Authentication: Bearer with token    
    Reason failing: wrong token, post with id does not exist, post is not from the user  

- Update post with id:  
    Path: "/post/:id"  
    Method: "PUT"  
    Data body: `title-string-max200` `published-boolean`   
    Argument:   
    Success: `200 post`  
    Failure: `401` `404 error`  
    Authentication: Bearer with token    
    Reason failing: wrong token, post with id does not exist, post is not from the user 

- Create post:  
    Path: "/post/:id"  
    Method: "POST"  
    Data body: `title-string-max200-min1-required` `subtitle-string-max200-optional` `content-string-min1-required` `published-boolean-optional`    
    Argument:   
    Success: `200 post`  
    Failure: `401` `404 error`  
    Authentication: Bearer with token    
    Reason failing: wrong token, wrong data input  

- Get all post:  
    Path: "/post/:id"  
    Method: "GET"  
    Data body:     
    Argument: `p-page number`   
    Success: `200 post`  
    Failure: `401` `404 error`  
    Authentication: Bearer with token    
    Reason failing: wrong token, cannot find any post with page number  

3. Comment management:  
- Get comment with commentid:  
    Path: "/post/:postid/comment/:commentid"  
    Method: "GET"  
    Data body:     
    Argument: `p-page number`   
    Success: `200 comment`  
    Failure: `404 error`  
    Authentication: None    
    Reason failing: Wrong id  

- Delete comment with commentid:  
    Path: "/post/:postid/comment/:commentid"  
    Method: "DELETE"  
    Data body:     
    Argument:    
    Success: `200 comment`  
    Failure: `404 error`  
    Authentication: Bearer with token      
    Reason failing: Wrong token, wrong id  

- Update comment with commentid:  
    Path: "/post/:postid/comment/:commentid"  
    Method: "PUT"  
    Data body: `content-string-max1000-optional` `author-string-max200-optional`      
    Argument:    
    Success: `200 comment`  
    Failure: `404 error`  
    Authentication: Bearer with token      
    Reason failing: Wrong token, wrong id, wrong data input  

-  Create a comment:  
    Path: "/post/:postid/comment"  
    Method: "POST"  
    Data body: `content-string-max1000-required` `author-string-max200-required`      
    Argument:    
    Success: `200 comment`  
    Failure: `404 error`  
    Authentication: None      
    Reason failing: wrong id, wrong data input, post does not exist  

- Get all comments of a post:  
    Path: "/post/:postid/comment"  
    Method: "GET"  
    Data body:      
    Argument:    
    Success: `200 comments count`  
    Failure: `404 error`  
    Authentication: None      
    Reason failing: wrong id, wrong data input, post does not exist  

4. Blogger management:  
- Get the current user (logged in user):  
    Path: "/blogger/current"  
    Method: "GET"  
    Data body:       
    Argument:    
    Success: `200 user`  
    Failure: `404 error`  
    Authentication: Bearer with token      
    Reason failing: wrong token  

- Get blogger information by id: 
    Path: "/blogger/:id"  
    Method: "GET"  
    Data body:       
    Argument:    
    Success: `200 blogger`  
    Failure: `404 error`  
    Authentication: None  
    Reason failing: wrong id  

- Delete current blogger:  
    Path: "/blogger"  
    Method: "DELETE"  
    Data body: `password-for authenticate`        
    Argument:    
    Success: `200 message`  
    Failure: `404 error`  
    Authentication: Bearer with token      
    Reason failing: wrong token, wrong password 

- Update current blogger:  
    Path: "/blogger"  
    Method: "PUT"  
    Data body: `password-string-min6-optional` `motto-string-max400-optional` `oldpassword-string-optional`        
    Argument:    
    Success: `200 newUser`  
    Failure: `404 error`  
    Authentication: Bearer with token      
    Reason failing: wrong token, old password is wrong, wrong input data  

- Heart a blogger: 
    Path: "/blogger/:id"  
    Method: "GET"  
    Data body:       
    Argument:    
    Success: `200 blogger`  
    Failure: `404 error`  
    Authentication: None      
    Reason failing: Wrong id  

-  Get all blogger:  
    Path: "/blogger"  
    Method: "GET"  
    Data body:       
    Argument: `p-page number` `m-mode`   
    Success: `200 user`  
    Failure: `404 error`  
    Authentication: None     
    Reason failing: Cannot find blogger with page number  