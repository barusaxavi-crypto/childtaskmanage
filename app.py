import calendar
from datetime import datetime
import sqlite3
import os
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

DB_PATH = os.path.join(os.path.dirname(__file__), 'childtasks.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with app.app_context():
        db = get_db()
        # 人物テーブル
        db.execute('''
            CREATE TABLE IF NOT EXISTS kids (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            )
        ''')
        # タスクテーブル
        # target_kid_id が NULL または 0 の場合は「全員」を意味する
        db.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                time_of_day TEXT NOT NULL,
                text TEXT NOT NULL,
                icon TEXT,
                time TEXT,
                target_kid_id INTEGER
            )
        ''')
        
        # 完了実績テーブル
        db.execute('''
            CREATE TABLE IF NOT EXISTS completions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                kid_id INTEGER NOT NULL,
                time_of_day TEXT NOT NULL,
                UNIQUE(date, kid_id, time_of_day)
            )
        ''')
        
        # データが空の場合の初期データ投入
        kids = db.execute('SELECT * FROM kids').fetchall()
        if len(kids) == 0:
            db.execute("INSERT INTO kids (name) VALUES ('おにいちゃん')")
            db.execute("INSERT INTO kids (name) VALUES ('いもうと')")
            
            # 朝のタスク
            db.execute("INSERT INTO tasks (time_of_day, text, icon, time, target_kid_id) VALUES ('morning', 'おきる', '☀️', '07:00', NULL)")
            db.execute("INSERT INTO tasks (time_of_day, text, icon, time, target_kid_id) VALUES ('morning', 'かおをあらう', '🚰', '07:15', 1)")
            db.execute("INSERT INTO tasks (time_of_day, text, icon, time, target_kid_id) VALUES ('morning', 'ごはんをたべる', '🍚', '07:30', NULL)")
            db.execute("INSERT INTO tasks (time_of_day, text, icon, time, target_kid_id) VALUES ('morning', 'はみがきする', '🦷', '08:00', 1)")
            db.execute("INSERT INTO tasks (time_of_day, text, icon, time, target_kid_id) VALUES ('morning', 'おきがえする', '👕', '08:00', 2)")
            
            # 夜のタスク
            db.execute("INSERT INTO tasks (time_of_day, text, icon, time, target_kid_id) VALUES ('evening', 'ごはんをたべる', '🍛', '18:00', NULL)")
            db.execute("INSERT INTO tasks (time_of_day, text, icon, time, target_kid_id) VALUES ('evening', 'おふろにはいる', '🛁', '19:00', NULL)")
            db.execute("INSERT INTO tasks (time_of_day, text, icon, time, target_kid_id) VALUES ('evening', 'はみがきする', '🦷', '20:00', 1)")
            db.execute("INSERT INTO tasks (time_of_day, text, icon, time, target_kid_id) VALUES ('evening', 'ねる', '💤', '20:30', 1)")
            db.execute("INSERT INTO tasks (time_of_day, text, icon, time, target_kid_id) VALUES ('evening', 'ねる', '💤', '20:00', 2)")
            
            db.commit()

# アプリ起動時にDB初期化
init_db()

# カスタムフィルター: AM/PM表記へ変換
@app.template_filter('format_time_jp')
def format_time_jp(time_str):
    try:
        dt = datetime.strptime(time_str, '%H:%M')
        ampm = '午前' if dt.hour < 12 else '午後'
        hour12 = dt.hour if dt.hour <= 12 else dt.hour - 12
        if hour12 == 0:
            hour12 = 12
        return f"{ampm} {hour12}:{dt.strftime('%M')}"
    except:
        return time_str

@app.route('/')
def home():
    # 親ページ（ホーム画面）
    return render_template('home.html')

@app.route('/tasks/<time_of_day>')
def task_list(time_of_day):
    # 子ページA（タスクチェックリスト画面）
    if time_of_day == 'morning':
        title = 'あさのタスク'
    elif time_of_day == 'evening':
        title = 'よるのタスク'
    else:
        title = 'タスク'

    db = get_db()
    kids_rows = db.execute('SELECT * FROM kids').fetchall()
    
    kids_data = {}
    for k in kids_rows:
        # その子供、もしくは全員（NULL または 0）のタスクを取得
        tasks_rows = db.execute('''
            SELECT * FROM tasks 
            WHERE time_of_day = ? AND (target_kid_id IS NULL OR target_kid_id = 0 OR target_kid_id = ?)
            ORDER BY time
        ''', (time_of_day, k['id'])).fetchall()
        
        tasks_list = []
        for t in tasks_rows:
            tasks_list.append({
                'id': f"k{k['id']}_t{t['id']}",
                'time': t['time'],
                'text': t['text'],
                'icon': t['icon'],
                'done': False
            })
            
        kids_data[str(k['id'])] = {
            'name': k['name'],
            'kid_id': k['id'],
            'tasks': tasks_list
        }
        
    return render_template('tasks.html', kids=kids_data, title=title, time_of_day=time_of_day)

@app.route('/api/complete', methods=['POST'])
def complete_task_group():
    # 「できた」ボタンが押されたときの実績登録API
    req_data = request.json
    kid_id = req_data.get('kid_id')
    time_of_day = req_data.get('time_of_day') # morning or evening
    
    if not kid_id or not time_of_day:
        return {'status': 'error', 'message': 'Missing parameters'}, 400
        
    db = get_db()
    today_str = datetime.now().strftime('%Y-%m-%d')
    try:
        db.execute('''
            INSERT OR IGNORE INTO completions (date, kid_id, time_of_day) 
            VALUES (?, ?, ?)
        ''', (today_str, kid_id, time_of_day))
        db.commit()
    except Exception as e:
        return {'status': 'error', 'message': str(e)}, 500
        
    return {'status': 'success'}

@app.route('/calendar')
def task_calendar():
    # 子ページB（当月カレンダー画面）
    now = datetime.now()
    year = now.year
    month = now.month
    
    db = get_db()
    kids = db.execute('SELECT * FROM kids').fetchall()
    
    # 該当月のカレンダーを取得。週の始まりは日曜(6)
    cal = calendar.Calendar(firstweekday=6)
    month_days = cal.monthdatescalendar(year, month)
    
    # 全ての完了実績を今月分取得
    start_date = f"{year}-{month:02d}-01"
    end_date = f"{year}-{month:02d}-31"
    completions = db.execute('''
        SELECT date, kid_id, COUNT(*) as stars 
        FROM completions 
        WHERE date >= ? AND date <= ?
        GROUP BY date, kid_id
    ''', (start_date, end_date)).fetchall()
    
    # 日付ごとの星の数を辞書化
    comp_dict = {}
    for c in completions:
        if c['date'] not in comp_dict:
            comp_dict[c['date']] = {}
        comp_dict[c['date']][str(c['kid_id'])] = c['stars']
    
    cal_data = []
    for week in month_days:
        week_data = []
        for d in week:
            date_str = d.strftime('%Y-%m-%d')
            is_current_month = (d.month == month)
            
            day_stars = {}
            for k in kids:
                day_stars[str(k['id'])] = comp_dict.get(date_str, {}).get(str(k['id']), 0)
            
            week_data.append({
                'date': d.day,
                'is_current_month': is_current_month,
                'stars': day_stars
            })
        cal_data.append(week_data)
        
    return render_template('calendar.html', year=year, month=month, calendar=cal_data, kids=kids)

# ==========================================
# 管理画面向けルート (Phase 3)
# ==========================================
@app.route('/settings')
def settings():
    db = get_db()
    kids = db.execute('SELECT * FROM kids').fetchall()
    tasks = db.execute('''
        SELECT t.*, k.name as kid_name 
        FROM tasks t
        LEFT JOIN kids k ON t.target_kid_id = k.id
        ORDER BY t.time_of_day, t.time
    ''').fetchall()
    
    return render_template('settings.html', kids=kids, tasks=tasks)

@app.route('/settings/kid/add', methods=['POST'])
def add_kid():
    name = request.form.get('name')
    if name:
        db = get_db()
        db.execute('INSERT INTO kids (name) VALUES (?)', (name,))
        db.commit()
    return redirect(url_for('settings'))

@app.route('/settings/kid/delete/<int:kid_id>', methods=['POST'])
def delete_kid(kid_id):
    db = get_db()
    db.execute('DELETE FROM kids WHERE id = ?', (kid_id,))
    db.commit()
    return redirect(url_for('settings'))

@app.route('/settings/task/add', methods=['POST'])
def add_task():
    time_of_day = request.form.get('time_of_day')
    text = request.form.get('text')
    icon = request.form.get('icon', '📝')
    time = request.form.get('time', '12:00')
    target_kid_id = request.form.get('target_kid_id')
    
    # 0 or empty means '全員' (NULL in DB)
    if not target_kid_id or target_kid_id == '0':
        target_kid_id = None
        
    if time_of_day and text:
        db = get_db()
        db.execute('''
            INSERT INTO tasks (time_of_day, text, icon, time, target_kid_id)
            VALUES (?, ?, ?, ?, ?)
        ''', (time_of_day, text, icon, time, target_kid_id))
        db.commit()
        
    return redirect(url_for('settings'))

@app.route('/settings/task/delete/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    db = get_db()
    db.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
    db.commit()
    return redirect(url_for('settings'))

@app.route('/settings/task/edit/<int:task_id>', methods=['GET', 'POST'])
def edit_task(task_id):
    db = get_db()
    if request.method == 'POST':
        time_of_day = request.form.get('time_of_day')
        text = request.form.get('text')
        icon = request.form.get('icon', '📝')
        time = request.form.get('time', '12:00')
        target_kid_id = request.form.get('target_kid_id')
        
        if not target_kid_id or target_kid_id == '0':
            target_kid_id = None
            
        if time_of_day and text:
            db.execute('''
                UPDATE tasks 
                SET time_of_day = ?, text = ?, icon = ?, time = ?, target_kid_id = ?
                WHERE id = ?
            ''', (time_of_day, text, icon, time, target_kid_id, task_id))
            db.commit()
            
        return redirect(url_for('settings'))
    else:
        # GETリクエストの場合、編集画面を表示
        task = db.execute('SELECT * FROM tasks WHERE id = ?', (task_id,)).fetchone()
        kids = db.execute('SELECT * FROM kids').fetchall()
        if not task:
            return redirect(url_for('settings'))
        return render_template('edit_task.html', task=task, kids=kids)

if __name__ == '__main__':
    # 開発用サーバーを起動
    app.run(host='0.0.0.0', debug=True, port=5000)
