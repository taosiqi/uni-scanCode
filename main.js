import Vue from 'vue'
import App from './App'
import VueI18n from 'vue-i18n'
import setTitle from './common/setTitle.js'
Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.mixin(setTitle);

const i18n = new VueI18n({
	locale: 'cn',
	messages: {
		'cn': require('./lang/cn.json'),
		'en': require('./lang/en.json')
	}
});

Vue.prototype._i18n = i18n
Vue.prototype.$eventHub = new Vue();

App.mpType = 'app'
const app = new Vue({
	i18n,
	...App
})
app.$mount()
