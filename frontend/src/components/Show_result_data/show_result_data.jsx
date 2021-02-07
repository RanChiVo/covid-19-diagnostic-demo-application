import React, { Component } from 'react';
import axios from 'axios';
import "../Show_result_data/show_result_data.css"
import { Form, TextArea, Button,Icon} from 'semantic-ui-react'
import ArrowBackSharpIcon from '@material-ui/icons/ArrowBackSharp';

class ShowResultData extends Component {

    constructor(props) {
        super(props);
        console.log("props:", props.location.data);
        this.state = {
            isLoaded: false,
            resultDianologis: props.location.data
        };
    }

    componentDidMount() {
        axios.get('http://127.0.0.1:5000/get_patients').then(response => {
            console.log("data:", response.data);
            this.setState({
                items: response.data.patients,
                isLoaded: true,
            });
        });
        this.setState({ isLoaded: true });
    }

    handleClick() {
        const { history } = this.props;
        history.push({
            pathname: `/`,
        })
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
                                            id='testTiem'
                                            type='date'
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Result time</label>
                                        <Form.Input
                                            fluid
                                            id='resultTime'
                                            type='date'
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
                                            value={this.state.resultDianologis && this.state.resultDianologis.diagnostis_result}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Field>
                                        <label style={{ color: "white" }}>Comments</label>
                                        <Form.TextArea rows={2} placeholder='Tell us more' />
                                    </Form.Field>
                                </Form.Group>

                            </Form>
                            <div className="saveCancel">
                                <Button.Group>
                                    <Button  onClick={() => this.handleClick()} >Cancel</Button>
                                    <Button.Or />
                                    <Button inverted color='blue'>Save</Button>
                                </Button.Group>
                            </div>

                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default ShowResultData;