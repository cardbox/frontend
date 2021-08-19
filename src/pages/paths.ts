export const paths = {
  home: () => '/',
  /** @test */
  comments: () => '/comments',
  cardView: (cardId = ':cardId') => `/card/${cardId}`,
  cardEdit: (cardId = ':cardId') => `/card/${cardId}/edit`,
  cardCreate: () => `/card/new`,
  oauthDone: () => '/accesso/done',
  user: (username = ':username') => `/u/${username}`,
  search: (query = '') => {
    if (query) return `/search?query=${query}`;
    return '/search';
  },
  /**
   * @example
   * user: (username = ':username') => `/@${username}`,
   */
};
