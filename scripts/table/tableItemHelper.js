function filter(item, filters) {
	return filters.every(filter=>{
		let {field, compareFunction} = filter
		let propValue = getProperty(item.data, field)
		return compareFunction(propValue)
	})
}

export function itemHelper({filters}) {
	let items = game.items.filter(i=>filter(i, filters))
	let randomIndex = Math.floor(Math.random() * items.length)
	return [items[randomIndex]]
}