### College Recomander

To run the application, first ensure you have MySQL database set up properly. We need to start both front end and back end individually. For front end, use any IDE go to the front-end folder, and "npm start" in the terminal or powershell. For backend, use any IDE go to the backend folder, on your terminal o powershell type in "nodemon app.js"

### Admin Functionality

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

### Basic Users Functionality

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

## SQL tables

* admin
  * admin id - admin (int)
  * username - usermname (string)
  * password - password (string)
* student / use
  * student id - idusers (int)
  * username - username (string)
  * password - password (int)
  * academic profile
* academic profile  - useracademic
  * academic id (PK) - iduseracademic (int)
  * student id (PK) - idusers  (int)
  * SAT - SAT (int)
  * GPA - GPA (float)
  * Extracurricular - extra (String)
  * comments - others (string)
  * majors - majors (string)
* college basic record - collegebasics
  * basics
    * college id - idCollege
    * college name - collegeName
    * picture - picURL
    * average SAT - aveSAT
    * average GPA - aveGPA
    * tuition - tuition
    * acceptance rate - accRate
    * rank - ranks
    * collge details id - idCollegeDetails
* college infos - collegeinfo
  * academic - academic (string)
  * value - value (string)
  * safety - safety (string)
  * location - location (string)
  * athletics - athletics (string)
  * student life - life (string)
  * details id - idCollegeDetails (PK)
  * college id - idCollege(FK)
* college comments - collegecomments
  * idcollegecomments (int, unique, auto cre)
  * idusers (int)
  * idcollege (int)
  * message (string)
* College decisions
  * idusers
  * idCollege
  * SAT
  * GPA
  * extra
  * decision
