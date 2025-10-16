import { query } from "../../core/db"
import { pool } from '../../config/db';
import { UsersRepo } from "../users/users.repo"
import { formatDate } from '../../util';


// ---------- Activities ----------
export const ActivityRepo = {
  async check_user_role(trip_id: number, user_id: string): Promise<"NoUser" | "Viewer" | "Editor" | "Owner"> {
    const query = `
      SELECT role
      FROM trip_collaborators
      WHERE trip_id = $1 AND user_id = $2 AND accepted = TRUE
    `;
    const values = [trip_id, user_id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) return "NoUser";

    const role = result.rows[0].role;
    if (role === "Owner") return "Owner";
    if (role === "Editor") return "Editor";
    if (role === "Viewer") return "Viewer";
    return "NoUser";
  },

  async listAll(trip_id: number) {
    const sql = `
      SELECT pit.pit_id, pit.place_id, pit.trip_id, pit.date,
            pit.time_start, pit.time_end, pit.is_vote,
            pit.event_names AS event_name, pit.event_title As event_title , pit.is_event,
            p.address, p.places_picture_path AS photo_url
      FROM places_in_trip pit
      LEFT JOIN places p ON pit.place_id = p.place_id
      WHERE pit.trip_id = $1
      AND NOT (
        (pit.is_vote = true  AND pit.is_event = false AND pit.place_id > 0) OR
        (pit.is_vote = true  AND pit.is_event = true  AND pit.place_id = 0)
      )
      ORDER BY pit.date, pit.time_start
    `
    const res = await query(sql, [trip_id])

    const rows = res.rows.map((r: any) => ({
      ...r,
      date: formatDate(new Date(r.date)),
    }))

    return await Promise.all(
      rows.map(async (row: any) => ({
        ...row,
        photo_url: row.photo_url
          ? (await UsersRepo.get_file_link(row.photo_url, "places", 3600)).signedUrl
          : null,
      }))
    )
  },
  
  async listByDate(trip_id: number, date: string) {
    const sql = `
      SELECT pit.pit_id, pit.place_id, pit.trip_id, pit.date,
             pit.time_start, pit.time_end, pit.is_vote,
             pit.event_names AS event_name, pit.event_title As event_title, pit.is_event,
             p.address, p.places_picture_path AS photo_url
      FROM places_in_trip pit
      LEFT JOIN places p ON pit.place_id = p.place_id
      WHERE pit.trip_id = $1 AND pit.date = $2
      AND NOT (
        (pit.is_vote = true  AND pit.is_event = false AND pit.place_id > 0) OR
        (pit.is_vote = true  AND pit.is_event = true  AND pit.place_id = 0)
      )
      ORDER BY pit.time_start
    `
    const res = await query(sql, [trip_id, date])

    const rows = res.rows.map((r: any) => ({
      ...r,
      date: formatDate(new Date(r.date)),
    }))

    return await Promise.all(
      rows.map(async (row: any) => ({
        ...row,
        photo_url: row.photo_url
          ? (await UsersRepo.get_file_link(row.photo_url, "places", 3600)).signedUrl
          : null,
      }))
    )
  },

  async pit_idDetail(pit_id: number){  
    const sql = `
      SELECT pit.pit_id, pit.place_id, pit.trip_id, pit.date,
             pit.time_start, pit.time_end, pit.is_vote,
             pit.event_names AS event_name, pit.event_title As event_title, pit.is_event,
             p.address, p.places_picture_path AS photo_url
      FROM places_in_trip pit
      LEFT JOIN places p ON pit.place_id = p.place_id
      WHERE pit.pit_id = $1 
      AND NOT (
        (pit.is_vote = true  AND pit.is_event = false AND pit.place_id > 0) OR
        (pit.is_vote = true  AND pit.is_event = true  AND pit.place_id = 0)
      )
    `
    const res = await query(sql, [pit_id])

    const rows = res.rows.map((r: any) => ({
      ...r,
      date: formatDate(new Date(r.date)),
    }))

    return await Promise.all(
      rows.map(async (row: any) => ({
        ...row,
        photo_url: row.photo_url
          ? (await UsersRepo.get_file_link(row.photo_url, "places", 3600)).signedUrl
          : null,
      }))
    )
  },

  async findPlacesByTripDate(trip_id: number, date: string) {
    const sql = `
      SELECT p.name AS title,
             p.lat::float AS latitude,
             p.lon::float AS longitude
      FROM places_in_trip pit
      JOIN places p ON pit.place_id = p.place_id
      WHERE pit.trip_id = $1
        AND pit.date = $2
        AND COALESCE(pit.is_event, false) = false
        AND pit.place_id IS NOT NULL
      ORDER BY pit.time_start ASC
    `;
    const res = await query(sql, [trip_id, date]);
    return res.rows as { title: string; latitude: number; longitude: number }[];
  },

  async remove(pit_id: number) {
    const sql = `DELETE FROM places_in_trip WHERE pit_id = $1 RETURNING pit_id`
    const res = await query(sql, [pit_id])
    return res.rows.length > 0
  },

  async dateClean(trip_id: number, date: string) {
    const sql = `DELETE FROM places_in_trip WHERE trip_id = $1 AND date = $2 RETURNING date`
    const res = await query(sql, [trip_id, date])
    return res.rows.length > 0
  }
}

// ---------- Events ----------
export const EventRepo = {
  async create(trip_id: number, dto: any) {
    const sql = `
      INSERT INTO places_in_trip (trip_id, place_id, date, time_start, time_end, is_vote, is_event, event_names, event_title)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
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
      dto.event_title
    ]
    const res = await query(sql, values)
    return res.rows[0]
  },

  async update(pit_id: number, dto: any) {
    const sql = `
      UPDATE places_in_trip
      SET date = $2, time_start = $3, time_end = $4, event_names = $5, event_title = $6
      WHERE pit_id = $1
      RETURNING *
    `
    
    const res = await query(sql, [pit_id, dto.date, dto.time_start, dto.time_end, dto.event_name, dto.event_title])
    const rows = res.rows.map((r: any) => ({
      ...r,
      date: formatDate(new Date(r.date)),
    }));
    return rows[0];
  },
}

// ---------- Places ----------
export const PlaceRepo = {
  async add(trip_id: number, dto: any) {
    const sql = `
      INSERT INTO places_in_trip (trip_id, place_id, date, time_start, time_end, is_vote, is_event, event_names, event_title)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
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
      dto.event_title
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
    const rows = res.rows.map((r: any) => ({
      ...r,
      date: formatDate(new Date(r.date)),
    }));
    return rows[0];
  },
}



// ---------- Votes ----------

function normalizeDate(val: any): string {
  if (!val) return ""
  try {
    return val instanceof Date ? val.toISOString().slice(0, 10) : String(val)
  } catch {
    return String(val ?? "")
  }
}

function normalizeTime(val: any): string {
  if (!val) return ""
  try {
    return val instanceof Date
      ? val.toISOString().slice(11, 19)
      : String(val)
  } catch {
    return String(val ?? "")
  }
}

export const VoteRepo = {
  async list(trip_id: number, pit_id: number, user_id: string) {
    const res = await query(
      `SELECT pit_id
      FROM vote
      WHERE trip_id=$1 AND pit_id=$2 AND user_id=$3`,
      [trip_id, pit_id, user_id]
    )

    const { pit_idUser } = res.rows[0] as {
      pit_idUser: string
    }
    
    const blockRes = await query(
      `SELECT date::text AS date, time_start::text AS time_start, time_end::text AS time_end, is_event
       FROM places_in_trip
       WHERE trip_id=$1 AND pit_id=$2 AND is_vote=true`,
      [trip_id, pit_id]
    )

    if (!blockRes.rows || blockRes.rows.length === 0) {
      throw new Error(`Voting block ${pit_id} not found or not active`)
    }

    const { date, time_start, time_end, is_event } = blockRes.rows[0] as {
      date: string
      time_start: string
      time_end: string
      is_event: boolean
    }
    
    const formattedDate = formatDate(new Date(date));
    let block_id: number = pit_id;

    const candidatesRes = await query(
      `SELECT pit.pit_id, pit.place_id, pit.event_names, pit.is_event, pit.event_title,
              p.address, p.places_picture_path AS photo_url , p.rating, p.rating_count, p.name
       FROM places_in_trip pit
       LEFT JOIN places p ON pit.place_id = p.place_id
       WHERE pit.trip_id=$1
         AND pit.date=$2
         AND pit.time_start=$3
         AND pit.time_end=$4
         AND pit.is_vote=true
         AND pit.pit_id<>$5`,
      [trip_id, date, time_start, time_end, pit_id]
    )

    const candidatePitIds = candidatesRes.rows.map((r: any) => r.pit_id)
    if (candidatePitIds.length === 0) {
        return {
          block_id: block_id,
          date : formattedDate ,
          time_start,
          time_end,
          voting : [],
      }
    }

    const votesRes = await query(
      `SELECT pit_id, COUNT(*)::int AS voting_count
       FROM vote
       WHERE trip_id=$1 AND pit_id = ANY($2)
       GROUP BY pit_id`,
      [trip_id, candidatePitIds]
    )

    const votesMap: Record<number, number> = {}
    for (const row of votesRes.rows) {
      votesMap[row.pit_id] = row.voting_count
    }

    const maxVote = Math.max(...Object.values(votesMap), 0)

    if (!is_event) {
      const places_voting = await Promise.all(
        candidatesRes.rows.map(async (row: any) => {
          const voting_count = votesMap[row.pit_id] || 0
          return {
            name: row.name,
            pit_id: row.pit_id,
            place_id: row.place_id,
            address: row.address,
            place_picture_url: row.photo_url
              ? (await UsersRepo.get_file_link(row.photo_url, "places", 3600)).signedUrl
              : null,
            voting_count,
            is_most_voted: voting_count === maxVote && maxVote > 0,
            rating: row.rating,
            rating_count: row.rating_count,
            is_voted: row.pit_id === pit_idUser
          }
        })
      )

      return {
        block_id: block_id,
        date : formattedDate ,
        time_start,
        time_end,
        places_voting,
      }
    } else {
      const event_voting = await Promise.all(
        candidatesRes.rows.map(async (row: any) => {
          const voting_count = votesMap[row.pit_id] || 0
          return {
            pit_id: row.pit_id,
            place_id: row.place_id,
            address: row.address,
            event_names: row.event_names,
            event_title: row.event_title,
            voting_count,
            is_most_voted: voting_count === maxVote && maxVote > 0,
            is_voted: row.pit_id === pit_idUser
          }
        })
      )

      return {
        block_id: block_id,
        date : formattedDate ,
        time_start,
        time_end,
        event_voting,
      }
    }
  },

  async initVotingBlock(trip_id: number, type: "places"|"events", body: any) {
    const sql = `
      INSERT INTO places_in_trip (trip_id, place_id, date, time_start, time_end, is_vote, is_event, event_names, event_title)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
    `
    const values = [
      trip_id,
      body.place_id,
      body.date,
      body.time_start,
      body.time_end,
      true,
      type === "events",
      "",
      type === "events" ? body.event_title : ""
    ]
    const res = await query(sql, values)
    return res.rows[0]
  },

 async addCandidate(
  trip_id: number,
  pit_id: number,
  place_id: number,
  body?: { event_name?: string; }
) {
  const block = await query(
    `SELECT date, time_start, time_end, is_event
     FROM places_in_trip
     WHERE trip_id=$1 AND pit_id=$2 AND is_vote=true`,
    [trip_id, pit_id]
  )

  if (!block.rows || block.rows.length === 0) {
    throw new Error(`Voting block ${pit_id} not found or not active`)
  }

  const row = block.rows[0] as {
    date: string
    time_start: string
    time_end: string
    is_event: boolean
  }
  const { date, time_start, time_end, is_event } = row

  if (place_id !== 0 && is_event) {
    throw new Error(`Cannot add place candidate to an event voting block`)
  }
  if (place_id === 0 && !is_event) {
    throw new Error(`Cannot add event candidate to a place voting block`)
  }

  if (place_id !== 0) {
    const checkPlace = await query(
      `SELECT place_id FROM places WHERE place_id=$1`,
      [place_id]
    )
    if (checkPlace.rows.length === 0) {
      throw new Error(`Place ${place_id} not found`)
    }

    const checkPlaceALready = await query(
      `SELECT place_id FROM places_in_trip WHERE trip_id=$1 AND place_id=$2 AND time_start=$3`,
      [trip_id,place_id,time_start]
    )
    if (checkPlaceALready.rows.length !== 0) {
      throw new Error(`This candidate has been added`)
    }

    const sql = `
      INSERT INTO places_in_trip (trip_id, place_id, date, time_start, time_end, is_vote, is_event, event_names, event_title)
      VALUES ($1,$2,$3,$4,$5,true,false,'','')
      RETURNING *
    `
    const res = await query(sql, [trip_id, place_id, date, time_start, time_end])
    const rows = res.rows.map((r: any) => ({
      ...r,
      date: formatDate(new Date(r.date)),
    }));

    return rows[0];
  }

  if (!body?.event_name) {
    throw new Error(`event_name is required when place_id=0`)
  }

  const checkEventALready = await query(
    `SELECT event_names FROM places_in_trip WHERE trip_id=$1 AND event_names=$2 AND time_start=$3`,
    [trip_id,body.event_name,time_start]
  )

  if ( checkEventALready.rows.length !== 0) {
    throw new Error(`This candidate has been added`)
  }

  const sql = `
    INSERT INTO places_in_trip (trip_id, place_id, date, time_start, time_end, is_vote, is_event, event_names, event_title)
    VALUES ($1,0,$2,$3,$4,true,true,$5,'')
    RETURNING *
  `
  
  const res = await query(sql, [trip_id, date, time_start, time_end, body.event_name])
  const rows = res.rows.map((r: any) => ({
    ...r,
    date: formatDate(new Date(r.date)),
  }));

  return rows[0];
},

  async votedPlaces(trip_id: number, pit_id: number, user_id: string) {
    const checkPit = await query(
      `SELECT pit_id
      FROM places_in_trip
      WHERE trip_id=$1 AND pit_id=$2 AND is_vote=true AND is_event=false`,
      [trip_id, pit_id]
    )
    if (!checkPit.rows || checkPit.rows.length === 0) {
      throw new Error(`Voting pit ${pit_id} not active`)
    }

    const sql = `
      INSERT INTO vote (trip_id, pit_id, user_id, time_start, event_name)
      VALUES ($1,$2,$3,NOW()::text,'')
      ON CONFLICT DO NOTHING
      RETURNING *
    `
    const res = await query(sql, [trip_id, pit_id, user_id])
    return (res.rows?.length ?? 0) > 0
  },

  async votedEvents(trip_id: number, pit_id: number, user_id: string, body: any) {
    const checkPit = await query(
      `SELECT pit_id, event_names
      FROM places_in_trip
      WHERE trip_id=$1 AND pit_id=$2 AND is_vote=true AND is_event=true`,
      [trip_id, pit_id]
    )
    if (!checkPit.rows || checkPit.rows.length === 0) {
      throw new Error(`Voting pit ${pit_id} not active`)
    }

    const pitRow = checkPit.rows[0] as any
    if (!pitRow.event_names || String(pitRow.event_names) !== String(body.event_name)) {
      throw new Error(`Invalid event_name`)
    }

    const sql = `
      INSERT INTO vote (trip_id, pit_id, user_id, time_start, event_name)
      VALUES ($1,$2,$3,NOW()::text,$4)
      ON CONFLICT DO NOTHING
      RETURNING *
    `
    const res = await query(sql, [trip_id, pit_id, user_id, body.event_name])
    return (res.rows?.length ?? 0) > 0
  },

  async patchVote(trip_id: number, pit_id: number, patch: any) {
    const oldBlockRes = await query(
      `SELECT date::text AS date, time_start::text AS time_start, time_end::text AS time_end
      FROM places_in_trip
      WHERE trip_id=$1 AND pit_id=$2 AND is_vote=true`,
      [trip_id, pit_id]
    )

    if (!oldBlockRes.rows || oldBlockRes.rows.length === 0) {
      throw new Error(`Voting block ${pit_id} not found`)
    }

    const oldRow = oldBlockRes.rows[0] as {
      date: string
      time_start: string
      time_end: string
    }

    const updateBlock = await query(
      `UPDATE places_in_trip
      SET date=$3, time_start=$4, time_end=$5
      WHERE trip_id=$1 AND pit_id=$2
      RETURNING *`,
      [trip_id, pit_id, patch.date, patch.start_time, patch.end_time]
    )

    await query(
      `UPDATE places_in_trip
      SET date=$4, time_start=$5, time_end=$6
      WHERE trip_id=$1
        AND date=$2
        AND time_start=$3
        AND is_vote=true
        AND pit_id<>$7`,
      [trip_id, oldRow.date, oldRow.time_start, patch.date, patch.start_time, patch.end_time, pit_id]
    )

    const rows = updateBlock.rows.map((r: any) => ({
      ...r,
      date: formatDate(new Date(r.date)),
    }));

    return rows[0];
  },


async cleanVotingBlock(trip_id: number, pit_id: number) {
    const blockRes = await query(
      `SELECT date::text AS date, time_start::text AS time_start
      FROM places_in_trip
      WHERE trip_id=$1 AND pit_id=$2`,
      [trip_id, pit_id]
    )

    if (!blockRes.rows || blockRes.rows.length === 0) {
      throw new Error(`${pit_id} not found or inactive`)
    }

    const row = blockRes.rows[0] as {
      date: string
      time_start: string
    }

    await query(
      `DELETE FROM vote
      WHERE trip_id=$1
        AND pit_id IN (
          SELECT pit_id
          FROM places_in_trip
          WHERE trip_id=$1
            AND date=$2
            AND time_start=$3
            AND is_vote=true
        )`,   
      [trip_id, row.date, row.time_start]
    )

    const res = await query(
      `DELETE FROM places_in_trip
      WHERE trip_id=$1
        AND date=$2
        AND time_start=$3
        AND is_vote=true
        AND pit_id<>$4
      RETURNING pit_id`,
      [trip_id, row.date, row.time_start, pit_id]
    )

    return (res.rows?.length ?? 0) > 0
  },


  async deleteVote(trip_id: number, pit_id: number, user_id: string) {
  const res = await query(
    `DELETE FROM vote
     WHERE trip_id=$1 AND pit_id=$2 AND user_id=$3
     RETURNING *`,
    [trip_id, pit_id, user_id]
  )
  return (res.rows?.length ?? 0) > 0 
},

  async getTopPlaces(trip_id: number, pit_id: number) {
  const blockRes = await query(
    `SELECT date::text AS date, time_start::text AS time_start, time_end::text AS time_end, is_event
     FROM places_in_trip 
     WHERE trip_id=$1 AND pit_id=$2 AND is_vote=true AND is_event=false`,
    [trip_id, pit_id]
  )

  if (!blockRes.rows || blockRes.rows.length === 0) {
    throw new Error(`Voting block ${pit_id} not found or inactive`)
  }

  const row = blockRes.rows[0] as {
    date: string
    time_start: string
    time_end: string
    is_event: boolean
  }

  const date = normalizeDate(row.date)
  const time_start = normalizeTime(row.time_start)
  const time_end = normalizeTime(row.time_end)

  const candidatesRes = await query(
    `SELECT pit_id, place_id
     FROM places_in_trip
     WHERE trip_id=$1 AND date=$2 AND time_start=$3 AND time_end=$4 AND is_event=false`,
    [trip_id, date, time_start, time_end]
  )

  const candidatePitIds = candidatesRes.rows.map((r: any) => r.pit_id)
  if (candidatePitIds.length === 0) {
    throw new Error(`No candidates found for block ${pit_id}`)
  }

  const votesRes = await query(
    `SELECT pit_id, COUNT(*)::int AS cnt
     FROM vote
     WHERE trip_id=$1 AND pit_id = ANY($2)
     GROUP BY pit_id
     HAVING COUNT(*) = (
       SELECT MAX(vcount) FROM (
         SELECT COUNT(*) AS vcount
         FROM vote
         WHERE trip_id=$1 AND pit_id = ANY($2)
         GROUP BY pit_id
       ) sub
     )`,
    [trip_id, candidatePitIds]
  )

  return votesRes.rows
} ,

async getTopEvents(trip_id: number, pit_id: number) {
  const blockRes = await query(
    `SELECT date::text AS date, time_start::text AS time_start, time_end::text AS time_end, is_event
     FROM places_in_trip 
     WHERE trip_id=$1 AND pit_id=$2 AND is_vote=true AND is_event=true`,
    [trip_id, pit_id]
  )

  if (!blockRes.rows || blockRes.rows.length === 0) {
    throw new Error(`Voting block ${pit_id} not found or inactive`)
  }

  const row = blockRes.rows[0] as {
    date: string
    time_start: string
    time_end: string
    is_event: boolean
  }

  const date = normalizeDate(row.date)
  const time_start = normalizeTime(row.time_start)
  const time_end = normalizeTime(row.time_end)

  const candidatesRes = await query(
    `SELECT pit_id, event_names
     FROM places_in_trip
     WHERE trip_id=$1 AND date=$2 AND time_start=$3 AND time_end=$4 AND is_event=true`,
    [trip_id, date, time_start, time_end]
  )

  const candidatePitIds = candidatesRes.rows.map((r: any) => r.pit_id)
  if (candidatePitIds.length === 0) {
    throw new Error(`No candidates found for block ${pit_id}`)
  }

  const votesRes = await query(
    `SELECT pit_id, COUNT(*)::int AS cnt
     FROM vote
     WHERE trip_id=$1 AND pit_id = ANY($2)
     GROUP BY pit_id
     HAVING COUNT(*) = (
       SELECT MAX(vcount) FROM (
         SELECT COUNT(*) AS vcount
         FROM vote
         WHERE trip_id=$1 AND pit_id = ANY($2)
         GROUP BY pit_id
       ) sub
     )`,
    [trip_id, candidatePitIds]
  )

  return votesRes.rows
},

async checkTimeOverlap(
  trip_id: number,
  pit_id: number | null,
  date: string,
  time_start: string,
  time_end: string
) {
  const res = await query(
    `SELECT pit_id, place_id, date, time_start, time_end, is_vote, is_event
    FROM places_in_trip
    WHERE trip_id = $1
      AND date = $2
      AND NOT (
        (place_id > 0 AND is_vote = true AND is_event = false) OR
        (place_id = 0 AND is_vote = true AND is_event = true)
      )
      ${pit_id ? "AND pit_id <> $5" : ""}
      AND ($3 < time_end AND $4 > time_start)`
    ,pit_id ? [trip_id, date, time_start, time_end, pit_id] : [trip_id, date, time_start, time_end]
  )

  return res.rows
},

async checkTimeOverlap2(
  trip_id: number,
  pit_id: number ,
  date: string,
  time_start: string,
  time_end: string
) {
  const res = await query(
    `SELECT pit_id, place_id, date, time_start, time_end, is_vote, is_event
    FROM places_in_trip
    WHERE trip_id = $1 AND date = $2 AND ($3 < time_end AND $4 > time_start)
      AND NOT (
        (place_id > 0 AND is_vote = true AND is_event = false) OR
        (place_id = 0 AND is_vote = true AND is_event = true) OR
        (pit_id = $5)
      )`
    ,[trip_id, date, time_start, time_end, pit_id]
  )
  return res.rows
},

async checkUserVoted(trip_id: number, pit_id: number, user_id: string) {
  const res = await query(
    `SELECT pit_id, event_name
     FROM vote
     WHERE trip_id=$1 AND pit_id=$2 AND user_id=$3`,
    [trip_id, pit_id, user_id]
  )
  if (!res.rows || res.rows.length === 0) {
    return { voted: false }
  }

  const row = res.rows[0] as { pit_id: number; event_name: string | null }
  return {
    voted: true,
    pit_id: row.pit_id,
    event_name: row.event_name ?? null,
  }
},  

async endOwner(trip_id:number, pit_id:number, type:"places"|"events") {
  const candidateRes = await query(
    `SELECT pit_id, date::text AS date, time_start::text AS time_start, time_end::text AS time_end, place_id, event_names
     FROM places_in_trip
     WHERE trip_id=$1 AND pit_id=$2 AND is_vote=true AND ${
       type==="places" ? "is_event=false AND place_id>0" : "is_event=true AND place_id=0"
     }`,
    [trip_id, pit_id]
  )
  if (!candidateRes.rows || candidateRes.rows.length === 0) {
    throw new Error(`Pit ${pit_id} is not a candidate of type ${type}`)
  }

  const cand = candidateRes.rows[0] as {
    pit_id: number
    date: string
    time_start: string
    time_end: string
    place_id: number
    event_names: string | null
  }

  const blockRes = await query(
    `SELECT pit_id
     FROM places_in_trip
     WHERE trip_id=$1 AND date=$2 AND time_start=$3 AND time_end=$4
       AND is_vote=true AND is_event=$5 `,
    [trip_id, cand.date, cand.time_start, cand.time_end, type==="events"]
  )

  if (!blockRes.rows || blockRes.rows.length === 0) {
    throw new Error(`Vote block not found for candidate ${pit_id}`)
  }

  const block = blockRes.rows[0] as { pit_id: number }
  const blockPitId = block.pit_id

  if (type === "places") {
    const updateRes = await query(
      `UPDATE places_in_trip
      SET place_id=$3, event_names=$4, is_vote=false
      WHERE trip_id=$1 AND pit_id=$2 AND place_id = 0
      RETURNING *`,
      [trip_id, blockPitId, cand.place_id, cand.event_names]
    )
    const rows = updateRes.rows.map((r: any) => ({
      ...r,
      date: formatDate(new Date(r.date)),
    }));

    return rows[0]
  }
  
  const updateRes = await query(
    `UPDATE places_in_trip
    SET place_id=$3, event_names=$4, is_vote=false
    WHERE trip_id=$1 AND pit_id=$2 AND place_id > 0
    RETURNING *`,
    [trip_id, blockPitId, cand.place_id, cand.event_names]
  )

  const rows = updateRes.rows.map((r: any) => ({
    ...r,
    date: formatDate(new Date(r.date)),
  }));
  
  return rows[0]
}
}

