<template>
    <v-layout row wrap>
        <v-flex sm8>
            <youtube
                    :video-id="videoId"
                    ref="youtube"
                    :player-vars="{ autoplay: 1 }"
                    width="100%"
                    :height="468"
                    @playing="setPlaying()"
                    @ended="ended()"
            />
            <v-layout column style="height: 214px;overflow: hidden;position: relative;">
                <v-list two-line
                        :style="{bottom: (72 * (displayComments.length - 3)) + 'px', position: 'relative', transition: cutComment + 's'}">
                    <template v-for="comment in displayComments">
                        <v-list-tile avatar :key="_.get(comment, 'id')" @click="">
                            <v-list-tile-avatar>
                                <img :src="_.get(comment, 'from.picture.data.url', 'https://i.imgur.com/GpaLu2q.png')">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title :style="{
                                    color: getVipConfig({id: comment.from.id, path: 'color'}),
                                    'font-weight': getVipConfig({id: comment.from.id, path: 'font-weight'}),
                                }" v-text="_.get(comment, 'from.name', 'Anonymous')"/>
                                <v-list-tile-sub-title v-text="_.get(comment, 'message', 'Empty')"/>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-layout>
        </v-flex>
        <v-flex sm4 style="padding-left: 10px">
            <!--Playing-->
            <div style="text-transform: uppercase;
        margin-bottom: 2px;
        margin-left: 18px;
        font-size: 16px;">Playing
            </div>
            <ul class="list-videos" style="height: 50px">
                <li class="moving-item video-container" v-if=" ! _.isEqual(playingVideo, {})" style="margin-bottom: 0">
                    <span class="video-index">▶</span>
                    <div class="video-thumbnail-container">
                        <img :src="playingVideo.src" alt="">
                    </div>
                    <div class="video-meta-container">
                        <div class="video-meta-title">
                            {{playingVideo.name}}
                        </div>
                    </div>
                </li>
            </ul>
            <v-list two-line v-if=" ! _.isEqual(playingVideo, {})" style="padding: 0">
                <v-list-tile avatar :key="_.get(playedVideo, 'id')" @click="">
                    <v-list-tile-avatar>
                        <img :src="_.get(playingVideo, 'from.picture.data.url', 'https://i.imgur.com/GpaLu2q.png')">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="_.get(playingVideo, 'from.name', 'Anonymous')"/>
                        <v-list-tile-sub-title v-text="_.get(playingVideo, 'message', 'Empty')"/>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
            <hr>
            <!--Top-->
            <div style="text-transform: uppercase;
        margin-bottom: 2px;
        margin-left: 18px;
        font-size: 16px;">Top
            </div>
            <ul class="list-videos top" style="height: 175px; position: relative">
                <li class="moving-item video-container"
                    v-for="video in top3Video"
                    :style="{ top: (video.position * 56) + 'px'}">
                    <span class="video-index">{{video.index + 1}}</span>
                    <div class="video-thumbnail-container">
                        <img :src="video.src" alt="">
                    </div>
                    <div class="video-meta-container">
                        <div class="video-meta-title">
                            {{video.name}}
                        </div>
                    </div>
                    <div class="video-from-container">
                        <img :src="_.get(video, 'from.picture.data.url', 'https://i.imgur.com/GpaLu2q.png')">
                    </div>
                    <div class="video-vote-container">
                        <span class="vote">
                            {{video.vote}}
                            <img src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjMyIiBjbGFzcz0ib2N0aWNvbiBvY3RpY29uLXN0YXIiIHZpZXdCb3g9IjAgMCAxNCAxNiIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjgiIGFyaWEtaGlkZGVuPSJ0cnVlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI0ZGQUMyQyIgZD0iTTE0IDZsLTQuOS0uNjRMNyAxIDQuOSA1LjM2IDAgNmwzLjYgMy4yNkwyLjY3IDE0IDcgMTEuNjcgMTEuMzMgMTRsLS45My00Ljc0eiI+PC9wYXRoPgo8L3N2Zz4K"
                                 alt="☆" width="14" height="16">
                        </span>
                    </div>
                </li>
            </ul>
            <hr>
            <div style="text-transform: uppercase;
        margin-bottom: 2px;
        margin-left: 18px;
        font-size: 16px;">All
            </div>
            <div style="height:308px;overflow: hidden; position: relative">
                <ul class="list-videos queue"
                    :style="{
                        transition: (queueLength * 1500) + 'ms linear',
                        top: queueTop}">
                    <li class="moving-item video-container"
                        v-for="video in listVideoInQueue"
                        :style="{ top: (video.position * 56) + 'px'}">
                        <div class="video-index">{{video.index + 1}}</div>
                        <div class="video-thumbnail-container">
                            <img :src="video.src" alt="">
                        </div>
                        <div class="video-meta-container">
                            <div class="video-meta-title">
                                {{video.name}}
                            </div>
                        </div>
                        <div class="video-from-container">
                            <img :src="_.get(video, 'from.picture.data.url', 'https://i.imgur.com/GpaLu2q.png')">
                        </div>
                        <div class="video-vote-container">
                        <span class="vote">
                            {{video.vote}}
                            <img src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjMyIiBjbGFzcz0ib2N0aWNvbiBvY3RpY29uLXN0YXIiIHZpZXdCb3g9IjAgMCAxNCAxNiIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjgiIGFyaWEtaGlkZGVuPSJ0cnVlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI0ZGQUMyQyIgZD0iTTE0IDZsLTQuOS0uNjRMNyAxIDQuOSA1LjM2IDAgNmwzLjYgMy4yNkwyLjY3IDE0IDcgMTEuNjcgMTEuMzMgMTRsLS45My00Ljc0eiI+PC9wYXRoPgo8L3N2Zz4K"
                                 alt="☆" width="14" height="16">
                        </span>
                        </div>
                    </li>
                </ul>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
    import YTHelper from 'libs/youtube-helpers'
    import FBHelper from 'libs/fb-helpers'

    export default {
        name: "livestream",
        data() {
            let vipConfig = new Map();
            vipConfig.set('100006472931102', {color: '#fa3c4c', 'font-weight': 'bold'});
            vipConfig.set('100006487845973', {color: '#8227e3', 'font-weight': 'bold'});
            return {
                vipConfig,
                voteMap: new Map(),
                maxVote: 5,
                countSpamComment: new Map(),
                spamCheck: 5,
                prevFromId: '',
                rawComments: [],
                displayComments: [],
                displayedComments: new Map(),
                cutComment: 1,
                next_page_comment: undefined,
                itvLoadComment: '',
                pid: '',
                videoId: '',
                maxDuration: YTHelper.convertYouTubeDuration('PT8M'),
                playingVideo: {},
                playing: false,
                queueTop: 0,
                queueLength: 0,
                queueIndex: -1,
                listVideoInQueue: [],
                sortedListVideo: [],
                playedVideo: new Map(),
                scrolling: false,
            }
        },
        created() {
            this.pid = this.$route.params.pid;
            this.changeOrder();
            if (this.sortedListVideo.length > 0) {
                this.ended();
                setTimeout(this.scrollQueueToTop, 2000);
            }
            this.loadComment();
        },
        computed: {
            top3Video() {
                let top3 = [];
                for (let i = 0; i < 3 && i < this.sortedListVideo.length; i++) {
                    top3.push({...this.sortedListVideo[i]});
                }
                let cloneOfTop3 = [...top3];
                cloneOfTop3.forEach((video, index) => video.position = index);
                return cloneOfTop3;
            },
            player() {
                return this.$refs.youtube.player
            }
        },
        methods: {
            getVipConfig({id, path}) {
                if (this.vipConfig.has(id)) {
                    return _.get(this.vipConfig.get(id), path);
                }
                return 'initial';
            },
            async loadComment() {
                this.itvLoadComment = setInterval(async () => {
                    if (this.rawComments.length > 0) {
                        this.hasRawComment();
                    } else {
                        this.fetchNewComment();
                    }
                }, 4000);
            },
            async hasRawComment() {
                //cut list comment displayed
                if (this.displayComments.length > 10) {
                    setTimeout(() => {
                        this.cutComment = 0;
                        this.displayComments.splice(0, 8);
                    }, 1200);
                    setTimeout(() => {
                        this.cutComment = 1;
                    }, 2500);
                }

                //remove all comment displayed
                let comment = this.rawComments.splice(0, 1)[0];
                while (this.displayedComments.has(comment.id) && this.rawComments.length > 0) {
                    comment = this.rawComments.splice(0, 1)[0]
                }
                if (this.displayedComments.has(comment.id)) return;

                let commentId = _.get(comment, 'id');
                let fromId = _.get(comment, 'from.id');
                this.displayedComments.set(commentId, true);

                //super user
                if (fromId.toString() === '100006487845973' && _.get(comment, 'message') === 'sudo control next') {
                    this.ended();
                    return
                }

                //check spam
                if (this.prevFromId === fromId && fromId.toString() !== '100006487845973') {
                    let c = this.countSpamComment.get(fromId);
                    if (c + 1 > this.spamCheck) {
                        return;
                    }
                    this.countSpamComment.set(fromId, c + 1)
                } else {
                    this.countSpamComment.set(this.prevFromId, 0);
                    this.countSpamComment.set(fromId, 1);
                    this.prevFromId = fromId;
                }

                //comment is number => vote
                let voteForIndex = +comment.message;
                if (!_.isNaN(voteForIndex)) {
                    //if exists => vote
                    let exists = false;
                    for (let video of this.listVideoInQueue) {
                        if (video.index === voteForIndex - 1) {
                            if (_.get(video, 'from.id') === fromId) { //cannot vote for self video
                                return;
                            }

                            //check max vote for per video
                            let key = fromId + '_' + voteForIndex;
                            if (this.voteMap.has(key)) {
                                let curVote = this.voteMap.get(key);
                                if (curVote + 1 > this.maxVote) {
                                    return;
                                }
                                this.voteMap.set(key, curVote + 1);
                            } else {
                                this.voteMap.set(key, 1);
                            }
                            video.vote = video.vote + 1;
                            exists = true;
                            break;
                        }
                    }
                    if (exists) {
                        this.displayComments.push(comment);
                        this.changeOrder();
                        if (!this.playing) {
                            this.ended(); //call ended to play first video in queue
                        }
                    }
                    return;
                }

                let youtubeLink = YTHelper.detectLinkYoutube({str: comment.message});
                if (youtubeLink) { //comment has youtube link
                    let idVideo = YTHelper.getVideoId({url: youtubeLink}); //get id video

                    if (this.playedVideo.has(idVideo)) return; //played, ignore

                    //if exists => vote
                    let exists = false;
                    for (let video of this.listVideoInQueue) {
                        if (video.id === idVideo) {
                            video.vote = video.vote + 1;
                            exists = true;
                            break;
                        }
                    }
                    //not exists => push to queue
                    if (!exists) {
                        let data = await YTHelper.fetchVideoInfo({vid: idVideo}); //get infor from youtube API
                        if (!data) return; //not found

                        let videoInfo = data[0];

                        //check max duration
                        let videoDuration = YTHelper.convertYouTubeDuration(_.get(videoInfo, 'contentDetails.duration'));
                        if (videoDuration > this.maxDuration) return;

                        //push to queue
                        this.queueIndex = this.queueIndex + 1;
                        let message = comment.message.replace(youtubeLink, '');
                        if (message.length > 100) message = message.substr(0, 100);
                        this.listVideoInQueue.push({
                            from: comment.from, //owner
                            message,
                            id: idVideo,
                            name: _.get(videoInfo, 'snippet.title'), //name video
                            index: this.queueIndex, //index for vote
                            position: this.listVideoInQueue.length, //postion for animation change order
                            src: _.get(videoInfo, 'snippet.thumbnails.default.url'), //src of img
                            vote: 1
                        });
                        this.scrollQueueToTop();
                    }
                    this.changeOrder();
                    if (!this.playing) { //if not playing
                        this.ended(); //call ended to play first video in queue
                    }
                }
                if (comment.message.length > 100)
                    comment.message = comment.message.substr(0, 100);
                this.displayComments.push(comment);
            },
            async fetchNewComment() {
                let commentsData;
                if (this.next_page_comment) {
                    commentsData = await FBHelper.getComment({link: this.next_page_comment});
                } else {
                    let {token} = localStorage;
                    commentsData = await FBHelper.getComment({pid: this.pid, access_token: token});
                }

                this.rawComments = this.rawComments.concat(commentsData.data);
                this.next_page_comment = commentsData.meta.next || this.next_page_comment;
                this.hasRawComment();
            },
            scrollQueueToTop() {
                if (this.scrolling) return;
                //queue can display 6 video at time
                if (this.listVideoInQueue.length < 6) {
                    this.queueLength = 0;
                    this.queueTop = 0;
                    return
                }
                this.queueLength = this.listVideoInQueue.length;
                this.queueTop = (-57 * this.queueLength) + 'px';
                this.scrolling = true;

                //time out when complete animation scroll
                setTimeout(() => {
                    this.queueLength = 0; //set transition = 0
                    this.queueTop = '310px'; //move queue to bottom
                    this.scrolling = false;
                    setTimeout(() => {
                        this.scrollQueueToTop(); //continute scroll
                    }, 100);
                }, this.queueLength * 1500)
            },

            async playVideo() {
                this.videoId = this.playingVideo.id;

                try {
                    await this.player.playVideo();
                } catch (err) {
                }
            },
            ended() {
                this.playing = false;
                if (this.listVideoInQueue.length === 0) return; //queue is empty
                this.playingVideo = this.sortedListVideo.splice(0, 1)[0];
                this.listVideoInQueue = this.listVideoInQueue.filter(video => video.index !== this.playingVideo.index);
                this.changeOrder();
                this.playVideo();
            },
            setPlaying() {
                this.playing = true;
                this.playedVideo.set(this.playingVideo.id, true); //mark video is played
            },
            changeOrder() {
                let self = this;
                this.sortedListVideo = self.listVideoInQueue.slice().sort(function (a, b) {
                    if (a.vote === +b.vote) return 0;
                    if (a.vote < b.vote) return 1;
                    return -1;
                });
                this.sortedListVideo.forEach(function (item, index) {
                    item.position = index;
                });
            }
        }
    }
</script>

<style scoped>
    .moving-item {
        transition: all 1s ease;
        -webkit-transition: all 1s ease;
    }

    ul.list-videos {
        list-style-type: none;
        padding: 0;
        position: relative;
    }

    ul.list-videos li {
        position: absolute;
        margin-bottom: 8px;
        width: 100%;
    }

    ul.list-videos li.list-videos-title {
        text-transform: uppercase;
        margin-bottom: 2px;
        margin-left: 18px;
        font-size: 16px;
    }

    ul.top > .video-container:nth-child(1) .vote {
        border-color: #ff5252;
    }

    ul.top > .video-container:nth-child(2) .vote {
        border-color: #2196f3;
    }

    ul.top > .video-container:nth-child(3) .vote {
        border-color: #4caf50;
    }

    ul.top > .video-container:nth-child(n + 6) .vote {
        border: none;
    }

    ul.queue {

        /*height: 380px;*/
        /*overflow: hidden;*/
    }

    .video-container {
        display: flex;
    }

    .video-index {
        display: flex;
        flex: none;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        width: 18px;
        padding: 4px;
    }

    .video-thumbnail-container {
        display: block;
        flex: none;
        width: 80px;
        height: 50px;
    }

    .video-thumbnail-container img {
        width: 100%;
        height: 100%;
    }

    .video-meta-container {
        display: flex;
        flex: 1;
        flex-basis: 0.000000001px;
        flex-direction: column;
        padding: 6px;
    }

    .video-meta-container .video-meta-title {
        display: block;
        margin: 0 0 4px 0;
        max-height: 2.4rem;
        overflow: hidden;
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.2rem;
    }

    .video-from-container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding-right: 4px;
    }

    .video-from-container img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
    }

    .video-vote-container {
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .video-vote-container .vote {
        padding: 3px;
        font-size: 16px;
        font-weight: 300;
        border: #eee 2px solid;
        border-radius: 4px;
    }

    .video-vote-container .vote img {
        transform: translateY(2px);
    }
</style>