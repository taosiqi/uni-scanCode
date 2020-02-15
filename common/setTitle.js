export default{
	methods: {
		// 设置标题
		setTitle(cn, en) {
			switch (getApp().globalData.lang) {
				case 'cn':
					uni.setNavigationBarTitle({
						title: cn
					});
					break;
				case 'en':
					uni.setNavigationBarTitle({
						title: en
					});
					break;
				default:
					break;
			}
		},
		tip(text){
			uni.showToast({
			    title: text,
				icon: "none",
			});
		}
	}
}