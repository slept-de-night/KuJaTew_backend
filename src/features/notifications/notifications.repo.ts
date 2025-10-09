import { query } from "../../core/db";

export async function get_noti(trip_id: number, limit: number) {
  const sql = `
    SELECT n.noti_id, n.noti_title, n.noti_text, n.noti_date, n.noti_time  
    FROM notification n
    JOIN trips t ON t.trip_id = n.trip_id
    WHERE n.trip_id = $1
    ORDER BY n.noti_time DESC
    LIMIT $2
  `;
  const res = await query(sql, [trip_id, limit]);

  const countSql = `
    SELECT COUNT(*) AS total
    FROM notification
    WHERE trip_id = $1
  `;
  const c = await query(countSql, [trip_id]);

  return {
    list: res.rows,
    count: Number(c.rows[0]!.total)
  };
}

export async function post_noti(trip_id: number, noti_title: string, noti_text: string, noti_date: Date, noti_time: string) {
  const sql = `
    INSERT INTO notification (trip_id, noti_title, noti_text, noti_date, noti_time)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT(trip_id, noti_text, noti_date, noti_time) DO NOTHING
  `;
  const res = await query(sql, [trip_id, noti_title, noti_text, noti_date, noti_time]);
  return (res.rowCount ?? 0) > 0; // Will return 1 if insert successfully | Else return 0
}