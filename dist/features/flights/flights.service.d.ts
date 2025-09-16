export declare function get_flight(trip_id: number): Promise<import("pg").QueryResultRow[]>;
export declare function delete_flight(user_id: string, trip_id: number, flight_id: number): Promise<boolean>;
export type FlightInsert = {
    dep_date: string;
    dep_time: string;
    dep_country: string;
    dep_airp_code: string;
    arr_date: string;
    arr_time: string;
    arr_country: string;
    arr_airp_code: string;
    airl_name: string;
};
export declare function post_flight(user_id: string, input: FlightInsert, trip_id: number): Promise<import("pg").QueryResultRow | undefined>;
export declare function put_flight(user_id: string, input: FlightInsert, trip_id: number, flight_id: number): Promise<import("pg").QueryResultRow | undefined>;
//# sourceMappingURL=flights.service.d.ts.map