const CONFIG = {
    // Switch this to 'false' when you are ready to use the deployed site
    isDev: true,
    devUrl: 'http://localhost:5173',
    prodUrl: 'https://clipvora.vercel.app',

    get activeUrl() {
        return this.isDev ? this.devUrl : this.prodUrl;
    }
};
