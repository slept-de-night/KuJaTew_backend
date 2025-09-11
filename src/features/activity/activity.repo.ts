import { query } from "../../core/db"

// ---------- Activities ----------
export const ActivityRepo = {
  async listByDate(trip_id: number, date: string) {
    const sql = `
      SELECT pit.pit_id, pit.place_id, pit.trip_id, pit.date,
             pit.time_start, pit.time_end, pit.is_vote,
             pit.event_names AS event_name, pit.is_event,
             p.address, p.places_picture_path AS photo_url
      FROM places_in_trip pit
      LEFT JOIN places p ON pit.place_id = p.place_id
      WHERE pit.trip_id = $1 AND pit.date = $2
      ORDER BY pit.time_start
    `
    const res = await query(sql, [trip_id, date])
    return res.rows
  },

  async remove(pit_id: number) {
    const sql = `DELETE FROM places_in_trip WHERE pit_id = $1 RETURNING pit_id`
    const res = await query(sql, [pit_id])
    return res.rows.length > 0
  },
}

// ---------- Events ----------
export const EventRepo = {
  async create(trip_id: number, dto: any) {
    const sql = `
      INSERT INTO places_in_trip (trip_id, place_id, date, time_start, time_end, is_vote, is_event, event_names)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `
    const values = [
      trip_id,
      dto.place_id,
      dto.date,
      dto.time_start,
      dto.time_end,
      dto.is_vote,
      dto.is_event,
      dto.event_name,
    ]
    const res = await query(sql, values)
    return res.rows[0]
  },

  async update(pit_id: number, dto: any) {
    const sql = `
      UPDATE places_in_trip
      SET date = $2, time_start = $3, time_end = $4, event_names = $5
      WHERE pit_id = $1
      RETURNING *
    `
    const res = await query(sql, [pit_id, dto.date, dto.time_start, dto.time_end, dto.event_name])
    return res.rows[0]
  },
}

// ---------- Places ----------
export const PlaceRepo = {
  async add(trip_id: number, dto: any) {
    const sql = `
      INSERT INTO places_in_trip (trip_id, place_id, date, time_start, time_end, is_vote, is_event, event_names)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `
    const values = [
      trip_id,
      dto.place_id,
      dto.date,
      dto.time_start,
      dto.time_end,
      dto.is_vote,
      dto.is_event,
      dto.event_name,
    ]
    const res = await query(sql, values)
    return res.rows[0]
  },

  async update(pit_id: number, dto: any) {
    const sql = `
      UPDATE places_in_trip
      SET date = $2, time_start = $3, time_end = $4
      WHERE pit_id = $1
      RETURNING *
    `
    const res = await query(sql, [pit_id, dto.date, dto.time_start, dto.time_end])
    return res.rows[0]
  },
}

// ---------- Votes ----------
export const VoteRepo = {
  async list(trip_id: number, pit_id: number, user_id: string) {
    const sql = `
      WITH vote_counts AS (
        SELECT v.pit_id, COUNT(*) AS cnt
        FROM vote v
        WHERE v.trip_id = $1
        GROUP BY v.pit_id
      ),
      max_votes AS (
        SELECT MAX(cnt) AS max_cnt FROM vote_counts
      )
      SELECT pit.date, pit.time_start, pit.time_end, pit.is_event,
             CASE 
               WHEN pit.is_event = false THEN json_agg(
                 json_build_object(
                   'pit_id', pit.pit_id,
                   'place_id', pit.place_id,
                   'address', p.address,
                   'place_picture_url', p.places_picture_path,
                   'voting_count', COUNT(v.*),
                   'is_voted', BOOL_OR(v.user_id = $3),
                   'is_most_voted', (COUNT(v.*) = (SELECT max_cnt FROM max_votes))
                 )
               )
             END AS places_voting,
             CASE 
               WHEN pit.is_event = true THEN json_build_object(
                 'pit_id', pit.pit_id,
                 'event_name', pit.event_names,
                 'voting_count', COUNT(v.*),
                 'is_voted', BOOL_OR(v.user_id = $3),
                 'is_most_voted', (COUNT(v.*) = (SELECT max_cnt FROM max_votes))
               )
             END AS event_voting
      FROM places_in_trip pit
      LEFT JOIN places p ON pit.place_id = p.place_id
      LEFT JOIN vote v ON v.trip_id = pit.trip_id AND v.pit_id = pit.pit_id
      WHERE pit.trip_id = $1 AND pit.pit_id = $2
      GROUP BY pit.pit_id, pit.date, pit.time_start, pit.time_end, pit.is_event, pit.event_names
    `
    const res = await query(sql, [trip_id, pit_id, user_id])
    return res.rows[0]
  },

  async initVotingBlock(trip_id: number, type: "places"|"events", body: any) {
    const sql = `
      INSERT INTO places_in_trip (trip_id, place_id, date, time_start, time_end, is_vote, is_event, event_names)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `
    const values = [
      trip_id,
      body.place_id,
      body.date,
      body.time_start,
      body.time_end,
      body.is_vote,
      body.is_event,
      body.is_event ? body.event_name ?? null : "",
    ]
    const res = await query(sql, values)
    return res.rows[0]
  },

  async addPlaceVote(trip_id: number, pit_id: number, place_id: number, user_id: string) {
    const sql = `
      INSERT INTO vote (trip_id, pit_id, user_id, time_start, event_name)
      VALUES ($1,$2,$3,NOW()::text,'')
      ON CONFLICT DO NOTHING
      RETURNING *
    `
    const res = await query(sql, [trip_id, pit_id, user_id])
    return res.rows.length > 0
  },

  async endVotingPlaces(trip_id: number, pit_id: number, body: any) {
    const sql = `
      UPDATE places_in_trip
      SET is_vote = false
      WHERE trip_id = $1 AND pit_id = $2
      RETURNING *
    `
    const res = await query(sql, [trip_id, body.pit_id])
    return res.rows[0]
  },

  async endVotingEvents(trip_id: number, pit_id: number, body: any) {
    const sql = `
      UPDATE places_in_trip
      SET is_vote = false, event_names = $3
      WHERE trip_id = $1 AND pit_id = $2
      RETURNING *
    `
    const res = await query(sql, [trip_id, pit_id, body.event_name])
    return res.rows[0]
  },

  async votedPlaces(trip_id: number, pit_id: number, user_id: string) {
    const sql = `
      INSERT INTO vote (trip_id, pit_id, user_id, time_start, event_name)
      VALUES ($1,$2,$3,NOW()::text,'')
      ON CONFLICT DO NOTHING
      RETURNING *
    `
    const res = await query(sql, [trip_id, pit_id, user_id])
    return res.rows.length > 0
  },

  async votedEvents(trip_id: number, pit_id: number, user_id: string, body: any) {
    const sql = `
      INSERT INTO vote (trip_id, pit_id, user_id, time_start, event_name)
      VALUES ($1,$2,$3,NOW()::text,$4)
      ON CONFLICT DO NOTHING
      RETURNING *
    `
    const res = await query(sql, [trip_id, pit_id, user_id, body.event_name])
    return res.rows.length > 0
  },

  async patchVote(trip_id: number, pit_id: number, patch: any) {
    const sql = `
      UPDATE places_in_trip
      SET date = $3, time_start = $4, time_end = $5
      WHERE trip_id = $1 AND pit_id = $2
      RETURNING *
    `
    const res = await query(sql, [trip_id, pit_id, patch.date, patch.start_time, patch.end_time])
    return res.rows[0]
  },

  async removeVotingBlock(trip_id: number, pit_id: number) {
    const sql = `DELETE FROM places_in_trip WHERE trip_id = $1 AND pit_id = $2 RETURNING pit_id`
    const res = await query(sql, [trip_id, pit_id])
    return res.rows.length > 0
  },
}
