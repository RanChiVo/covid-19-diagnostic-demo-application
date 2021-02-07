import React, { Component } from 'react';
import axios from 'axios';
import "../Show_result_data/show_result_data.css"
import { Form, TextArea, Button, Icon } from 'semantic-ui-react'
import ArrowBackSharpIcon from '@material-ui/icons/ArrowBackSharp';

class ShowResultData extends Component {

    constructor(props) {
        super(props);
        console.log("props:", props.location.data);
        this.state = {
            stateTestAvailable: false,
            isLoaded: false,
            resultDianologis: props.location.data,
            id: "",
            test_time: "",
            result_time: "",
            result: "",
            patient_id: "",
            comments: ""
        };
    }

    componentDidMount() {
        let url = this.state.resultDianologis.url;
        let id_patient = this.state.resultDianologis.id;
        const formData = new FormData();
        formData.append("id_patient", id_patient);

        fetch("http://127.0.0.1:5000/get_test_id_patient", {
            method: "POST",
            body: formData
        }).then(res => res.json())
            .then(function (file) {
                let response = file["test"];
                if (response != "emty") {
                    this.setState({ stateTestAvailable: true })
                    this.setState({ id: response.id });
                    this.setState({ test_time: response.test_time });
                    this.setState({ result_time: response.result_time });
                    this.setState({ patient_id: response.patient_id });
                    this.setState({ comments: response.comments });
                }
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
        this.setState({ isLoaded: true });
    }

    handleClick() {
        const { history } = this.props;
        history.push({
            pathname: `/`,
        })
    }

    handleSave() {
        if (this.state.stateTestAvailable) {
            var formData = new FormData();
            formData.append("id", this.state.id);
            console.log("id", this.state.id);

            formData.append("test_time", this.state.test_time);
            console.log("test_time", this.state.test_time);

            formData.append("result_time", this.state.result_time);
            console.log("result_time", this.state.result_time);

            formData.append("result", this.state.result);
            console.log("result", this.state.result);

            formData.append("patient_id", this.state.resultDianologis.patient_id);
            console.log("patient_id", this.state.resultDianologis.patient_id);

            formData.append("comments", this.state.comments);
            console.log("comments", this.state.comments);

            const url = "http://127.0.0.1:5000/update_test";

            axios.post(url, formData, { processData: false },
                { contentType: false }, {

                headers: new Headers({
                    'Access-Control-Allow-Origin': '*'
                })
            })
                .then(function (response) {
                    console.log("OK NHA");
                    //handle success
                    console.log(response);
                    alert("Saved successful");
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                });

        }

        else {

            var formData = new FormData();
            formData.append("test_time", this.state.test_time);
            console.log("test_time", this.state.test_time);

            formData.append("result_time", this.state.result_time);
            console.log("result_time", this.state.result_time);

            formData.append("result", this.state.result);
            console.log("result", this.state.result);

            formData.append("patient_id", this.state.resultDianologis.patient_id);
            console.log("patient_id", this.state.resultDianologis.patient_id);

            formData.append("comments", this.state.comments);
            console.log("comments", this.state.comments);

            const url = "http://127.0.0.1:5000/add_test";

            axios.post(url, formData, { processData: false },
                { contentType: false }, {

                headers: new Headers({
                    'Access-Control-Allow-Origin': '*'
                })
            })
                .then(function (response) {
                    console.log("OK NHA");
                    alert("Saved successful");
                    //handle success
                    console.log(response);
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                });
        }
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className="resultMainPage">
                    <div className="back_home">
                        <Button inverted color='blue' icon labelPosition='left' onClick={() => this.handleClick()}>
                            Data list
                             <Icon name='left arrow' />
                        </Button>
                    </div>
                    <div className="resultPage">
                        <div className="container">
                            <div className="title">
                                <label>   DIAGNOSTIS RESULT</label>
                            </div>
                            <Form>
                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>First Name</label>
                                        <Form.Input
                                            fluid
                                            id='fullname'
                                            value={this.state.resultDianologis && this.state.resultDianologis.fullname}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Fullname Patient</label>
                                        <Form.Input
                                            fluid
                                            id='fullname'
                                            value={this.state.resultDianologis && this.state.resultDianologis.fullname}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Created date</label>
                                        <Form.Input
                                            fluid
                                            id='created_date'
                                            value={this.state.resultDianologis && this.state.resultDianologis.created_date}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Gender</label>
                                        <Form.Input
                                            fluid
                                            id='gender'
                                            value={this.state.resultDianologis && this.state.resultDianologis.gender}
                                        />
                                    </Form.Field>

                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Date of birth</label>
                                        <Form.Input
                                            fluid
                                            id='date_of_birth'
                                            value={this.state.resultDianologis && this.state.resultDianologis.date_of_birth} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Address</label>
                                        <Form.Input
                                            fluid
                                            id='address'
                                            value={this.state.resultDianologis && this.state.resultDianologis.address}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Phone</label>
                                        <Form.Input
                                            fluid
                                            id='phone'
                                            value={this.state.resultDianologis && this.state.resultDianologis.phone}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Email</label>
                                        <Form.Input
                                            fluid
                                            id='email'
                                            value={this.state.resultDianologis && this.state.resultDianologis.email}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Quarantine status</label>
                                        <Form.Input
                                            fluid
                                            id='quarantine_status'
                                            value={this.state.resultDianologis && this.state.resultDianologis.quarantine_status}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Image id</label>
                                        <Form.Input
                                            fluid
                                            id='id_image'
                                            value={this.state.resultDianologis && this.state.resultDianologis.id_image}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>url/name image</label>
                                        <Form.Input
                                            fluid
                                            id='url'
                                            value={this.state.resultDianologis && this.state.resultDianologis.url}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Uploaded date</label>
                                        <Form.Input
                                            fluid
                                            id='uploaded_date'
                                            value={this.state.resultDianologis && this.state.resultDianologis.uploaded_date}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Test Time</label>
                                        <Form.Input
                                            fluid
                                            id='test_time'
                                            type='date'
                                            value={this.state.test_time}
                                            onChange={this.handleChangeTestTime}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Result time</label>
                                        <Form.Input
                                            fluid
                                            id='result_time'
                                            type='date'
                                            value={this.state.result_time}
                                            onChange={this.handleChangeResultTime}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Diagnostis result AI</label>
                                        <Form.Input className="diagnostis_result"
                                            fluid
                                            id='diagnostis_result'
                                            value={this.state.resultDianologis && this.state.resultDianologis.diagnostis_result}
                                        />
                                    </Form.Field>

                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Conclusion</label>
                                        <Form.Input
                                            fluid
                                            id='result'
                                            value={this.state.result}
                                            onChange={this.handleChangeResult}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Comments</label>
                                        <Form.TextArea rows={2}
                                            value={this.state.comments}
                                            onChange={this.handleChangeComments}
                                            placeholder='Tell us more' />
                                    </Form.Field>
                                </Form.Group>

                            </Form>
                            <div className="saveCancel">
                                <Button.Group>
                                    <Button onClick={() => this.handleClick()} >Cancel</Button>
                                    <Button.Or />
                                    <Button inverted color='blue' onClick={() => this.handleSave()}>Save</Button>
                                </Button.Group>
                            </div>

                        </div>
                    </div>
                </div>
            );
        }
    }
    handleChangeTestTime = (_e, { value }) => {
        this.setState({ test_time: value });
    };

    handleChangeResultTime = (_e, { value }) => {
        this.setState({ result_time: value });
    };

    handleChangeResult = (_e, { value }) => {
        this.setState({ result: value });
    };

    handleChangeComments = (_e, { value }) => {
        this.setState({ comments: value });
    };

};

export default ShowResultData;