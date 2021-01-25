import React from 'react'
import { Button, Header, Dropdown, Image, Modal, Input } from 'semantic-ui-react'
import {DateInput} from "semantic-ui-calendar-react";
import { InputFile } from 'semantic-ui-react-input-file'

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
            open: false, value: tagOptions[1].value,
            searchQuery: "",
            filteredList: tagOptions,
            date:""
        };
    }


    render() {
        return (
            <Modal
                onClose={() => this.setState({ open: false })}
                onOpen={() => this.setState({ open: true })}
                open={this.state.open}
                trigger={this.props.trigger}>
                <Modal.Header>Add patient</Modal.Header>
                <Modal.Content image>
                    {/* <Image size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped /> */}
                    <Modal.Description>
                        <Header>Add patient and upload image</Header>
                        <div class="content">
                            <p></p>
                            <p></p>
                            <p></p>
                            <p>Full name</p>
                            <Input type="text" placeholder="Name" /><br/>
                            <p>Gender</p>
                            <Dropdown
                                ref={this.dropdownRef}
                                placeholder="Filter Posts"
                                fluid={true}
                                labeled={true}
                                className="selection"
                                search={this.searchFn}
                                clearable={true}
                                onChange={this.handleChange}
                                onClose={this.handleClose}
                                value={this.state.value}
                                text={this.state.value}
                                onSearchChange={this.handleSearchChange}
                            >
                                <Dropdown.Menu style={{ maxHeight: "initial" }}>
                                    <Dropdown.Header>Choose gender</Dropdown.Header>
                                    <Dropdown.Divider />
                                    <Dropdown.Menu scrolling={true}>
                                        {this.state.filteredList.map(option => (
                                            <Dropdown.Item
                                                active={option.value === this.state.value}
                                                key={option.value}
                                                {...option}
                                                onClick={this.handleItemClick}
                                            />
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown.Menu>
                            </Dropdown>
                            <p>Day of birth</p>
                            <DateInput
                                name="date"
                                placeholder="Date"
                                value={this.state.date}
                                iconPosition="left"
                                onChange={this.handleChangeDay}
                            />
                            <p>Address</p>
                            <Input type="text" placeholder="Address" />
                            <p>Email</p>
                            <Input type="email" placeholder="Email" />
                            <p>Phone</p>
                            <Input type="text" placeholder="Phone" />
                            <p>Quarantine status</p>
                            <Input type="text" placeholder="Quarantine status" />
                            <InputFile
                                button={{  }}
                                input={{
                                    id: 'input-control-id',
                                    onChange: this.handleUpload
                                }}
                            />
                        </div>

                    </Modal.Description>    
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => this.setState({ open: false })}>
                        Exit
                    </Button>
                    <Button
                        content="Create"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => this.setState({ open: false })}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        );
    }


    handleChange = (_e, { value }) => {
        this.setState({ value });
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

    handleChangeDay= (event, { name, value }) => {
        if (this.state.hasOwnProperty(name)) {
          this.setState({ [name]: value });
        }
      };
    
    handleUpload = (_e, x) => {
      
    };
}

export default AddPatientModal;