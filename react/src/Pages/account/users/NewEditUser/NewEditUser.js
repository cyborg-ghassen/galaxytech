import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import CardHeader from 'react-bootstrap/CardHeader';
import Flex from '../../../../components/common/Flex';
import IconButton from '../../../../components/common/IconButton';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Field, Formik } from 'formik';
import Avatar from '../../../../components/common/Avatar';
import { isIterableArray } from '../../../../helpers/utils';
import FalconDropzone from '../../../../components/common/FalconDropzone';
import cloudUpload from '../../../../assets/img/icons/cloud-upload.svg';
import avatarImg from '../../../../assets/img/team/avatar.png';
import { AuthWizardContext } from '../../../../context/Context';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import useQuery from '../../../../hooks/useQuery';
import { getGroups, getPermissions } from '../../actions/GroupsPermissions';
import { getMarketplaces } from '../../../marketplace/actions/Marketplace';
import { api } from '../../../../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FormError from '../../../errors/FormError';
import { format } from 'date-fns';

export const NewEditUser = () => {
    const { user } = useContext(AuthWizardContext);
    const [formData, setFormData] = useState({
        password: '',
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        is_active: true,
        is_staff: false,
        is_superuser: false,
        is_marketplace: false,
        number: '',
        avatar: null,
        gender: null,
        birth_date: null,
        marketplace: null,
        groups: [],
        user_permissions: []
    });
    const [loading, setLoading] = useState(true);
    const [avatar, setAvatar] = useState([
        ...(user.avatar ? user.avatar : []),
        { src: avatarImg }
    ]);
    const [errors, setErrors] = useState({});
    const [date, setDate] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [groups, setGroups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState(null);
    const [marketplaces, setMarketplaces] = useState([]);
    const [selectedMarketplace, setSelectedMarketplace] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();
    const query = useQuery();
    const marketplaceQuery = useQuery();

    useEffect(() => {
        setLoading(true);
        getGroups(query)
            .then(res => setGroups(res?.results))
            .catch(() => {});
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        getPermissions(query)
            .then(res => setPermissions(res?.results))
            .catch(() => {});
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        marketplaceQuery.set('page_size', '50');
        marketplaceQuery.set('page', currentPage);
        getMarketplaces(marketplaceQuery)
            // eslint-disable-next-line no-unsafe-optional-chaining
            .then(res => setMarketplaces([...marketplaces, ...res?.results]))
            .catch(() => {});
        setLoading(false);
    }, [currentPage]);

    let groupOptions = groups.map(group => ({
        label: group.name,
        value: group.id
    }));

    groupOptions = [
        { label: '---------------------------', value: '' },
        ...groupOptions
    ];

    let permissionOptions = permissions.map(permission => ({
        label: permission.name,
        value: permission.id
    }));

    permissionOptions = [
        { label: '---------------------------', value: '' },
        ...permissionOptions
    ];

    let marketplaceOptions = marketplaces.map(marketplace => ({
        label: marketplace.name,
        value: marketplace.id
    }));

    marketplaceOptions = [
        { label: '---------------------------', value: '' },
        ...marketplaceOptions
    ];

    let genderOptions = [
        { label: '---------------------------', value: '' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
    ];

    const handleSubmit = async (e, values) => {
        e.preventDefault();
        setLoading(true);
        api.defaults.headers['Content-Type'] =
            'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW';
        setFormData(values);
        let fd = new FormData();
        Object.keys(values).forEach(key => {
            fd.append(key, values[key]);
        });
        if (!values.avatar) fd.delete('avatar');
        if (!values.birth_date) fd.delete('birth_date');
        if (!values.gender) fd.delete('gender');
        if (!values.marketplace) fd.delete('marketplace');
        fd.delete('groups');
        fd.delete('avatar');
        fd.delete('user_permissions');
        console.log(values.avatar);
        if (values.avatar) {
            console.log(avatar[0]);
            fd.append('avatar', avatar[0]);
        }
        if (values.groups) {
            values.groups.forEach(group => fd.append('groups', group));
        }
        if (values.user_permissions) {
            values.user_permissions.forEach(permission =>
                fd.append('user_permissions', permission)
            );
        }
        await api
            .post('/account/user/', fd)
            .then(() => {
                toast.success('User successfully added.', { theme: 'colored' });
                navigate('/accounts/user');
            })
            .catch(err => {
                setErrors(err?.response?.data);
                toast.error('An error has occurred.', { theme: 'colored' });
            });

        setLoading(false);
    };

    return (
        <Fragment>
            {loading ? (
                <Flex
                    justifyContent="center"
                    alignItems={'center'}
                    className="p-2 mb-2"
                >
                    <Spinner animation={'border'} variant={'primary'} />
                </Flex>
            ) : (
                <>
                    <Formik
                        initialValues={formData}
                        onSubmit={values => {
                            console.log(values);
                        }}
                    >
                        {({ values, setFieldValue }) => (
                            <>
                                <Card>
                                    <CardHeader>
                                        <Flex
                                            justifyContent={'between'}
                                            wrap={'wrap'}
                                        >
                                            <h5
                                                className={
                                                    'justify-content-start'
                                                }
                                            >
                                                User settings
                                            </h5>
                                            <IconButton
                                                icon={faSave}
                                                onClick={e =>
                                                    handleSubmit(e, values)
                                                }
                                            >
                                                <span className="d-none d-sm-inline-block ms-1">
                                                    Save
                                                </span>
                                            </IconButton>
                                        </Flex>
                                    </CardHeader>
                                </Card>

                                <Form>
                                    <Row className={'g-3 mt-1 mb-3'}>
                                        <Col xxl={8} xl={12}>
                                            <Row className="g-3">
                                                <Col xs={12}>
                                                    <Card>
                                                        <Card.Header>
                                                            <h5 className="mb-0 text-muted">
                                                                Basic
                                                                Information
                                                            </h5>
                                                        </Card.Header>
                                                        <Card.Body className="bg-light pb-0">
                                                            <Form.Group>
                                                                <Row className="mb-3">
                                                                    <Col md="auto">
                                                                        <Avatar
                                                                            size="4xl"
                                                                            src={
                                                                                isIterableArray(
                                                                                    avatar
                                                                                )
                                                                                    ? avatar[0]
                                                                                          ?.base64 ||
                                                                                      avatar[0]
                                                                                          ?.src
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Col>
                                                                    <Col md>
                                                                        <Field name="avatar">
                                                                            {() => (
                                                                                <FalconDropzone
                                                                                    files={
                                                                                        avatar
                                                                                    }
                                                                                    onChange={files => {
                                                                                        setAvatar(
                                                                                            files
                                                                                        );
                                                                                        setFieldValue(
                                                                                            'avatar',
                                                                                            files[0]
                                                                                        );
                                                                                    }}
                                                                                    multiple={
                                                                                        false
                                                                                    }
                                                                                    accept="image/*"
                                                                                    placeholder={
                                                                                        <>
                                                                                            <Flex justifyContent="center">
                                                                                                <img
                                                                                                    src={
                                                                                                        cloudUpload
                                                                                                    }
                                                                                                    alt=""
                                                                                                    width={
                                                                                                        25
                                                                                                    }
                                                                                                    className="me-2"
                                                                                                />
                                                                                                <p className="fs-0 mb-0 text-700">
                                                                                                    Upload
                                                                                                    your
                                                                                                    profile
                                                                                                    picture
                                                                                                </p>
                                                                                            </Flex>
                                                                                            <p className="mb-0 w-75 mx-auto text-400">
                                                                                                Upload
                                                                                                a
                                                                                                300x300
                                                                                                jpg
                                                                                                image
                                                                                                with
                                                                                                a
                                                                                                maximum
                                                                                                size
                                                                                                of
                                                                                                400KB
                                                                                            </p>
                                                                                        </>
                                                                                    }
                                                                                />
                                                                            )}
                                                                        </Field>
                                                                        <FormError
                                                                            error={
                                                                                errors.avatar
                                                                            }
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </Form.Group>
                                                            <Form.Group>
                                                                <Form.Label>
                                                                    Username:
                                                                </Form.Label>
                                                                <Field name="username">
                                                                    {({
                                                                        field
                                                                    }) => (
                                                                        <Form.Control
                                                                            type="text"
                                                                            name="username"
                                                                            placeholder="Username"
                                                                            errors={
                                                                                errors
                                                                            }
                                                                            formGroupProps={{
                                                                                className:
                                                                                    'mb-3'
                                                                            }}
                                                                            onChange={e => {
                                                                                setFieldValue(
                                                                                    field.name,
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }}
                                                                            value={
                                                                                field.value
                                                                            }
                                                                        />
                                                                    )}
                                                                </Field>
                                                                <FormError
                                                                    error={
                                                                        errors.username
                                                                    }
                                                                />
                                                            </Form.Group>
                                                            <Row>
                                                                <Col md={6}>
                                                                    <Form.Group>
                                                                        <Form.Label>
                                                                            First
                                                                            Name:
                                                                        </Form.Label>
                                                                        <Field name="first_name">
                                                                            {({
                                                                                field
                                                                            }) => (
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    label="First Name"
                                                                                    name="first_name"
                                                                                    placeholder="First Name"
                                                                                    errors={
                                                                                        errors
                                                                                    }
                                                                                    formGroupProps={{
                                                                                        className:
                                                                                            'mb-3'
                                                                                    }}
                                                                                    onChange={e => {
                                                                                        setFieldValue(
                                                                                            field.name,
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        );
                                                                                    }}
                                                                                    value={
                                                                                        field.value
                                                                                    }
                                                                                />
                                                                            )}
                                                                        </Field>
                                                                        <FormError
                                                                            error={
                                                                                errors.first_name
                                                                            }
                                                                        />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col md={6}>
                                                                    <Form.Group>
                                                                        <Form.Label>
                                                                            Last
                                                                            Name:
                                                                        </Form.Label>
                                                                        <Field name="last_name">
                                                                            {({
                                                                                field
                                                                            }) => (
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    label="Last Name"
                                                                                    name="last_name"
                                                                                    placeholder="Last Name"
                                                                                    errors={
                                                                                        errors
                                                                                    }
                                                                                    formGroupProps={{
                                                                                        className:
                                                                                            'mb-3'
                                                                                    }}
                                                                                    onChange={e => {
                                                                                        setFieldValue(
                                                                                            field.name,
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        );
                                                                                    }}
                                                                                    value={
                                                                                        field.value
                                                                                    }
                                                                                />
                                                                            )}
                                                                        </Field>
                                                                        <FormError
                                                                            error={
                                                                                errors.last_name
                                                                            }
                                                                        />
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                            <Form.Group>
                                                                <Form.Label>
                                                                    Gender:
                                                                </Form.Label>
                                                                <Field name="gender">
                                                                    {({
                                                                        field
                                                                    }) => (
                                                                        <Select
                                                                            options={
                                                                                genderOptions
                                                                            }
                                                                            placeholder="Select gender"
                                                                            classNamePrefix="react-select"
                                                                            value={
                                                                                selectedGender
                                                                            }
                                                                            onChange={value => {
                                                                                setFieldValue(
                                                                                    field.name,
                                                                                    value.value
                                                                                );
                                                                                setSelectedGender(
                                                                                    value
                                                                                );
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Field>
                                                                <FormError
                                                                    error={
                                                                        errors.gender
                                                                    }
                                                                />
                                                            </Form.Group>
                                                            <Form.Group
                                                                className={
                                                                    'mb-3'
                                                                }
                                                            >
                                                                <Row>
                                                                    <Form.Label>
                                                                        Date of
                                                                        Birth:
                                                                    </Form.Label>
                                                                </Row>
                                                                <Row>
                                                                    <Field name="birth_date">
                                                                        {({
                                                                            field
                                                                        }) => (
                                                                            <DatePicker
                                                                                selected={
                                                                                    date
                                                                                }
                                                                                onChange={date => {
                                                                                    setDate(
                                                                                        date
                                                                                    );
                                                                                    setFieldValue(
                                                                                        field.name,
                                                                                        format(
                                                                                            date,
                                                                                            'yyyy-MM-dd'
                                                                                        )
                                                                                    );
                                                                                }}
                                                                                formatWeekDay={day =>
                                                                                    day.slice(
                                                                                        0,
                                                                                        3
                                                                                    )
                                                                                }
                                                                                className="form-control"
                                                                                dateFormat="MM-dd-yyyy"
                                                                                placeholderText="MM-DD-YYYY"
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </Row>
                                                                <FormError
                                                                    error={
                                                                        errors.birth_date
                                                                    }
                                                                />
                                                            </Form.Group>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col xs={12}>
                                                    <Card className={'pb-3'}>
                                                        <Card.Header>
                                                            <h5 className="mb-0 text-muted">
                                                                Contact
                                                                Information
                                                            </h5>
                                                        </Card.Header>
                                                        <Card.Body className="bg-light pb-0">
                                                            <Form.Group>
                                                                <Form.Label>
                                                                    Email:
                                                                </Form.Label>
                                                                <Field name="email">
                                                                    {({
                                                                        field
                                                                    }) => (
                                                                        <Form.Control
                                                                            type="email"
                                                                            label="Email"
                                                                            name="email"
                                                                            placeholder="Email"
                                                                            errors={
                                                                                errors
                                                                            }
                                                                            formGroupProps={{
                                                                                className:
                                                                                    'mb-3'
                                                                            }}
                                                                            onChange={e => {
                                                                                setFieldValue(
                                                                                    field.name,
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }}
                                                                            value={
                                                                                field.value
                                                                            }
                                                                        />
                                                                    )}
                                                                </Field>
                                                                <FormError
                                                                    error={
                                                                        errors.email
                                                                    }
                                                                />
                                                            </Form.Group>
                                                            <Form.Group>
                                                                <Form.Label>
                                                                    Phone:
                                                                </Form.Label>
                                                                <Field name="number">
                                                                    {({
                                                                        field
                                                                    }) => (
                                                                        <Form.Control
                                                                            type="number"
                                                                            label="Phone"
                                                                            name="number"
                                                                            placeholder={
                                                                                'Phone'
                                                                            }
                                                                            errors={
                                                                                errors
                                                                            }
                                                                            formGroupProps={{
                                                                                className:
                                                                                    'mb-3'
                                                                            }}
                                                                            formControlProps={{
                                                                                className:
                                                                                    'input-spin-none'
                                                                            }}
                                                                            onChange={e =>
                                                                                setFieldValue(
                                                                                    field.name,
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            value={
                                                                                field.value
                                                                            }
                                                                        />
                                                                    )}
                                                                </Field>
                                                                <FormError
                                                                    error={
                                                                        errors.number
                                                                    }
                                                                />
                                                            </Form.Group>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xxl={4} xl={12}>
                                            <Card>
                                                <CardHeader>
                                                    <h5 className="mb-0 text-muted">
                                                        User Status
                                                    </h5>
                                                </CardHeader>
                                                <Card.Body>
                                                    <Form.Group>
                                                        <Field name="is_active">
                                                            {({ field }) => (
                                                                <Form.Switch
                                                                    label="Active"
                                                                    name="is_active"
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    formGroupProps={{
                                                                        className:
                                                                            'mb-3'
                                                                    }}
                                                                    onChange={e =>
                                                                        setFieldValue(
                                                                            field.name,
                                                                            e
                                                                                .target
                                                                                .checked
                                                                        )
                                                                    }
                                                                    value={
                                                                        field.value
                                                                    }
                                                                />
                                                            )}
                                                        </Field>
                                                        <FormError
                                                            error={
                                                                errors.is_active
                                                            }
                                                        />
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Field name="is_staff">
                                                            {({ field }) => (
                                                                <Form.Switch
                                                                    label="Staff"
                                                                    name="is_staff"
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    formGroupProps={{
                                                                        className:
                                                                            'mb-3'
                                                                    }}
                                                                    onChange={e =>
                                                                        setFieldValue(
                                                                            field.name,
                                                                            e
                                                                                .target
                                                                                .checked
                                                                        )
                                                                    }
                                                                    value={
                                                                        field.value
                                                                    }
                                                                />
                                                            )}
                                                        </Field>
                                                        <FormError
                                                            error={
                                                                errors.is_staff
                                                            }
                                                        />
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Field name="is_superuser">
                                                            {({ field }) => (
                                                                <Form.Switch
                                                                    label="Super User"
                                                                    name="is_superuser"
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    formGroupProps={{
                                                                        className:
                                                                            'mb-3'
                                                                    }}
                                                                    onChange={e =>
                                                                        setFieldValue(
                                                                            field.name,
                                                                            e
                                                                                .target
                                                                                .checked
                                                                        )
                                                                    }
                                                                    value={
                                                                        field.value
                                                                    }
                                                                />
                                                            )}
                                                        </Field>
                                                        <FormError
                                                            error={
                                                                errors.is_superuser
                                                            }
                                                        />
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Field name="is_marketplace">
                                                            {({ field }) => (
                                                                <Form.Switch
                                                                    label="Marketplace"
                                                                    name="is_marketplace"
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    formGroupProps={{
                                                                        className:
                                                                            'mb-3'
                                                                    }}
                                                                    onChange={e =>
                                                                        setFieldValue(
                                                                            field.name,
                                                                            e
                                                                                .target
                                                                                .checked
                                                                        )
                                                                    }
                                                                    value={
                                                                        field.value
                                                                    }
                                                                />
                                                            )}
                                                        </Field>
                                                        <FormError
                                                            error={
                                                                errors.is_marketplace
                                                            }
                                                        />
                                                    </Form.Group>
                                                    {values?.is_marketplace && (
                                                        <Form.Group>
                                                            <Field name="marketplace">
                                                                {({
                                                                    field
                                                                }) => (
                                                                    <Select
                                                                        options={
                                                                            marketplaceOptions
                                                                        }
                                                                        onMenuScrollToBottom={e => {
                                                                            console.log(
                                                                                e
                                                                            );
                                                                            setCurrentPage(
                                                                                page =>
                                                                                    page +
                                                                                    1
                                                                            );
                                                                        }}
                                                                        onInputChange={e => {
                                                                            marketplaceQuery.set(
                                                                                'search',
                                                                                e
                                                                            );
                                                                            getMarketplaces(
                                                                                marketplaceQuery
                                                                            ).catch(
                                                                                () => {}
                                                                            );
                                                                        }}
                                                                        placeholder="Select marketplace"
                                                                        classNamePrefix="react-select"
                                                                        value={
                                                                            selectedMarketplace
                                                                        }
                                                                        onChange={value => {
                                                                            setFieldValue(
                                                                                field.name,
                                                                                value.value
                                                                            );
                                                                            setSelectedMarketplace(
                                                                                value
                                                                            );
                                                                        }}
                                                                    />
                                                                )}
                                                            </Field>
                                                            <FormError
                                                                error={
                                                                    errors.marketplace
                                                                }
                                                            />
                                                        </Form.Group>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                            <Card className={'mt-3'}>
                                                <CardHeader>
                                                    <h5 className="mb-0 text-muted">
                                                        Groups & Permissions
                                                    </h5>
                                                </CardHeader>
                                                <Card.Body>
                                                    <Form.Group>
                                                        <Form.Label>
                                                            Groups
                                                        </Form.Label>
                                                        <Field name={'groups'}>
                                                            {({
                                                                field,
                                                                form
                                                            }) => (
                                                                <Select
                                                                    options={
                                                                        groupOptions
                                                                    }
                                                                    placeholder="Select groups"
                                                                    isMulti
                                                                    classNamePrefix="react-select"
                                                                    value={
                                                                        selectedGroups
                                                                    }
                                                                    onChange={selectedOptions => {
                                                                        const values =
                                                                            selectedOptions.map(
                                                                                option =>
                                                                                    option.value
                                                                            );
                                                                        form.setFieldValue(
                                                                            field.name,
                                                                            values
                                                                        );
                                                                        setSelectedGroups(
                                                                            selectedOptions
                                                                        );
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                        <FormError
                                                            error={
                                                                errors.groups
                                                            }
                                                        />
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Form.Label>
                                                            Permissions
                                                        </Form.Label>
                                                        <Field
                                                            name={
                                                                'user_permissions'
                                                            }
                                                        >
                                                            {({
                                                                field,
                                                                form
                                                            }) => (
                                                                <Select
                                                                    options={
                                                                        permissionOptions
                                                                    }
                                                                    placeholder="Select permissions"
                                                                    isMulti
                                                                    classNamePrefix="react-select"
                                                                    value={
                                                                        selectedPermissions
                                                                    }
                                                                    onChange={selectedOptions => {
                                                                        const values =
                                                                            selectedOptions.map(
                                                                                option =>
                                                                                    option.value
                                                                            );
                                                                        form.setFieldValue(
                                                                            field.name,
                                                                            values
                                                                        );
                                                                        setSelectedPermissions(
                                                                            selectedOptions
                                                                        );
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                        <FormError
                                                            error={
                                                                errors.user_permissions
                                                            }
                                                        />
                                                    </Form.Group>
                                                </Card.Body>
                                            </Card>
                                            <Card className={'mt-3'}>
                                                <CardHeader>
                                                    <h5 className="mb-0 text-muted">
                                                        Password
                                                    </h5>
                                                </CardHeader>
                                                <Card.Body>
                                                    <Form.Group>
                                                        <Form.Label>
                                                            Password
                                                        </Form.Label>
                                                        <Field
                                                            name={'password'}
                                                        >
                                                            {({ field }) => (
                                                                <Form.Control
                                                                    type="password"
                                                                    label="Password"
                                                                    name="password"
                                                                    placeholder={
                                                                        'Password'
                                                                    }
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    formGroupProps={{
                                                                        className:
                                                                            'mb-3'
                                                                    }}
                                                                    formControlProps={{
                                                                        className:
                                                                            'input-spin-none'
                                                                    }}
                                                                    onChange={e =>
                                                                        setFieldValue(
                                                                            field.name,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    value={
                                                                        field.value
                                                                    }
                                                                />
                                                            )}
                                                        </Field>
                                                        <FormError
                                                            error={
                                                                errors.password
                                                            }
                                                        />
                                                    </Form.Group>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Form>

                                <Card>
                                    <CardHeader>
                                        <Flex
                                            justifyContent={'end'}
                                            wrap={'wrap'}
                                        >
                                            <IconButton
                                                icon={faSave}
                                                onClick={e =>
                                                    handleSubmit(e, values)
                                                }
                                            >
                                                <span className="d-none d-sm-inline-block ms-1">
                                                    Save
                                                </span>
                                            </IconButton>
                                        </Flex>
                                    </CardHeader>
                                </Card>
                            </>
                        )}
                    </Formik>
                </>
            )}
        </Fragment>
    );
};
