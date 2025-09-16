"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteRepo = exports.PlaceRepo = exports.EventRepo = exports.ActivityRepo = void 0;
const db_1 = require("../../core/db");
const users_repo_1 = require("../users/users.repo");
// ---------- Activities ----------
exports.ActivityRepo = {
    async listAll(trip_id) {
        const sql = `
      SELECT pit.pit_id, pit.place_id, pit.trip_id, pit.date,
            pit.time_start, pit.time_end, pit.is_vote,
            pit.event_names AS event_name, pit.is_event,
            p.address, p.places_picture_path AS photo_url
      FROM places_in_trip pit
      LEFT JOIN places p ON pit.place_id = p.place_id
      WHERE pit.trip_id = $1
      ORDER BY pit.date, pit.time_start
    `;
        const res = await (0, db_1.query)(sql, [trip_id]);
        return await Promise.all(res.rows.map(async (row) => ({
            ...row,
            photo_url: row.photo_url
                ? (await users_repo_1.UsersRepo.get_file_link(row.photo_url, "places", 3600)).signedUrl
                : null,
        })));
    },
    async listByDate(trip_id, date) {
        const sql = `
      SELECT pit.pit_id, pit.place_id, pit.trip_id, pit.date,
             pit.time_start, pit.time_end, pit.is_vote,
             pit.event_names AS event_name, pit.is_event,
             p.address, p.places_picture_path AS photo_url
      FROM places_in_trip pit
      LEFT JOIN places p ON pit.place_id = p.place_id
      WHERE pit.trip_id = $1 AND pit.date = $2
      ORDER BY pit.time_start
    `;
        const res = await (0, db_1.query)(sql, [trip_id, date]);
        return await Promise.all(res.rows.map(async (row) => ({
            ...row,
            photo_url: row.photo_url
                ? (await users_repo_1.UsersRepo.get_file_link(row.photo_url, "places", 3600)).signedUrl
                : null,
        })));
    },
    async remove(pit_id) {
        const sql = `DELETE FROM places_in_trip WHERE pit_id = $1 RETURNING pit_id`;
        const res = await (0, db_1.query)(sql, [pit_id]);
        return res.rows.length > 0;
    },
};
// ---------- Events ----------
exports.EventRepo = {
    async create(trip_id, dto) {
        const sql = `
      INSERT INTO places_in_trip (trip_id, place_id, date, time_start, time_end, is_vote, is_event, event_names)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `;
        const values = [
            trip_id,
            dto.place_id,
            dto.date,
            dto.time_start,
            dto.time_end,
            dto.is_vote,
            dto.is_event,
            dto.event_name,
        ];
        const res = await (0, db_1.query)(sql, values);
        return res.rows[0];
    },
    async update(pit_id, dto) {
        const sql = `
      UPDATE places_in_trip
      SET date = $2, time_start = $3, time_end = $4, event_names = $5
      WHERE pit_id = $1
      RETURNING *
    `;
        const res = await (0, db_1.query)(sql, [pit_id, dto.date, dto.time_start, dto.time_end, dto.event_name]);
        return res.rows[0];
    },
};
// ---------- Places ----------
exports.PlaceRepo = {
    async add(trip_id, dto) {
        const sql = `
      INSERT INTO places_in_trip (trip_id, place_id, date, time_start, time_end, is_vote, is_event, event_names)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `;
        const values = [
            trip_id,
            dto.place_id,
            dto.date,
            dto.time_start,
            dto.time_end,
            dto.is_vote,
            dto.is_event,
            dto.event_name,
        ];
        const res = await (0, db_1.query)(sql, values);
        return res.rows[0];
    },
    async update(pit_id, dto) {
        const sql = `
      UPDATE places_in_trip
      SET date = $2, time_start = $3, time_end = $4
      WHERE pit_id = $1
      RETURNING *
    `;
        const res = await (0, db_1.query)(sql, [pit_id, dto.date, dto.time_start, dto.time_end]);
        return res.rows[0];
    },
};
// ---------- Votes ----------
function normalizeDate(val) {
    if (!val)
        return "";
    try {
        return val instanceof Date ? val.toISOString().slice(0, 10) : String(val);
    }
    catch {
        return String(val ?? "");
    }
}
function normalizeTime(val) {
    if (!val)
        return "";
    try {
        return val instanceof Date
            ? val.toISOString().slice(11, 19)
            : String(val);
    }
    catch {
        return String(val ?? "");
    }
}
exports.VoteRepo = {
    async list(trip_id, pit_id) {
        const blockRes = await (0, db_1.query)(`SELECT date::text AS date, time_start::text AS time_start, time_end::text AS time_end, is_event
       FROM places_in_trip
       WHERE trip_id=$1 AND pit_id=$2 AND is_vote=true`, [trip_id, pit_id]);
        if (!blockRes.rows || blockRes.rows.length === 0) {
            throw new Error(`Voting block ${pit_id} not found or not active`);
        }
        const { date, time_start, time_end, is_event } = blockRes.rows[0];
        const candidatesRes = await (0, db_1.query)(`SELECT pit.pit_id, pit.place_id, pit.event_names, pit.is_event,
              p.address, p.places_picture_path AS photo_url
       FROM places_in_trip pit
       LEFT JOIN places p ON pit.place_id = p.place_id
       WHERE pit.trip_id=$1
         AND pit.date=$2
         AND pit.time_start=$3
         AND pit.time_end=$4
         AND pit.is_vote=true`, [trip_id, date, time_start, time_end]);
        const candidatePitIds = candidatesRes.rows.map((r) => r.pit_id);
        if (candidatePitIds.length === 0) {
            throw new Error(`No candidates found for block ${pit_id}`);
        }
        const votesRes = await (0, db_1.query)(`SELECT pit_id, COUNT(*)::int AS voting_count
       FROM vote
       WHERE trip_id=$1 AND pit_id = ANY($2)
       GROUP BY pit_id`, [trip_id, candidatePitIds]);
        const votesMap = {};
        for (const row of votesRes.rows) {
            votesMap[row.pit_id] = row.voting_count;
        }
        const maxVote = Math.max(...Object.values(votesMap), 0);
        if (!is_event) {
            const places_voting = await Promise.all(candidatesRes.rows.map(async (row) => {
                const voting_count = votesMap[row.pit_id] || 0;
                return {
                    pit_id: row.pit_id,
                    place_id: row.place_id,
                    address: row.address,
                    place_picture_url: row.photo_url
                        ? (await users_repo_1.UsersRepo.get_file_link(row.photo_url, "places", 3600)).signedUrl
                        : null,
                    voting_count,
                    is_most_voted: voting_count === maxVote && maxVote > 0,
                };
            }));
            return {
                date,
                time_start,
                time_end,
                places_voting,
            };
        }
        else {
            const eventCandidates = candidatesRes.rows.map((row) => ({
                pit_id: row.pit_id,
                event_name: row.event_names,
                voting_count: votesMap[row.pit_id] || 0,
            }));
            const mostVotedEvent = eventCandidates.find((c) => c.voting_count === maxVote)?.event_name ?? "";
            return {
                date,
                time_start,
                time_end,
                event_voting: {
                    ...eventCandidates[0],
                    is_most_voted: mostVotedEvent,
                },
            };
        }
    },
    async initVotingBlock(trip_id, type, body) {
        const sql = `
      INSERT INTO places_in_trip (trip_id, place_id, date, time_start, time_end, is_vote, is_event, event_names)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `;
        const values = [
            trip_id,
            body.place_id,
            body.date,
            body.time_start,
            body.time_end,
            true,
            type === "events",
            type === "events" ? body.event_name : "",
        ];
        const res = await (0, db_1.query)(sql, values);
        return res.rows[0];
    },
    async addCandidate(trip_id, pit_id, place_id, body) {
        const block = await (0, db_1.query)(`SELECT date, time_start, time_end, is_event
     FROM places_in_trip
     WHERE trip_id=$1 AND pit_id=$2 AND is_vote=true`, [trip_id, pit_id]);
        if (!block.rows || block.rows.length === 0) {
            throw new Error(`Voting block ${pit_id} not found or not active`);
        }
        const row = block.rows[0];
        const { date, time_start, time_end, is_event } = row;
        if (place_id !== 0 && is_event) {
            throw new Error(`Cannot add place candidate to an event voting block`);
        }
        if (place_id === 0 && !is_event) {
            throw new Error(`Cannot add event candidate to a place voting block`);
        }
        if (place_id !== 0) {
            const checkPlace = await (0, db_1.query)(`SELECT place_id FROM places WHERE place_id=$1`, [place_id]);
            if (checkPlace.rows.length === 0) {
                throw new Error(`Place ${place_id} not found`);
            }
            const sql = `
      INSERT INTO places_in_trip (trip_id, place_id, date, time_start, time_end, is_vote, is_event, event_names)
      VALUES ($1,$2,$3,$4,$5,true,false,'')
      RETURNING *
    `;
            const res = await (0, db_1.query)(sql, [trip_id, place_id, date, time_start, time_end]);
            return res.rows[0];
        }
        if (!body?.event_name) {
            throw new Error(`event_name is required when place_id=0`);
        }
        const sql = `
    INSERT INTO places_in_trip (trip_id, place_id, date, time_start, time_end, is_vote, is_event, event_names)
    VALUES ($1,0,$2,$3,$4,true,true,$5)
    RETURNING *
  `;
        const res = await (0, db_1.query)(sql, [trip_id, date, time_start, time_end, body.event_name]);
        return res.rows[0];
    },
    async votedPlaces(trip_id, pit_id, user_id) {
        const checkPit = await (0, db_1.query)(`SELECT pit_id
      FROM places_in_trip
      WHERE trip_id=$1 AND pit_id=$2 AND is_vote=true AND is_event=false`, [trip_id, pit_id]);
        if (!checkPit.rows || checkPit.rows.length === 0) {
            throw new Error(`Voting pit ${pit_id} not active`);
        }
        const sql = `
      INSERT INTO vote (trip_id, pit_id, user_id, time_start, event_name)
      VALUES ($1,$2,$3,NOW()::text,'')
      ON CONFLICT DO NOTHING
      RETURNING *
    `;
        const res = await (0, db_1.query)(sql, [trip_id, pit_id, user_id]);
        return (res.rows?.length ?? 0) > 0;
    },
    async votedEvents(trip_id, pit_id, user_id, body) {
        const checkPit = await (0, db_1.query)(`SELECT pit_id, event_names
      FROM places_in_trip
      WHERE trip_id=$1 AND pit_id=$2 AND is_vote=true AND is_event=true`, [trip_id, pit_id]);
        if (!checkPit.rows || checkPit.rows.length === 0) {
            throw new Error(`Voting pit ${pit_id} not active`);
        }
        const pitRow = checkPit.rows[0];
        if (!pitRow.event_names || String(pitRow.event_names) !== String(body.event_name)) {
            throw new Error(`Invalid event_name`);
        }
        const sql = `
      INSERT INTO vote (trip_id, pit_id, user_id, time_start, event_name)
      VALUES ($1,$2,$3,NOW()::text,$4)
      ON CONFLICT DO NOTHING
      RETURNING *
    `;
        const res = await (0, db_1.query)(sql, [trip_id, pit_id, user_id, body.event_name]);
        return (res.rows?.length ?? 0) > 0;
    },
    async endVotingPlaces(trip_id, pit_id) {
        const blockRes = await (0, db_1.query)(`SELECT date::text AS block_date, time_start::text AS block_start, time_end::text AS block_end
       FROM places_in_trip 
       WHERE trip_id=$1 AND pit_id=$2 AND is_vote=true AND is_event=false`, [trip_id, pit_id]);
        if (!blockRes.rows || blockRes.rows.length === 0) {
            throw new Error(`Voting block ${pit_id} not found or inactive`);
        }
        const block = blockRes.rows[0];
        const date = normalizeDate(block.block_date);
        const time_start = normalizeTime(block.block_start);
        const time_end = normalizeTime(block.block_end);
        const candidatesRes = await (0, db_1.query)(`SELECT pit_id, place_id
       FROM places_in_trip
       WHERE trip_id=$1 AND date=$2 AND time_start=$3 AND time_end=$4 AND is_event=false`, [trip_id, date, time_start, time_end]);
        const candidatePitIds = candidatesRes.rows.map((r) => r.pit_id);
        if (candidatePitIds.length === 0)
            throw new Error(`No candidates found for block ${pit_id}`);
        const votesRes = await (0, db_1.query)(`SELECT pit_id, COUNT(*)::int AS cnt
       FROM vote
       WHERE trip_id=$1 AND pit_id = ANY($2)
       GROUP BY pit_id
       ORDER BY cnt DESC
       LIMIT 1`, [trip_id, candidatePitIds]);
        if (!votesRes.rows || votesRes.rows.length === 0) {
            throw new Error(`No votes found for block ${pit_id}`);
        }
        const winnerPitId = votesRes.rows[0]?.pit_id;
        if (!winnerPitId)
            throw new Error(`Winner pit_id not found`);
        const updateRes = await (0, db_1.query)(`UPDATE places_in_trip
       SET is_vote=false, place_id=(SELECT place_id FROM places_in_trip WHERE pit_id=$3)
       WHERE trip_id=$1 AND pit_id=$2
       RETURNING *`, [trip_id, pit_id, winnerPitId]);
        return updateRes.rows[0] || null;
    },
    async endVotingEvents(trip_id, pit_id) {
        const blockRes = await (0, db_1.query)(`SELECT date::text AS block_date, time_start::text AS block_start, time_end::text AS block_end
      FROM places_in_trip 
      WHERE trip_id=$1 AND pit_id=$2 AND is_vote=true AND is_event=true`, [trip_id, pit_id]);
        if (!blockRes.rows || blockRes.rows.length === 0) {
            throw new Error(`Voting block ${pit_id} not found or inactive`);
        }
        const block = blockRes.rows[0];
        const date = normalizeDate(block.block_date);
        const time_start = normalizeTime(block.block_start);
        const time_end = normalizeTime(block.block_end);
        const candidatesRes = await (0, db_1.query)(`SELECT pit_id, place_id, event_names
      FROM places_in_trip
      WHERE trip_id=$1 AND date=$2 AND time_start=$3 AND time_end=$4 AND is_event=true`, [trip_id, date, time_start, time_end]);
        const candidatePitIds = candidatesRes.rows.map((r) => r.pit_id);
        if (candidatePitIds.length === 0) {
            throw new Error(`No candidates found for block ${pit_id}`);
        }
        const votesRes = await (0, db_1.query)(`SELECT pit_id, COUNT(*)::int AS cnt
      FROM vote
      WHERE trip_id=$1 AND pit_id = ANY($2)
      GROUP BY pit_id
      ORDER BY cnt DESC
      LIMIT 1`, [trip_id, candidatePitIds]);
        if (!votesRes.rows || votesRes.rows.length === 0) {
            throw new Error(`No votes found for block ${pit_id}`);
        }
        const winnerPitId = votesRes.rows[0]?.pit_id;
        if (!winnerPitId) {
            throw new Error(`Winner pit_id not found`);
        }
        const updateRes = await (0, db_1.query)(`UPDATE places_in_trip
      SET is_vote=false,
          place_id=(SELECT place_id FROM places_in_trip WHERE pit_id=$3),
          event_names=(SELECT event_names FROM places_in_trip WHERE pit_id=$3)
      WHERE trip_id=$1 AND pit_id=$2
      RETURNING *`, [trip_id, pit_id, winnerPitId]);
        return updateRes.rows[0] || null;
    },
    async patchVote(trip_id, pit_id, patch) {
        const sql = `
      UPDATE places_in_trip
      SET date=$3, time_start=$4, time_end=$5
      WHERE trip_id=$1 AND pit_id=$2
      RETURNING *
    `;
        const res = await (0, db_1.query)(sql, [trip_id, pit_id, patch.date, patch.start_time, patch.end_time]);
        return res.rows[0];
    },
    async removeVotingBlock(trip_id, pit_id) {
        const sql = `DELETE FROM places_in_trip WHERE trip_id=$1 AND pit_id=$2 RETURNING pit_id`;
        const res = await (0, db_1.query)(sql, [trip_id, pit_id]);
        return (res.rows?.length ?? 0) > 0;
    },
    async deleteVote(trip_id, pit_id, user_id) {
        const res = await (0, db_1.query)(`DELETE FROM vote
     WHERE trip_id=$1 AND pit_id=$2 AND user_id=$3
     RETURNING *`, [trip_id, pit_id, user_id]);
        return (res.rows?.length ?? 0) > 0;
    }
};
//# sourceMappingURL=activity.repo.js.map