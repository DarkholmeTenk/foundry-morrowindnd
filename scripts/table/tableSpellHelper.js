import { getLogger } from "../util.js"

const log = getLogger("TableSpellHelper")

let allSpells = null
async function getAllSpells() {
	if(allSpells) { return allSpells }
	let pack = game.packs.find(p=>p.metadata.label == "Spells") || game.packs.find(p=>p.metadata.label == "Spells (SRD)")
	if(pack) {
		let index = await pack.getIndex()
		allSpells = await Promise.all(index.map(i=>pack.getEntity(i._id)))
	} else {
		allSpells = []
	}
	return allSpells
}

export async function spellsTable({filterItem}) {
	log.debug("Getting random spell from pack", filters)
	let allResults = await getAllSpells()
	let filteredResults = allResults.filter(filterItem)
	log.debug("Filtered spells", filters, filteredResults)
	let spellIndex = Math.floor(Math.random() * filteredResults.length)
	log.debug("Returning random spell", spellIndex, filteredResults[spellIndex])
	return [filteredResults[spellIndex]]
}