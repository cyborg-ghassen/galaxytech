import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import team3 from 'assets/img/team/3.jpg';
import Avatar from 'components/common/Avatar';
import { api } from '../../../utils/api';
import AppContext from '../../../context/Context';
import { toast } from 'react-toastify';

const ProfileDropdown = () => {
  const { setConfig } = useContext(AppContext);
  const handleLogout = async () => {
    await api
      .post('/account/logout/')
      .then(() => {
        setConfig('isAuthenticated', false);
        toast.success('Logout successful.', { theme: 'colored' });
      })
      .catch(reason =>
        toast.error(`An error has occurred. ${reason.toString()}`, {
          theme: 'colored'
        })
      );
  };
  return (
    <Dropdown navbar={true} as="li">
      <Dropdown.Toggle
        bsPrefix="toggle"
        as={Link}
        to="#!"
        className="pe-0 ps-2 nav-link"
      >
        <Avatar src={team3} />
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-caret dropdown-menu-card  dropdown-menu-end">
        <div className="bg-white rounded-2 py-2 dark__bg-1000">
          <Dropdown.Item as={Link} to="/user/profile">
            Profile &amp; account
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item as={Link} to="/user/settings">
            Settings
          </Dropdown.Item>
          <Dropdown.Item
            as={Link}
            onClick={handleLogout}
            to="/authentication/card/logout"
          >
            Logout
          </Dropdown.Item>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;
