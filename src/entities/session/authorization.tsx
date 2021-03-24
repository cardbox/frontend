import React from 'react';
import { useStore } from 'effector-react/ssr';

import { $session } from './model';
import { ActionName, ResourceType, can } from './access';

interface Props {
  action: { name: ActionName };
  resource: { type: ResourceType; id: string };
}

export const Can: React.FC<Props> = ({ action, resource, children }) => {
  const user = useStore($session);
  const allowed = React.useMemo(() => {
    const subject = user ? { id: user.id } : { id: '00000000-0000-0000-0000-000000000000' }; // null object
    return can({ action, resource, subject }) === 'PERMIT';
  }, [user, action.name, resource.type, resource.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{allowed ? children : null}</>;
};
