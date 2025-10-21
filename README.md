# Logistics

**Q1:** At what time in the week would your group be available to meet online?  
**Example:**  
*We are available to meet online on weekends from 12pm-8pm (12-2pm Saturday + Sunday), as well as from 4pm-6pm on Fridays.*  
*Our weekly meeting will be Thursday 11am-12pm.* 

Answer:
We are available to meet online on any time of the week from 3pm-10pm. Moreover, we are also available to meet in person from 3pm-5pm on any time of the week

---

# Timeline: Weekly Meeting Goals

**Q2:** What is your goals that your group want to achieve in each weekly meeting?  
**Example:**  
_Prior to 3/13: Weekly Meeting we will plan out some preliminary info/idea for the project itself ahead of the scheduled meeting like which data source/API and data structures we will use in our backend. We will browse [the given list of public APIs for inspiration](https://github.com/public-apis/public-apis)._

_During week of 3/25: Work on the project rough draft itself to make a functioning project with data input, data structure usage, and processing into output on the frontend._

_Prior to 4/17: Meet together weekly to target project weakpoints/bugs and possibly visit office hours to get guidance if the progress feels weak._


Week 10/07 - Week 10/23: In these weeks we will plan out the implementation for the project and what data structures we will use for the project. Furthermore, we will discuss what roles each member will take for the project and start coding based on the roles assigned to each member of the group

Week 11/4 - Week 11/20: In these weeks we will come together to check our implementation and where each memeber is in terms of completing the project and help each other on the problem we might be facing.

Prior to Week 12/01: Finalize and complete our project and prepare for the presentation.

---

# Communication

**Q3a:** How can your group communicate when doing the Full Stack Group Project?  
**Q3b:** What are the usernames of each group member on that platform?  
**Q3c:** What is your group’s expected response time to messages?

**Example:**  
_We will use Discord for communication_

_Usernames:_  
_Justin - ghostmechanic_  
_Claudia - ninth.py_  
_Mauricio - itsperi_  
_Our expected response time will be within 12 hours._

We will be using Discord for communication

Username:
Kavyasri Challa - kavya0196
Adithya Prasad  - adi2562
Niharika Patil  - _niharikapatil_
Lakshmi Krishan - hellomellow0471
Our expected response time will be within 24 hours.

---

# Norms

**Q4a:** How will your group handle situations when there is conflict in your group?  
**Q4b:** How will your group handle situations when a member is not contributing enough?

_For all cases where we are in conflict of opinions or actions, we as a group will come together in a meeting ad
decide standards on how things should be done._
_For cases where we can not come to an agreement, we will take a vote_
_If a group member is contributing less than required or continously not pulling their weight, they will be asked in our grouply meetings to do their part and provide us with information on any issues they might be having so we can do our best to help._
_If the behaviour continues, the rest of the group will try to come up with an unanimous decision to move forward._

---

# Roles

**Q5:** How will your group divide your role in the Group Project?

_Niharika - Frontend, Lakshmi - Backend, Kavya - Database Integration + Storylining, Adithya - UX Design + Database help_

---

# Tech Stacks

**Q6:** Which tech stacks will your group use? (Django + React or Flask + React)

_Django + React_

# Full Stack Group Project Track

---

# Track 1: Tackling Generative AI Consequences

**Problem 1:**

**Solution 1:**

---

# Track 2: Technology for Public Goods

**Problem 2:**
    Many local community volunteers struggle to find nearby opportunities to help out, coordinate with other volunteers, or learn about upcoming events. This makes it harder for people to get involved and have a meaningful impact in their community.


**Solution 2:**
    A practical project is to build a simple app that connects volunteers with local opportunities. Users could create profiles, browse events based on interests or location, sign up for activities, and communicate with other volunteers. Features could include event notifications, messaging, and a calendar. This project helps build community engagement, makes volunteering more accessible, and is easy to implement using web or mobile technologies.

**Problem 3:**

**Solution 3:**

# Track 3: Creative Coding and Cultural Expression

**Idea - Story - Inspiration 4:**

    This idea is inspired by one of our teammates dream where she time traveled back into the 1980's India where she got to explore the cultural environment and social norms where at one point she finds a younger version of her mother. We are implementing a storyline based application/game that accurately captures retro India and its political landscape, ethnic cuisine, entertainment, and navigates life post-British rule.

**Implementation 4:**

    Develop a web or mobile app that establishes a protagonist/user, and allows said user to choose a range of time periods post-British rule (1950 - onwards). Features could include mini games throughout the time period that educate player/user on the history of that specific time period. Gamification can be implemented through a score system that rewards players based on the choices they make.

**Idea - Story - Inspiration 5:**

**Implementation 5:**

# Idea Finalization

**From 5 project ideas you have above, please choose one of the project that you are going with for the rest of the semester. Explain why you are going with that project**
Track 3 is the most preferred project the group has agreed upon

# Extra Credit (Only do this if you are done with Idea Finalization)

## Database Design

**Q1: What database are you using for your project (SQLite, PostgreSQL, noSQL, MongoDB,...), and why do you choose it?**
We will use PostgreSQL because it is reliable, scalable, and supports both structured and semi-structured data needed for our storyline and gameplay features.

**Q2: How will database be helpful to your project? How will you design your database to support your application features?**
The database will track users, progress, scores, and historical events, designed with relational tables to link time periods, choices, and achievements.

## Third-Party API Integration

**Q3: Which third-party API(s) will you integrate into your project? What data will you pull from the API(s), and how will you use it in your application?**
We will integrate APIs to pull historical context, images, and references that accurately represents the cultural and political climate.

**Q4: Does your API key has limitations such as rate limits or downtime? How are you going to deal with that?**
Since the APIs have rate limits, we’ll handle it by caching results locally and falling back on stored content when needed.
## Authentication and Security

**Q5: What authentication method will you use (e.g., username/password, OAuth, JWT)?**
For auth, we’ll use OAuth so we can manage secure sessions across web and mobile.


**Q6: How will you store and protect sensitive user data (e.g., passwords, tokens)?**
Passwords will be hashed with bcrypt, and tokens will be encrypted and stored safely in environment variables.

## Deployment

**Q7: Where will you deploy your project (e.g., Heroku, AWS, Render)? How will you manage environment variables and secrets during deployment?**
Deployment will be done on Vercel. We will be carefully handling all the sensitive information without deploying them.

**Q8: How will you ensure your deployment is reliable and easy to update?**
We’ll keep deployments reliable with Docker.