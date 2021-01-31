import React from 'react'
import { Button, Header, Dropdown, Image, Modal, Input , Message} from 'semantic-ui-react'
import { DateInput } from "semantic-ui-calendar-react";
import { InputFile } from 'semantic-ui-react-input-file'
import "../CreatePatient/modal.css"
import axios from 'axios';
import moment from "moment";


const tagOptions = [
    {
        key: "Male",
        text: "Male",
        value: "Male",
    },
    {
        key: "Female",
        text: "Female",
        value: "Female",
    },]

class AddPatientModal extends React.Component {
    dropdownRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            searchQuery: "",
            filteredList: tagOptions,
            open_date: false,
            fullname: "",
            gender: tagOptions[1].value,
            created_date: moment().format("DD-MM-YYYY hh:mm:ss"),
            date_of_birth: "",
            address: "",
            phone: "",
            email: "",
            quarantine_status: "",
            visible_notify:false,
            selectedFile:"",
            url:""
        };
    }


    render() {
        return (
            <div className="addPatient">
                <Modal
                    closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }}
                    onClose={() => this.setState({ open: false })}
                    onOpen={() => this.setState({ open: true })}
                    open={this.state.open}
                    trigger={this.props.trigger}>
                    <Header>Add patient and upload image</Header>
                    <Modal.Content image>
                        {/* <Image size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped /> */}
                        <Modal.Description>
                            <div class="contentA">
                                <div>
                                    <p>Full name</p>
                                    <Input type="text" placeholder="Name" size="10" value={this.state.fullname} onChange={this.update_full_name} width="200%" required /><br />
                                </div>
                                <div>
                                    <p>Gender</p>
                                    <Dropdown
                                        height='70px'
                                        ref={this.dropdownRef}
                                        placeholder="Filter Posts"
                                        fluid={true}
                                        labeled={true}
                                        className="selection"
                                        search={this.searchFn}
                                        clearable={true}
                                        onChange={this.updateGender}
                                        onClose={this.handleClose}
                                        value={this.state.gender}
                                        text={this.state.gender}
                                        onSearchChange={this.handleSearchChange}
                                    >
                                        <Dropdown.Menu style={{ maxHeight: "initial" }}>
                                            <Dropdown.Header>Choose gender</Dropdown.Header>
                                            <Dropdown.Divider />
                                            <Dropdown.Menu scrolling={true}>
                                                {this.state.filteredList.map(option => (
                                                    <Dropdown.Item
                                                        active={option.value === this.state.gender}
                                                        key={option.value}
                                                        {...option}
                                                        onClick={this.handleItemClick}
                                                    />
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                            <div class="contentB">
                                <div>
                                    <p>Day of birth</p>
                                    <DateInput
                                        pickerWidth="150px"
                                        name="date"
                                        placeholder="Date"
                                        value={this.state.date_of_birth}
                                        iconPosition="left"
                                        onChange={this.updateDateOfBirth}
                                        closable
                                        required
                                    />
                                </div>
                                <div>
                                    <p>Address</p>
                                    <Input type="text" placeholder="Address" value={this.state.address} onChange={this.updateAdress} required />
                                </div>
                            </div>
                            <div class="contentC">
                                <div>
                                    <p>Email</p>
                                    <Input type="email" placeholder="Email" value={this.state.email} onChange={this.updateEmail} required />
                                </div>
                                <div>
                                    <p>Phone</p>
                                    <Input type="text" placeholder="Phone" value={this.state.phone} onChange={this.updatePhone} required />
                                </div>
                            </div>
                            <div class="contentD">
                            <div>
                            <p>Quarantine status</p>
                            <Input type="text" placeholder="Quarantine status" value={this.state.quarantine_status} onChange={this.updateQuarantine_status} required />
                            </div>
                            <div>
                            <p>Created date</p>
                            <DateInput
                                pickerWidth="150px"
                                name="date_create"
                                placeholder="Date created"
                                value={this.state.created_date}
                                iconPosition="left"
                                onChange={this.handleChangeCreateDay}
                                closable
                            />
                            </div>
                            </div>
                            <div class="contentE">
                                <div>
                                    <p>Upload image</p>
                                    <input type="file" id="selectFile" onChange={this.updateSelectedFile}/>
                                </div>
                            </div>
                           

                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions height="auto">
                        <Button color='black' onClick={() => this.setState({ open: false })}>
                            Exit
                    </Button>
                        <Button
                            content="Create"
                            labelPosition='right'
                            icon='checkmark'
                            onClick={this.handleCreateNewData}
                            className="create"
                            primary
                        />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }

    update_full_name = (_e, { value }) => {
        this.setState({ fullname: value })
    }

    handleChangeCreateDay = (event, { name, value }) => {
        this.setState({ date_create: value });
    };

    updateGender = (_e, { value }) => {
        this.setState({ gender: value });
    };

    updateDateOfBirth = (event, { name, value }) => {
        this.setState({ date_of_birth: value });
    };

    updateAdress = (_e, { value }) => {
        this.setState({ address: value });
    };

    updateEmail = (_e, { value }) => {
        this.setState({ email: value });
    };

    updatePhone = (_e, { value }) => {
        this.setState({ phone: value });
    };

    updateQuarantine_status = (_e, { value }) => {
        this.setState({ quarantine_status: value });
    };

    searchFn = (_e, searchQuery) => {
        const filteredList = tagOptions.filter(
            item => !searchQuery || item.value.includes(searchQuery)
        );
        return filteredList;
    };

    handleSearchChange = (_e, { searchQuery }) => {
        const filteredList = this.searchFn(_e, searchQuery);
        this.setState({ searchQuery, filteredList });
    };

    handleClose = (_e, { searchQuery }) => {
        this.setState({ searchQuery: "", filteredList: tagOptions });
    };

    handleItemClick = (_e, x) => {
        this.dropdownRef.current.handleItemClick(_e, x);
    };

    handleUpload = (_e, x) => {
    };

    handleCreateNewData = () => {
        console.log("CREATE NEW DATA");
        this.setState({ open: false });
        
        var form = new FormData();
        form.append("file", this.state.selectedFile);
        console.log("selectedFile", this.state.selectedFile);
            
        axios.post("http://127.0.0.1:5000/file-upload", form, { processData: false },
            { contentType: false }, {

            headers: new Headers({
                'Access-Control-Allow-Origin': '*'
            })
        })
            .then(function (response) {
                //handle success
                console.log("response", response['data']['message']);
                this.setState({url:response['data']['message']})
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });

        var formData = new FormData();
        formData.append("url","assets/"+ this.state.selectedFile['name']);
        console.log("url", "assets/"+ this.state.selectedFile['name']);

        formData.append("fullname", this.state.fullname);
        console.log("fullname", this.state.fullname);

        formData.append("created_date", this.state.created_date);
        console.log("created_date", this.state.created_date);

        formData.append("gender", this.state.gender);
        console.log("gender", this.state.gender);

        formData.append("date_of_birth", this.state.date_of_birth);
        console.log("date_of_birth", this.state.date_of_birth);

        formData.append("address", this.state.address);
        console.log("address", this.state.address);

        formData.append("phone", this.state.phone);
        console.log("phone", this.state.phone);

        formData.append("email", this.state.email);
        console.log("email", this.state.email);

        formData.append("quarantine_status", this.state.quarantine_status);
        console.log("quarantine_status", this.state.quarantine_status);

      
        const url = "http://127.0.0.1:5000/add_patient";

        axios.post(url, formData, { processData: false },
            { contentType: false }, {

            headers: new Headers({
                'Access-Control-Allow-Origin': '*'
            })
        })
            .then(function (response) {
                //handle success
                console.log(response);
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    }

    updateSelectedFile = (_e) => {
        if (!_e.target.files || _e.target.files.length === 0) {
            this.setState({selectedFile:undefined})
            return
          }
          // I've kept this example simple by using the first image instead of multiple
        this.setState({selectedFile:_e.target.files[0]})
        console.log("path file upload", this.state.selectedFile)
    }

};
export default AddPatientModal;