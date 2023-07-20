import React, { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import CardHeader from 'react-bootstrap/CardHeader';
import Flex from '../../../../common/Flex';
import IconButton from '../../../../common/IconButton';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import PersonalForm from '../../../../wizard/PersonalForm';
import { useForm } from 'react-hook-form';

export const NewUser = () => {
    const {
        register,
        formState: { errors },
        setValue
    } = useForm();
    return (
        <Fragment>
            <Card>
                <CardHeader>
                    <Flex justifyContent={'between'} wrap={'wrap'}>
                        <h5 className={'justify-content-start'}>
                            User settings
                        </h5>
                        <IconButton icon={faSave}>
                            <span className="d-none d-sm-inline-block ms-1">
                                Save
                            </span>
                        </IconButton>
                    </Flex>
                </CardHeader>
            </Card>
            <Row>
                <Col md={8}>
                    <Card className="h-100">
                        <Card.Header>
                            <h5 className="mb-0 text-muted">
                                Basic Information
                            </h5>
                        </Card.Header>
                        <Card.Body className="bg-light pb-0">
                            <PersonalForm
                                register={register}
                                errors={errors}
                                setValue={setValue}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card>
                <CardHeader>
                    <Flex justifyContent={'end'} wrap={'wrap'}>
                        <IconButton icon={faSave}>
                            <span className="d-none d-sm-inline-block ms-1">
                                Save
                            </span>
                        </IconButton>
                    </Flex>
                </CardHeader>
            </Card>
        </Fragment>
    );
};
