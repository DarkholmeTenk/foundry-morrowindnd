import ActorSheet5e from "../../../../systems/dnd5e/module/actor/sheets/base.js"
import { rollTable } from "../enchanting/enchantTable.js";
import { getLogger, nAsync } from "../util.js";
import Item5e from "../../../../systems/dnd5e/module/item/entity.js"
import { CurrencyItem } from "../table/tableGoldHelper.js"
import { DCForm } from "../../../dc-base/scripts/FormHelper.js"
import { clone } from "../../../dc-base/scripts/util.js";

const log = getLogger("ActorLootDrop")

function getPack(item) {
	if(item.compendium) {
		let c = item.compendium.metadata
		return `${c.package}.${c.name}`.toLowerCase()
	}
}

class LootDropForm extends DCForm {
	constructor(lootTable, actor) {
		super(actor, {rolls: "1", qty: "1", convertSpellsToScrolls: false}, {tableName: lootTable.name, actorName: actor.name})
		this.lootTable = lootTable
	}

	static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 500,
			height: 170,
			template: "modules/morrowindnd/templates/lootDrop.hbs",
			title: "Dropping loot"
        });
	}


	async onSave() {
		let actor = this.object
		let {rolls, qty, convertSpellsToScrolls} = this.data
		let rollAmount = new Roll(rolls).roll().total
		let rollResults = (await nAsync(rollAmount, ()=>{
			return rollTable(this.lootTable.id)
		})).flatMap(i=>i)
		let currency = rollResults
				.filter(i=>i instanceof CurrencyItem)
				.reduce((p,c)=>p.add(c), new CurrencyItem(0))
				.multiply(new Roll(qty).roll().total)
		let items = await rollResults.filter(i=>i instanceof Item5e)
				.map(i=>i.data)
				.mapAsync(async i=> {
					if(i.type === "spell" && convertSpellsToScrolls) {
						let scroll = await Item5e.createScrollFromSpell(i)
						return scroll.data
					} else {
						return i
					}
				})
		items = items.map(i=>clone(i))
				.map(i=>{
					let newQty = new Roll(qty).roll().total
					i.data.quantity = (i.data.quantity || 1) * newQty
					return i
				})
		if(items.length > 0) {
			await actor.createEmbeddedEntity("OwnedItem", items);
		}
		if(currency.value > 0) {
			await actor.update(currency.getModifications(actor.data))
		}
		this.close()
	}
}

let onDrop = ActorSheet5e.prototype._onDrop
ActorSheet5e.prototype._onDrop = async function(event) {
    let data;
    try {
      data = JSON.parse(event.dataTransfer.getData('text/plain'));
    } catch (err) {
      return false;
    }
	if ( !data ) return false;
	
	if(data.type === "RollTable") {
		let table = game.tables.get(data.id)
		let actor = this.actor
		log("Creating loot drop form", table, actor)
		new LootDropForm(table, actor).render(true)
	} else {
		onDrop.bind(this)(event)
	}
}