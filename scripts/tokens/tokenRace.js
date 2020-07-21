import { getLogger } from "../util.js"

const log = getLogger("TokenRace")

let traits = {
	"dunmer": ()=>({"actorData.data.traits.dr.value": ["fire"]}),
	"nord": ()=>({"actorData.data.traits.dr.value": ["cold"]}),
	"heavy": (actor)=>({"actorData.data.attributes.ac.value": actor.data.data.attributes.ac.value + 2})
}

Hooks.on("createTokenMutate", async (update, {token, actor})=>{
	update(async ()=>{
		let image = token.img.replace(/.*\//, "")
		let matchedTraits = Object.keys(traits).filter((traitName)=>image.indexOf(traitName) !== -1)
		log.debug("Matching traits", image, matchedTraits)
		let updateData = {}
		matchedTraits.forEach(traitName=>{
			let trait = traits[traitName](actor)
			Object.assign(updateData, trait)
		})
		updateData["actorData.img"] = token.img
		log("Adding traits", matchedTraits, updateData)
		return updateData
	})
})