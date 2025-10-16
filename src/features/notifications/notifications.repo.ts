import { query } from "../../core/db";

export async function get_noti(trip_id: number, user_id: string) {
  const sql = `
    SELECT n.noti_id, n.noti_title, n.noti_text, n.noti_date, n.noti_time  
    FROM notification n
    JOIN trips t ON t.trip_id = n.trip_id
    WHERE n.trip_id = $1
    ORDER BY n.noti_time DESC
  `;
  const res = await query(sql, [trip_id]);

  const countSql = `
    SELECT COUNT(*) AS total
    FROM notification
    WHERE trip_id = $1
  `;
  const c = await query(countSql, [trip_id]);

  const updateSql = `
    UPDATE trip_collaborators
    SET seen_noti = $1
    WHERE user_id = $2
  `
  const update = await query(updateSql, [Number(c.rows[0]?.total), user_id])

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

export async function current_noti(userId: string, trip_id: number) {
  const sql = `
    SELECT COUNT(tc.user_id) - tc.seen_noti AS unseen_noti_count
    FROM trip_collaborators tc
    JOIN notification n ON n.trip_id = tc.trip_id
    WHERE tc.user_id = $1 AND tc.trip_id = $2
    GROUP BY tc.seen_noti;
  `;
  const res = await query(sql, [userId, trip_id]);
  const count = res.rows[0]?.unseen_noti_count ?? 0;
  return Number(count);
} 