Convenience Store Database Management System


Initialise the project
Backend (Django):
# Create the virtual environment
    python -m venv venv

# Activate the virtual environment(Windows)
    .venv\Scripts\activate
# Activate the virtual environment(Mac/Linux)
    source venv/bin/activate

# Install dependency
    pip install -r requirements.txt

# Migrate database
    python manage.py migrate`

Frontend:
# Move to frontend directory and install dependency
    cd frontend
    npm install


Running the project:
# Run Backend (Django):
    python manage.py runserver

# Run frontend (React)
    cd frontend
    npm start