import { createDomain } from 'effector';
import { debug } from 'patronum/debug';

export const root = createDomain();

debug(root);

export const $pageName = root.createStore('(nothing)');

export const pageNameSet = root.createEvent<string>();

$pageName.on(pageNameSet, (_, pageName) => pageName);
