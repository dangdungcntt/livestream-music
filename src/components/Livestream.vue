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
                <v-list two-line :style="{bottom: (72 * (displayComments.length - 3)) + 'px', position: 'relative', transition: cutComment + 's'}">
                    <template v-for="comment in displayComments">
                        <v-list-tile avatar :key="_.get(comment, 'id')" @click="">
                            <v-list-tile-avatar>
                                <img :src="_.get(comment, 'from.picture.data.url', 'https://i.imgur.com/GpaLu2q.png')">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-text="_.get(comment, 'from.name', 'Anonymous')"/>
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
            <ul class="list-videos" style="height: 60px">
                <li class="moving-item video-container" v-if=" ! _.isEqual(playingVideo, {})">
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
            <v-list two-line v-if=" ! _.isEqual(playingVideo, {})">
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
                <!--v-for="link in listVideo" ::key="link" :style="{ top: (link.position * 35) + 'px'}"-->
                <!--v-if="link.index === curIndex"-->
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
            <div style="height:285px;overflow: hidden; position: relative">
                <ul class="list-videos queue"
                    :style="{
                        transition: (queueLength * 1500) + 'ms linear',
                        top: queueTop}">
                    <li class="moving-item video-container"
                        v-for="video in listVideoInQueue"
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
            return {
                queueIndex: -1,
                listVideoInQueue: [

                ],
                playedVideo: new Map(),
                sortedListVideo: [],
                rawComments: [
                    {
                        "from": {
                            "picture": {
                                "data": {
                                    "height": 50,
                                    "is_silhouette": false,
                                    "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/15578812_2063545387205036_3839048549796851743_n.jpg?oh=2f65df51f23b7151c14c4a9bafc188a5&oe=5AEFBA18",
                                    "width": 50
                                }
                            },
                            "name": "Nguyễn Đăng Dũng",
                            "id": "1677028372523408"
                        },
                        "message": "https://www.youtube.com/watch?v=V-mP3VU0DCg Chúc mọi người buổi tối vui vẻ :D",
                        "id": "851143101731199"
                    }
                ],
                displayComments: [

                ],
                displayedComments: new Map(),
                cutComment: 1,
                next_page_comment: undefined,
                itvLoadComment: '',
                pid: '',
                videoId: '',
                maxDuration: YTHelper.convertYouTubeDuration('PT8M'),
                playingVideo: {},
                playing: false,
                queueLength: 0,
                queueTop: 0,
                scrolling: false,
            }
        },
        created() {
            this.pid = this.$route.params.pid;
            this.changeOrder();
            if (this.sortedListVideo.length > 0) {
                this.ended();
                setTimeout(this.scrollQueueToTop, 4000);
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
                let comment = this.rawComments.splice(0, 1)[0];

                while (this.displayedComments.has(comment.id) && this.rawComments.length > 0) {
                    comment = this.rawComments.splice(0, 1)[0]
                }
                if (this.displayedComments.has(comment.id)) return;

                this.displayComments.push(comment);
                if (this.displayComments.length > 10) {
                    setTimeout(() => {
                        this.cutComment = 0;
                        this.displayComments.splice(0, 8);
                    }, 1200);
                    setTimeout(() => {
                        this.cutComment = 1;
                    }, 2500);
                }
                this.displayedComments.set(comment.id, true);
                let youtubeLink = YTHelper.detectLinkYoutube({str: comment.message});
                if (youtubeLink) {
                    let idVideo = YTHelper.getVideoId({url: youtubeLink});

                    if (this.playedVideo.has(idVideo)) return;

                    let exists = false;
                    for (let video of this.listVideoInQueue) {
                        if (video.id === idVideo) {
                            video.vote = video.vote + 1;
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        let data = await YTHelper.fetchVideoInfo({vid: idVideo});
                        if (!data) return;

                        let videoInfo = data[0];
                        let videoDuration = YTHelper.convertYouTubeDuration(_.get(videoInfo, 'contentDetails.duration'));

                        if (videoDuration > this.maxDuration) return;

                        this.queueIndex = this.queueIndex + 1;
                        this.listVideoInQueue.push({
                            from: comment.from,
                            message: comment.message.replace(youtubeLink, ''),
                            id: idVideo,
                            name: _.get(videoInfo, 'snippet.title'),
                            index: this.queueIndex,
                            position: this.listVideoInQueue.length,
                            src: _.get(videoInfo, 'snippet.thumbnails.default.url'),
                            vote: 1
                        });
                        this.scrollQueueToTop();
                    }
                    this.changeOrder();
                    if (!this.playing) {
                        this.ended();
                    }
                    return;
                }
                let voteForIndex = +comment.message;
                if (_.isNaN(voteForIndex)) return;

                let exists = false;
                for (let video of this.listVideoInQueue) {
                    if (video.index === voteForIndex - 1) {
                        video.vote = video.vote + 1;
                        exists = true;
                        break;
                    }
                }
                if (exists) this.changeOrder();
                if (!this.playing) {
                    this.ended();
                }
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
                if (this.listVideoInQueue.length < 6) {
                    this.queueLength = 0;
                    this.queueTop = '0';
                    return
                }
                this.queueLength = this.listVideoInQueue.length;
                this.queueTop = (-57 * this.queueLength) + 'px';
                this.scrolling = true;
                setTimeout(() => {
                    this.queueLength = 0;
                    this.queueTop = '310px';
                    this.scrolling = false;
                    setTimeout(() => {
                        this.scrollQueueToTop();
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
                if (this.listVideoInQueue.length === 0) return;
                this.playingVideo = this.sortedListVideo.splice(0, 1)[0];
                this.listVideoInQueue = this.listVideoInQueue.filter(video => video.index !== this.playingVideo.index);
                this.changeOrder();
                this.playVideo();
            },
            setPlaying() {
                this.playing = true;
                this.playedVideo.set(this.playingVideo.id, true);
            },
            getId({link}) {
                return this.$youtube.getIdFromUrl(link)
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

    .video-container, .video-index, .video-meta-container {
        display: flex;
    }

    .video-index {
        flex: none;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        width: 18px;

    }

    .video-thumbnail-container {
        display: block;
        flex: none;
        width: 80px;
        height: 45px;
    }

    .video-thumbnail-container img {
        width: 100%;
        height: 100%;
    }

    .video-meta-container {
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