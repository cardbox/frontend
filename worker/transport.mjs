import { Writable } from 'stream';

export default () => {
  return new Writable({
    write(chunk, encoding, callback) {
      callback();
    },
  });
};
