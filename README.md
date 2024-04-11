Access [http://localhost:3000/champions](http://localhost:3000/champions) and press a champion icon to look at the information

TO DOS:

# Working on

- Inventory.jsx --> tooltip on hover item
- Shop.jsx --> Make item MATH information show up

# MAJOR PROBLEMS

- If skills need target max health, add it to the skill description calculation (ex. 60 + 4% max hp)
- Fix "mapped" component keys (problem lies in having purchased multiple of the same item. need to differentiate same items)

# MINOR PROBLEMS

- Buying mana items should not increase the mana for Energy / Fury champions
  - Would be nice to have these champs have "energy / fury" shown up as text instead of "mana"
- Properly make only 1 mythic per inventory and other niche / unique instances
- Make everything look better
- Inventory.jsx --> Ornn border should use current patch border
- Inventory.jsx --> Make sure if the icon does not exist, use a temporary image
- Item hit effect and tip have to add symbols
- Need to round to 2 decimals for Item numerized stats
- Replace logo image in navbar
- Some words need to be checked when adding color to text to account for suffixes (ex. Syndra W uses "slowed" but only "slow" is colored)
