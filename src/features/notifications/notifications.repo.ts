import { query } from "../../core/db";

export async function get_noti(trip_id: number, limit: number) {
  const sql = `
    SELECT n.noti_id, n.noti_title, n.noti_text, TO_CHAR(n.noti_date, 'DD/MM/YYYY') AS noti_date, TO_CHAR(n.noti_time, 'HH24:MI') AS noti_time  
    FROM notification n
    JOIN trips t ON t.trip_id = n.trip_id
    WHERE n.trip_id = $1
    ORDER BY n.noti_time DESC
    LIMIT $2
  `;
  const res = await query(sql, [trip_id, limit]);
  return res.rows;
}

export async function post_noti(trip_id: number, noti_title: string, noti_text: string, noti_date: string, noti_time: string) {
  const sql = `
    INSERT INTO notification (trip_id, noti_title, noti_text, noti_date, noti_time)
    VALUES ($1, $2, $3, TO_DATE($4, 'DD/MM/YYYY'), $5)
    ON CONFLICT(trip_id, noti_text, noti_date, noti_time) DO NOTHING
  `;
  const res = await query(sql, [trip_id, noti_title, noti_text, noti_date, noti_time]);
  return (res.rowCount ?? 0) > 0; // Will return 1 if insert successfully | Else return 0
}