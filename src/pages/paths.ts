export const paths = {
  home: () => '/',
  /** @test */
  comments: () => '/comments',
  card: ({ id } = { id: ':cardId' }) => `/card/${id}`,
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
