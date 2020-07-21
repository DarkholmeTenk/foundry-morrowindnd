import { parseArguments } from "./tableHelperUtils.js";
import { rollTable } from "../enchanting/enchantTable.js";
import { nAsync } from "../util.js";

function filter(r, filters) {
	return filters.every(({field, compareFunction})=>{
		let prop = getProperty(r, field)
		return compareFunction(prop)
	})
}

export async function tableHelper({args, filters}) {
	if(!args.table) {
		throw Error("No @table argument specified")
	} else {
		let table = game.tables.find(t=>t.name === args.table)
		if(!table) {
			throw Error(`No table found for name [${args.table}]`)
		} else {
			let min = args.min
			let results = []
			if(min) {
				let i = 0
				while(results.length < min && i < 20) {
					let items = (await rollTable(table.id)).filter(i=>filter(i, filters))
					if(items.length > 0) {
						results.push(...items)
					}
					i++
				}
			} else {
				let rollString = args.roll || "1"
				let rollResult = parseInt(new Roll(rollString).roll({}).total)
				let resultTables = await nAsync(rollResult, ()=>rollTable(table.id))
				results = resultTables
						.flatMap(i=>i)
						.flatMap(i=>i)
						.filter(i=>filter(i, filters))
			}
			let max = args.max || 100
			return results.slice(0, max)
		}
	}
}