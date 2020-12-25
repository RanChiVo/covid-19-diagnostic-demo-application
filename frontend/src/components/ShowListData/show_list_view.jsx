
import React, { Component } from 'react';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Link,
  useRouteMatch,
  useParams,
  Redirect
} from "react-router-dom";

import DicomViewer from "../DicomViewer"
class ShowListData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      redirect: null,
      items: [],
      columns: [{
        dataField: 'address',
        text: 'Address',
        filter: textFilter() 
      },
      {
        dataField: 'created_date',
        text: 'Created Date',

      }
        , {
        dataField: 'date_of_birth',
        text: 'Date Of Birth',
        sort: true,
        filter: textFilter() 
      },
      {
        dataField: 'email',
        text: 'Email',
        sort: true,
        filter: textFilter() 
      },
      {
        dataField: 'fullname',
        text: 'Fullname',
        sort: true,
        filter: textFilter()  
      },
      {
        dataField: 'gender',
        text: 'Gender',
        sort: true,
        filter: textFilter() 
      },
      {
        dataField: 'id',
        text: 'Id',
        sort: true,
        filter: textFilter() 
      },
      {
        dataField: 'phone',
        text: 'Phone',
        sort: true,
        filter: textFilter() 
      },
      {
        dataField: 'quarantine_status',
        text: 'Quarantine Status',
        sort: true,
        filter: textFilter() 
      },]
    };
    console.log("hello")
  }

  componentDidMount() {
    // fetch("http://127.0.0.1:5000/get_patients")
    //   .then(res => res.json())
    //   .then(
    //     (result) => {
    //       console.log("result:", result)                
    //       this.setState({
    //         isLoaded: true,
    //         items: result
    //       });
    //     },
    //     (error) => {
    //       this.setState({
    //         isLoaded: true,
    //         error
    //       });
    //     }
    //   )

    axios.get('http://127.0.0.1:5000/get_patients').then(response => {
      console.log("data:", response.data);
      this.setState({
        items: response.data.patients,
        isLoaded: true,
      });
    });
  }

  onItemClick(e) {
    // let string_patient = e.id;
    // alert("You have pressed this row: id patient:"+ string_patient.toString())
    // this.setState({ redirect: "/images"});
    const { history } = this.props;
    history.push({
      pathname: `/images/${e.fullname}`,
      data: e.id // your data array of objects
    })
    window.location.reload();
  }


  render() {
    const { error, isLoaded, items } = this.state;
    const options = {
      page: 2,
      sizePerPageList: [{
        text: '5', value: 5
      }, {
        text: '10', value: 10
      }, {
        text: 'All', value: this.state.items.length
      }],
      sizePerPage: 5,
      pageStartIndex: 0,
      paginationSize: 3,
      prePage: 'Prev',
      nextPage: 'Next',
      firstPage: 'First',
      lastPage: 'Last',

    };
    console.log("list_data:", this.state.items);
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <ul>
            <ul>
              {/* {this.state.items.map(item => (
            <li key={item.id} onClick={() => this.onItemClick(item)}>
              {item.fullname} {item.gender} {item.address} {item.quarantine_status} {item.email} {item.date_of_birth}{item.created_date} 
            </li>
          ))}    */}
            </ul>
          </ul>
          <div className="container">
            <div className="row" className="hdr">
              <div className="col-xl-12 btn btn-info">
                React Bootstrap Table with Searching and Custom Pagination
             </div>
            </div>
            <div style={{ marginTop: 20,  }}>
              <BootstrapTable
                striped
                hover
                keyField='id'
                data={this.state.items}
                columns={this.state.columns}
                filter={ filterFactory() }   
                pagination={paginationFactory()} />
            </div>
          </div>
        </div>
      );
    }

  }
}

export default withRouter(ShowListData);
