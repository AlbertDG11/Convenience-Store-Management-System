# Convenience Store Database Management System
## Initialise the project
##### Backend (Django):
Create the virtual environment:<br>
`python -m venv venv`

Activate the virtual environment(Windows):<br>
`.venv\Scripts\activate`
Activate the virtual environment(Mac/Linux):<br>
`source venv/bin/activate`

Install dependency:<br>
`pip install -r requirements.txt`

Migrate database:<br>
`python manage.py migrate`

##### Frontend (React):
Move to frontend directory and install dependency:<br>
`cd frontend`
`npm install`


## Run the project:
###### Backend (Django):
    python manage.py runserver

###### Frontend (React):
    cd frontend
    npm start