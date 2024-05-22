### College Recomander

To run the application, first ensure you have MySQL database set up properly. We need to start both front end and back end individually. For front end, use any IDE go to the front-end folder, and "npm start" in the terminal or powershell. For backend, use any IDE go to the backend folder, on your terminal o powershell type in "nodemon app.js"




### Admin

* control panel

  * [X] manage all user accounts
    * [X] add
    * [X] delete
    * [X] edit
    * [X] logout
  * [X] CRUD user notice
    * [X] change adminID to current useAuth admin ID
  * [X] CRUD college
    * [X] CRUD basic infos
    * [X] CRUD college details

  * approve add school request from basic users

### Basic users

* [X] login
* [X] register

* Main home page

  * [X] browse all college
    * [X] make buttons to split page

  * search all college
    * [X] based on name
    * [X] based on range of SAT
    * [X] based on range of GRE

  * [X] add selected college unit to your favorite list
  * [X] read user notice

  * suggest to add new school not in database
* user profile

  * [X] edit username, password
    * [X] after update the username or any info, the useAuth should update as well
  * [X] CRUDemic information: SAT, GPA, extra, others, majors
* school selection page

  * match current academic profile with fav college saved by that user
  * suggest closest match college outside of user saved college
* User’s liked/saved college

  * [X] delete liked college

* [X] College Details Page
  * [X] display basics
  * [X] display colelge info/details
  * [X] user can comment on a post
    * [X] delete / edit his own comment
