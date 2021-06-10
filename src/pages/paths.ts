export const paths = {
  home: () => '/',
  /** @test */
  comments: () => '/comments',
  card: () => '/card/:id',
  user: () => '/user',
  /**
   * @example
   * user: (username = ':username') => `/@${username}`,
   */
};
