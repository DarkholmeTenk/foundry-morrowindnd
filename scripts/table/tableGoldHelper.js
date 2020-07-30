export class CurrencyItem {
	constructor(value) {
		this.value = value
	}

	multiply(amount) {
		return new CurrencyItem(this.value * amount)
	}

	add(other) {
		return new CurrencyItem(this.value + other.value)
	}

	getModifications(actorData) {
		if(this.value == 0) return {}
		return {"data.currency.gp.value": (actorData.data.currency?.gp?.value || 0) + this.value}
	}
}

export function goldHelper({args}) {
	let roll = args.roll || "1d10"
	let result = parseInt(new Roll(roll).roll().total)
	return [new CurrencyItem(result)]
}