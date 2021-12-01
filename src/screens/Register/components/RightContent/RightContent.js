import React, { Component } from 'react';
import { withRouter} from "react-router-dom";
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions/profile';
import { InputRange, MultiSelect } from '../../../../components';
import stateList from '../../../../mock/state.json';
import { formatPhoneNumber, isValidEmail } from '../../../../utils';
import './style.css';

export class RightContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstName: '',
        lastName: '',
        telephone: '',
        age: 28,
        email: '',
        state: '',
        aprendiz: '',
        address: 'Home',
        address1: '',
        address2: '',
        interests: [],
        subscribenewsletter: false
      },
      errors: {
        user: {
          firstName: 'Enter First Name',
          telephone: 'Enter Telephone',
          email: 'Email is not valid!',
          interests: 'Enter your Interests'
        }
      },
      validForm: false,
      submitted: false
    }
  }

  componentDidMount() {
    if(this.props.profile) {
      this.setState({ user: this.props.profile });
      if (this.props.profile.email) {
        this.resetErrorMsg();
      }
    }
  }

  validationErrorMessage = (event) => {
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case 'firstName': 
        errors.user.firstName = value.length < 1 ? 'Ingrese su Nombre' : '';
        break;
      case 'email': 
        errors.user.email = isValidEmail(value) ? '' : 'Este no es un correo!';
        break;
      case 'telephone': 
        errors.user.telephone = value.length < 1 && value.length > 10 ? 'Ingrese un numero valido' : '';
        break;
    }

    this.setState({ errors });
  }

  inputChange = (event) => {
    let telphone = ''
    const { name, value } = event.target;
    const user = this.state.user;
    if (name === 'telephone') {
      telphone = formatPhoneNumber(value);
      user[name] = telphone;
    } else {
      user[name] = value;
    }
    this.setState({ user });
    this.validationErrorMessage(event);
  }

  checkboxChange = (event) => {
    const { name, checked } = event.target;
    const user = this.state.user;
    user[name] = checked;
    this.setState({ user });
  }

  onChangeAddress = (event) => {
    const user = this.state.user;
    user['address'] = event.target.value;
    this.setState({ user });
  }

  onChangeInputRange = (value) => {
    const user = this.state.user;
    user['age'] = value;
    this.setState({ user })
  }

  onSelectedInterest = (value) => {
    const user = this.state.user;
    const errors = this.state.errors;
    user['interests'] = value;
    errors.user.interests = value.length < 1 ? 'Ingresa tu experiencia' : '';
    this.setState({ user, errors });
  }

  validateForm = (errors) => {
    let valid = true;
    Object.entries(errors.user).forEach(item => {
      console.log(item)
      item && item[1].length > 0 && (valid = false)
    })
    return valid;
  }

  submitForm = async (event) => {
    this.setState({ submitted: true });
    this.props.dispatch(ActionCreators.formSubmittionStatus(true));
    const user = this.state.user;
    if (user && this.props.profile) {
      user.profileImage = this.props.profile.profileImage;
    }
    event.preventDefault();
    if (this.validateForm(this.state.errors) && this.props.profile && this.props.profile.profileImage) {
      console.info('Valid Form')
      this.props.dispatch(ActionCreators.addProfile(user));
      this.props.history.push('/confirm')
    } else {
      console.log('Invalid Form')
    }
  }

  resetErrorMsg = () => {
    let errors = this.state.errors;
    errors.user.firstName = ''
    errors.user.telephone = ''
    errors.user.email = ''
    errors.user.interests = ''
    this.setState({ errors });
  }

  render() {
    const { firstName, lastName, age, email, telephone, aprendiz, interests, subscribenewsletter } = this.state.user;
    const { submitted } = this.state;
    const listState = stateList.listStates.map((item, key) =>
      <option key={key} value={item.name}>{item.name}</option>
    );
    return (
      <div className="rightPanel">
        <div className="row">
          <label htmlFor="staticEmail1" className="col-sm-2 col-form-label">Aprendiz Sena</label>
          <div className="col-sm-6 mb-2">
            <select className="custom-select" value={aprendiz} name="country" id="inlineFormCustomSelect" onChange={this.inputChange}>
              <option value="US">Sí</option>
              <option value="IN">No</option>
            </select>
          </div>
          <div className="col-sm-4">
          </div>
         </div>
        <div className="row">
          <label className="col-sm-2 col-form-label">Nombres</label>
          <div className="col-sm-3 mb-2">
            <input type="text" value={firstName} name="firstName" onChange={(e) => { this.inputChange(e)} } className="form-control" placeholder="Nombres" />
            { submitted && this.state.errors.user.firstName.length > 0 &&  <span className='error'>{this.state.errors.user.firstName}</span>}
          </div>
          <div className="col-sm-3 mb-2">
            <input type="text" value={lastName} name="lastName" onChange={(e) => { this.inputChange(e)} } className="form-control" placeholder="Apellidos" />
          </div>
          <div className="col-sm-4">
          </div>
        </div>
        <div className="row">
          <label htmlFor="formControlAgeRange" className="col-sm-2 col-form-label">Edad</label>
          <div className="col-sm-6 mb-2">
            <InputRange min={1} max={100} step={1} value={age} onChangeInputRange={this.onChangeInputRange} />
          </div>
          <div className="col-sm-4">
          </div>
        </div>
        <div className="row">
          <label htmlFor="email" className="col-sm-2 col-form-label">Correo</label>
          <div className="col-sm-6 mb-2">
            <input type="email" value={email} name="email" onChange={(e) => { this.inputChange(e)} } className="form-control" id="email" placeholder="senarama@misena.edu.co" />
            { submitted && this.state.errors.user.email.length > 0 &&  <span className='error'>{this.state.errors.user.email}</span>}
          </div>
          <div className="col-sm-4">
          </div>
        </div>
        <div className="row">
          <label htmlFor="telephone" className="col-sm-2 col-form-label">Celular</label>
          <div className="col-sm-6 mb-2">
            <input type="text" pattern="[0-9]" maxLength="14" value={telephone} name="telephone" onChange={(e) => { this.inputChange(e)} }  className="form-control" id="telephone" placeholder="3045555555" />
            { submitted && this.state.errors.user.telephone.length > 0 &&  <span className='error'>{this.state.errors.user.telephone}</span>}
          </div>
          <div className="col-sm-4">
          </div>
        </div>
        <div className="row">
          <label htmlFor="staticEmail1" className="col-sm-2 col-form-label">En breves palabras hablanos de tu experiencia</label>
          <div className="col-sm-6 mb-2">
            <MultiSelect className="form-control" searchPlaceholder="Experiencia" selected={interests} onSelect={this.onSelectedInterest} />
            { submitted && this.state.errors.user.interests.length > 0 &&  <span className='error'>{this.state.errors.user.interests}</span>}
          </div>
          <div className="col-sm-4">
          </div>
        </div>
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-6 mb-2">
            <label htmlFor="subscribenewsletter"><input type="checkbox" checked={subscribenewsletter} name="subscribenewsletter" onChange={this.checkboxChange} id="subscribenewsletter" style={{margin: '10px'}} />Tienes un proyecto en gestación relacionadocon la cultura?<br/>Ejemplo:Producción teatral, Dancistica, Músical, etc</label>
          </div>
          <div className="col-sm-4">
          </div>
        </div>
        <div className="row">
          <div className="col-sm-5 mb-2">
          </div>
          <div className="col-sm-4">
            <button type="button" className="button" onClick={this.submitForm}>Enviar</button>
          </div>
          <div className="col-sm-3"></div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.user.profile
  }
}

export default connect(mapStateToProps)(withRouter(RightContent));
