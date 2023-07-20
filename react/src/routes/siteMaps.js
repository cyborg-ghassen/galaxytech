import {
  faLayerGroup,
  faLocationArrow,
  faMoneyBill,
  faPersonBooth,
  faShoppingCart,
  faTruckMoving,
  faTruckPickup,
  faUserTie
} from '@fortawesome/free-solid-svg-icons';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';

export const dashboardRoutes = {
  label: 'Dashboard',
  labelDisable: true,
  children: [
    {
      name: 'Dashboard',
      active: true,
      icon: 'chart-pie',
      to: '/'
    }
  ]
};
export const appRoutes = {
  label: 'app',
  children: [
    {
      name: 'Accounts',
      icon: faUserTie,
      active: true,
      children: [
        {
          name: 'Users',
          icon: 'user',
          to: '/accounts/user',
          active: true
        },
        {
          name: 'Groups',
          icon: 'users',
          to: '/accounts/group',
          active: true
        }
      ]
    },
    {
      name: 'Logistics',
      icon: faTruckPickup,
      active: true,
      children: [
        {
          name: 'Carriers',
          icon: faTruckMoving,
          to: '/logistics/carrier',
          active: true
        },
        {
          name: 'Addresses',
          icon: faLocationArrow,
          to: '/logistics/address',
          active: true
        }
      ]
    },
    {
      name: 'Products',
      icon: faProductHunt,
      to: '/e-commerce/product/product-list',
      active: true
    },
    {
      name: 'Orders',
      icon: faLayerGroup,
      active: true,
      to: '/e-commerce/orders/order-list'
    },
    {
      name: 'Marketplace',
      icon: faShoppingCart,
      to: '/e-commerce/customers',
      active: true
    },
    {
      name: 'Finance',
      icon: faMoneyBill,
      to: '/e-commerce/customers',
      active: true
    },
    {
      name: 'Customers',
      icon: faPersonBooth,
      to: '/e-commerce/customers',
      active: true
    }
  ]
};

export default [dashboardRoutes, appRoutes];
