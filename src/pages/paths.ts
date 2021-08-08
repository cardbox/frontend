export const paths = {
  home: () => '/',
  /** @test */
  comments: () => '/comments',
  card: (cardId: string) => `/card/${cardId}`,
  cardEdit: (cardId: string) => `/card/${cardId}/edit`,
  cardCreate: () => `/card/new`,
  user: (username: string) => `/u/${username}`,
  search: (query = '') => {
    if (query) return `/search?query=${query}`;
    return '/search';
  },
  /**
   * @example
   * user: (username = ':username') => `/@${username}`,
   */
};
