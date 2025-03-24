# Convenience Store Database Management System
## Initialise the project
#### Backend (Django):
Create the virtual environment:
```bash
python -m venv venv
```

Activate the virtual environment(Windows):
```bash
.venv\Scripts\activate
```


Activate the virtual environment(Mac/Linux):<br>
```bash
source venv/bin/activate
```

Install dependency:
```bash
pip install -r requirements.txt
```

Migrate database:
```bash
python manage.py migrate
```

#### Frontend (React):
Move to frontend directory and install dependency:
```bash
cd frontend
npm install
```


## Run the project:
#### Backend (Django):
```bash
python manage.py runserver
```

#### Frontend (React):
```bash
cd frontend
npm start
```