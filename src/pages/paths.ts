export const paths = {
  home: () => '/',
  /** @test */
  comments: () => '/comments',
  card: (cardId: string) => `/card/${cardId}`,
  user: () => '/user',
  author: (username: string) => `/user/${username}`,
  search: (query = '') => {
    if (query) return `/search?query=${query}`;
    return '/search';
  },
  /**
   * @example
   * user: (username = ':username') => `/@${username}`,
   */
};
