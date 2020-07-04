import { getLogger } from "../util.js"

const log = getLogger("TokenRace")

let races = {
	"dunmer": {"actorData.data.traits.dr.value": ["fire"]},
	"nord": {"actorData.data.traits.dr.value": ["cold"]},
}

Hooks.on("createTokenMutate", async (update, {token})=>{
	update(async ()=>{
		let image = token.img.replace(/.*\//, "")
		let update = Object.keys(races).find((race)=>image.indexOf(race) !== -1)
		log.debug("Matching races", image, update)
		let updateData = update ? races[update] : {}
		updateData["actorData.img"] = token.img
		return updateData
	})
})