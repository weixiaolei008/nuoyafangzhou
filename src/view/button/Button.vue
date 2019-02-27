<template>
	<div style="float: left;">
		<div class="maun">
			<button class="headButton" :class="type" :icon="icon" @click="addClick"></button>
			<span v-text="text"></span>
		</div>

	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			addClick() {
				this.$emit('click', '')
			}
		},
		props: ['text', 'type', 'icon']
	}
</script>

<style scoped="scoped">
	.maun{
		width: 65px;
		height: 55px;
		text-align: center;
	}
	.maun span{
		width: 65px;
		line-height: 20px;
		text-align: center;
		display: block;
		color: #666;
		font-size: 12px;
	}
	.headButton {
		color: #fff;
		border: 0;
		width: 35px;
		height: 35px;
		cursor: pointer;
		border-radius: 5px;
	}
</style>