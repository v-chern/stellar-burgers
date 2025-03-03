import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';
import { TIconTypes } from '@zlden/react-developer-burger-ui-components/dist/ui/icons/utils';
import { useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  const getClassNames = (isActive: boolean, extraClass: string = '') =>
    isActive
      ? `${styles.link} ${styles.link_active} ${extraClass}`
      : `${styles.link} ${extraClass}`;

  const getIconType = (pathname: string, route: string): TIconTypes =>
    pathname === route ? 'primary' : 'secondary';

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink to='/' className={({ isActive }) => getClassNames(isActive)}>
            <BurgerIcon type={getIconType(location.pathname, '/')} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
          <NavLink
            to='/feed'
            className={({ isActive }) => getClassNames(isActive)}
          >
            <ListIcon type={getIconType(location.pathname, '/feed')} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            getClassNames(isActive, styles.link_position_last)
          }
        >
          <ProfileIcon type={getIconType(location.pathname, '/profile')} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};
