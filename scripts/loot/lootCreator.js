import { getLogger } from "../util.js"

const log = getLogger("LootSheetCreator")
const FLAG = "LootedFlag"
const BlacklistedTypes = ["class", "spell", "feat"]

function isLootSheet(actor) {
	log("Sheet", actor._sheetClass.name)
	return actor.isToken && actor._sheetClass.name == "LootSheet5eNPC"
}

function canBeLooted(token, lootContainer) {
	let flag = token.getFlag("morrowindnd", FLAG)
	if(flag) {
		let {container} = flag
		return container == lootContainer.id
	} else {
		return true
	}
}

function getBaseActor(token) {
	return game.actors.get(token.data.actorId)
}

async function lootTokens(lootContainer, tokens) {
	log.debug("Looting Tokens", lootContainer, tokens)
	let items = tokens.flatMap(token=>{
		let actor = getBaseActor(token)
		let tokenItems = token.actor.items || []
		return tokenItems
				.filter(i=>!actor.items.get(i.id))
				.filter(i=>!BlacklistedTypes.includes(i.type))
	})
	await tokens.forEachAsync((token)=>token.setFlag("morrowindnd", FLAG, {container: lootContainer.id}))
	await lootContainer.update({"items": items})
}

Hooks.on("actorSheetMenuItems", (add, app)=>{
	let actor = app.object
	if(isLootSheet(actor)) {
		add({
			name: "Loot Tokens",
			icon: '<i class="fas fa-shopping-bag"></i>',
			callback: async ()=>{
				let selected = canvas.tokens.controlled
						.filter(t=>canBeLooted(t, actor))
						.filter(t=>t.actor != actor)
				await lootTokens(actor, selected)
			}
		})
	}
	if(actor.isToken && actor.token.getFlag("morrowindnd", FLAG)) {
		add({
			name: "Reset Loot Status",
			icon: '<i class="fas fa-shopping-bag"></i>',
			callback: async ()=>{
				await actor.token.unsetFlag("morrowindnd", FLAG)
			}
		})
	}
})