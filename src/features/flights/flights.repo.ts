import { query, pool } from "../../core/db";

export async function get_flight(trip_id: number) {
  const sql = `
    SELECT 
      f.flight_id, 
      f.depart_date as dep_date,
      f.depart_time as dep_time, 
      f.origin_country as dep_country,
      f.origin as dep_airport_code,
      f.arrive_date as arr_date, 
      f.arrive_time as arr_time,
      f.destination_country as arr_country,
      f.destination as arr_airport_code,
      f.airline
    FROM flights f
    where f.trip_id = $1
    ORDER BY f.flight_id DESC
  `;
  const res = await query(sql, [trip_id]);
  return res.rows;
}

export async function delete_flight(trip_id: number, flight_id: number) {
  const sql = `DELETE FROM flights WHERE trip_id = $1 AND flight_id = $2`;
  const res = await query(sql, [trip_id, flight_id]);
  return (res.rowCount ?? 0) > 0; // Will return 1 if remove successfully | Else return 0
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

export async function post_flight(input: FlightInsert, trip_id: number) {
  const sql = `
    INSERT INTO flights (
      trip_id, 
      depart_date, 
      depart_time,
      origin_country,
      origin,
      arrive_date,
      arrive_time,
      destination_country,
      destination,
      airline
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *;
  `;

  const params = [
    trip_id,
    input.dep_date,
    input.dep_time,
    input.dep_country,
    input.dep_airp_code,
    input.arr_date,
    input.arr_time,
    input.arr_country,
    input.arr_airp_code,
    input.airl_name,
  ];

  const { rows } = await query(sql, params);
  return rows[0];
}

export async function put_flight(input: FlightInsert, trip_id: number, flight_id: number) {
  const sql = `
    UPDATE flights 
    SET
      depart_date = $1, 
      depart_time = $2,
      origin_country = $3,
      origin = $4,
      arrive_date = $5,
      arrive_time = $6,
      destination_country = $7,
      destination = $8,
      airline = $9
    WHERE trip_id = $10 AND flight_id = $11
    RETURNING *;
  `;

  const params = [
    input.dep_date,
    input.dep_time,
    input.dep_country,
    input.dep_airp_code,
    input.arr_date,
    input.arr_time,
    input.arr_country,
    input.arr_airp_code,
    input.airl_name,
    trip_id,
    flight_id
  ];

  const { rows } = await query(sql, params);
  return rows[0];
}