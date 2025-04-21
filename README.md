# Convenience Store Management System
## Initialise Project
#### Backend (Django)
Create Virtual Environment:
```bash
python -m venv venv
```

Activate Virtual Environment(Windows CMD) (Optional):
```bash
venv\Scripts\activate
```

Activate Virtual Environment(Windows PowerShell) (Optional):
```bash
venv\Scripts\Activate.ps1
```

Activate Virtual Environment(Mac/Linux) (Optional):
```bash
source venv/bin/activate
```

Install Dependency:
```bash
pip install -r requirements.txt
```

Migrate Database:
```bash
python manage.py migrate
```

#### Frontend (React)
Move to Frontend Directory and Install Dependency:
```bash
cd frontend
npm install
npm install react-router-dom
npm install @mui/material @emotion/react @emotion/styled
npm install axios
npm install react-toastify
npm install recharts
```
<br>

## Run Project
#### Backend (Django)
```bash
venv\Scripts\activate # Windows CMD, Optional
venv\Scripts\Activate.ps1 # Windows PowerShell, Optional
source venv/bin/activate # Mac/Linux, Optional
python manage.py runserver
```

#### Frontend (React)
```bash
cd frontend
npm start
```