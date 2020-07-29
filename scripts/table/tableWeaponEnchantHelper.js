import {DND5E} from "../../../../systems/dnd5e/module/config.js"

export class WeaponEnchantment {
	constructor(data = {}) {
		this.data = data
	}

	apply(weaponData) {
		let {attackBonus, damageParts, prefix, suffix, valueAdd, valueMult} = this.data
		if(attackBonus && attackBonus != "0") {
			weaponData.data.attackBonus += ` + ${this.data.attackBonus}`
		}
		if(damageParts) {
			weaponData.data.damage.parts.push(...damageParts)
		}
		if(prefix) {
			weaponData.name = prefix + " " + weaponData.name
		}
		if(suffix) {
			weaponData.name += " " + suffix
		}
		if(valueMult) {
			weaponData.data.price = Math.round(weaponData.data.price * parseFloat(valueMult))
		}
		if(valueAdd) {
			weaponData.data.price += parseInt(valueAdd)
		}
	}
}

export async function weaponEnchantHelper({args}) {
	let attackBonus = args.attackBonus || ""
	let damageParts = []
	let damages = args.damage || ""
	let damageTypes = args.damageType || ""
	if(damages != "") {
		let damageSplit = damages.split(",")
		let damageTypeSplit = damageTypes.split(",")
		damageSplit.forEach((damage,index)=>{
			let type = damageTypeSplit[index]
			if(DND5E.damageTypes[type]) {
				damageParts.push([damage, type])
			}
		})
	}
	return [new WeaponEnchantment({...args, attackBonus, damageParts})]
}