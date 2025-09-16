"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_place = get_place;
exports.add_place = add_place;
exports.remove_place = remove_place;
exports.get_guide = get_guide;
exports.add_guide = add_guide;
exports.remove_guide = remove_guide;
const db_1 = require("../../core/db");
async function get_place(userId) {
    const sql = `
    SELECT b.bookmark_id, p.name, p.place_id, p.rating, p.rating_count, p.address, p.api_id ,p.places_picture_path, p.website_url
    FROM bookmark b
    JOIN places p ON p.place_id = b.place_id
    WHERE b.user_id = $1
    ORDER BY b.bookmark_id DESC
  `;
    const res = await (0, db_1.query)(sql, [userId]);
    return res.rows;
}
async function add_place(userId, placeId) {
    const sql = `
    INSERT INTO bookmark (user_id, place_id)
    VALUES ($1, $2)
  `;
    const res = await (0, db_1.query)(sql, [userId, placeId]);
    return (res.rowCount ?? 0) > 0; // Will return 1 if insert successfully | Else return 0
}
async function remove_place(userId, bookmark_id) {
    const sql = `DELETE FROM bookmark WHERE user_id = $1 AND bookmark_id = $2`;
    const res = await (0, db_1.query)(sql, [userId, bookmark_id]);
    return (res.rowCount ?? 0) > 0; // Will return 1 if remove successfully | Else return 0
}
async function get_guide(userId) {
    const sql = `
    SELECT 
      t.trip_id, 
      g.gbookmark_id, 
      (t.end_date - t.start_date) AS duration, 
      t.trip_url,
      t.trip_picture_path,  
      u.name as trip_owner
    FROM guide_bookmark g
    JOIN trips t ON t.trip_id = g.trip_id
    JOIN users u ON u.user_id = t.user_id
    WHERE g.user_id = $1
    ORDER BY g.gbookmark_id DESC
  `;
    const res = await (0, db_1.query)(sql, [userId]);
    return res.rows;
}
async function add_guide(userId, trip_id) {
    const sql = `
    INSERT INTO guide_bookmark (user_id, trip_id)
    VALUES ($1, $2)
  `;
    const res = await (0, db_1.query)(sql, [userId, trip_id]);
    return (res.rowCount ?? 0) > 0; // Will return 1 if insert successfully | Else return 0
}
async function remove_guide(userId, gbookmark_id) {
    const sql = `DELETE FROM guide_bookmark WHERE user_id = $1 AND gbookmark_id = $2`;
    const res = await (0, db_1.query)(sql, [userId, gbookmark_id]);
    return (res.rowCount ?? 0) > 0; // Will return 1 if remove successfully | Else return 0
}
//# sourceMappingURL=bookmarks.repo.js.map