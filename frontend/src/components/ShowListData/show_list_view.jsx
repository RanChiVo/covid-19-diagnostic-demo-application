
import React, { Component } from 'react';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import '/home/mot/Documents/version_control/demo_covid/frontend/src/components/ShowListData/show_list_view.css';
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

    this.style_filter = {
      border: 'none',
      color: 'White',
      height: '40px',
      margin: '0 5px 20px 5px',
      padding: '0 20px',
      backgroundColor: '#516873',

    };

    this.state = {
      isLoaded: false,
      redirect: null,
      items: [],
      columns: [{
        dataField: 'address',
        text: 'Address',
        filter: textFilter({ style: this.style_filter })
      },
      {
        dataField: 'created_date',
        text: 'Created Date',
        style: { 'padding': '20px' },
        filter: textFilter({ style: this.style_filter })
      }
        , {
        dataField: 'date_of_birth',
        text: 'Date Of Birth',
        sort: true,
        filter: textFilter({ style: this.style_filter })
      },
      {
        dataField: 'email',
        text: 'Email',
        sort: true,
        filter: textFilter({ style: this.style_filter })
      },
      {
        dataField: 'fullname',
        text: 'Fullname',
        sort: true,
        filter: textFilter({ style: this.style_filter })
      },
      {
        dataField: 'gender',
        text: 'Gender',
        sort: true,
        filter: textFilter({ style: this.style_filter })
      },
      {
        dataField: 'id',
        text: 'Id',
        sort: true,
        filter: textFilter({ style: this.style_filter })
      },
      {
        dataField: 'phone',
        text: 'Phone',
        sort: true,
        filter: textFilter({ style: this.style_filter })
      },
      {
        dataField: 'quarantine_status',
        text: 'Quarantine Status',
        sort: true,
        filter: textFilter({ style: this.style_filter })
      },]
    };
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

  handle_click_row = {
    onClick: (e, row, rowIndex) => {
      const { history } = this.props;
    history.push({
      pathname: `/images/${row.fullname}`,
      data: row.id // your data array of objects
    })
    window.location.reload();
    },
    onMouseEnter: (e, row, rowIndex) => {
      console.log(`enter on row with index: ${rowIndex}`);
    }
  }

  render() {
    const selectRow = { mode: 'checkbox', bgColor: 'Gray' };
    const { error, isLoaded, items } = this.state;
    const options = {
      page: 2,
      sizePerPageList: [{
        text: '5', value: 2
      }, {
        text: '10', value: 2
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
        <div className="list_patients">
          <ul>
            <ul>
              {/* {this.state.items.map(item => (
            <li key={item.id} onClick={() => this.onItemClick(item)}>
              {item.fullname} {item.gender} {item.address} {item.quarantine_status} {item.email} {item.date_of_birth}{item.created_date} 
            </li>
          ))}    */}
            </ul>
          </ul>
          <div className="info">
            LIST OF PATIENTS AND THEIR X-RAYS
             </div>
          <div className="total_patients">
            <div className="row" className="hdr">
              <div className="col-xl-12 title_total_patients">
                STUDYLIST
             </div>
            </div>
          </div>
          <div className="form_list">
            <div className="table_list_patient" >

              <div style={{ backgroundColor: '#151a1f' }}>
                <BootstrapTable
                  striped
                  hover
                  keyField='id'
                  data={this.state.items}
                  columns={this.state.columns}
                  filter={filterFactory()}
                  pagination={paginationFactory()} selectRow={selectRow}  rowEvents={this.handle_click_row} />
              </div>
            </div>
          </div>
        </div>
      );
    }

  }
}

export default withRouter(ShowListData);
