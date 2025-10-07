import * as repo from "./flights.repo";

export async function get_flight(trip_id: number) {
  return repo.get_flight(trip_id);
}

export async function delete_flight(user_id: string, trip_id: number, flight_id: number) {
  return repo.delete_flight(user_id, trip_id, flight_id);
}

export type FlightInsert = {
  dep_date:string,
  dep_time:string,
  dep_country:string,
  dep_airp_code:string,
  arr_date:string,
  arr_time:string,
  arr_country:string,
  arr_airp_code:string,
  airl_name:string,
};

export async function post_flight(user_id: string, input: FlightInsert, trip_id: number) {
  return repo.post_flight(user_id, input, trip_id);
}

export async function put_flight(user_id: string, input: FlightInsert, trip_id: number, flight_id: number) {
  return repo.put_flight(user_id, input, trip_id, flight_id);
}