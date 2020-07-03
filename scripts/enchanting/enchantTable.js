import { getLogger, getRollTableItem } from "../util.js"
import { replace } from "../../../dc-base/scripts/util.js"
import { getRandomCharge, enchantItem } from "./enchanter.js"

const log = getLogger("EnchantTable")

export async function rollTable(tableId) {
	let table = game.tables.get(tableId)
	let roll = table.roll()
	let {tableId: enchantTableId} = table.getFlag("morrowindnd", "enchant_spells") || {}
	let spellTable = tableId? game.tables.get(enchantTableId) : null
	return await Promise.all(roll.results.map(async result=>{
		let item = await getRollTableItem(result)
		if(spellTable) {
			let spellDraw = spellTable.roll()
			if(spellDraw && spellDraw.results.length >= 1) {
				let spell = await getRollItem(spellDraw.results[0])
				if(spell && spell.data.type==="spell" && item && item.data.type==="equipment") {
					let charges = getRandomCharge()
					let enchanted = await enchantItem({item, charges, spell})
					log("Enchanting", item, spell)
					return enchanted
				}
			}
		}
		return item
	}))
}

async function handleDraw(original, args) {
	let draw = await original(args)
	log(`Handle draw ${original.name}`, this, args, draw)
	let enchantData = {tableId: "UnXHT94foJQ6Hq8o"} //this.getFlag("morrowindnd", "enchant_spells")
	if(enchantData) {
		let spellTable = game.tables.get(enchantData.tableId)
		if(spellTable) {
			let newResults = await Promise.all(draw.results.map(async result=>{
				let item = await getRollTableItem(result)
				let spellDraw = spellTable.roll()
				if(spellDraw && spellDraw.results.length >= 1) {
					let spell = await getRollItem(spellDraw.results[0])
					if(spell && spell.data.type==="spell" && item && item.data.type==="equipment") {
						let charges = getRandomCharge()
						let enchanted = await enchantItem({item, charges, spell})
						log("Enchanting", item, spell)
						return {
							...result,
							text: enchanted.name,
							collection: "Items",
							type: 1,
							resultId: enchanted.id
						}
					}
					return result
				} else {
					return result
				}
			}))
			draw.results = newResults
		}
	}
	log("Draw changed to", draw)
	return draw
}

replace(RollTable.prototype, "drawMany", handleDraw)
replace(RollTable.prototype, "draw", handleDraw)

// replace(RollTable.prototype, RollTable.prototype.draw, function(original, arguments) {
// 	let result = original.bind(this)(arguments)
// 	let enchantData = this.getFlag("morrowindnd", "enchant")
// 	if(enchantData) {
// 		Promise.all(result.results.map(async r=>{
// 		}))
// 	}
// 	log("Table Rolled", this, arguments, result)
// 	return result
// })

Hooks.on("rollTableConfigMenuItems", async (addMenuItem, app)=>{
	if(game.user.isGM) {
		addMenuItem({
			name: "Enchant",
			icon: '<i class="fas fa-hand-sparkles"></i>',
			callback: ()=>{
				log("Creating Enchantment Form", app)
			}
		})
	}
})