# Project Overview

## 1.1 Overview
The main objective of this project is to create an interactive web dashboard using the Python Django framework and ECharts, Chart.js libraries for front-end interactivity. The purpose of the data tool is to provide business managers with insightful data visualizations that support informed decision-making. This tool was developed as part of a programming lab project at university, targeting professors simulating the role of business managers.

## 1.2 Main Functions
The dashboard is divided into four main pages, each focusing on a different aspect of the data:
- **Homepage**: Provides key metrics on overall sales for all years, offering a quick overview of the business's performance.
- **Products Page**: Focuses on product performance, including charts on product sales, size popularity, and ingredient usage.
- **Customers Page**: Analyzes customer distribution and behavior, providing insights into customer demographics and purchasing patterns.
- **Stores Page**: Evaluates store performance with metrics such as total revenue by store, order distribution by distance, and heat maps of customer locations.

# Installation Guideline

## 2.1 Prerequisites
Before you begin, ensure you have met the following requirements:
- Python 3.12.3
- pip (Python package installer)
- Virtualenv (optional but recommended)
- Git (to clone the repository)
- MySQL server and client installed

## 2.2 Installation Steps

### Step 1: Clone the Repository
First, clone the repository from GitHub to your local machine:
```bash
git clone https://github.com/thidiemquynhtran/ProgLab.git
cd ProgLab
```

### Step 2: Set Up a Virtual Environment (Optional)
It's a good practice to use a virtual environment to manage dependencies. You can create one using virtualenv:
```bash
python -m venv venv
```
Activate the virtual environment:
- On Windows:
  ```bash
  venv\Scripts\activate
  ```
- On macOS/Linux:
  ```bash
  source venv/bin/activate
  ```

### Step 3: Install Dependencies
With the virtual environment activated, install the project dependencies using pip:
```bash
pip install -r requirements.txt
```

### Step 4: Download the SQL Dump File
Download the SQL dump file from the provided link:
[Download dbpizatest.sql](https://studfrauasde-my.sharepoint.com/:u:/g/personal/thi_tran2_stud_fra-uas_de/EWuC7hAfPr5Oj18Yprpx-nwBr57JJ2ehISkenH7VV3P4HA?e=68cjlT)

### Step 5: Configure and Load the Database
Ensure your MySQL server is running and you have created a database for the project. You can create a database using the MySQL client:
```sql
mysql -u root -p
```
In the MySQL prompt, run:
```sql
CREATE DATABASE dbpizatest;
CREATE USER 'youruser'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON dbpizatest.* TO 'youruser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
Load the downloaded SQL dump file into MySQL:
```bash
mysql -u root -p dbpizatest < path/to/dbpizatest.sql
```
Or:
```bash
mysql -u youruser -p dbpizatest < path/to/dbpizatest.sql
```

### Step 6: Migrate the Database
To initialize the database, run the following commands:
```bash
python manage.py migrate
```

### Step 7: Run the Development Server
Now you can start the development server:
```bash
python manage.py runserver
```

### Step 8: Access the Dashboard
Open your web browser and navigate to `http://127.0.0.1:8000/data_analysis/index.html` to see the project running.

With the project running, you can start analyzing your data. Refer to the user guide for detailed instructions on how to use the tool effectively.

-----
