# Convenience Store Management System
This program was developed as part of the CPSC 471 "Database Management Systems" course project. <br>
It is a web-based convenience store management system tailored for small to medium-sized stores, supporting operations such as sales, purchasing, inventory control, and employee and supplier management.<br>
The system is built using a **React–Django–MySQL** architecture. It ensures accurate operations and enforces permission control across different employee roles. A user-friendly frontend interface is also provided.<br>
You can follow the instructions in the rest of this manual to build and run the program. If you encounter any problems during initialization or execution, feel free to contact us: [Zhuojun Dong](https://github.com/AlbertDG11), [Fei Ding](https://github.com/DingFei1) and [Jiaqi Chen](https://github.com/Jiaqichen2).<br><br>

## Initialise Project
#### Backend (Django)
From the root directory<br>
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

Initialise Database:<br>
1. Edit database credentials in line 98 of `./convenience_store/settings.py`.
2. Then run:
```bash
python manage.py makemigrations
python manage.py migrate
```
3. Import initial data by executing the operations in `./original_data.sql` on MySQL.<br>
4. If you want to try the Redis in the program, ensure the first Redis database is open on port 6379, and set the flag to `True` at line 13 of `./backend/employee/views.py`.

#### Frontend (React)
Navigate to frontend directory and install dependencies:
```bash
cd frontend
npm install
```

## Run Project
#### Backend (Django)
From the root directory:
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

## Program Usage
#### Login
There are six initialised users. Their account information is listed below:<br>
| Account | Password  | Role            |
|---------|-----------|-----------------|
| 1       | pwdFrank  | Manager         |
| 2       | pwdGrace  | Salesperson     |
| 3       | pwdHeidi  | Salesperson     |
| 4       | pwdIvan   | Purchase Person |
| 5       | pwdJudy   | Purchase person |
| 6       | pwdKarl   | Manager         |

The system uses role-based access control. After logging in, each user will only be able to access the pages and features permitted by their role.
#### Main Pages
After logging in, you will be navigated to appropriate dashboards based on their role. You can choose the desired page from the left sidebar, and perform operations by pressing the corresponding buttons or entering text on the right panel.

#### Log Out
To log out, simply click the Logout button located in the upper-left corner.
