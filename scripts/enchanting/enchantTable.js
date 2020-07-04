import { getLogger } from "../util.js"
import { getRandomCharge, enchantItem } from "./enchanter.js"
import { DCForm } from "../../../dc-base/scripts/FormHelper.js"
import { getRollTableItem } from "../table/tableHelper.js"

const log = getLogger("EnchantTable")
const FLAG = "enchant_spells"

async function handleEnchant(table, result, item) {
	let {tableId: enchantTableId} = table.getFlag("morrowindnd", FLAG) || {}
	if(item && item.data.type==="equipment" && enchantTableId) {
		let spells = await rollTable(enchantTableId)
		let spell = spells[0]
		log.debug("Found spell", spell, item)
		if(spell && spell.data.type==="spell") {
			let charges = getRandomCharge()
			let enchanted = await enchantItem({item, charges, spell})
			log("Enchanting", item, spell)
			return enchanted
		}
	}
}

export async function rollTable(tableId) {
	let table = game.tables.get(tableId)
	let roll = table.roll()
	let items = await Promise.all(roll.results.map(async result=>{
		let item = await getRollTableItem(result)
		let enchanted = await handleEnchant(table, result, item)
		log.debug("Pre/Enchant", item, enchanted)
		if(enchanted) { return enchanted }
		return item
	}))
	log.debug("Rolled items", table.name, items)
	return items.filter(i=>i)
}

class TableEnchantForm extends DCForm {
	constructor(table) {
		super(table, table.getFlag("morrowindnd", FLAG) || {
			tableId: "",
		}, {
			possibleRollTables: game.tables.map(i=>({id: i.id, name:i.name}))
		})
	}

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 400,
			height: 200,
            template: "modules/morrowindnd/templates/enchantTable.hbs",
			dragDrop: [{dragSelector: ".table", dropSelector: ""}]
        });
	}

	async onSave() {
		await this.object.setFlag("morrowindnd", FLAG, this.data)
		this.close()
	}
}

Hooks.on("rollTableConfigMenuItems", async (addMenuItem, app)=>{
	if(game.user.isGM) {
		addMenuItem({
			name: "Enchant",
			icon: '<i class="fas fa-hand-sparkles"></i>',
			callback: ()=>{
				log("Creating Enchantment Form", app)
				new TableEnchantForm(app.object).render(true)
			}
		})
		addMenuItem({
			name: "Help",
			icon: '<i class="fas fa-dice"></i>',
			callback: async ()=>{
				log("Item Rolled", await rollTable(app.object._id))
			}
		})
	}
})