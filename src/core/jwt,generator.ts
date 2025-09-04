import jwt from 'jsonwebtoken';
import ms from 'ms';

export function gen_jwt_token(jwt_scret:string,playload:object,expireIn:number | ms.StringValue):string{
    const gen_token = jwt.sign(playload,jwt_scret,{expiresIn:expireIn});
    return gen_token;
}