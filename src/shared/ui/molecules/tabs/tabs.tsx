import React from 'react';
import styled from 'styled-components';

import { TabTitle } from './title';

interface TabProps {
  children: React.ReactElement[];
}

const Tabs: React.FC<TabProps> = ({ children }) => {
  const [activeTab, setActiveTab] = React.useState(0);
  return (
    <>
      <Ul>
        {children.map((item, index) => (
          <TabTitle
            // no need to handle index issue here
            // eslint-disable-next-line react/jsx-key,react/no-array-index-key
            key={index}
            isVisible={item.props.isVisible}
            title={item.props.label}
            index={index}
            active={activeTab}
            setSelectedTab={setActiveTab}
          />
        ))}
      </Ul>
      {children[activeTab]}
    </>
  );
};

const Ul = styled.ul`
  list-style: none;
  display: flex;
  padding-left: 0;
  margin: 0 0 20px;
`;

export { Tabs };
