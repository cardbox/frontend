import Tippy from '@tippyjs/react';
import { useUnit } from 'effector-react/scope';
import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Instance } from 'tippy.js';

import { getFullName } from '@box/entities/user/lib';

import { imgLogo } from '@box/shared/assets';
import { routes } from '@box/shared/routes';
import { Avatar } from '@box/shared/ui';

import { SignInButton } from '../atoms';
import { $session, forceLogout } from '../model';
import { ShowOnly } from './show-only';

enum ItemOption {
  PROFILE = 'PROFILE',
  LOGOUT = 'LOGOUT',
}

// FIXME: move to features
export const SessionPanel = () => {
  return (
    <>
      <ShowOnly when="authorized">
        <Viewer />
      </ShowOnly>
      <ShowOnly when="anonymous">
        <SignInButton />
      </ShowOnly>
    </>
  );
};

const Viewer = () => {
  const [instance, setInstance] = useState<Instance | null>(null);
  const viewer = useUnit($session);
  const handlers = useUnit({
    openUserPage: routes.user.view.open,
    forceLogout,
  });

  if (!viewer) return null;

  const handleMenuClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    instance?.hide();
    if (!(event.currentTarget instanceof HTMLButtonElement)) {
      return;
    }
    switch (event.currentTarget?.dataset.option) {
      case ItemOption.PROFILE:
        handlers.openUserPage({ username: viewer.id });
        break;
      case ItemOption.LOGOUT:
        handlers.forceLogout();
        break;
      default:
    }
  };

  return (
    <User>
      <Tippy
        placement="bottom"
        appendTo="parent"
        arrow={false}
        trigger="click"
        interactive={true}
        theme="menu menu-light"
        onCreate={setInstance}
        content={
          <MenuContent>
            <MenuItem data-option={ItemOption.PROFILE} onClick={handleMenuClick}>
              Profile
            </MenuItem>
            <MenuItem data-option={ItemOption.LOGOUT} onClick={handleMenuClick}>
              Logout
            </MenuItem>
          </MenuContent>
        }
      >
        <NameWrapper>
          <Avatar size="small" src={viewer.avatar || imgLogo} />
          <Name>{getFullName(viewer)}</Name>
        </NameWrapper>
      </Tippy>
      {/* @ts-ignore */}
      <MenuStyles />
    </User>
  );
};

const NameWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

const MenuContent = styled.div`
  display: flex;
  flex-flow: column wrap;
  background-color: var(--background-color);
  width: 230px;
  padding: 6px;
  font-size: 14px;
  box-sizing: border-box;
  position: relative;
  background-clip: padding-box;
  line-height: 1.4;
  outline: 0;
  transition-property: transform, visibility, opacity;
  color: var(--text-color);
  border: thin solid var(--border-color);
  border-radius: 4px;
  margin-top: -4px;
`;

const MenuItem = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 6px 12px;
  border-radius: 3px;
  cursor: pointer;
  background: inherit;
  border: none;
  font-size: inherit;

  &:hover {
    background: #f8f8fa;
  }
`;

const User = styled.div`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  margin-left: 12px;
`;

const Name = styled.button`
  border: none;
  margin-right: 12px;
  margin-left: 8px;
  background: inherit;
  font-size: 16px;
  cursor: pointer;
`;

export const MenuStyles = createGlobalStyle`
  .tippy-box[data-theme~='menu-light'] {
    --text-color: #1A1A23;
    --background-color: #fff;
    --border-color: #e4e4ea;

    box-shadow: 0 2px 3px #F2F3F5;
  }
`;
