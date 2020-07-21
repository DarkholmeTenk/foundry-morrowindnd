import { calculateEnchantValueAdd } from "../spells.js";
import { getLogger } from "../util.js";
import { isEqual } from "../../../dc-base/scripts/util.js";
import { setupFolder } from "../../../dc-base/scripts/FolderHelper.js";

const log = getLogger("Enchanter")

export const Minor = {charges: 2, label: "Minor", weight: 8}
export const Major = {charges: 5, label: "Major", weight: 3}
export const Superior = {charges: 10, label: "Superior", weight: 1}
export const Immense = {charges: 15, label: "Immense", weight: 0.5}
export const ChargeTypes = [Minor, Major, Superior, Immense]

export function getRandomCharge() {
	let max = ChargeTypes.map(x=>x.weight).reduce((p,c)=>p+c)
	let newRand = Math.random() * max
	for(let i in ChargeTypes) {
		let c = ChargeTypes[i]
		if(newRand <= c.weight) return c
		newRand -= c.weight
	}
	return Minor
}

const valueRarity = [
	{name: "Common", valueMin: 0},
	{name: "Uncommon", valueMin: 300},
	{name: "Rare", valueMin: 1000},
	{name: "Very Rare", valueMin: 10000},
	{name: "Legendary", valueMin: 20000},
	{name: "Artifact", valueMin: 50000},
]

function getRarity(value) {
	let result = valueRarity[0]
	for(let x of valueRarity) {
		if(value >= x.valueMin) {
			result = x
		}
	}
	return result.name
}

export async function enchantItem({item, charges, spell, renderSheet=false}) {
	let enchantData = {item: item.id, charges: charges, spell: spell.id}
	let existing = game.items.find(i=>{
		let enchantedData = i.getFlag("morrowindnd", "enchanter_data")
		return isEqual(enchantData, enchantedData)
	})
	if(existing) { 
		if(renderSheet) {
			existing.sheet.render(true)
		}
		return existing 
	}

	let folderID = await setupFolder(`MorrowinDnD/Enchanted Items/Level ${spell.data.data.level}`)
	let newName = `${item.data.name} of ${charges.label} ${spell.data.name}`
	log(`Enchanting item ${newName}`, item, charges, spell)
	let spellLevel = spell.data.data.level
	let newValue = Math.floor((item.data.data.price * 1.2) + calculateEnchantValueAdd(spellLevel, charges.charges))
	let nestedData = {
		...spell.data.data,
		description: {value:`${item.data.data.description.value}<br/><br/>${spell.data.data.description.value}`, chat: "", unidentified: `${item.data.data.description.value}<br/><br/>Unknown enchantment`},
		consumableType: "trinket",
		weight: item.data.data.weight,
		price: newValue,
		quantity: 1,
		uses: {value: charges.charges, max: charges.charges, per: "day"},
		armor: item.data.data.armor,
		rarity: getRarity(newValue)
	}
	let newData = {
		name: newName,
		permission: item.data.permission,
		type: "consumable",
		data: nestedData,
		img: item.data.img,
		folder: folderID
	}
	log("Creating " + newName, item, spell, newData)
	let newItem = await Item.create(newData, {temporary: false, renderSheet})
	await newItem.setFlag("morrowindnd", "enchanter_data", enchantData)
	return newItem
}