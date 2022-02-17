//建立 pagination 元件

export default{
	//傳入分頁資訊
	props:['pages'],
	//pagination 元件的樣板
	template:`
		<nav aria-label="Page navigation">
			<ul class="pagination d-flex justify-content-center">
				<!-- 上一頁 --->
				<li class="page-item"
						:class="{ disabled: !pages.has_pre }">
					<a class="page-link" href="#" aria-label="Previous"
						@click="$emit('get-data', page-1)">
						<span aria-hidden="true">&laquo;</span>
					</a>
				</li>
				<!-- 目前頁面 --->
				<li class="page-item" 
						:class="{ active: page === pages.current_page }"
						v-for="page in pages.total_pages"
						:key="page + 'page'">
					<a class="page-link" href="#"
						@click="$emit('get-data', page)">{{ page }}</a>
				</li>
				<!-- 下一頁 --->
				<li class="page-item"
						:class="{ disabled: !pages.has_next }">
					<a class="page-link" href="#" aria-label="Next"
						@click="$emit('get-data', page+1)">
						<span aria-hidden="true">&raquo;</span>
					</a>
				</li>
			</ul>
		</nav>
	`
}

//:key="page + 'page'" =>避免重複加上的字串'page'
//class 判斷式 :class="{ disabled: !pages.has_pre }"
//由內往外傳事件 @click="$emit('get-data', page)"