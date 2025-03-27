# Convenience Store Management System
## Initialise Project
#### Backend (Django)
Create the virtual environment:
```bash
python -m venv venv
```

Activate the virtual environment(Windows) (Optional):
```bash
.venv\Scripts\activate
```


Activate the virtual environment(Mac/Linux) (Optional):
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

#### Frontend (React)
Move to frontend directory and install dependency:
```bash
cd frontend
npm install
```
<br>

## Run Project
#### Backend (Django)
```bash
.venv\Scripts\activate # Windows, Optional
source venv/bin/activate # Mac/Linux, Optional
python manage.py runserver
```

#### Frontend (React)
```bash
cd frontend
npm start
```
