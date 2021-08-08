import { viewer } from '@box/api/mock/fixtures';

export function isViewerById(userId: string): boolean {
  return viewer.id === userId;
}
