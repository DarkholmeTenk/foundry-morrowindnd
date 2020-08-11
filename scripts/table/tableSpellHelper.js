import { getLogger } from "../util.js"
import Item5e from "../../../../systems/dnd5e/module/item/entity.js"

const log = getLogger("TableSpellHelper")

let allPackSpells = null
async function loadPackSpells() {
	if(allPackSpells) { return allPackSpells }
	let pack = game.packs.find(p=>p.metadata.label == "Spells") || game.packs.find(p=>p.metadata.label == "Spells (SRD)")
	if(pack) {
		let index = await pack.getIndex()
		let byName = {}
		allPackSpells = await Promise.all(index.map(i=>pack.getEntity(i._id)))
	} else {
		allPackSpells = []
	}
	return allPackSpells
}

async function getAllSpells() {
	let packSpells = await loadPackSpells()
	let byName = {}
	packSpells.forEach(s=>byName[s.name] = s)
	game.items.filter(i=>i.type === "spell")
			  .forEach(s=>byName[s.name] = s)
	return Object.values(byName)
}

export async function spellsTable({filters, filterItem, args}) {
	log.debug("Getting random spell from pack", filters)
	let allResults = await getAllSpells()
	let filteredResults = allResults.filter(filterItem)
	log.debug("Filtered spells", filters, filteredResults)
	let spellIndex = Math.floor(Math.random() * filteredResults.length)
	let spell = filteredResults[spellIndex]
	if(args.scroll) {
		spell = await Item5e.createScrollFromSpell(spell)
	}
	return [spell]
}