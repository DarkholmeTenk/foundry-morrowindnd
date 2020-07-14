export const ArmorType = {
	LIGHT: "Light",
	MEDIUM: "Medium",
	HEAVY: "Heavy"
}

export const Materials = [
    {
        name: "Leather",
        description: "A material made from tanned hide",
        lootWeight: 8,
        maxEnchantStrength: 10,
        armorProperties: {
            type: ArmorType.LIGHT,
            fullSetAC: 11,
            addDex: true,
            shieldAC: 1,
            averagePrice: 100,
        }
    },
    {
        name: "Chitin",
        description: "A material which is constructed by laminating several layers of insect shell glued with organic resins",
        lootWeight: 7,
        maxEnchantStrength: 12,
        armorProperties: {
            type: ArmorType.LIGHT,
            fullSetAC: 12,
            addDex: true,
            shieldAC: 1,
            averagePrice: 150
        },
        weaponProperties: {
            attackBonus: 1,
            damageBonus: 0,
            hurtsGhosts: false,
            averagePrice: 160,
            melee: true,
            ranged: false
        }
    },
    {
        name: "Boiled Leather",
        description: "Netch Leather is a unique Dunmer light armor design with much higher craftsmanship than the typical Imperial Armor of the west.",
        lootWeight: 6,
        maxEnchantStrength: 12,
        armorProperties: {
            type: ArmorType.LIGHT,
            fullSetAC: 13,
            addDex: true,
            shieldAC: 1,
            averagePrice: 300
        }
    },
    {
        name: "Glass",
        description: "Glass weapons and armor are an ornate design: light and flexible, although very difficult to make and expensive. Glass is a lightlootWeight material created using rare metals studded with volcanic glass. The result is stronger than steel due to its ability to absorb and distribute shocks very well.",
        lootWeight: 0.8,
        maxEnchantStrength: 20,
        armorProperties: {
            type: ArmorType.LIGHT,
            fullSetAC: 14,
            addDex: true,
            shieldAC: 2,
            averagePrice: 14000
        },
        weaponProperties: {
            attackBonus: 3,
            damageBonus: 1,
            hurtsGhosts: true,
            averagePrice: 16000,
            melee: true,
            ranged: false
        }
    },
    {
        name: "Bonemold",
        description: "Bonemold is an expensive medium lootWeight material which can generally only be afforded by Morrowind's House Dunmer. The material is composed of bones which are artificially shaped and assembled before being fixed with resin glues.",
        lootWeight: 7,
        maxEnchantStrength:10,
        armorProperties: {
            type: ArmorType.MEDIUM,
            fullSetAC: 12,
            addDex: true,
            shieldAC: 2,
            averagePrice: 350
        },
        weaponProperties: {
            attackBonus: 0,
            damageBonus: 1,
            hurtsGhosts: false,
            averagePrice: 140,
            melee: false,
            ranged: true
        }
    },
    {
        name: "Chainmail",
        description: "Chainmail armor is composed of small interlocking rings of steel, it makes for a decent medium lootWeight armor.",
        lootWeight: 7,
        maxEnchantStrength: 10,
        armorProperties: {
            type: ArmorType.MEDIUM,
            fullSetAC: 13,
            addDex: false,
            averagePrice: 150,
        }
    },
    {
        name: "Silver",
        description: "Silver is typically used to enhance the appearance of the item or to increase its effectiveness against certain creatures and is typically plated on to other cheaper forms of metal.",
        lootWeight: 5,
        maxEnchantStrength: 15,
        armorProperties: {
            type: ArmorType.MEDIUM,
            fullSetAC: 14,
            addDex: true,
            shieldAC: 2,
            averagePrice: 240,
            extras: "Advantage save versus undead"
        },
        weaponProperties: {
            attackBonus: 0,
            damageBonus: 0,
            hurtsGhosts: true,
            averagePrice: 180,
            melee: true,
            ranged: true
        }
    },
    {
        name: "Orcish",
        description: "Orcish armor is an ornate, light steel plate design which is worn over cloth padding resulting in a light and comfortable fit when compared to other steel plate designs",
        lootWeight: 3,
        maxEnchantStrength: 14,
        armorProperties: {
            type: ArmorType.MEDIUM,
            fullSetAC: 15,
            addDex: true,
            shieldAC: 2,
            averagePrice: 1400
        },
        weaponProperties: {
            attackBonus: 1,
            damageBonus: 2,
            hurtsGhosts: false,
            averagePrice: 640,
            melee: true,
            ranged: false
        }
    },
    {
        name: "Dreugh",
        description: "Dreugh Armor is a remarkably strong Dunmer Medium Armor created from the carapaces of Dreugh.",
        lootWeight: 1.5,
        maxEnchantStrength: 13,
        armorProperties: {
            type: ArmorType.MEDIUM,
            fullSetAC: 16,
            addDex: true,
            shieldAC: 3,
            averagePrice: 2125
        }
    },
    {
        name: "Iron",
        description: "Iron is one of the most abundant and cheap materials available for the construction of weapons and heavy armor in Morrowind and the rest of Tamriel. Unfortunately it has a heavy lootWeight and bends easily which produces generally poor to medium quality wares.",
        lootWeight: 10,
        maxEnchantStrength: 6,
        armorProperties: {
            type: ArmorType.HEAVY,
            fullSetAC: 14,
            addDex: false,
            shieldAC: 2,
            averagePrice: 70
        },
        weaponProperties: {
            attackBonus: -1,
            damageBonus: 0,
            hurtsGhosts: false,
            averagePrice: 80,
            melee: true,
            ranged: false
        }
    },
    {
        name: "Steel",
        description: "Steel, a refined form of iron, is another of the more common metals used to produce weapons and heavy armor. Its hardness is greater than that of iron, which leads to higher quality items with about the same lootWeight.",
        lootWeight: 8,
        maxEnchantStrength: 9,
        armorProperties: {
            type: ArmorType.HEAVY,
            fullSetAC: 15,
            addDex: false,
            shieldAC: 2,
            averagePrice: 200
        },
        weaponProperties: {
            attackBonus: 0,
            damageBonus: 0,
            hurtsGhosts: false,
            averagePrice: 120,
            melee: true,
            ranged: false
        }
    },
    {
        name: "Dwemer",
        description: "Dwemer (also known as Dwarven) armor and weapons, though heavier than steel, are highly sought after for their resistance to corrosion, unmatched craftsmanship, their ability to keep an edge, and even just for their rarity. Dwarven items have not been produced since the disappearance of the Dwemer long ago and are truly a treasure whether in the battlefield or on display.",
        lootWeight: 4,
        maxEnchantStrength: 6,
        armorProperties: {
            type: ArmorType.HEAVY,
            fullSetAC: 16,
            addDex: false,
            shieldAC: 3,
            averagePrice: 1200,
            extras: "Advantage save vs magic"
        },
        weaponProperties: {
            attackBonus: 0,
            damageBonus: 1,
            hurtsGhosts: false,
            averagePrice: 450,
            melee: true,
            ranged: true
        }
    },
    {
        name: "Ebony",
        description: "Ebony weapons and armor are created from a rare form of volcanic glass buried in the lava flows from Vvardenfell's Red Mountain. The items are so-named because of their opaque black, glassy surface. Ebony items are very high quality and are much sought-after.",
        lootWeight: 1,
        maxEnchantStrength: 6,
        armorProperties: {
            type: ArmorType.HEAVY,
            fullSetAC: 18,
            addDex: false,
            shieldAC: 3,
            averagePrice: 17500
        },
        weaponProperties: {
            attackBonus: 1,
            damageBonus: 3,
            hurtsGhosts: true,
            averagePrice: 20000,
            melee: true,
            ranged: false
        }
    },
    {
        name: "Daedric",
        description: "Daedric weapons are made from raw ebony which has been refined using the craft and magical substances of the lesser minions of Oblivion. The process is not a pleasant one for the Daedra involved, and the weapons retain echoes of preternaturally prolonged suffering endured during manufacture. Daedric weapons are the most rare and expensive weapons known in Tamriel.",
        lootWeight: 0.2,
        maxEnchantStrength: 23,
        armorProperties: {
            type: ArmorType.HEAVY,
            fullSetAC: 20,
            addDex: false,
            shieldAC: 4,
            averagePrice: 45000
        },
        weaponProperties: {
            attackBonus: 2,
            damageBonus: 3,
            hurtsGhosts: true,
            averagePrice: 40000,
            melee: true,
            ranged: true
        }
    },
    {
        name: "Wood",
        description: "A simple material harvested from the giant mushrooms across the island",
        lootWeight: 13,
        maxEnchantStrength: 8,
        weaponProperties: {
            attackBonus: -1,
            damageBonus: 0,
            hurtsGhosts: false,
            averagePrice: 80,
            melee: false,
            ranged: true
        }
	}
]