
import React, { Component } from 'react';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import "../ShowListData/show_list_view.css";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import axios from 'axios';
import { Button } from 'semantic-ui-react'
import AddPatientModal from "../CreatePatient/modal" 
import Header from "../ShowListData/header"
import {
  BrowserRouter as Router,
  withRouter,
} from "react-router-dom";

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

  
  handle_click_row = {
    onClick: (e, row, rowIndex) => {
      const { history } = this.props;
      let patientInfo = {};
      const patientList = this.state.items;
      console.log("PATIENT", patientList);
      for (var item in patientList){
        console.log("item id", );
        if(patientList[item]["id"]===row.id){
          patientInfo = patientList[item];
          break;
        }
      }
      history.push({
        pathname: `/images/${row.fullname}`,
        data: patientInfo // your data array of objects
      })
      
      console.log(`enter on row with index: ${rowIndex}`);
      console.log("value of row", row.phone)
      
    },
    onMouseEnter: (e, row, rowIndex) => {
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
        <div className="list_patients" style={{background: 'rgb(81, 104, 115)'}}>
          <div className="info">
          <Header></Header>
            LIST OF PATIENTS AND LUNG X-RAYS IMAGES
             </div>
          <div className="total_patients">
            <div className="row" className="hdr">
              <div className="col-xl-12 title_total_patients">
                PATIENT LIST
             </div>
             <AddPatientModal trigger={<div className="createPatient">
            <button className="ui labeled icon blue button create_Patient" style={{backgroundColor: 'rgb(81, 104, 115)', color: 'color: rgb(145, 185, 205)', bỏ
            : 'solid #80bdff 0px'}}>
              <i class="plus circle icon"></i>
              Add Patient
          </button>
            </div>}>
          </AddPatientModal>
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
                  pagination={paginationFactory()} selectRow={selectRow} rowEvents={this.handle_click_row} />
              </div>
            </div>
          </div>
        </div>
      );
    }

  }
}

export default withRouter(ShowListData);
