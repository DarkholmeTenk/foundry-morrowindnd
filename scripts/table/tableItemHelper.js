export function itemHelper({filterItem}) {
	let items = game.items.filter(filterItem)
	let randomIndex = Math.floor(Math.random() * items.length)
	return [items[randomIndex]]
}