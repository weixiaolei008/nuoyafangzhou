<template style="height:100%">
	<div class="d-box v-box">
		<div class="flexTable spaceTable">
			<div class="tableDiv">
				<el-table v-loading="loading"  ref="multipleTable" stripe :data="data" tooltip-effect="dark" style="width: 100%;" height="100%" @selection-change="handleSelectionChange" @row-click="toggleSelection">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column v-for="(item,index) in tableName" :key='index' :prop="item.value" :label="item.name" align="center">
					</el-table-column>
					<!--<el-table-column v-for="o in tableName" :label="o.name" align="center">
						<template slot-scope="scope">
							<span>{{scope.row.name}}</span>
						</template>
					</el-table-column>-->
				</el-table>
			</div>
		</div>
		<div class="footerDiv">
			<el-pagination style="text-align: center;padding: 6px 0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage1" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="num">
			</el-pagination>
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
			//表格Checkbox 选中
			handleSelectionChange(val) {
				this.$emit('selection-change', val);
			},
			//点击行选中复选框
			toggleSelection(row) {
				//				this.$emit('row-click', row);
				var rows = [];
				rows.push(row);
				if(rows) {
					rows.forEach(row => {
						this.$refs.multipleTable.toggleRowSelection(row);
					});
				} else {
					this.$refs.multipleTable.clearSelection();
				}
			},
			//每页显示条数
			handleSizeChange(num) {
				this.$emit('size-change', num);
			},
			//页面切换
			handleCurrentChange(num) {
				this.$emit('current-change', num);
			}
		},
		created() {
		},

		props: ['data', 'tableName', 'currentPage1', 'num','loading']
	}
</script>

<style scoped>
	.d-box {
		display: -moz-box;
		/* OLD - Firefox 19- (buggy but mostly works) */
		display: -webkit-box;
		/* OLD - iOS 6-, Safari 3.1-6 */
		display: -webkit-flex;
		/* NEW - Chrome */
		display: -ms-flexbox;
		/* TWEENER - IE 10 */
		display: box;
		display: flexbox;
		display: flex;
		/* NEW, Spec - Opera 12.1, Firefox 20+ */
		height: 100%;
		width: 100%;
	}
	
	.v-box {
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-moz-box-orient: vertical;
		-moz-box-direction: normal;
		-webkit-flex-direction: column;
		-moz-flex-direction: column;
		-ms-flex-direction: column;
		-o-flex-direction: column;
		flex-direction: column;
	}
	
	.headDiv {
		padding: 20px;
		background: #fff;
		overflow: hidden;
		position: relative;
	}
	
	.flexTable {
		-webkit-box-flex: 1;
		-moz-box-flex: 1;
		-ms-flex: 1;
		flex: 1;
		position: relative;
	}
	
	.spaceTable{
		margin: 0 20px;
	}
	
	.tableDiv {
		width: 100%;
		height: 100%;
		position: absolute;
		overflow: auto;
	}
	
	.footerDiv {
		height: 40px;
		position: relative;
	}
</style>