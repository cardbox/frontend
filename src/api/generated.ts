import * as typed from 'typed-contracts';
// Cardbox API Internal 0.1.0
// ---
// This file is automatically generated by openapi with preset effector-openapi-preset
// Do not edit this file directly. Instead open openapi config file and follow the link in "file"
import { createEffect } from 'effector-root';

import { requestClient } from './request/client';

//#region prebuilt code
const custom = { any: (valueName: string, value: unknown): any => value };

export type GenericErrors =
  | {
      status: 'unexpected';
      error: Error;
    }
  | {
      status: 'unknown_status';
      error: { status: number; body: unknown };
    }
  | {
      status: 'validation_error';
      error: typed.ValidationError;
    };

type ErrorCodes =
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 500
  | 501
  | 502
  | 503
  | 503
  | 505;
/**
 * @throws
 */
function parseByStatus<
  Variants extends string,
  Contracts extends Record<number, [Variants, typed.Contract<any>]>,
  Result extends {
    [Code in keyof Contracts]: Contracts[Code] extends [
      infer Status,
      typed.Contract<infer T>,
    ]
      ? { status: Status; answer: T }
      : never;
  },
>(
  name: string,
  response: { status: number; body?: unknown },
  contracts: Contracts,
): Result[Exclude<keyof Result, ErrorCodes>] {
  const contractObject = contracts[response.status];
  if (!contractObject) {
    throw {
      status: 'unknown_status',
      error: {
        status: response.status,
        body: response.body,
      },
    };
  }
  const [status, contract] = contractObject;
  const answer = contract(name, response.body);
  if (answer instanceof typed.ValidationError) {
    throw { status: 'validation_error', error: answer };
  }
  if (response.status >= 400) {
    throw { status, error: answer };
  }
  return { status, answer } as Result[Exclude<keyof Result, ErrorCodes>];
}

//#endregion prebuilt code/* --- */
//#region authDone
export type AuthDone = {
  body?: {
    /* Authorization code */
    authorizationCode?: string;
  };
};
export const authDoneOk = typed.object({
  user: typed.object({
    id: typed.string,
    firstName: typed.string,
    lastName: typed.string,
  }),
});
export type AuthDoneDone = {
  status: 'ok';
  answer: typed.Get<typeof authDoneOk>;
};

/* Failed to authorize */
export const authDoneUnauthorized = typed.object({
  error: typed.union('accesso_failed', 'try_later'),
});

/* Something went wrong */
export const authDoneInternalServerError = typed.nul;
export type AuthDoneFail =
  | {
      status: 'unauthorized';
      error: typed.Get<typeof authDoneUnauthorized>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof authDoneInternalServerError>;
    }
  | GenericErrors;

/* Redirect endpoint */
export const authDone = createEffect<AuthDone, AuthDoneDone, AuthDoneFail>({
  async handler({ body }) {
    const name = 'authDone.body';
    const response = await requestClient({
      path: '/accesso/auth.done',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      200: ['ok', authDoneOk],
      401: ['unauthorized', authDoneUnauthorized],
      500: ['internal_server_error', authDoneInternalServerError],
    });
  },
});
//#endregion authDone

/* --- */
//#region authParams
export type AuthParams = {
  body?: {
    /* oauth state */
    state?: string;
  };
};
export const authParamsOk = typed.object({
  /* Accesso Url */
  accessoUrl: typed.string,
});
export type AuthParamsDone = {
  status: 'ok';
  answer: typed.Get<typeof authParamsOk>;
};

/* SERVER_ERROR */
export const authParamsInternalServerError = typed.nul;
export type AuthParamsFail =
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof authParamsInternalServerError>;
    }
  | GenericErrors;

/* Get accesso auth url */
export const authParams = createEffect<
  AuthParams,
  AuthParamsDone,
  AuthParamsFail
>({
  async handler({ body }) {
    const name = 'authParams.body';
    const response = await requestClient({
      path: '/accesso/auth.params',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      200: ['ok', authParamsOk],
      500: ['internal_server_error', authParamsInternalServerError],
    });
  },
});
//#endregion authParams

/* --- */
//#region cardsSearch
export type CardsSearch = {
  body?: {
    /* Search term */
    query: string;
  };
};

/* OK */
export const cardsSearchOk = typed.object({
  cards: typed.array(
    typed.object({
      id: typed.string,
      title: typed.string,
      content: typed.object({}),
      createdAt: typed.string,
      updatedAt: typed.string,

      /* Author user uuid */
      authorId: typed.string.optional,

      /* Later, we can create `Tag` entity */
      tags: typed.array(typed.string),

      /* Later, we can add this field
       * For custom text-overflow (instead of truncating with emphasizing) */
      summary: typed.string.maybe,
    }),
  ),
  users: typed.array(
    typed.object({
      /* ID */
      id: typed.string,
      username: typed.string,
      firstName: typed.string,
      lastName: typed.string,
      bio: typed.string.maybe,

      /* Later, can implement as `File` entity */
      avatar: typed.string.maybe,
      socials: typed.object({
        github: typed.string.maybe,
        devto: typed.string.maybe,
        twitter: typed.string.maybe,
      }).optional,

      /* Later, can implement as `Work` entity */
      work: typed.string.maybe,

      /* Later, can implement checking user permissions by `Role` entity */
      roles: typed.array(typed.string).maybe,
    }),
  ),
  total: typed.number,
});
export type CardsSearchDone = {
  status: 'ok';
  answer: typed.Get<typeof cardsSearchOk>;
};

/* Server error */
export const cardsSearchInternalServerError = typed.nul;
export type CardsSearchFail =
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof cardsSearchInternalServerError>;
    }
  | GenericErrors;

/* Full text search of cards
 * - `POST /api/internal/cards.search '{"search": SEARCH_TERM}'`
 * - By title, content, tags (and maybe by author) */
export const cardsSearch = createEffect<
  CardsSearch,
  CardsSearchDone,
  CardsSearchFail
>({
  async handler({ body }) {
    const name = 'cardsSearch.body';
    const response = await requestClient({
      path: '/cards.search',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      200: ['ok', cardsSearchOk],
      500: ['internal_server_error', cardsSearchInternalServerError],
    });
  },
});
//#endregion cardsSearch

/* --- */
//#region cardsList
export type CardsList = {
  body?: {
    /* Author id */
    authorId?: string;
  };
};

/* OK */
export const cardsListOk = typed.object({
  cards: typed.array(
    typed.object({
      id: typed.string,
      title: typed.string,
      content: typed.object({}),
      createdAt: typed.string,
      updatedAt: typed.string,

      /* Author user uuid */
      authorId: typed.string.optional,

      /* Later, we can create `Tag` entity */
      tags: typed.array(typed.string),

      /* Later, we can add this field
       * For custom text-overflow (instead of truncating with emphasizing) */
      summary: typed.string.maybe,
    }),
  ),
  total: typed.number,
});
export type CardsListDone = {
  status: 'ok';
  answer: typed.Get<typeof cardsListOk>;
};

/* CLIENT_ERROR */
export const cardsListBadRequest = typed.object({
  error: typed.boolean,
  code: typed.union('invalid_params', 'unauthorized'),
});

/* SERVER_ERROR */
export const cardsListInternalServerError = typed.nul;
export type CardsListFail =
  | {
      status: 'bad_request';
      error: typed.Get<typeof cardsListBadRequest>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof cardsListInternalServerError>;
    }
  | GenericErrors;

/* 1. **Personal cards**
 * - `POST /api/v1/card/list`
 * 2. **Cards of user**
 * - `POST /api/v1/card/list '{"authorId": USER_ID}'`
 *
 * - `TODO:` Add pagination later
 *
 * - `TODO:` Maybe there is should be OData-like format instead of partial params
 *
 * - `TODO:` Add later access control for card by it's visibilty and user permissions */
export const cardsList = createEffect<CardsList, CardsListDone, CardsListFail>({
  async handler({ body }) {
    const name = 'cardsList.body';
    const response = await requestClient({
      path: '/cards.list',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      200: ['ok', cardsListOk],
      400: ['bad_request', cardsListBadRequest],
      500: ['internal_server_error', cardsListInternalServerError],
    });
  },
});
//#endregion cardsList

/* --- */
//#region cardsGet
export type CardsGet = {
  body?: {
    cardId: string;
  };
};

/* OK */
export const cardsGetOk = typed.object({
  card: typed.object({
    id: typed.string,
    title: typed.string,
    content: typed.object({}),
    createdAt: typed.string,
    updatedAt: typed.string,

    /* Author user uuid */
    authorId: typed.string.optional,

    /* Later, we can create `Tag` entity */
    tags: typed.array(typed.string),

    /* Later, we can add this field
     * For custom text-overflow (instead of truncating with emphasizing) */
    summary: typed.string.maybe,
  }),
});
export type CardsGetDone = {
  status: 'ok';
  answer: typed.Get<typeof cardsGetOk>;
};

/* CLIENT_ERROR */
export const cardsGetBadRequest = typed.object({
  error: typed.boolean,
  code: typed.union('card_not_found'),
});

/* SERVER_ERROR */
export const cardsGetInternalServerError = typed.nul;
export type CardsGetFail =
  | {
      status: 'bad_request';
      error: typed.Get<typeof cardsGetBadRequest>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof cardsGetInternalServerError>;
    }
  | GenericErrors;
export const cardsGet = createEffect<CardsGet, CardsGetDone, CardsGetFail>({
  async handler({ body }) {
    const name = 'cardsGet.body';
    const response = await requestClient({
      path: '/cards.get',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      200: ['ok', cardsGetOk],
      400: ['bad_request', cardsGetBadRequest],
      500: ['internal_server_error', cardsGetInternalServerError],
    });
  },
});
//#endregion cardsGet

/* --- */
//#region cardsCreate
export type CardsCreate = {
  body?: {
    title: string;
    content: {};
    tags?: string[];
  };
};

/* Ok */
export const cardsCreateOk = typed.object({
  card: typed.object({
    id: typed.string,
    title: typed.string,
    content: typed.object({}),
    createdAt: typed.string,
    updatedAt: typed.string,

    /* Author user uuid */
    authorId: typed.string.optional,

    /* Later, we can create `Tag` entity */
    tags: typed.array(typed.string),

    /* Later, we can add this field
     * For custom text-overflow (instead of truncating with emphasizing) */
    summary: typed.string.maybe,
  }),
});
export type CardsCreateDone = {
  status: 'ok';
  answer: typed.Get<typeof cardsCreateOk>;
};

/* CLIENT_ERROR */
export const cardsCreateBadRequest = typed.object({
  error: typed.union('empty_title', 'invalid_content'),
});

/* SERVER_ERROR */
export const cardsCreateInternalServerError = typed.nul;
export type CardsCreateFail =
  | {
      status: 'bad_request';
      error: typed.Get<typeof cardsCreateBadRequest>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof cardsCreateInternalServerError>;
    }
  | GenericErrors;
export const cardsCreate = createEffect<
  CardsCreate,
  CardsCreateDone,
  CardsCreateFail
>({
  async handler({ body }) {
    const name = 'cardsCreate.body';
    const response = await requestClient({
      path: '/cards.create',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      200: ['ok', cardsCreateOk],
      400: ['bad_request', cardsCreateBadRequest],
      500: ['internal_server_error', cardsCreateInternalServerError],
    });
  },
});
//#endregion cardsCreate

/* --- */
//#region cardsEdit
export type CardsEdit = {
  body?: {
    cardId: string;
    title?: string;
    content?: {};
    tags?: string[];
  };
};

/* OK */
export const cardsEditOk = typed.object({
  card: typed.object({
    id: typed.string,
    title: typed.string,
    content: typed.object({}),
    createdAt: typed.string,
    updatedAt: typed.string,

    /* Author user uuid */
    authorId: typed.string.optional,

    /* Later, we can create `Tag` entity */
    tags: typed.array(typed.string),

    /* Later, we can add this field
     * For custom text-overflow (instead of truncating with emphasizing) */
    summary: typed.string.maybe,
  }),
});
export type CardsEditDone = {
  status: 'ok';
  answer: typed.Get<typeof cardsEditOk>;
};

/* CLIENT_ERROR */
export const cardsEditBadRequest = typed.object({
  error: typed.union('card_not_found', 'invalid_payload', 'no_access'),
});

/* SERVER_ERROR */
export const cardsEditInternalServerError = typed.nul;
export type CardsEditFail =
  | {
      status: 'bad_request';
      error: typed.Get<typeof cardsEditBadRequest>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof cardsEditInternalServerError>;
    }
  | GenericErrors;

/* `IMPORTANT:` There is should be check that user has required permissions for editing card
 * - **For prototype**: that he is card's author */
export const cardsEdit = createEffect<CardsEdit, CardsEditDone, CardsEditFail>({
  async handler({ body }) {
    const name = 'cardsEdit.body';
    const response = await requestClient({
      path: '/cards.edit',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      200: ['ok', cardsEditOk],
      400: ['bad_request', cardsEditBadRequest],
      500: ['internal_server_error', cardsEditInternalServerError],
    });
  },
});
//#endregion cardsEdit

/* --- */
//#region cardsDelete
export type CardsDelete = {
  body?: {
    cardId: string;
  };
};

/* OK */
export const cardsDeleteOk = typed.object({
  cardId: typed.string,
});
export type CardsDeleteDone = {
  status: 'ok';
  answer: typed.Get<typeof cardsDeleteOk>;
};

/* CLIENT_ERROR */
export const cardsDeleteBadRequest = typed.object({
  error: typed.union('card_not_found', 'no_access'),
});

/* SERVER_ERROR */
export const cardsDeleteInternalServerError = typed.nul;
export type CardsDeleteFail =
  | {
      status: 'bad_request';
      error: typed.Get<typeof cardsDeleteBadRequest>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof cardsDeleteInternalServerError>;
    }
  | GenericErrors;
export const cardsDelete = createEffect<
  CardsDelete,
  CardsDeleteDone,
  CardsDeleteFail
>({
  async handler({ body }) {
    const name = 'cardsDelete.body';
    const response = await requestClient({
      path: '/cards.delete',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      200: ['ok', cardsDeleteOk],
      400: ['bad_request', cardsDeleteBadRequest],
      500: ['internal_server_error', cardsDeleteInternalServerError],
    });
  },
});
//#endregion cardsDelete

/* --- */
//#region cardsSave
export type CardsSave = {
  body?: {
    cardId: string;
  };
};

/* OK */
export const cardsSaveOk = typed.object({
  card: typed.object({
    id: typed.string,
    title: typed.string,
    content: typed.object({}),
    createdAt: typed.string,
    updatedAt: typed.string,

    /* Author user uuid */
    authorId: typed.string.optional,

    /* Later, we can create `Tag` entity */
    tags: typed.array(typed.string),

    /* Later, we can add this field
     * For custom text-overflow (instead of truncating with emphasizing) */
    summary: typed.string.maybe,
  }),
  boxId: typed.string,
});
export type CardsSaveDone = {
  status: 'ok';
  answer: typed.Get<typeof cardsSaveOk>;
};

/* CLIENT_ERROR */
export const cardsSaveBadRequest = typed.object({
  error: typed.boolean,
  code: typed.union('already_saved', 'card_not_found', 'no_access'),
});

/* SERVER_ERROR */
export const cardsSaveInternalServerError = typed.nul;
export type CardsSaveFail =
  | {
      status: 'bad_request';
      error: typed.Get<typeof cardsSaveBadRequest>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof cardsSaveInternalServerError>;
    }
  | GenericErrors;
export const cardsSave = createEffect<CardsSave, CardsSaveDone, CardsSaveFail>({
  async handler({ body }) {
    const name = 'cardsSave.body';
    const response = await requestClient({
      path: '/cards.save',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      200: ['ok', cardsSaveOk],
      400: ['bad_request', cardsSaveBadRequest],
      500: ['internal_server_error', cardsSaveInternalServerError],
    });
  },
});
//#endregion cardsSave

/* --- */
//#region sessionGet
export type SessionGet = {};

/* Session exists */
export const sessionGetOk = typed.object({
  user: typed.object({
    id: typed.string,
    firstName: typed.string,
    lastName: typed.string,
  }),
});
export type SessionGetDone = {
  status: 'ok';
  answer: typed.Get<typeof sessionGetOk>;
};

/* User not authorized */
export const sessionGetUnauthorized = typed.nul;

/* Something went wrong */
export const sessionGetInternalServerError = typed.nul;
export type SessionGetFail =
  | {
      status: 'unauthorized';
      error: typed.Get<typeof sessionGetUnauthorized>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof sessionGetInternalServerError>;
    }
  | GenericErrors;

/* Read session token and show current session. Authenticated checked by session-token cookie */
export const sessionGet = createEffect<
  SessionGet,
  SessionGetDone,
  SessionGetFail
>({
  async handler() {
    const name = 'sessionGet.body';
    const response = await requestClient({
      path: '/session/get',
      method: 'POST',
    });
    return parseByStatus(name, response, {
      200: ['ok', sessionGetOk],
      401: ['unauthorized', sessionGetUnauthorized],
      500: ['internal_server_error', sessionGetInternalServerError],
    });
  },
});
//#endregion sessionGet

/* --- */
//#region sessionDelete
export type SessionDelete = {
  body: {
    deleteAllSessions: boolean;
  };
};

/* session deleted */
export const sessionDeleteOk = typed.nul;
export type SessionDeleteDone = {
  status: 'ok';
  answer: typed.Get<typeof sessionDeleteOk>;
};

/* failed to delete session */
export const sessionDeleteBadRequest = typed.object({
  error: typed.union('invalid_payload'),
});

/* User not authorized */
export const sessionDeleteUnauthorized = typed.nul;

/* Something went wrong */
export const sessionDeleteInternalServerError = typed.nul;
export type SessionDeleteFail =
  | {
      status: 'bad_request';
      error: typed.Get<typeof sessionDeleteBadRequest>;
    }
  | {
      status: 'unauthorized';
      error: typed.Get<typeof sessionDeleteUnauthorized>;
    }
  | {
      status: 'internal_server_error';
      error: typed.Get<typeof sessionDeleteInternalServerError>;
    }
  | GenericErrors;

/* Delete current or all sessions */
export const sessionDelete = createEffect<
  SessionDelete,
  SessionDeleteDone,
  SessionDeleteFail
>({
  async handler({ body }) {
    const name = 'sessionDelete.body';
    const response = await requestClient({
      path: '/session/delete',
      method: 'POST',
      body,
    });
    return parseByStatus(name, response, {
      200: ['ok', sessionDeleteOk],
      400: ['bad_request', sessionDeleteBadRequest],
      401: ['unauthorized', sessionDeleteUnauthorized],
      500: ['internal_server_error', sessionDeleteInternalServerError],
    });
  },
});
//#endregion sessionDelete
