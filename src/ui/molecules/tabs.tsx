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
            key={index}
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
`;

export { Tabs };
