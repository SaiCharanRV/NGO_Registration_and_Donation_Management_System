from flask import Flask, request, jsonify, render_template, send_from_directory
import sqlite3
from database import get_db_connection, init_db
import os
import hashlib
import json

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = 'super_secret_key_for_demo'  # Change for production

# Helper for Hashing Passwords (minimal for demo)
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# --- API ROUTES ---

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = 'user'  # Force all registrations to be 'user' role only
    
    if not name or not email or not password:
        return jsonify({'error': 'Missing fields'}), 400
    
    hashed_pw = hash_password(password)
    
    try:
        conn = get_db_connection()
        conn.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                     (name, email, hashed_pw, role))
        conn.commit()
        conn.close()
        return jsonify({'message': 'User registered successfully'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    hashed_pw = hash_password(password)
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, hashed_pw)).fetchone()
    conn.close()
    
    if user:
        # Simple session simulation using user object return
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role'],
                'created_at': user['created_at']
            }
        }), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/donate', methods=['POST'])
def donate():
    data = request.json
    user_id = data.get('user_id')
    amount = data.get('amount')
    
    if not user_id or not amount:
        return jsonify({'error': 'Missing data'}), 400
        
    conn = get_db_connection()
    cursor = conn.execute('INSERT INTO donations (user_id, amount, status) VALUES (?, ?, ?)',
                          (user_id, amount, 'pending'))
    donation_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'donation_id': donation_id, 'status': 'pending'}), 201

@app.route('/api/donate/confirm', methods=['POST'])
def confirm_donation():
    data = request.json
    donation_id = data.get('donation_id')
    status = data.get('status') # 'success' or 'failed'
    transaction_id = data.get('transaction_id', f'TXN-{donation_id}-MOCK')
    
    if status not in ['success', 'failed']:
        return jsonify({'error': 'Invalid status'}), 400
        
    conn = get_db_connection()
    conn.execute('UPDATE donations SET status = ?, transaction_id = ? WHERE id = ?',
                 (status, transaction_id, donation_id))
    conn.commit()
    conn.close()
    
    return jsonify({'message': f'Donation marked as {status}'}), 200

@app.route('/api/user/history', methods=['GET'])
def get_user_history():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID required'}), 400
        
    conn = get_db_connection()
    donations = conn.execute('SELECT * FROM donations WHERE user_id = ? ORDER BY created_at DESC', (user_id,)).fetchall()
    conn.close()
    
    return jsonify([dict(d) for d in donations])

@app.route('/api/admin/stats', methods=['GET'])
def get_admin_stats():
    # Helper to only fetch if admin - for now relying on frontend or simple check logic
    # In real app, check JWT role.
    
    conn = get_db_connection()
    total_users = conn.execute("SELECT COUNT(*) FROM users WHERE role != 'admin'").fetchone()[0]
    total_donations_count = conn.execute("SELECT COUNT(*) FROM donations WHERE status = 'success'").fetchone()[0]
    total_amount_collected = conn.execute("SELECT SUM(amount) FROM donations WHERE status = 'success'").fetchone()[0] or 0
    
    # Get recent donations
    recent_donations = conn.execute('''
        SELECT d.*, u.name as user_name 
        FROM donations d 
        JOIN users u ON d.user_id = u.id 
        ORDER BY d.created_at DESC LIMIT 10
    ''').fetchall()
    
    conn.close()
    
    return jsonify({
        'total_users': total_users,
        'total_donations_count': total_donations_count,
        'total_amount_collected': total_amount_collected,
        'recent_donations': [dict(d) for d in recent_donations]
    })

@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    search = request.args.get('search', '').lower()
    sort_by = request.args.get('sort_by', 'date_desc')
    
    order_clause = "created_at DESC"
    if sort_by == 'date_asc':
        order_clause = "created_at ASC"
    elif sort_by == 'name_asc':
        order_clause = "name ASC"
    elif sort_by == 'name_desc':
        order_clause = "name DESC"

    conn = get_db_connection()
    if search:
        users = conn.execute(f"SELECT id, name, email, role, created_at FROM users WHERE role != 'admin' AND (lower(name) LIKE ? OR lower(email) LIKE ?) ORDER BY {order_clause}", 
                             (f'%{search}%', f'%{search}%')).fetchall()
    else:
        users = conn.execute(f"SELECT id, name, email, role, created_at FROM users WHERE role != 'admin' ORDER BY {order_clause}").fetchall()
    conn.close()
    
    return jsonify([dict(u) for u in users])

@app.route('/api/admin/donations', methods=['GET'])
def get_all_donations():
    sort_by = request.args.get('sort_by', 'date_desc')
    
    order_clause = "d.created_at DESC"
    if sort_by == 'date_asc':
        order_clause = "d.created_at ASC"
    elif sort_by == 'amount_desc':
        order_clause = "d.amount DESC"
    elif sort_by == 'amount_asc':
        order_clause = "d.amount ASC"
    elif sort_by == 'status':
        order_clause = "d.status, d.created_at DESC"

    conn = get_db_connection()
    donations = conn.execute(f'''
        SELECT d.*, u.name as user_name, u.email as user_email
        FROM donations d 
        JOIN users u ON d.user_id = u.id 
        ORDER BY {order_clause}
    ''').fetchall()
    conn.close()
    return jsonify([dict(d) for d in donations])

@app.route('/api/admin/export/users', methods=['GET'])
def export_users():
    import csv
    import io
    from flask import Response
    
    conn = get_db_connection()
    users = conn.execute("SELECT id, name, email, role, created_at FROM users WHERE role != 'admin'").fetchall()
    conn.close()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['ID', 'Name', 'Email', 'Role', 'Joined At'])
    
    for user in users:
        writer.writerow([user['id'], user['name'], user['email'], user['role'], user['created_at']])
        
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-disposition": "attachment; filename=users_export.csv"}
    )

@app.route('/api/admin/create-admin', methods=['POST'])
def create_admin():
    """
    Endpoint for admins to create new admin users.
    Requires the requesting user to be an admin.
    """
    data = request.json
    admin_user_id = data.get('admin_user_id')  # ID of admin making the request
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not all([admin_user_id, name, email, password]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Verify requester is admin
    conn = get_db_connection()
    requester = conn.execute('SELECT role FROM users WHERE id = ?', (admin_user_id,)).fetchone()
    
    if not requester or requester['role'] != 'admin':
        conn.close()
        return jsonify({'error': 'Unauthorized: Admin access required'}), 403
    
    hashed_pw = hash_password(password)
    
    try:
        conn.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                     (name, email, hashed_pw, 'admin'))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Admin user created successfully'}), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Email already exists'}), 409
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/public/stats', methods=['GET'])
def get_public_stats():
    conn = get_db_connection()
    try:
        donors_count = conn.execute("SELECT COUNT(DISTINCT user_id) FROM donations WHERE status = 'success'").fetchone()[0]
        funds_raised = conn.execute("SELECT SUM(amount) FROM donations WHERE status = 'success'").fetchone()[0] or 0
        successful_donations_count = conn.execute("SELECT COUNT(*) FROM donations WHERE status = 'success'").fetchone()[0]
        
        return jsonify({
            'donors': donors_count,
            'raised': funds_raised,
            'total_donations': successful_donations_count
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# --- FRONTEND ROUTES (SPA) ---
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    if not os.path.exists("ngo_database.db"):
        init_db()
    app.run(debug=True, port=5000)
