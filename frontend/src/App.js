import React, { useState } from 'react';
import Tweet from './Tweet';
import Form from './components/Form';
import DicomViewer from './components/DicomViewer';
import registerServiceWorker from './registerServiceWorker'
import "bootstrap/dist/css/bootstrap.min.css";


// define a component App
function App() {
  return (
    //  <Form/>
    <DicomViewer/>
  );
}

registerServiceWorker();

export default App;