import React, {Component} from 'react';
import {Form, FormGroup, Input, Label} from 'reactstrap';
import PropTypes from 'prop-types';

class SellerPosition extends Component {

  changeLocation(e) {
    this.props.changeLocation(e.target.value);
  }

  render() {
    return (
      <React.Fragment>
        <h2>What location do you want to display</h2>
        <Form onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            <Label className="text-small mt-3 mb-0">Location</Label>
            <Input type="text" name="location" id="location" placeholder="Enter location"
                   value={this.props.location || ''} onChange={(e) => this.changeLocation(e)}/>

            <FormGroup check className="mt-3">
              <Label check>
                <Input type="checkbox" onClick={(e) => {
                  if (e.target.checked) {
                    this.props.changeLocation('');
                  }
                }}/>
                Hide location
              </Label>
            </FormGroup>
          </FormGroup>
        </Form>
      </React.Fragment>
    );
  }
}

SellerPosition.propTypes = {
  changeLocation: PropTypes.func,
  location: PropTypes.string
};


export default SellerPosition;
