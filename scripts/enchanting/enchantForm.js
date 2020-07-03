import { getLogger } from "../util.js";
import { ChargeTypes, enchantItem } from "./enchanter.js";

const log = getLogger("EnchantForm")

class EnchantForm extends FormApplication {

	constructor(item) {
		super(item, {title: `Enchanter - ${item.data.name}`})
	}

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 400,
            height: 150,
            template: "modules/morrowindnd/templates/enchanter.hbs",
			dragDrop: [{dragSelector: ".item", dropSelector: ".spelldrop"}]
        });
	}

	getData() {
		return {
			spellName: this.spell ? this.spell.data.name : "Drop a spell here to use it",
			chargeTypes: ChargeTypes,
			charges: this.charges || 0,
			invalid: this.spell == null
		}
	}

	async _updateObject(_, formData) {
        this.charges = formData.charges || 0
    }
	
	async getSpell(event) {
		try {
			let data = JSON.parse(event.dataTransfer.getData('text/plain'));
			if(data.type === "Item") {
				let item
				if(data.pack) {
					log("Searching pack for id", data.pack, data.id)
					let pack = game.packs.get(data.pack)
					item = await pack.getEntity(data.id)
				} else {
					item = await game.items.get(data.id)
				}
				if(item && item.data.type == "spell") {
					return item
				}
			}
		} catch (err) {
		  log("Error while processing data", err)
		}
		return null
	}

	async _onDrop (event) {
		event.preventDefault();
		this.spell = await this.getSpell(event)
		console.log("Got spell", this.spell)
		this.render()
		return false
	}

	activateListeners(html) {
		super.activateListeners(html)
        let saveCloseButton = html.find("button[name='submit']");
        saveCloseButton.on("click", async (e)=>{
            e.preventDefault()
			await this.submit()
			let charges = ChargeTypes[this.charges]
			let {spell, object: item} = this
			if(spell && charges) {
				log("Created enchanted item", await enchantItem({item, charges, spell, renderSheet: true}))
			}
        });
    }
}

Hooks.on("itemSheetMenuItems", async (addMenuItem, app)=>{
	let item = app.object
	if(game.user.isGM && item.data.type === "equipment") {
		addMenuItem({
			name: "Enchant",
			icon: '<i class="fas fa-hand-sparkles"></i>',
			callback: ()=>{
				log("Creating Enchantment Form", item)
				new EnchantForm(item).render(true)
			}
		})
	}
})