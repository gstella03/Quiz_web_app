# Quiz App

Questo è un'applicazione Flask per eseguire quiz a scelta multipla. Le domande vengono caricate da un file di testo (`cloud_quiz.txt`) e l'applicazione permette agli utenti di rispondere alle domande e visualizzare il punteggio finale.

## Struttura del Progetto

Il progetto è organizzato come segue:

- `app.py`: Il file principale dell'applicazione Flask.
- `cloud_quiz.txt`: Il file contenente le domande del quiz.
- `static/`: Directory per i file statici come CSS e JavaScript.
- `templates/`: Directory per i template HTML.
- `logs/`: Directory in cui verranno salvati i file di log generati dall'applicazione.

## Prerequisiti

- Docker installato sul tuo sistema. 

## Dockerizzazione dell'Applicazione

1. **Costruzione dell'Immagine Docker**

    ```bash
        docker build -t quiz-app .
    ```
2. **Esecuzione del Container Docker**
    ```bash
        docker run -p 5000:5000 quiz-app
    ```
3. **Accesso all'Applicazione**
    ```
        http://localhost:5000/
    ```