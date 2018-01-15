import axios from 'axios'

let FB = axios.create({
    baseURL: 'https://graph.facebook.com/v2.11'
});

export default {
    async getComment({link, pid, access_token}) {
        if (!link) {
            let response = await FB.get(`${pid}/comments?fields=from{picture,name},message&limit=10&order=chronological&access_token=${access_token}`);
            // console.log(response);
            return {data: response.data.data, meta: {next: _.get(response, 'data.paging.next', undefined)}}
        }
        let response = await axios.get(link);
        // console.log("LINK");
        // console.log(response);
        return {data: response.data.data, meta: { next: _.get(response, 'data.paging.next', undefined) }};
    }

}