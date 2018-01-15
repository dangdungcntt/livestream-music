import axios from 'axios';

let apiKey = localStorage.apiKey;

let YT = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3'
});
export default {
    async fetchVideoInfo({vid}) {
        let response = await YT.get('videos', {
            params: {
                id: vid,
                part: 'snippet,contentDetails',
                key: apiKey
            }
        }).catch(err => {});
        return _.get(response, 'data.items', undefined);
    },
    convertYouTubeDuration: yt_duration => {
        const time_extractor = /([0-9]*H)?([0-9]*M)?([0-9]*S)?$/;
        const extracted = time_extractor.exec(yt_duration);
        const hours = parseInt(extracted[1], 10) || 0;
        const minutes = parseInt(extracted[2], 10) || 0;
        const seconds = parseInt(extracted[3], 10) || 0;
        return (hours * 3600 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
    },
    getVideoId({url, opts}) {
        if (opts === undefined) {
            opts = {fuzzy: true};
        }

        if (/youtu\.?be/.test(url)) {

            // Look first for known patterns
            let i;
            let patterns = [
                /youtu\.be\/([^#\&\?]{11})/,  // youtu.be/<id>
                /\?v=([^#\&\?]{11})/,         // ?v=<id>
                /\&v=([^#\&\?]{11})/,         // &v=<id>
                /embed\/([^#\&\?]{11})/,      // embed/<id>
                /\/v\/([^#\&\?]{11})/         // /v/<id>
            ];

            // If any pattern matches, return the ID
            for (i = 0; i < patterns.length; ++i) {
                if (patterns[i].test(url)) {
                    return patterns[i].exec(url)[1];
                }
            }

            if (opts.fuzzy) {
                // If that fails, break it apart by certain characters and look
                // for the 11 character key
                let tokens = url.split(/[\/\&\?=#\.\s]/g);
                for (i = 0; i < tokens.length; ++i) {
                    if (/^[^#\&\?]{11}$/.test(tokens[i])) {
                        return tokens[i];
                    }
                }
            }
        }

        return null;
    },
    detectLinkYoutube({str}) {
        let reg = new RegExp('http(?:s?):\\/\\/(?:www\\.)?youtu(?:be\\.com\\/watch\\?v=|\\.be\\/)([\\w\\-\\_]*)(&(amp;)?‌​[\\w\\?‌​=]*)?', 'g')
        let res = reg.exec(str);
        return res ? res[0] : undefined;
    }
}