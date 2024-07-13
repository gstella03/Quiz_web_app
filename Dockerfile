# Usa l'immagine base di Python
FROM python:3.9-slim

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file requirements.txt nella directory di lavoro
COPY requirements.txt .

# Installa le dipendenze
RUN pip install --no-cache-dir -r requirements.txt

# Copia il resto del codice nella directory di lavoro
COPY . .

# Crea la directory per i log
RUN mkdir -p logs

# Espone la porta su cui l'applicazione gira
EXPOSE 5000

# Comando per eseguire l'applicazione
CMD ["python", "app.py"]