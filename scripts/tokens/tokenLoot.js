import { rollTable } from "../enchanting/enchantTable.js"
import { getLogger } from "../util.js"
import { DCForm } from "../../../dc-base/scripts/FormHelper.js"

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
	if(actor.owner) {
		add({
			name: "Loot",
			icon: '<i class="fas utensils"></i>',
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
		let itemGroups = await Promise.all(rollTableIds.map(async ({id: rollTableId, qty})=>{
			let {result} = new Roll(qty).roll()
			let items = await Promise.all(Array(parseInt(result)).fill("").map(()=>rollTable(rollTableId)))
			items = items.flatMap(i=>i)
			log.debug("Items rolled", items, result)
			return items
		}))
		let items = itemGroups.flatMap(i=>i)
		log("Giving NPC items", token, items)
		let oldItems = token.actorData?.items || actor.data.items || []
		let newItems = [...oldItems, ...items]
		return {"actorData.items": newItems}
	})
})