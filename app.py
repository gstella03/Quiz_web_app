from flask import Flask, jsonify, render_template, request, flash
import os
import logging

app = Flask(__name__)
app.secret_key = 'your_secret_key'  

# Configurazione del logging per registrare messaggi in un file
logging.basicConfig(
    filename='logs/quiz.log',    
    level=logging.DEBUG,                   
    datefmt='%d/%m/%y %H:%M:%S',           
    format='%(asctime)s - %(levelname)s - %(message)s'  
)

def read_quiz_file(filename):
    try:
        with open(filename, 'r') as file:
            lines = file.readlines()
    except FileNotFoundError:
        raise ValueError(f"File '{filename}' not found.")
    except Exception as e:
        raise ValueError(f"Error reading file '{filename}': {e}")
    
    questions = []
    current_question = None

    for line in lines:
        line = line.strip()
        if line.startswith("Domanda"):
            if current_question:
                questions.append(current_question)
            current_question = {"question": line, "options": [], "answer": None}
        elif line:
            if line.endswith("*"):
                current_question["answer"] = line[:-2].strip()
                current_question["options"].append(current_question["answer"])
            else:
                current_question["options"].append(line.strip())

    if current_question:
        questions.append(current_question)
 
    return questions

# Route per gestire la richiesta del quiz
@app.route('/quiz')
def get_quiz():
    filename = request.args.get('filename')
    if not filename:
        flash('Filename is required.', 'error')
        logging.error('Filename is required.')
        return jsonify({'error': 'Filename is required.'}), 400

    file_path = os.path.join(app.root_path, filename)
    try:
        questions = read_quiz_file(file_path)
        logging.info(f'Quiz loaded successfully from {filename}.')
        return jsonify(questions)
    except ValueError as e:
        flash(str(e), 'error')
        logging.error(f"Error: {e}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        flash('An unexpected error occurred.', 'error')
        logging.error(f"Unexpected error: {e}")
        return jsonify({'error': 'An unexpected error occurred.'}), 500

# Route per gestire i log dal client
@app.route('/log', methods=['POST'])
def log_message():
    data = request.json
    if not data or 'message' not in data or 'level' not in data:
        return jsonify({'error': 'Invalid log data'}), 400

    message = data['message']
    level = data['level'].upper()

    if level == 'ERROR':
        logging.error(message)
    elif level == 'INFO':
        logging.info(message)
    else:
        logging.debug(message)

    return jsonify({'status': 'success'}), 200

# Route per la homepage dell'app
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    if not os.path.exists('logs'):
        os.makedirs('logs')
    app.run(host='0.0.0.0', port=5000,debug=True)
