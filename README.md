# Hyker

**About**

Hyker is a full stack ride sharing application designed to help users safely request and offer rides. This application is built using React as the frontend, Django as the backend, and Leaflet for map navigation. Hyker provides an intuitive interface for real time route visualization, ride coordination, and user to user interaction.

Hyker allows riders to request a ride by selecting a pickup and a drop off location, while the drivers can browse through available ride requests and offer a ride with a single click. The app dynamically generates optimal routes using A\* algorithm and then displays them visually on an interactive map.

# Key Features

Rider Request Service: Riders can request for a driver from one location to another.

Routing Mapping: Routes from point A to point B are geolocationally mapped and custom drawn onto a map.

Ride Offering: Easily find and provide rides to requestors nearby.

Profile Customization: View user profiles, see how many rides you’ve previously requested, and change information such as name and email.

# Tools

React + Vite, Django, MongoDB, Google Maps, Google Places API, Leaflet

**Frontend: React**

We built the Hyker app using React to create a dynamic user interface. The react’s component based structure made it easy to manage interactive elements such as map views, ride cards, and user dashboard across the app. Moreover, we used React Router for a smooth transition between the different pages of the application.

**Backend: Django**

We chose Django as our backend framework as it offers a very structured framework for handling the authentication, data models, and API logic. Using Django we were able to implement endpoints for user data, driver interactions, and route processing.

**Database: Mongo DB**

We used Mongo DB as our database for the application to store user information, ride requests, location details, and ride assignments.

**Maps, Routing and Geolocation: Google Maps, Google Places API, and Leaflet**

We used a combination of Google Maps, Google Places API, and Leaflet to power location features in Hyker. Google Maps was used specifically for displaying some of the popular locations around UIC and for highlighting them on an interactive map. The Google Maps API was used to retrieve the popular locations and their details. Leaflet was used for the actual routing display which displayed the computed route from the Pickup to dropoff location using the A\* algorithm.

# How to run this project locally

## Clone The Repository:

    Type in the following command into your terminal: git clone https://github.com/lkris2/cs351group14.git

## Install and Resolve Dependencies:

**Backend Installation**

    For Windows Users, Download Python from the official website.
    For Mac Users, install using Homebrew : brew install python
    Confirm installation by typing python --version and pip --version on Command Prompt
    pip install -r requirements.txt
    Following env variables are required to be in the .env file for local backend fu
        VITE_MY_GOOGLE_OAUTH
        VITE_GOOGLE_MAPS_API_KEY
        MONGO_DB

**Frontend Installation:**

    For Windows users, install Node.js and npm LTS version
    For Mac users, using Homebrew brew install node
    Confirm installation by running node -v and npm -v
    Then, type in the following command: cd frontend/hykerapp
    Run npm install

## To set up the Backend, Open Up One Terminal And Do The Following:

    First, type in the command: “cd frontend”
    Then, type in the next command: “cd hykerapp”
    Next, type in the following command: “cd backend_py”
    Next, type in the following command: “cd backend”
    Finally, type in this command to run the backend server: python manage.py runserver

## To set up the Frontend, Open Up Another Terminal And Do The Following Command:

    First, type in the command: “cd frontend”
    Then, type in the next command: “cd hykerapp”
    Finally, type in this command to run the frontend server: npm run dev

# Demo

    https://drive.google.com/file/d/1b0xXb7isFZvH3N4q0HdPDO287FrIpMTG/view?usp=drive_link

# Contributers

    Niharika Patil: npati@uic.edu
    Kavyasri Challa: 218kavya@gmail.com
    Adithya Prasad: apras4@uic.edu
    Lakshmi Krishnan: lkris2@uic.edu
