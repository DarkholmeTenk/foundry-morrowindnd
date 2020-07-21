import { getLogger } from "../util.js"
import { WeaponTypes } from "./Types.js"
import { Materials } from "./Materials.js"
import { setupFolder } from "../../../dc-base/scripts/FolderHelper.js"

const log = getLogger("MaterialCreator")

async function findBaseItem(itemName) {
	let item = game.items.find(i => i.name === itemName)
	if (!item) {
		let pack = game.packs.get("dnd5e.items")
		let packIndex = await pack.getIndex()
		let itemIndex = packIndex.find(i => i.name === itemName)
		if (itemIndex) {
			item = await pack.getEntity(itemIndex._id)
		}
	}
	return item
}

function addDamage(baseItem, damageBonus) {
	let {damage} = baseItem.data.data
	let [partOne, ...partRest] = damage.parts
	if(partOne && damageBonus > 0) {
		let [damageRoll, ...damageRest] = partOne
		damageRoll += ` + ${damageBonus}`
		let {versatile} = damage
		if(versatile != "") {
			versatile += ` + ${damageBonus}`
		}
		return {
			parts: [[damageRoll, ...damageRest], ...partRest],
			versatile
		}
	} else {
		return damage
	}
}

async function createWeapons(referencePrice, weaponType, materials) {
	let weaponTypes = WeaponTypes[weaponType]
	await weaponTypes.forEachAsyncOrdered(async type=>{
		let folderId = await setupFolder(`MorrowinDnD/${weaponType}/${type}`)
		let baseItem = await findBaseItem(type)
		if(!baseItem) {
			log.error(`Unable to find item [${type}]`)
			return
		}
		let priceMultiplier = baseItem.data.data.price / referencePrice
		let newItemData = materials.map(material=>{
			let materialProps = material.weaponProperties
			let newName = `${material.name} ${type}`
			let newPrice = Math.ceil(priceMultiplier * materialProps.averagePrice)
			let newWeight = baseItem.data.data.weight * (materialProps.weightMult || 1)
			let itemData = {
				...baseItem.data,
				_id: null,
				folder: folderId,
				name: newName,
				permission:{default: 2},
				data: {
					...baseItem.data.data,
					description: {
						...baseItem.data.data.description,
						value: `${baseItem.data.data.description.value}\n<p>${material.description}</p>`,
					},
					price: newPrice,
					weight: newWeight,
					rarity: material.rarity || baseItem.data.data.rarity,
					attackBonus: materialProps.attackBonus || 0,
					damage: addDamage(baseItem, materialProps.damageBonus)
				}
			}
			
			log.debug(`Creating ${newName}`, baseItem, newPrice, materialProps, itemData)
			return itemData
		})
		await Item.create(newItemData, {temporary:false, renderSheet: false})
	})
}

async function findBasePrice(weaponType) {
	let referenceItemName = WeaponTypes.referencePrices[weaponType]
	let referenceItem = await findBaseItem(referenceItemName)
	if (!referenceItem) {
		log(`Unable to find item [${referenceItemName}] for weapon type [${weaponType}]`)
		return
	}
	let basePrice = referenceItem.data.data.price
	log(`Found base price for [${weaponType} - ${referenceItemName}] = ${basePrice}`)
	return basePrice
}

function getMaterials(weaponType) {
	return Materials.filter(m=>m.weaponProperties && m.weaponProperties[weaponType.toLowerCase()])
}

Hooks.on("itemSheetMenuItems", async (addMenuItem) => {
	if (game.user.isGM) {
		addMenuItem({
			name: "Create Weapons",
			icon: '<i class="fas fa-hand-sparkles"></i>',
			callback: async () => {
				log("Creating Weapons")
				await Object.keys(WeaponTypes.referencePrices).forEachAsyncOrdered(async (weaponType) => {
					let basePrice = await findBasePrice(weaponType)
					let materials = getMaterials(weaponType)
					createWeapons(basePrice, weaponType, materials)
				})
			}
		})
	}
})