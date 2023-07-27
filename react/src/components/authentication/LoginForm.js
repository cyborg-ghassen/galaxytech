import Divider from 'components/common/Divider';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import SocialAuthButtons from './SocialAuthButtons';
import AppContext from '../../context/Context';
import { api } from '../../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setCSRF } from '../../helpers/utils';

const LoginForm = ({ hasLabel, layout }) => {
    const { setConfig } = useContext(AppContext);
    const navigate = useNavigate();
    // State
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        remember: false
    });
    const [, setErrors] = useState({});

    // Handler
    const handleSubmit = e => {
        e.preventDefault();
        api.post('/account/login/', formData)
            .then(() => {
                setConfig('isAuthenticated', true);
                setCSRF();
                navigate('/');
                toast.success(`Logged in as ${formData.username}`, {
                    theme: 'colored'
                });
            })
            .catch(err => {
                setErrors(err?.response?.data);
                toast.error(`An error has occurred ${err.toString()}`, {
                    theme: 'colored'
                });
            });
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

            <Form.Group className="mb-3">
                {hasLabel && <Form.Label>Password</Form.Label>}
                <Form.Control
                    placeholder={!hasLabel ? 'Password' : ''}
                    value={formData.password}
                    name="password"
                    onChange={handleFieldChange}
                    type="password"
                />
            </Form.Group>

            <Row className="justify-content-between align-items-center">
                <Col xs="auto">
                    <Form.Check
                        type="checkbox"
                        id="rememberMe"
                        className="mb-0"
                    >
                        <Form.Check.Input
                            type="checkbox"
                            name="remember"
                            checked={formData.remember}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    remember: e.target.checked
                                })
                            }
                        />
                        <Form.Check.Label className="mb-0 text-700">
                            Remember me
                        </Form.Check.Label>
                    </Form.Check>
                </Col>

                <Col xs="auto">
                    <Link
                        className="fs--1 mb-0"
                        to={`/authentication/${layout}/forgot-password`}
                    >
                        Forgot Password?
                    </Link>
                </Col>
            </Row>

            <Form.Group>
                <Button
                    type="submit"
                    color="primary"
                    className="mt-3 w-100"
                    disabled={!formData.username || !formData.password}
                >
                    Log in
                </Button>
            </Form.Group>

            <Divider className="mt-4">or log in with</Divider>

            <SocialAuthButtons />
        </Form>
    );
};

LoginForm.propTypes = {
    layout: PropTypes.string,
    hasLabel: PropTypes.bool
};

LoginForm.defaultProps = {
    layout: 'simple',
    hasLabel: false
};

export default LoginForm;
