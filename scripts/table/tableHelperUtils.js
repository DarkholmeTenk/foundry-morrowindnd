import { getLogger } from "../util.js";
import { getSubFolders } from "../../../dc-base/scripts/FolderHelper.js";

const log = getLogger("TableHelperUtils")

const rarity = ["common", "uncommon", "rare", "very rare", "legendary", "artifact"]

function getCompareFunction(comparator, target) {
	switch(comparator) {
		case "=": return (v)=>v == target;
		case "<=": return (v)=>v <= target;
		case ">=": return (v)=>v >= target;
		case "<": return (v)=>v < target;
		case ">": return (v)=>v > target;
		case "!=": return  (v)=>v != target
		case "in": return (v)=>target.split(",").includes(v)
		case "!in": return (v)=>!target.split(",").includes(v)
	}
}

const specialFilters = {
	"lrare": (target)=>{
		let index = rarity.indexOf(target.toLowerCase())
		if(index !== -1) {
			return (v) => rarity.indexOf(v.toLowerCase()) !== -1 && rarity.indexOf(v.toLowerCase()) < index
		}
	},
	"rarer": (target)=>{
		let index = rarity.indexOf(target.toLowerCase())
		if(index !== -1) {
			return (v) => rarity.indexOf(v.toLowerCase()) !== -1 && rarity.indexOf(v.toLowerCase()) > index
		}
	},
	"inside": (target) =>{
		let folders = getSubFolders(target)
		return (v)=>folders.includes(v)
	}
}

function getFilter(argument) {
	let split = argument.match(/^(.+?)(=|<=|>=|<|>| in | !in |!=)(.+)$/)
	if(split) {
		log.debug("Found regular filter", argument, split)
		let [, field, comparator, target] = split
		let compareFunction = getCompareFunction(comparator, target)
		return {field, compareFunction}
	} else {
		for(let specialFilterName in specialFilters) {
			let match = argument.match(`^(.+?) \\$${specialFilterName} (.+)$`)
			if(match)  {
				log.debug("Found special filter", specialFilterName, argument, match)
				let [, field, target] = match
				let compareFunction = specialFilters[specialFilterName](target)
				return {field, compareFunction}
			}
		}
	}
}

export function parseArguments(args) {
	let specialArguments = args.filter(a=>a.startsWith("@"))
	let filterArguments = args.filter(a=>!a.startsWith("@")).map(a=>getFilter(a)).filter(a=>a)
	let result = {
		args: {},
		filters: []
	}
	specialArguments.forEach(a=>{
		let match = a.match(/(.+?)=(.+)/)
		if(match) {
			let [, field, target] = match
			field = field.substring(1)
			result.args[field] = target
		} 
	})
	filterArguments.forEach((filter)=>{
		result.filters.push(filter)
	})
	log.debug("Built argument table", result)
	return result
}