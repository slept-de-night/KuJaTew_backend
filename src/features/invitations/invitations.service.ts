import * as repo from "./invitations.repo";

export async function invite(inviter_user_id: string, trip_id: number, invited_user_name: string) {
  return repo.invite(inviter_user_id, trip_id, invited_user_name);
}

export async function code_join(user_id: string, trip_code: string, trip_password: string) {
  return repo.code_join(user_id, trip_code, trip_password);
}

export async function accept_invite(trip_id: number, user_id: string) {
  return repo.accept_invite(trip_id, user_id);
}

export async function reject_invite(trip_id: number, user_id: string) {
  return repo.reject_invite(trip_id, user_id);
}