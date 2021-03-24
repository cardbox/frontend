export const paths = {
  home: () => '/',
  /** @test */
  comments: () => '/comments',
  card: (id = ':cardId') => `/card/${id}`,
  user: () => '/user',
  /**
   * @example
   * user: (username = ':username') => `/@${username}`,
   */
};
