import { query } from "../../core/db";

export async function get_place(userId: string) {
  const sql = `
    SELECT b.bookmark_id, p.name, p.place_id, p.rating, p.rating_count, p.address, p.places_picture_url
    FROM bookmark b
    JOIN places p ON p.place_id = b.place_id
    WHERE b.user_id = $1
    ORDER BY b.bookmark_id DESC
  `;
  const res = await query(sql, [userId]);
  return res.rows;
}

export async function add_place(userId: string, placeId: string) {
  const sql = `
    INSERT INTO bookmark (user_id, place_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, place_id) DO NOTHING
  `;
  const res = await query(sql, [userId, placeId]);
  return (res.rowCount ?? 0) > 0; // Will return 1 if insert successfully | Else return 0
}

export async function remove_place(userId: string, placeId: string) {
  const sql = `DELETE FROM bookmark WHERE user_id = $1 AND place_id = $2`;
  const res = await query(sql, [userId, placeId]);
  return (res.rowCount ?? 0) > 0; // Will return 1 if remove successfully | Else return 0
}

export async function get_guide(userId: string) {
  const sql = `
    SELECT 
      t.trip_id, 
      g.gbookmark_id, 
      (t.end_date - t.start_date) AS duration, 
      t.trip_picture_url, 
      u.name as trip_owner
    FROM guide_bookmark g
    JOIN trips t ON t.trip_id = g.trip_id
    JOIN users u ON u.user_id = t.user_id
    WHERE g.user_id = $1
    ORDER BY g.gbookmark_id DESC
  `;
  const res = await query(sql, [userId]);
  return res.rows;
}


export async function add_guide(userId: string, placeId: string) {
  const sql = `
    INSERT INTO guide_bookmark (user_id, trip_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, place_id) DO NOTHING
  `;
  const res = await query(sql, [userId, placeId]);
  return (res.rowCount ?? 0) > 0; // Will return 1 if insert successfully | Else return 0
}

export async function remove_guide(userId: string, placeId: string) {
  const sql = `DELETE FROM guide_bookmark WHERE user_id = $1 AND trip_id = $2`;
  const res = await query(sql, [userId, placeId]);
  return (res.rowCount ?? 0) > 0; // Will return 1 if remove successfully | Else return 0
}


