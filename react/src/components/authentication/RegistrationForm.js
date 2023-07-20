import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Form, Row, Col } from 'react-bootstrap';
import Divider from 'components/common/Divider';
import SocialAuthButtons from './SocialAuthButtons';
import { api } from '../../utils/api';
import AppContext from '../../context/Context';
import { setCSRF } from '../../helpers/utils';

const RegistrationForm = ({ hasLabel }) => {
  const { setConfig } = useContext(AppContext);
  const navigate = useNavigate();
  // State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAccepted: false
  });

  // Handler
  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords doesn't match.", { theme: 'colored' });
    } else {
      await api
        .post('/account/auth/register/', formData)
        .then(async () => {
          await api.post('/account/login/', formData).then(() => {
            setConfig('isAuthenticated', true);
            setCSRF();
            navigate('/');
            toast.success(`Successfully registered as ${formData.username}`, {
              theme: 'colored'
            });
          });
        })
        .catch(err => {
          toast.error(`An error has occurred. ${err.toString()}`, {
            theme: 'colored'
          });
        });
    }
  };

  const handleFieldChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Username</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Username' : ''}
          value={formData.username}
          name="username"
          onChange={handleFieldChange}
          type="text"
        />
      </Form.Group>
      <Row>
        <Form.Group className="mb-3" as={Col} sm={6}>
          {hasLabel && <Form.Label>First Name</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'First Name' : ''}
            value={formData.first_name}
            name="first_name"
            onChange={handleFieldChange}
            type="text"
          />
        </Form.Group>
        <Form.Group className="mb-3" as={Col} sm={6}>
          {hasLabel && <Form.Label>Last Name</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Last Name' : ''}
            value={formData.last_name}
            name="last_name"
            onChange={handleFieldChange}
            type="text"
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Email address</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Email address' : ''}
          value={formData.email}
          name="email"
          onChange={handleFieldChange}
          type="email"
        />
      </Form.Group>

      <Row className="g-2 mb-3">
        <Form.Group as={Col} sm={6}>
          {hasLabel && <Form.Label>Password</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Password' : ''}
            value={formData.password}
            name="password"
            onChange={handleFieldChange}
            type="password"
          />
        </Form.Group>
        <Form.Group as={Col} sm={6}>
          {hasLabel && <Form.Label>Confirm Password</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Confirm Password' : ''}
            value={formData.confirmPassword}
            name="confirmPassword"
            onChange={handleFieldChange}
            type="password"
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3">
        <Form.Check type="checkbox" id="acceptCheckbox" className="form-check">
          <Form.Check.Input
            type="checkbox"
            name="isAccepted"
            checked={formData.isAccepted}
            onChange={e =>
              setFormData({
                ...formData,
                isAccepted: e.target.checked
              })
            }
          />
          <Form.Check.Label className="form-label">
            I accept the <Link to="#!">terms</Link> and{' '}
            <Link to="#!">privacy policy</Link>
          </Form.Check.Label>
        </Form.Check>
      </Form.Group>

      <Form.Group className="mb-4">
        <Button
          className="w-100"
          type="submit"
          disabled={
            !formData.username ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.isAccepted
          }
        >
          Register
        </Button>
      </Form.Group>
      <Divider>or register with</Divider>

      <SocialAuthButtons />
    </Form>
  );
};

RegistrationForm.propTypes = {
  hasLabel: PropTypes.bool
};

export default RegistrationForm;
