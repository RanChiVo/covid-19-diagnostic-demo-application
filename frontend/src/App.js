import React, { useState } from 'react';
import Form from './components/Form';
import DicomViewer from './components/DicomViewer';
import registerServiceWorker from './registerServiceWorker'
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <DicomViewer/>
  );
}

registerServiceWorker();

export default App;