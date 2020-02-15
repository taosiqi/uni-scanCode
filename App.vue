<script>
	export default {
		//这里可以获取系统语言
		globalData: {
			lang: 'cn'
		},
		onLaunch: function() {
			console.log('App onLaunch');
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
	};
</script>

<style>
	/*每个页面公共css */
	@import './common/uni.css';
</style>
