type User = import('@box/api').User;

export const getFullName = ({ firstName, lastName }: User) =>
  `${firstName}\u00A0${lastName}`;
