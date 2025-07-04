import sqlite3
import csv
import json
import hashlib
from datetime import datetime

# Create SQLite database
conn = sqlite3.connect('call_center.db')
cursor = conn.cursor()

def setup_database():
    # Create users table for authentication
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS auth_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create users table for call center data
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            userId INTEGER PRIMARY KEY,
            firstName TEXT,
            lastName TEXT
        )
    ''')
    
    # Create call logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS callLogs (
            callId INTEGER PRIMARY KEY AUTOINCREMENT,
            phoneNumber TEXT,
            startTime INTEGER,
            endTime INTEGER,
            direction TEXT,
            userId INTEGER,
            FOREIGN KEY (userId) REFERENCES users(userId)
        )
    ''')
    
    print("Database tables created successfully!")

def load_csv_data():
    # Load users data
    try:
        # Fetch and parse users.csv
        import urllib.request
        
        users_url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/users-JzbqUPjpdEri0Xf1nF4unX2MDlq3kH.csv"
        with urllib.request.urlopen(users_url) as response:
            users_data = response.read().decode('utf-8')
        
        users_lines = users_data.strip().split('\n')
        user_id = 1
        for line in users_lines[1:]:  # Skip header
            if line.strip():
                parts = line.split(',')
                if len(parts) >= 2:
                    first_name = parts[0].strip().strip('"')
                    last_name = parts[1].strip().strip('"')
                    if first_name and last_name:
                        cursor.execute(
                            "INSERT OR REPLACE INTO users (userId, firstName, lastName) VALUES (?, ?, ?)",
                            (user_id, first_name, last_name)
                        )
                        user_id += 1
        
        print(f"Loaded {user_id - 1} users")
        
        # Load call logs data
        call_logs_url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/callLogs-Du11Imbq2ytLhOEvJil8SIbFEFrk2Y.csv"
        with urllib.request.urlopen(call_logs_url) as response:
            call_logs_data = response.read().decode('utf-8')
        
        call_logs_lines = call_logs_data.strip().split('\n')
        call_count = 0
        for line in call_logs_lines[1:]:  # Skip header
            if line.strip():
                parts = line.split(',')
                if len(parts) >= 5:
                    try:
                        phone = parts[0].strip().strip('"')
                        start_time = int(parts[1].strip())
                        end_time = int(parts[2].strip())
                        direction = parts[3].strip().strip('"')
                        user_id = int(parts[4].strip())
                        
                        if phone and direction and end_time > start_time:
                            cursor.execute('''
                                INSERT INTO callLogs 
                                (phoneNumber, startTime, endTime, direction, userId) 
                                VALUES (?, ?, ?, ?, ?)
                            ''', (phone, start_time, end_time, direction, user_id))
                            call_count += 1
                    except (ValueError, IndexError):
                        continue
        
        print(f"Loaded {call_count} call logs")
        
    except Exception as e:
        print(f"Error loading CSV data: {e}")

def create_sample_auth_user():
    # Create a sample user for testing
    password = "password123"
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    cursor.execute('''
        INSERT OR REPLACE INTO auth_users (name, email, password_hash)
        VALUES (?, ?, ?)
    ''', ("John Doe", "john@example.com", password_hash))
    
    print("Sample auth user created: john@example.com / password123")

if __name__ == "__main__":
    setup_database()
    load_csv_data()
    create_sample_auth_user()
    
    conn.commit()
    conn.close()
    
    print("Database setup completed!")
