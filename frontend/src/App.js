import React, { useState } from 'react';
import Form from './components/Form';
import DicomViewer from './components/DicomViewer';
import registerServiceWorker from './registerServiceWorker'
import "bootstrap/dist/css/bootstrap.min.css";
import ShowListData from './components/ShowListData/show_list_view'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Switch>
        <Route exact path="/" component={ShowListData} />
        <Route path="/images" component={DicomViewer} />
        </Switch>
      </div>
    </Router>
  );
}

registerServiceWorker();

export default App;