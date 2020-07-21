import { parseArguments } from "./tableHelperUtils.js"

export class CurrencyItem {
	constructor(value) {
		this.value = value
	}
}

export function goldHelper({args}) {
	let roll = args.roll || "1d10"
	let result = parseInt(new Roll(roll).roll().result)
	return [new CurrencyItem(result)]
}