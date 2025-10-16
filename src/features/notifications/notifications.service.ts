import * as repo from "./notifications.repo";

export async function get_noti(trip_id: number, limit: number) {
  return repo.get_noti(trip_id, limit);
}

export async function post_noti(trip_id: number, noti_title: string, noti_text: string, noti_date: Date, noti_time: string) {
  return repo.post_noti(trip_id, noti_title, noti_text, noti_date, noti_time);
}

export async function current_noti(user_id: string, trip_id: number) {
  return repo.current_noti(user_id, trip_id);
}