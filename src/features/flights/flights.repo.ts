import { query, pool } from "../../core/db";

export async function get_flight(trip_id: number) {
  const sql = `
    SELECT 
      f.flight_id, 
      f.depart_date,
      f.depart_time,
      f.origin_country AS dep_country,
      f.origin AS dep_airport_code,
      f.arrive_date,
      f.arrive_time,
      f.destination_country AS arr_country,
      f.destination AS arr_airport_code,
      f.airline
    FROM flights f
    WHERE f.trip_id = $1
    ORDER BY f.flight_id DESC
  `;
  const res = await query(sql, [trip_id]);
  return res.rows;
}

export async function delete_flight(user_id: string, trip_id: number, flight_id: number) {
  const check_sql = `
  SELECT *
  FROM trip_collaborators
  WHERE trip_id = $1 AND user_id = $2 AND (role = 'Owner' OR role = 'Editor')
  LIMIT 1
  `;
  const check_res = await query(check_sql, [trip_id, user_id]);

  if (check_res.rowCount === 0) {
    throw new Error("Permission denied: inviter is not owner/editor");
  }


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

export async function post_flight(user_id: string, input: FlightInsert, trip_id: number) {
  const check_sql = `
  SELECT *
  FROM trip_collaborators
  WHERE trip_id = $1 AND user_id = $2 AND (role = 'Owner' OR role = 'Editor')
  LIMIT 1
  `;
  const check_res = await query(check_sql, [trip_id, user_id]);

  if (check_res.rowCount === 0) {
    const role = "viewer";
    throw new Error("Permission denied: inviter is not owner/editor (role: ${role})");
  }

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
    VALUES ($1,TO_DATE($2, 'DD/MM/YYYY'),$3,$4,$5,TO_DATE($6, 'DD/MM/YYYY'),$7,$8,$9,$10)
    ON CONFLICT (trip_id, airline, origin, depart_date, depart_time, destination) DO NOTHING
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

  const res = await query(sql, params);
  return (res.rowCount ?? 0) > 0; // Will return 1 if remove successfully | Else return 0
}

export async function put_flight(user_id: string, input: FlightInsert, trip_id: number, flight_id: number) {
  const check_sql = `
  SELECT *
  FROM trip_collaborators
  WHERE trip_id = $1 AND user_id = $2 AND (role = 'Owner' OR role = 'Editor')
  LIMIT 1
  `;
  const check_res = await query(check_sql, [trip_id, user_id]);

  if (check_res.rowCount === 0) {
    throw new Error("Permission denied: inviter is not owner/editor");
  }
  
  const sql = `
    UPDATE flights
    SET
      depart_date = TO_DATE($1, 'DD/MM/YYYY'), 
      depart_time = $2,
      origin_country = $3,
      origin = $4,
      arrive_date = TO_DATE($5, 'DD/MM/YYYY'),
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

  const res = await query(sql, params);
  return (res.rowCount ?? 0) > 0; // Will return 1 if remove successfully | Else return 0
}