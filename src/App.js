import React, { useState, useEffect, useCallback, useRef } from 'react';
import 'bulma/css/bulma.min.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [editable, setEditable] = useState(false);
  const transcriptRef = useRef(null);

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = language;

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognition.stop();
      recognition.onend = null;
    } else {
      recognition.start();
      recognition.onend = () => recognition.start();
    }
    setIsListening(!isListening);
  }, [isListening]);

  useEffect(() => {
    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setTranscript(currentTranscript);
    };
  }, []);

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'transcript.txt';
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="container mt-6">
      <h1 className="title has-text-centered mb-6">Speech to Text Converter</h1>
      <div className="control has-icons-left mb-6">
        <div className="select is-fullwidth">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Spanish (Spain)</option>
            <option value="de-DE">German (Germany)</option>
            {/* Add other languages as needed */}
          </select>
          <span className="icon is-small is-left">
            <i className="fas fa-globe"></i>
          </span>
        </div>
      </div>
      <button
        onClick={toggleListening}
        className={`button is-large is-fullwidth mb-4 ${isListening ? 'is-danger' : 'is-info'}`}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      {editable ? (
        <textarea
          ref={transcriptRef}
          className="textarea has-fixed-size mb-4"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        ></textarea>
      ) : (
        <div className="box h-64 mb-4">
          {transcript}
        </div>
      )}
      <button
        onClick={() => setEditable(!editable)}
        className="button is-success is-fullwidth mb-4"
      >
        {editable ? 'Lock Editing' : 'Edit Transcript'}
      </button>
      <button
        onClick={downloadTranscript}
        className="button is-primary is-fullwidth"
      >
        Download Transcript
      </button>
    </div>
  );
}

export default App;
