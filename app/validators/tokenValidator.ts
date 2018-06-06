import { Request, Response, Next } from 'restify';
const Client = require('node-rest-client').Client;

export class TokenValidator {

    public checkToken = async (req: any, res: Response, next: Next) => {
        // http://mongoosejs.com/docs/api.html#model_Model.find
        // console.log('======');
        // console.log(req.token);
        // next();
        const client = new Client();
            // Data test
            // request and response additional configuration
            let datapost = {name_api: 'post_users/login'};
            const args = {
                headers: {
                    'Authorization': 'Bearer ' + req.token,
                    'Content-Type': 'application/json'
                },
                data: datapost,
                requestConfig: {
                    timeout: 10000, // request timeout in milliseconds
                    noDelay: true, // Enable/disable the Nagle algorithm
                    keepAlive: true, // Enable/disable keep-alive functionalityidle socket.
                    keepAliveDelay: 1000 // and optionally set the initial delay before the first keepalive probe is sent
                },
                responseConfig: {
                    timeout: 1000 // response timeout
                }
            };
            const reqapi = client.post('http://13.250.129.169:3002/oauth/authorise/check', args, function (data: any, response: any) {                // parsed response body as js object
                // console.log(data);
                // console.log('++++');
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    req['token'] = data.result.infor;
                    next();
                }
                else {
                    res.send(400, 'không có token ' + req.token);
                }

            });
        }
}