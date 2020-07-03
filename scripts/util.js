import { getLoggerFactory } from "../../dc-base/scripts/util.js"

export const getLogger = getLoggerFactory("MorrowinDnD")

export async function getRollTableItem({type, resultId, collection}) {
	if(type == 1) {
		return game.items.get(resultId)
	} if(type == 2) {
		let pack = game.packs.get(collection)
		return await pack.getEntity(resultId)
	}
}

export function isEqual(a, b) {
	console.log(a, b)
	if(!a != !b) return false
	let aEqual = Object.keys(a).every(key=>{
		let aVal = a[key]
		let bVal = b[key]
		if(typeof(aVal) !== typeof(bVal)) {
			return false
		} else if(typeof(aVal) === "object") {
			return isEqual(aVal, bVal)
		} else {
			return aVal == bVal
		}
	})
	let bNewKey = Object.keys(b).some(key=>a[key] === null || a[key] === undefined)
	return aEqual && !bNewKey
}