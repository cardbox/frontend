export const paths = {
  home: () => '/',
  /** @test */
  comments: () => '/comments',
  card: (cardId: string) => `/card/${cardId}`,
  user: () => '/user',
  search: (query = '') => {
    if (query) return `/search?query=${query}`;
    return '/search';
  },
  /**
   * @example
   * user: (username = ':username') => `/@${username}`,
   */
};
