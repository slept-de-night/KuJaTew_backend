import { query, pool } from "../../core/db";

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

export async function post_flight(input: FlightInput, trip_id: number) {
  const flightSql = `
    INSERT INTO flights (
      origin, origin_country, destination, destination_country,
      airline, depart_date, arrive_date, depart_time, arrive_time
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING flight_id
  `;

  const post_flight_table = await query<{ flight_id: number }>(flightSql, [
    input.dep_airp_code,
    input.dep_country,
    input.arr_airp_code,
    input.arr_country,
    input.airl_name,
    input.dep_date,
    input.arr_date,
    input.dep_time,
    input.arr_time
  ]);

  if (!post_flight_table.rows[0]) {
  throw new Error("Insert failed: no flight_id returned"); // need to find a better way to handle this... unless it might crash the entire thing :(
  }
  const flightId = post_flight_table.rows[0].flight_id;

  const post_fit = `
    INSERT INTO flight_in_trip (flight_id, trip_id)
    VALUES ($1, $2)
    RETURNING fit_id
  `;

  const fitRes = await query<{ fit_id: number }>(post_fit, [flightId, trip_id]);

  if (!fitRes.rows[0]) {
  throw new Error("Insert failed: no fit_id returned"); // need to find a better way to handle this... unless it might crash the entire thing :(
  }

  return true
}

export async function get_flight(trip_id: number) {
  const sql = `
    SELECT
      f.flight_id,
      f.depart_date,
      f.depart_time,
      f.origin_country,
      f.origin,
      f.arrive_date,
      f.arrive_time,
      f.destination_country,
      f.destination,
      f.airline
    FROM flight_in_trip fit
    JOIN flights f ON f.flight_id = fit.flight_id
    WHERE fit.trip_id = $1
    ORDER BY f.flight_id DESC
  `;
  const { rows } = await query(sql, [trip_id]);
  return rows; // raw rows from DB
}

export async function delete_flight(trip_id: number, flight_id: number) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1) remove the association
    const r1 = await client.query(
      `DELETE FROM flight_in_trip WHERE trip_id = $1 AND flight_id = $2`,
      [trip_id, flight_id]
    );

    if ((r1.rowCount ?? 0) === 0) {
      await client.query("ROLLBACK");
      return false; // nothing to delete (not linked)
    }

    // 2) delete the flight itself
    const r2 = await client.query(
      `DELETE FROM flights WHERE flight_id = $1`,
      [flight_id]
    );

    await client.query("COMMIT");
    return (r2.rowCount ?? 0) > 0;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}