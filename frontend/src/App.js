import React, { useState } from 'react';
import Form from './components/Form';
import DicomViewerTest from './components/DicomViewer/index';
import registerServiceWorker from './registerServiceWorker'
import "bootstrap/dist/css/bootstrap.min.css";
import ShowListData from './components/ShowListData/show_list_view'
import ShowResultData from './components/Show_result_data/show_result_data'
import 'semantic-ui-css/semantic.min.css'
import AddPatientModal from "./components/CreatePatient/modal" 

  
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
        <Route path="/images" component={DicomViewerTest} />
        <Route path="/result" component={ShowResultData}/> 
        </Switch>
      </div>
    </Router>
  );
}

registerServiceWorker();

export default App;