<template>
	<view>
		<view class="codeData">{{$t('scan.text')}}{{codeData}}</view>
		<button class="codeBtn" type="primary" @tap="open">{{$t('scan.title')}}</button>
		<button class="codeBtn" type="primary" @tap="switchLang('cn')">中文</button>
		<button class="codeBtn" type="primary" @tap="switchLang('en')">英文</button>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				codeData: '' //获取到的二维码内容。
			}
		},
		methods: {
			// 扫码
			open() {
				uni.navigateTo({
					url: '../scan/scan'
				});
			},
			// 切换语言
			switchLang(opt){
					getApp().globalData.lang = opt
					this.$i18n.locale = opt
					this.setTitle("首页", "index")
					this.setTab()
			},
			// 修改底部导航文本
			setTab() {
				switch (getApp().globalData.lang) {
					case 'cn':
						uni.setTabBarItem({
							index: 0,
							text: '首页',
						})
						uni.setTabBarItem({
							index: 1,
							text: '我的',
						})
						break;
					case 'en':
						uni.setTabBarItem({
							index: 0,
							text: 'index',
						})
						uni.setTabBarItem({
							index: 1,
							text: 'me',
						})
						break;
					default:
						break;
				}
			},
		},
		onReady() {

		},
		onLoad() {
			let _this=this
			// js里使用多语言
			_this.tip(_this.$t('scan.title'))
			// #ifdef APP-PLUS
			// 接收扫码的值
			// $eventHub在mainjs定义了 
			_this.$eventHub .$on("scanResult", function(data) {
				_this.codeData = data.result;
			});
			// #endif
		},
	}
</script>

<style>
	.codeData{
		height: 300rpx;
		width: 690rpx;
		margin: 30rpx;
		border: 1px solid #efefef;
		text-align: justify;
		text-justify: newspaper;
		word-break: break-all;
	}
	.codeBtn{
		width: 50%;
		margin: 10rpx auto;
	}
</style>
