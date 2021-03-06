import { rollTable } from "../enchanting/enchantTable.js"
import { getLogger } from "../util.js"
import { DCForm } from "../../../dc-base/scripts/FormHelper.js"
import Item5e from "../../../../systems/dnd5e/module/item/entity.js"
import { CurrencyItem } from "../table/tableGoldHelper.js"

const log = getLogger("NPCCreateToken")

const ACTOR_FLAG = "extraActorData"

class TokenLootForm extends DCForm {
	constructor(actor) {
		super(actor, actor.getFlag("morrowindnd", ACTOR_FLAG) || {
			rollTableIds: [],
		}, {
			possibleRollTables: game.tables.map(i=>({id: i.id, name:i.name}))
		})
	}

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 500,
			height: 300,
            template: "modules/morrowindnd/templates/weapons.hbs",
			dragDrop: [{dragSelector: ".table", dropSelector: ""}]
        });
	}

	newRollTableRow = ()=>({qty: "1d4", id: ""})

	async onSave() {
		await this.object.setFlag("morrowindnd", ACTOR_FLAG, this.data)
		this.close()
	}
}

Hooks.on("actorSheetMenuItems", (add, app, html, data)=>{
	let actor = app.object
	if(actor.owner && !actor.isToken && !actor.isPC) {
		add({
			name: "Loot",
			icon: '<i class="fas fa-utensils"></i>',
			callback: ()=>{
				log("Creating Starting Loot Form", actor)
				new TokenLootForm(actor).render(true)
			}
		})
	}
})

Hooks.on("createTokenMutate", async (update, {actor, token})=>{
	update(async ()=>{
		let {rollTableIds = []} = actor.getFlag("morrowindnd", ACTOR_FLAG) || {}
		let rollResult = (await Promise.all(rollTableIds.map(async ({id: rollTableId, qty})=>{
			let result = new Roll(qty).roll().total
			let items = await Promise.all(Array(parseInt(result)).fill("").map(()=>rollTable(rollTableId)))
			items = items.flatMap(i=>i)
			log.debug("Items rolled", items, result)
			return items
		}))).flatMap(i=>i)
		let items = rollResult.filter(i=>i instanceof Item5e).map(i=>i.data)
		let currency = rollResult.filter(i=>i instanceof CurrencyItem).map(i=>i.value).reduce((p,c)=>p+c,0)
		log("Giving NPC items", token, items, currency)
		return {"items": items, "actorData.data.currency.gp.value": currency}
	})
})