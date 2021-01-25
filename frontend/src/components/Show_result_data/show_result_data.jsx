import React, { Component } from 'react';
import axios from 'axios';

class ShowResultData extends Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        axios.get('http://127.0.0.1:5000/get_patients').then(response => {
            console.log("data:", response.data);
            this.setState({
                items: response.data.patients,
                isLoaded: true,
            });
        });
    }

    onItemClick(e) {
       
        const { history } = this.props;
        history.push({
            pathname: `/images/${e.fullname}`,
            data: e.id // your data array of objects
        })
        window.location.reload();
    }

    handle_click_row = {
    }

    render() {
        return (
            <div>
                <div className="result">
                    DIAGNOSTIS RESULT
             </div>
                <div className="total_patients">
                    <div className="row" className="hdr">
                        <div className="col-xl-12 title_total_patients">
                            INFOMATION PATIENT LIST
             </div>
                    </div>
                </div>
            </div>
        );
    }

}


export default ShowResultData;