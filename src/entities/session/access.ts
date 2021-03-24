import { Policy, Rule, Schema, check } from 'can-you';

export type ActionName = 'edit' | 'view' | 'create' | 'delete' | 'archive';
export type ResourceType = 'card' | 'user';

const cardOwnerCan: Rule = {
  rule: {
    name: 'Only owner can',
    target: {
      notEqual: { attr1: 'resource.owner.id', attr2: 'subject.id' },
    },
    effect: 'DENY',
  },
};

const cardEdit: Policy = {
  policy: {
    name: 'Edit card',
    target: {
      equal: { attr: 'action.name', value: 'edit' },
    },
    permitUnlessDeny: [
      cardOwnerCan,
      {
        rule: {
          name: 'Archived card cannot be edited',
          target: {
            equal: { attr: 'resource.archived', value: 'true' },
          },
          effect: 'DENY',
        },
      },
    ],
  },
};

const cardArchive: Policy = {
  policy: {
    name: 'Archive card',
    target: {
      equal: { attr: 'action.name', value: 'archive' },
    },
    permitUnlessDeny: [
      cardOwnerCan,
      {
        rule: {
          name: 'Archived card cannot be archived again',
          target: {
            equal: { attr: 'resource.archived', value: 'true' },
          },
          effect: 'DENY',
        },
      },
    ],
  },
};

const cardDelete: Policy = {
  policy: {
    name: 'Delete card',
    target: {
      equal: { attr: 'action.name', value: 'delete' },
    },
    permitUnlessDeny: [
      cardOwnerCan,
      {
        rule: {
          name: 'Saved card cannot be deleted',
          target: {
            greaterThan: { attr: 'resource.savedCount', value: '0' },
          },
          effect: 'DENY',
        },
      },
    ],
  },
};

const schema: Schema = {
  attributes: {
    'resource.id': 'String',
    'resource.owner.id': 'String',
    'resource.type': 'String', // card | user
    'resource.archived': 'Boolean',
    'resource.savedCount': 'Int',
    'subject.id': 'String',
    'action.name': 'String', // edit | view | create | delete | archive
  },
  globalPolicy: {
    firstApplicable: [
      {
        policy: {
          name: 'Check for cards',
          target: {
            equal: { attr: 'resource.type', value: 'card' },
          },
          denyUnlessPermit: [cardEdit, cardArchive, cardDelete],
        },
      },
    ],
  },
};

interface Context {
  resource: { type: ResourceType; [x: string]: unknown };
  action: { name: ActionName };
  subject: Record<string, unknown>;
}

export function can(attributes: Context): 'PERMIT' | 'DENY' | 'NOT_APPLICABLE' {
  const context = flattenAttributes(attributes as any);
  return check(context, schema);
}

interface AttributesObjects {
  [key: string]: string | number | boolean | AttributesObjects;
}

export function flattenAttributes(
  attributes: AttributesObjects,
  parentKey?: string,
): Record<string, string> {
  const map = {};
  for (const key in attributes) {
    const resultKey = parentKey ? `${parentKey}.${key}` : key;
    const value = attributes[key];
    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(map, flattenAttributes(value, resultKey));
    } else {
      map[resultKey] = String(attributes[key]);
    }
  }
  return map;
}
