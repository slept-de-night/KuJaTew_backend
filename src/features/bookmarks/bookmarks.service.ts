import * as repo from "./bookmarks.repo";

export async function get_place(userId: string) {
  return repo.get_place(userId);
}

export async function add_place(userId: string, placeId: string) {
  return repo.add_place(userId, placeId);
}

export async function remove_place(userId: string, placeId: string) {
  return repo.remove_place(userId, placeId);
}

export async function get_guide(userId: string) {
  return repo.get_guide(userId);
}

export async function add_guide(userId: string, placeId: string) {
  return repo.add_guide(userId, placeId);
}

export async function remove_guide(userId: string, placeId: string) {
  return repo.remove_guide(userId, placeId);
}