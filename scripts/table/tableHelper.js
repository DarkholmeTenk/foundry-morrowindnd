import { spellsTable } from "./tableSpellHelper.js"
import { getLogger } from "../util.js"

const log = getLogger("TableHelper")

const TextHelpers = {
	"@Spells": spellsTable
}

function getArguments(text) {
	let results = text.match(/\[([^\]]+)\]/g).map(text=>text.substr(1, text.length - 2))
	log.debug("Found roll helper arguments", results, text)
	return results
}

export async function getRollTableItem({type, text, resultId, collection}) {
	log.debug("Getting roll item", arguments)
	if(type == 0) {
		let call = text.split(/\s/,1)
		let helper = TextHelpers[call]
		if(helper) {
			let filters = getArguments(text)
			let result = await helper(filters)
			log.debug("Found result", result)
			return result
		}
	} else if(type == 1) {
		return game.items.get(resultId)
	} else if(type == 2) {
		let pack = game.packs.get(collection)
		return await pack.getEntity(resultId)
	}
}