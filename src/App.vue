<template>
    <v-app>
        <!--<v-navigation-drawer-->
                <!--fixed-->
                <!--clipped-->
                <!--v-model="drawer"-->
                <!--app-->
        <!--&gt;-->
            <!--<v-list>-->
                <!--<v-list-tile-->
                        <!--value="true"-->
                        <!--v-for="(item, i) in items"-->
                        <!--:key="i"-->
                <!--&gt;-->
                    <!--<v-list-tile-action>-->
                        <!--<v-icon v-html="item.icon"></v-icon>-->
                    <!--</v-list-tile-action>-->
                    <!--<v-list-tile-content>-->
                        <!--<v-list-tile-title v-text="item.title"></v-list-tile-title>-->
                    <!--</v-list-tile-content>-->
                <!--</v-list-tile>-->
            <!--</v-list>-->
        <!--</v-navigation-drawer>-->
        <!--<v-toolbar fixed app clipped-left>-->
            <!--<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>-->
            <!--<v-toolbar-title v-text="title"></v-toolbar-title>-->
            <!--<v-spacer></v-spacer>-->
        <!--</v-toolbar>-->
        <!--<v-content>-->
            <v-container fluid>
                <v-slide-y-transition mode="out-in">
                    <v-layout row wrap>
                        <router-view/>
                    </v-layout>
                </v-slide-y-transition>
            </v-container>
        <!--</v-content>-->
        <!--<v-footer fixed app>-->
            <!--<span>&copy; 2017</span>-->
        <!--</v-footer>-->
    </v-app>
</template>

<script>
    export default {
        data() {
            return {
                drawer: false,
                items: [
                    {icon: 'bubble_chart', title: 'Inspire'}
                ],
                title: 'Livestreaming'
            }
        }
    }
</script>

<style>
    ::-webkit-scrollbar {
        width: 8px;
        background: #fafafa;
    }

    ::-webkit-scrollbar-thumb {
        background: #02cbf7;
    }
</style>
