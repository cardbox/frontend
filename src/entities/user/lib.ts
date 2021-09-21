interface Named {
  firstName: string;
  lastName: string;
}

export function getFullName({ firstName, lastName }: Named) {
  return `${firstName}\u00A0${lastName}`;
}
