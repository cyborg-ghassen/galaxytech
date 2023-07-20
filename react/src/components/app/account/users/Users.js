import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SoftBadge from '../../../common/SoftBadge';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CardDropdown from '../../../common/CardDropdown';
import { Card, Dropdown, Spinner } from 'react-bootstrap';
import AdvanceTable from '../../../common/advance-table/AdvanceTable';
import AdvanceTablePagination from '../../../common/advance-table/AdvanceTablePagination';
import AdvanceTableWrapper from '../../../common/advance-table/AdvanceTableWrapper';
import UsersTableHeader from './UsersTableHeader';
import useQuery from '../../../../hooks/useQuery';
import { getUsers } from '../actions/Users';
import Flex from '../../../common/Flex';
import Avatar from '../../../common/Avatar';
import { formatDateTime } from '../../../../helpers/utils';

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortingField, setSortingField] = useState('created_at'); // Set the initial sorting field
    const [sortingDirection, setSortingDirection] = useState('desc');
    const [count, setCount] = useState(0);
    const [length, setLength] = useState(0);
    const query = useQuery();

    useEffect(() => {
        setLoading(true);
        const sortingParam = `${
            sortingDirection === 'desc' ? '-' : ''
        }${sortingField}`;

        query.set('ordering', sortingParam);

        // Cancel the previous request if it exists
        getUsers(query)
            .then(res => {
                setUsers(res?.results);
                setCount(res.data?.count);
            })
            .catch(() => {});
        setLength(users.length);
        setLoading(false);
    }, [sortingField, sortingDirection]);

    const columns = [
        {
            accessor: 'name',
            Header: 'Name',
            headerProps: { className: 'pe-1' },
            cellProps: {
                className: 'py-2'
            },
            Cell: rowData => {
                const { name, email, avatar, id } = rowData.row.original;
                return (
                    <>
                        <Link to={`/accounts/user/${id}/detail`}>
                            <Flex alignItems="center">
                                {avatar ? (
                                    <Avatar
                                        src={avatar}
                                        rounded={'circle'}
                                        size="4xl"
                                        className="me-2"
                                    />
                                ) : (
                                    <Avatar
                                        size="4xl"
                                        name={name}
                                        rounded={'circle'}
                                        className="me-2"
                                    />
                                )}
                                <div className="flex-1">
                                    <h6
                                        className="mb-0 fs-0"
                                        style={{
                                            width: '200px',
                                            wordWrap: 'break-word',
                                            wordBreak: 'break-all',
                                            whiteSpace: 'pre-wrap'
                                        }}
                                    >
                                        {name}
                                    </h6>
                                    <div style={{ color: 'black' }}>
                                        {email}
                                    </div>
                                </div>
                            </Flex>
                        </Link>
                    </>
                );
            }
        },
        {
            accessor: 'username',
            Header: 'Username',
            headerProps: { className: 'pe-3' }
        },
        {
            accessor: 'number',
            Header: 'Number',
            Cell: rowData => {
                const { number } = rowData.row.original;
                return (
                    <>
                        <p className="mb-0 text-500">{number}</p>
                    </>
                );
            }
        },
        {
            accessor: 'active',
            Header: 'Status',
            headerProps: {
                className: 'text-center'
            },
            cellProps: {
                className: 'fs-0'
            },
            Cell: rowData => {
                const { active } = rowData.row.original;
                return (
                    <SoftBadge
                        pill
                        bg={classNames({
                            success: active,
                            warning: !active
                        })}
                        className="d-flex flex-center"
                    >
                        <p className="mb-0">
                            {active && 'Active'}
                            {!active && 'Inactive'}
                        </p>
                        <FontAwesomeIcon
                            icon={classNames({
                                check: active,
                                ban: !active
                            })}
                            transform="shrink-2"
                            className="ms-1"
                        />
                    </SoftBadge>
                );
            }
        },
        {
            accessor: 'groups_names',
            Header: 'Groups',
            headerProps: {
                className: 'text-center'
            },
            cellProps: {
                className: 'text-center fs-0 py-2'
            },
            Cell: rowData => `${rowData.row.original.groups_names}`
        },
        {
            accessor: 'date',
            Header: 'Date Joined',
            headerProps: {
                className: 'text-center'
            },
            cellProps: {
                className: 'text-center fs-0 py-2'
            },
            Cell: rowData => `${formatDateTime(rowData.row.original.date)}`
        },
        {
            accessor: 'none',
            Header: '',
            disableSortBy: true,
            cellProps: {
                className: 'text-end'
            },
            Cell: rowData => {
                const { id } = rowData.row.original;
                return (
                    <CardDropdown>
                        <div className="py-2">
                            <Dropdown.Item href={`/accounts/user/${id}/edit`}>
                                Edit
                            </Dropdown.Item>
                            <Dropdown.Divider as="div" />
                            <Dropdown.Item href="#!" className="text-danger">
                                Deactivate
                            </Dropdown.Item>
                            <Dropdown.Item href="#!" className="text-danger">
                                Delete
                            </Dropdown.Item>
                        </div>
                    </CardDropdown>
                );
            }
        }
    ];

    const userList = users.map(user => ({
        id: user.id,
        name: user.full_name,
        email: user.email,
        username: user.username,
        number: user.number,
        active: user.is_active,
        avatar: user.avatar,
        groups_names: user.groups_names,
        date: user.date_joined
    }));

    const handleSort = column => {
        if (column.canSort) {
            const { id } = column;
            const isDescending =
                sortingField === id && sortingDirection === 'desc';

            // Update the sorting field and direction
            setSortingField(id);
            setSortingDirection(isDescending ? 'asc' : 'desc');

            // Modify the sorting properties of the column
            column.isSorted = true;
            column.isSortedDesc = isDescending;
            column.sortingDirection = isDescending ? 'asc' : 'desc';
        }
    };

    return (
        <AdvanceTableWrapper
            columns={columns}
            data={userList}
            selection
            pagination
            perPage={20}
        >
            <Card className="mb-3">
                <Card.Header>
                    <UsersTableHeader table />
                </Card.Header>
                <Card.Body className="p-0">
                    {loading ? (
                        <Flex justifyContent="center" className="p-2 mb-2">
                            <Spinner animation={'border'} variant={'primary'} />
                        </Flex>
                    ) : (
                        <AdvanceTable
                            handleSort={handleSort}
                            table
                            headerClassName="bg-200 text-900 text-nowrap align-middle"
                            rowClassName="align-middle white-space-nowrap"
                            tableProps={{
                                size: 'sm',
                                striped: true,
                                className: 'fs--1 mb-0 overflow-hidden'
                            }}
                            headers={columns}
                        />
                    )}
                </Card.Body>
                <Card.Footer>
                    <AdvanceTablePagination
                        query={query}
                        fetch={getUsers}
                        count={count}
                        length={length}
                        itemsPerPage={20}
                    />
                </Card.Footer>
            </Card>
        </AdvanceTableWrapper>
    );
};
