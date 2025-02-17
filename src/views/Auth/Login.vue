<template>
    <div class="page-centered page-login">
        <div class="login-box">
            <div class="box-header">{{ $t('login.header') }}</div>
            <div class="box-banned" v-if="isBanned">
                {{ $t('login.banned.message') }} <a href="https://forms.gle/gpcpFe9jkymXSCsY7" target="_blank">{{ $t('login.banned.appealLinkText') }}</a>
            </div>
            <div class="box-content">
                <input class="input" type="text" v-model="userName" :placeholder="$t('login.form.usernamePlaceholder')" />
                <input class="input" type="password" v-model="userPass" :placeholder="$t('login.form.passwordPlaceholder')" />

                <button v-on:click="login()" class="button button-filled">{{ $t('login.form.loginButton') }}</button>
                
                <div class="social-logins">
                    <button v-on:click="loginDiscord()" class="button">Discord</button>
                    <!-- <button v-on:click="loginDiscord()" class="button">Twitter</button>
                    <button v-on:click="loginDiscord()" class="button">Google</button> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import MGGApi from '../../modules/api';

    export default {
        name: 'Login',
        metaInfo: {
            title: 'Login',
        },
        data: function() {
            return {
                apiRef: null,
                userName: "",
                userPass: "",
                isBanned: false,
            }
        },
        created: function() {
            this.$data.apiRef = new MGGApi();
        },
        methods: {
            login: async function() {
                this.$data.isBanned = false;

                if(this.$data.userName == "" || this.$data.userPass == "") {
                    this.$root.$emit('addSnackbar', {
                        type: "error",
                        icon: "key",
                        text: this.$t('login.snackbar.error.fillOut'),
                        stay: false,
                    });
                    return;
                }

                try {
                    const loginResponse = await this.$data.apiRef.authLogin(this.$data.userName, this.$data.userPass);
                    this.$store.dispatch('refreshUser', loginResponse);

                    this.$root.$emit('addSnackbar', {
                        type: "success",
                        icon: "key",
                        text: this.$t('login.snackbar.welcomeBack', {username: loginResponse.userData.username}),
                        stay: false,
                    });

                    this.$router.push({ name: 'Index' });
                } catch(error) {
                    switch(error.name) {
                        default:
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "key",
                                text: this.$t('login.snackbar.error.serverError'),
                                stay: false,
                            });
                            break;
                        case "UserNotFoundException":
                            // Wrong username
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "key",
                                text: this.$t('login.snackbar.error.userDoesntExist'),
                                stay: false,
                            });
                            break;
                        case "AuthenticationWrongException":
                            // Wrong Password
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "key",
                                text: this.$t('login.snackbar.error.passwordWrong'),
                                stay: false,
                            });
                            break;
                        case "AuthenticationBannedException":
                            // Banned
                            this.$data.isBanned = true;
                            this.$root.$emit('addSnackbar', {
                                type: "error",
                                icon: "key",
                                text: this.$t('login.snackbar.error.banned', {reason: error.message}),
                                stay: true,
                            });
                            break;
                    }
                }
            },
            loginDiscord: async function() {
                let oauthUrl = await this.$data.apiRef.oauthDiscordGetUrl();

                window.location = oauthUrl.url;
            }
        }
    }
</script>

<style lang="less" scoped>
    .page-login {
        background: url('../../assets/img/patternLight.png') center #ffd332;

        & .login-box {
            background: #fff;
            border: 2px solid #222;
            border-radius: 10px;
            width: 90%;
            max-width: 400px;
            overflow: hidden;
            margin: 25px 0px;

            & .box-header {
                background: #222;
                padding: 10px 15px;
                font-size: 12px;
                color: #fff;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.15em;
            }
            & .box-banned {
                padding: 20px;
                text-align: center;
                background: #fd084d;
                color: #fff;
            }
            & .box-content {
                padding: 20px;
                display: grid;
                grid-gap: 15px;

                & button {
                    justify-self: right;
                }

                & .social-logins {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    grid-gap: 15px;
                    margin-top: 15px;

                    & button {
                        justify-self: stretch;
                    }
                }
            }
        }
    }

    .theme-dark {
        & .page-login {
            background: url('../../assets/img/patternDark.png') center #322700;

            & .login-box {
                background: #222;
                color: #fff;
                border: 2px solid #fff;

                & .box-header {
                    background: #fff;
                    color: #222;
                }
            }
        }
    }
</style>