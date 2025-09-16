export declare const ActivityController: {
    listAll: (req: any, res: any, next: any) => Promise<any>;
    list: (req: any, res: any, next: any) => Promise<any>;
    remove: (req: any, res: any, next: any) => Promise<any>;
};
export declare const EventController: {
    create: (req: any, res: any, next: any) => Promise<any>;
    update: (req: any, res: any, next: any) => Promise<any>;
};
export declare const PlaceController: {
    add: (req: any, res: any, next: any) => Promise<any>;
    update: (req: any, res: any, next: any) => Promise<any>;
};
export declare const VoteController: {
    list: (req: any, res: any, next: any) => Promise<any>;
    postInit: (req: any, res: any, next: any) => Promise<any>;
    voteByCandidate: (req: any, res: any, next: any) => Promise<any>;
    voteTypeEnd: (req: any, res: any, next: any) => Promise<any>;
    votedType: (req: any, res: any, next: any) => Promise<any>;
    patchVote: (req: any, res: any, next: any) => Promise<any>;
    unvote: (req: any, res: any, next: any) => Promise<any>;
    deleteVote: (req: any, res: any, next: any) => Promise<any>;
};
//# sourceMappingURL=activity.controller.d.ts.map