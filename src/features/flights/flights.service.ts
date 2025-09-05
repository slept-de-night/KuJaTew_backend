import * as repo from "./flights.repo";

export type FlightInput = {
  dep_date: string;        // e.g. "2025-09-05"
  dep_time: string;        // e.g. "08:30:00"
  dep_country: string;     // e.g. "Thailand"
  dep_airp_code: string;   // e.g. "BKK"

  arr_date: string;        // e.g. "2025-09-05"
  arr_time: string;        // e.g. "12:00:00"
  arr_country: string;     // e.g. "Japan"
  arr_airp_code: string;   // e.g. "NRT"

  airl_name: string;       // airline name
};

export async function post_flight(Input: FlightInput, trip_id: number) {
  return repo.post_flight(Input, trip_id);
}

export async function get_flight(tripId: number) {
  return repo.get_flight(tripId);
}

export async function delete_flight(tripId: number, flightId: number) {
  return repo.delete_flight(tripId, flightId);
}